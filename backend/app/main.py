import json
import math
import re
import sqlite3
from datetime import datetime
from pathlib import Path

import cv2
import numpy as np
from deep_translator import GoogleTranslator
from fastapi import FastAPI, File,Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rapidocr_onnxruntime import RapidOCR
from sentence_transformers import SentenceTransformer

app = FastAPI(title="Dharohar AI API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ocr_engine = RapidOCR()
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

DATA_FOLDER = Path("data")
DATABASE_PATH = DATA_FOLDER / "dharohar.db"


class HeritageRecord(BaseModel):
    id: int
    name: str
    location: str
    state: str
    latitude: float
    longitude: float
    period: str
    category: str
    description: str
    tags: list[str]
    colour: str


RECORDS = [
    HeritageRecord(
        id=1,
        name="Chand Baori",
        location="Abhaneri",
        state="Rajasthan",
        latitude=27.0070,
        longitude=76.6060,
        period="8th–9th century",
        category="Stepwell",
        description="A monumental stepwell with thousands of symmetrical stone steps.",
        tags=["stepwell", "water heritage"],
        colour="#E9A93D",
    ),
    HeritageRecord(
        id=2,
        name="Rani ki Vav",
        location="Patan",
        state="Gujarat",
        latitude=23.8493,
        longitude=72.1012,
        period="11th century",
        category="Stepwell",
        description="A UNESCO-listed subterranean stepwell.",
        tags=["stepwell", "UNESCO"],
        colour="#DE6B48",
    ),
]

def get_database_connection():
    DATA_FOLDER.mkdir(exist_ok=True)

    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row

    connection.execute("""
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            extracted_text TEXT,
            translated_text TEXT,
            summary TEXT,
            created_at TEXT NOT NULL,
            embedding TEXT
        )
    """)

    columns = [
        row["name"]
        for row in connection.execute("PRAGMA table_info(uploads)").fetchall()
    ]

    if "embedding" not in columns:
        connection.execute(
            "ALTER TABLE uploads ADD COLUMN embedding TEXT"
        )
        connection.commit()

    if "latitude" not in columns:
        connection.execute("ALTER TABLE uploads ADD COLUMN latitude REAL")
        connection.execute("ALTER TABLE uploads ADD COLUMN longitude REAL")
        connection.execute("ALTER TABLE uploads ADD COLUMN location_name TEXT")
        connection.commit()

    return connection





def create_embedding(text: str) -> list[float]:
    return embedding_model.encode(text).tolist()


def cosine_similarity(vector_a: list[float], vector_b: list[float]) -> float:
    dot_product = sum(a * b for a, b in zip(vector_a, vector_b))

    magnitude_a = math.sqrt(sum(a * a for a in vector_a))
    magnitude_b = math.sqrt(sum(b * b for b in vector_b))

    if magnitude_a == 0 or magnitude_b == 0:
        return 0

    return dot_product / (magnitude_a * magnitude_b)


def create_summary(extracted_text: str) -> str:
    clean_text = re.sub(r"\s+", " ", extracted_text).strip()

    if not clean_text:
        return "No readable text was found. Try uploading a clearer, well-lit image."

    preview = clean_text[:280]

    if len(clean_text) > 280:
        preview += "..."

    return f"OCR found readable text in this heritage record: {preview}"


def translate_to_english(extracted_text: str) -> str:
    if not extracted_text.strip():
        return "No text available for translation."

    is_english = all(
        ord(character) < 128
        for character in extracted_text
    )

    if is_english:
        return extracted_text

    try:
        return GoogleTranslator(
            source="auto",
            target="en",
        ).translate(extracted_text[:4500])

    except Exception:
        return "Translation is unavailable. Please check your internet connection."


def save_upload(
    file_name: str,
    extracted_text: str,
    translated_text: str,
    summary: str,
    embedding: list[float],
    latitude: float = None,
    longitude: float = None,
    location_name: str = None,
) -> int:
    connection = get_database_connection()
    cursor = connection.execute(
        """
        INSERT INTO uploads (
            file_name, extracted_text, translated_text, summary, 
            created_at, embedding, latitude, longitude, location_name
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            file_name, extracted_text, translated_text, summary,
            datetime.now().isoformat(), json.dumps(embedding),
            latitude, longitude, location_name
        ),
    )
    connection.commit()
    upload_id = cursor.lastrowid
    connection.close()
    return upload_id


@app.get("/")
def health_check():
    return {"message": "Dharohar AI backend is running"}


@app.get("/api/heritage", response_model=list[HeritageRecord])
def get_heritage_records():
    return RECORDS


@app.post("/api/analyse-upload")
async def analyse_upload(
    file: UploadFile = File(...),
    latitude: float = Form(None),
    longitude: float = Form(None),
    location_name: str = Form(None)
):
    # ... existing PDF check and image decoding code ...

    # ... existing OCR, translation, and embedding code ...

    upload_id = save_upload(
        file_name=file.filename,
        extracted_text=text,
        translated_text=translated_text,
        summary=summary,
        embedding=embedding,
        latitude=latitude,
        longitude=longitude,
        location_name=location_name
    )

    return {
        "file_name": file.filename,
        "suggested_type": "Heritage photograph or scanned document",
        "summary": summary,
        "suggested_tags": ["heritage", "OCR extracted", "needs review"],
        "extracted_text": text,
        "translated_text": translated_text,
        "record_id": upload_id,
        "confidence_scores": scores,
        "latitude": latitude,
        "longitude": longitude,
        "location_name": location_name
    }

    content = await file.read()

    image = cv2.imdecode(
        np.frombuffer(content, np.uint8),
        cv2.IMREAD_COLOR,
    )

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image or PDF.",
        )

    result = ocr_engine(image)

    text = "\n".join(result.txts or [])

    scores = [
        round(float(score), 2)
        for score in (result.scores or [])
    ]

    summary = create_summary(text)

    translated_text = translate_to_english(text)

    embedding_text = (
        f"{file.filename} {text} {translated_text} {summary}"
    )

    embedding = create_embedding(embedding_text)

    upload_id = save_upload(
        file_name=file.filename,
        extracted_text=text,
        translated_text=translated_text,
        summary=summary,
        embedding=embedding,
    )

    return {
        "file_name": file.filename,
        "suggested_type": "Heritage photograph or scanned document",
        "summary": summary,
        "suggested_tags": ["heritage", "OCR extracted", "needs review"],
        "extracted_text": text,
        "translated_text": translated_text,
        "record_id": upload_id,
        "confidence_scores": scores,
    }


@app.get("/api/uploads")
def get_saved_uploads():
    connection = get_database_connection()
    uploads = connection.execute(
        """
        SELECT
            id, file_name, extracted_text, translated_text, 
            summary, created_at, latitude, longitude, location_name
        FROM uploads
        ORDER BY id DESC
        """
    ).fetchall()
    connection.close()
    return [dict(upload) for upload in uploads]


@app.get("/api/search")
def search_archive(q: str = Query(min_length=2)):
    connection = get_database_connection()

    uploads = connection.execute(
        """
        SELECT
            id,
            file_name,
            extracted_text,
            translated_text,
            summary,
            created_at,
            embedding
        FROM uploads
        WHERE embedding IS NOT NULL
        """
    ).fetchall()

    connection.close()

    query_embedding = create_embedding(q)

    ranked_uploads = []

    for upload in uploads:
        record = dict(upload)

        record_embedding = json.loads(record["embedding"])

        record["similarity_score"] = round(
            cosine_similarity(
                query_embedding,
                record_embedding,
            ),
            3,
        )

        del record["embedding"]

        ranked_uploads.append(record)

    ranked_uploads.sort(
        key=lambda record: record["similarity_score"],
        reverse=True,
    )

    return ranked_uploads[:10]