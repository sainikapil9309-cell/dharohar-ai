import json
import math
import os
import re
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rapidocr_onnxruntime import RapidOCR
from sentence_transformers import SentenceTransformer

# Optional PyMuPDF
try:
    import fitz
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

# Optional EasyOCR
try:
    import easyocr
    hindi_ocr_reader = easyocr.Reader(['en', 'hi'], gpu=False)
    HAS_EASYOCR = True
except Exception as e:
    HAS_EASYOCR = False

# Optional Google Translator
try:
    from deep_translator import GoogleTranslator
    HAS_GOOGLE_TRANS = True
except ImportError:
    HAS_GOOGLE_TRANS = False

app = FastAPI(title="Dharohar AI API", version="0.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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


HERITAGE_KNOWLEDGE_BASE = [
    # Gujarat
    HeritageRecord(
        id=1,
        name="Rani Ki Vav",
        location="Patan",
        state="Gujarat",
        latitude=23.8493,
        longitude=72.1012,
        period="11th century CE (Solanki Dynasty)",
        category="Stepwell",
        description="UNESCO World Heritage subterranean stepwell commissioned by Queen Udayamati for King Bhima I. Built in Maru-Gurjara style with 7 terraced levels and over 500 principal sculptures.",
        tags=["stepwell", "water conservation", "Maru-Gurjara", "UNESCO", "Patan", "Solanki"],
        colour="#E9A93D",
    ),
    HeritageRecord(
        id=2,
        name="Dholavira",
        location="Khadir Island, Kutch",
        state="Gujarat",
        latitude=23.8863,
        longitude=70.2133,
        period="3000–1500 BCE (Harappan / IVC)",
        category="Ancient Archaeological City",
        description="Ancient Indus Valley Civilization metropolis renowned for grand rock-cut water reservoirs, sophisticated rainwater harvesting, fortified citadels, and Harappan signage.",
        tags=["Harappan", "Indus Valley", "water reservoir", "UNESCO", "Kutch", "urban planning"],
        colour="#0077B6",
    ),
    HeritageRecord(
        id=3,
        name="Nirona — Rogan Art & Copper Bells",
        location="Kutch",
        state="Gujarat",
        latitude=23.3644,
        longitude=69.6012,
        period="Generational Living Craft",
        category="Intangible Cultural Heritage",
        description="Historic artisan hamlet famous for Rogan fabric painting using boiled castor oil pigments, copper bells tuned with mud kilns, and traditional lacquer wood crafts.",
        tags=["Rogan Art", "living heritage", "Kutch", "textile art", "handicraft", "copper bell"],
        colour="#7B2CBF",
    ),
    HeritageRecord(
        id=4,
        name="Ajrakhpur — Natural Block Printing",
        location="Kutch",
        state="Gujarat",
        latitude=23.2200,
        longitude=69.8300,
        period="Generational Living Craft",
        category="Intangible Cultural Heritage",
        description="Artisan village specialized in Ajrakh hand-block printing using hand-carved wooden blocks, resist mordants, and indigo/madder natural dyes in geometric and astral patterns.",
        tags=["Ajrakh", "block printing", "natural dyes", "textile", "Kutch", "living heritage"],
        colour="#7B2CBF",
    ),

    # Karnataka
    HeritageRecord(
        id=5,
        name="Hampi (Vijayanagara)",
        location="Vijayanagara",
        state="Karnataka",
        latitude=15.3145,
        longitude=76.4600,
        period="14th–16th century CE (Vijayanagara Empire)",
        category="Ancient City / Temple Complex",
        description="UNESCO World Heritage capital of Vijayanagara Empire on Tungabhadra banks. Renowned for the monolithic Stone Chariot, musical pillars of Vitthala Temple, and Virupaksha Temple.",
        tags=["Vijayanagara", "Stone Chariot", "Vitthala", "UNESCO", "Dravidian", "Hampi"],
        colour="#DE6B48",
    ),
    HeritageRecord(
        id=6,
        name="Badami Cave Temples",
        location="Bagalkot",
        state="Karnataka",
        latitude=15.9194,
        longitude=75.6825,
        period="6th–8th century CE (Chalukya Dynasty)",
        category="Rock-cut Temples",
        description="Four monumental rock-cut cave shrines excavated into red sandstone cliffs by the Early Chalukyas, featuring iconic 18-armed Nataraja sculptures and Jain/Vaishnava bas-reliefs.",
        tags=["Chalukya", "rock-cut", "sandstone", "Badami", "Nataraja", "cave temple"],
        colour="#E76F51",
    ),
    HeritageRecord(
        id=7,
        name="Kinhal — Traditional Wooden Toys",
        location="Koppal",
        state="Karnataka",
        latitude=15.4217,
        longitude=76.0592,
        period="Vijayanagara Era to Present",
        category="Intangible Cultural Heritage",
        description="Centuries-old GI-tagged craft of light wood figurines and idols created by the Chitragar community using tamarind paste, chalk, and natural lacquer paints.",
        tags=["Kinhal Toys", "wooden craft", "GI Tag", "Chitragar", "living heritage"],
        colour="#7B2CBF",
    ),
    HeritageRecord(
        id=8,
        name="Guledgudda — Traditional Khana Weaving",
        location="Bagalkot",
        state="Karnataka",
        latitude=16.0519,
        longitude=75.8858,
        period="Generational Living Craft",
        category="Intangible Cultural Heritage",
        description="Traditional handloom weaving center famous for Guledgudda Khana, India's only dedicated blouse fabric with distinctive geometric motifs and hand-spun borders.",
        tags=["Guledgudda Khana", "textile", "handloom", "living heritage", "weaving"],
        colour="#7B2CBF",
    ),

    # Andhra Pradesh
    HeritageRecord(
        id=9,
        name="Lepakshi Veerabhadra Temple",
        location="Sri Sathya Sai",
        state="Andhra Pradesh",
        latitude=13.8000,
        longitude=77.6060,
        period="16th century CE (Vijayanagara Empire)",
        category="Temple",
        description="Architectural marvel famous for its legendary Hanging Pillar, India's largest monolithic Nandi bull, and intricate ceiling murals depicting epics.",
        tags=["Hanging Pillar", "Vijayanagara", "Nandi", "frescoes", "Lepakshi", "Veerabhadra"],
        colour="#E9A93D",
    ),
    HeritageRecord(
        id=10,
        name="Gandikota Fort",
        location="YSR Kadapa",
        state="Andhra Pradesh",
        latitude=14.8167,
        longitude=78.2833,
        period="12th–17th century CE",
        category="Fort",
        description="Known as the Grand Canyon of India, a gorge-side citadel overlooking the Penna River with monumental sandstone ramparts, Raghunatha Temple, and Jama Masjid.",
        tags=["Grand Canyon", "Penna River", "citadel", "sandstone", "Gandikota", "fort"],
        colour="#DE6B48",
    ),
    HeritageRecord(
        id=11,
        name="Nimmalakunta — Tholu Bommalata",
        location="Sri Sathya Sai / Anantapur",
        state="Andhra Pradesh",
        latitude=14.3000,
        longitude=77.5800,
        period="Ancient to Present",
        category="Intangible Cultural Heritage",
        description="Living folk tradition of translucent goat-leather shadow puppets (Tholu Bommalata) used to narrate Ramayana and Mahabharata folklore.",
        tags=["Tholu Bommalata", "shadow puppets", "leather craft", "folk art", "living heritage"],
        colour="#7B2CBF",
    ),
    HeritageRecord(
        id=12,
        name="Budithi — Brass and Bell Metal Craft",
        location="Srikakulam",
        state="Andhra Pradesh",
        latitude=18.6667,
        longitude=84.1500,
        period="Generational Living Craft",
        category="Intangible Cultural Heritage",
        description="Traditional metal-casting artisan cluster celebrated for alloyed brass cookware, ceremonial temple lamps, and geometric blackened polish work.",
        tags=["Budithi", "brassware", "bell metal", "metal craft", "living heritage"],
        colour="#7B2CBF",
    ),

    # Maharashtra
    HeritageRecord(
        id=13,
        name="Ajanta Caves",
        location="Chhatrapati Sambhajinagar",
        state="Maharashtra",
        latitude=20.5519,
        longitude=75.7033,
        period="2nd century BCE – 6th century CE",
        category="Rock-cut Caves",
        description="30 UNESCO rock-cut Buddhist chaityas and viharas celebrated for world-famous tempera mural paintings and sculptures depicting Buddha's life and Jataka tales.",
        tags=["Ajanta", "Buddhist", "Jataka", "rock-cut", "murals", "UNESCO", "frescoes"],
        colour="#0077B6",
    ),
    HeritageRecord(
        id=14,
        name="Gateway of India",
        location="Mumbai",
        state="Maharashtra",
        latitude=18.9220,
        longitude=72.8347,
        period="1911–1924 CE",
        category="Monument",
        description="Iconic Indo-Saracenic archway erected in yellow basalt to commemorate King George V's arrival, through which the final British troops sailed out in 1948.",
        tags=["Indo-Saracenic", "Gateway of India", "Mumbai", "yellow basalt", "colonial era"],
        colour="#2A9D8F",
    ),

    # Rajasthan
    HeritageRecord(
        id=15,
        name="Hawa Mahal (Palace of Winds)",
        location="Jaipur",
        state="Rajasthan",
        latitude=26.9240,
        longitude=75.8267,
        period="1799 CE (Maharaja Sawai Pratap Singh)",
        category="Palace",
        description="Five-storey crown-shaped palace of red and pink sandstone with 953 ornate jharokha honeycomb windows designed for royal women to witness street festivities.",
        tags=["Hawa Mahal", "jharokhas", "Jaipur", "pink sandstone", "Rajput", "Palace"],
        colour="#E76F51",
    ),
    HeritageRecord(
        id=16,
        name="Tijara Fort Palace",
        location="Alwar",
        state="Rajasthan",
        latitude=27.9340,
        longitude=76.8560,
        period="19th century CE",
        category="Fort / Palace",
        description="Hilltop citadel nestled in the Aravalli range with palatial courtyards, stone jalis, and restored Rajasthani Rajput-Afghan architecture.",
        tags=["Tijara", "Aravalli", "fort", "Alwar", "Rajput", "citadel"],
        colour="#DE6B48",
    ),

    # Punjab
    HeritageRecord(
        id=17,
        name="Sri Harmandir Sahib (Golden Temple)",
        location="Amritsar",
        state="Punjab",
        latitude=31.6200,
        longitude=74.8765,
        period="1604 CE (Guru Arjan Dev Ji)",
        category="Sacred Gurudwara",
        description="Central spiritual shrine of Sikhism situated in the holy Amrit Sarovar pool, decorated with gilded copper plates, floral pietre dure marble inlay, and four open doors.",
        tags=["Golden Temple", "Harmandir Sahib", "Amritsar", "Sikh heritage", "Amrit Sarovar"],
        colour="#E9A93D",
    ),
    HeritageRecord(
        id=18,
        name="Doraha Sarai (Rang De Basanti Fort)",
        location="Ludhiana",
        state="Punjab",
        latitude=30.8000,
        longitude=76.0333,
        period="1667 CE (Emperor Aurangzeb)",
        category="Mughal Sarai / Fort",
        description="Grand rectangular roadside fortress constructed on the historic Grand Trunk Road, featuring double-storey decorative arched gateways and brick ramparts.",
        tags=["Doraha Fort", "Mughal Sarai", "Ludhiana", "Grand Trunk Road", "Rang De Basanti"],
        colour="#DE6B48",
    ),

    # Jammu & Kashmir
    HeritageRecord(
        id=19,
        name="Vaishno Devi Shrine",
        location="Reasi",
        state="Jammu & Kashmir",
        latitude=32.9929,
        longitude=74.9403,
        period="Ancient Pilgrimage Shrine",
        category="Sacred Cave Shrine",
        description="Venerated Hindu pilgrimage shrine in the Trikuta mountain range, centered around an ancient natural rock cave dedicated to the three Pindis of Mahakali, Mahalakshmi, and Mahasaraswati.",
        tags=["Vaishno Devi", "Trikuta", "cave shrine", "pilgrimage", "Jammu"],
        colour="#D90429",
    ),
    HeritageRecord(
        id=20,
        name="Gurez Valley (Dard-Shina Heritage)",
        location="Bandipora",
        state="Jammu & Kashmir",
        latitude=34.6416,
        longitude=74.8470,
        period="Ancient Silk Route Valley",
        category="Cultural & Natural Landscape",
        description="High-altitude Himalayan valley along the Kishanganga river preserving the unique indigenous Dard-Shina language, traditional timber log houses, and ancient Silk Route archaeological petroglyphs.",
        tags=["Gurez Valley", "Dard-Shina", "Silk Route", "wooden architecture", "Himalayan"],
        colour="#2A9D8F",
    ),
]


ARCHITECTURAL_CATEGORIES = {
    "stepwell": ["stepwell", "baori", "vav", "kalyani", "subterranean", "water storage", "rani ki vav"],
    "harappan": ["harappan", "indus valley", "dholavira", "reservoir", "beads", "pottery", "ivc"],
    "temple": ["temple", "mandir", "shikhara", "dravidian", "nagara", "garbhagriha", "gopuram", "lepakshi", "veerabhadra", "hampi"],
    "craft": ["rogan", "ajrakh", "kinhal", "guledgudda", "khana", "tholu bommalata", "budithi", "puppet", "brassware", "textile", "handloom", "block print"],
    "fort": ["fort", "citadel", "bastion", "qila", "rampart", "gandikota", "tijara", "doraha"],
    "rock-cut": ["cave", "rock-cut", "chaitya", "vihara", "stupa", "ajanta", "badami", "buddhist", "jataka"],
    "sacred": ["gurudwara", "harmandir", "golden temple", "vaishno devi", "shrine", "sarovar", "trikuta"],
    "inscription": ["inscription", "epigraphy", "script", "brahmi", "devanagari", "manuscript", "edict", "pillar"],
}


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
            embedding TEXT,
            latitude REAL,
            longitude REAL,
            location_name TEXT,
            architectural_tags TEXT
        )
    """)

    columns = [row["name"] for row in connection.execute("PRAGMA table_info(uploads)").fetchall()]
    for col, col_type in [
        ("embedding", "TEXT"),
        ("latitude", "REAL"),
        ("longitude", "REAL"),
        ("location_name", "TEXT"),
        ("architectural_tags", "TEXT"),
    ]:
        if col not in columns:
            connection.execute(f"ALTER TABLE uploads ADD COLUMN {col} {col_type}")
            connection.commit()

    return connection


def create_embedding(text: str) -> list[float]:
    clean = text.strip() if text else "heritage record"
    return embedding_model.encode(clean).tolist()


# Pre-compute embeddings for knowledge base on startup
KNOWLEDGE_BASE_EMBEDDINGS = [
    (
        record,
        create_embedding(f"{record.name} {record.location} {record.state} {record.period} {record.category} {record.description} {' '.join(record.tags)}")
    )
    for record in HERITAGE_KNOWLEDGE_BASE
]


def cosine_similarity(vector_a: list[float], vector_b: list[float]) -> float:
    dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
    mag_a = math.sqrt(sum(a * a for a in vector_a))
    mag_b = math.sqrt(sum(b * b for b in vector_b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot_product / (mag_a * mag_b)


def classify_heritage(text: str, file_name: str) -> list[str]:
    content = f"{file_name} {text}".lower()
    tags = set()

    for category, keywords in ARCHITECTURAL_CATEGORIES.items():
        if any(kw in content for kw in keywords):
            tags.add(category.capitalize())

    # Detect Devanagari
    if any(0x0900 <= ord(char) <= 0x097F for char in text):
        tags.add("Devanagari Inscription")

    if not tags:
        tags.add("Heritage Archive")

    return list(tags)


def extract_images_from_file(content: bytes, filename: str) -> list[np.ndarray]:
    images = []
    if filename.lower().endswith(".pdf"):
        if HAS_PYMUPDF:
            doc = fitz.open(stream=content, filetype="pdf")
            for page_idx in range(min(len(doc), 5)):
                page = doc[page_idx]
                pix = page.get_pixmap(dpi=150)
                img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
                if pix.n == 4:
                    img_np = cv2.cvtColor(img_np, cv2.COLOR_RGBA2BGR)
                elif pix.n == 3:
                    img_np = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
                images.append(img_np)
    else:
        img = cv2.imdecode(np.frombuffer(content, np.uint8), cv2.IMREAD_COLOR)
        if img is not None:
            images.append(img)
    return images


def run_ocr(images: list[np.ndarray]) -> tuple[str, list[float]]:
    all_texts = []
    all_scores = []

    for img in images:
        rapid_text = ""
        rapid_scores = []
        try:
            res = ocr_engine(img)
            if res:
                rapid_text = "\n".join(res.txts or [])
                rapid_scores = [round(float(s), 2) for s in (res.scores or [])]
        except Exception:
            pass

        if HAS_EASYOCR:
            try:
                easy_res = hindi_ocr_reader.readtext(img)
                easy_txts = [r[1] for r in easy_res if r[2] > 0.35]
                easy_scores = [round(float(r[2]), 2) for r in easy_res if r[2] > 0.35]

                combined = [rapid_text] if rapid_text else []
                for line in easy_txts:
                    if line not in rapid_text:
                        combined.append(line)
                page_text = "\n".join(combined).strip()
                scores = rapid_scores + easy_scores
            except Exception:
                page_text = rapid_text
                scores = rapid_scores
        else:
            page_text = rapid_text
            scores = rapid_scores

        if page_text:
            all_texts.append(page_text)
            all_scores.extend(scores)

    return "\n\n".join(all_texts), all_scores


def translate_to_english(extracted_text: str) -> str:
    if not extracted_text.strip():
        return "No text detected."

    if all(ord(c) < 128 for c in extracted_text):
        return extracted_text

    if HAS_GOOGLE_TRANS:
        try:
            res = GoogleTranslator(source="auto", target="en").translate(extracted_text[:3000])
            if res:
                return res
        except Exception:
            pass

    return f"[Transcription Preview]: {extracted_text[:200]}"


def create_summary(extracted_text: str) -> str:
    clean = re.sub(r"\s+", " ", extracted_text).strip()
    if not clean:
        return "Heritage artefact scan documented. No legible text found."
    return f"OCR extracted content: {clean[:260]}..."


def save_upload(
    file_name: str,
    extracted_text: str,
    translated_text: str,
    summary: str,
    embedding: list[float],
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    location_name: Optional[str] = None,
    architectural_tags: list[str] = None,
) -> int:
    conn = get_database_connection()
    cursor = conn.execute(
        """
        INSERT INTO uploads (
            file_name, extracted_text, translated_text, summary,
            created_at, embedding, latitude, longitude, location_name, architectural_tags
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            file_name,
            extracted_text,
            translated_text,
            summary,
            datetime.now().isoformat(),
            json.dumps(embedding),
            latitude,
            longitude,
            location_name,
            json.dumps(architectural_tags or []),
        ),
    )
    conn.commit()
    upload_id = cursor.lastrowid
    conn.close()
    return upload_id


@app.get("/")
def health_check():
    return {
        "message": "Dharohar AI backend is running",
        "total_knowledge_records": len(HERITAGE_KNOWLEDGE_BASE),
        "has_pymupdf": HAS_PYMUPDF,
        "has_easyocr": HAS_EASYOCR,
    }


@app.get("/api/heritage")
def get_heritage_records():
    records_list = [record.model_dump() for record in HERITAGE_KNOWLEDGE_BASE]

    conn = get_database_connection()
    uploads = conn.execute(
        """
        SELECT id, file_name, summary, latitude, longitude, location_name, architectural_tags
        FROM uploads
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        """
    ).fetchall()
    conn.close()

    for item in uploads:
        tags = []
        if item["architectural_tags"]:
            try:
                tags = json.loads(item["architectural_tags"])
            except Exception:
                tags = ["Community Upload"]

        records_list.append({
            "id": 1000 + item["id"],
            "name": item["location_name"] or item["file_name"],
            "location": item["location_name"] or "Uploaded Site",
            "state": "Community Record",
            "latitude": float(item["latitude"]),
            "longitude": float(item["longitude"]),
            "period": "Documented Archive",
            "category": tags[0] if tags else "Community Record",
            "description": item["summary"] or "User-contributed heritage scan.",
            "tags": tags,
            "colour": "#2A9D8F",
        })

    return records_list


@app.post("/api/analyse-upload")
async def analyse_upload(
    file: UploadFile = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    location_name: Optional[str] = Form(None),
):
    try:
        content = await file.read()
        images = extract_images_from_file(content, file.filename)

        if not images:
            raise HTTPException(status_code=400, detail="Invalid image or PDF file.")

        text, scores = run_ocr(images)
        translated_text = translate_to_english(text)
        summary = create_summary(text)
        tags = classify_heritage(text, file.filename)

        embedding = create_embedding(f"{file.filename} {text} {translated_text} {summary} {' '.join(tags)}")

        upload_id = save_upload(
            file_name=file.filename,
            extracted_text=text,
            translated_text=translated_text,
            summary=summary,
            embedding=embedding,
            latitude=latitude,
            longitude=longitude,
            location_name=location_name,
            architectural_tags=tags,
        )

        return {
            "file_name": file.filename,
            "suggested_type": "Heritage Record",
            "summary": summary,
            "suggested_tags": tags,
            "extracted_text": text,
            "translated_text": translated_text,
            "record_id": upload_id,
            "confidence_scores": scores,
            "latitude": latitude,
            "longitude": longitude,
            "location_name": location_name,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/uploads")
def get_saved_uploads():
    conn = get_database_connection()
    uploads = conn.execute(
        """
        SELECT
            id, file_name, extracted_text, translated_text,
            summary, created_at, latitude, longitude, location_name, architectural_tags
        FROM uploads
        ORDER BY id DESC
        """
    ).fetchall()
    conn.close()

    result = []
    for row in uploads:
        d = dict(row)
        if d.get("architectural_tags"):
            try:
                d["architectural_tags"] = json.loads(d["architectural_tags"])
            except Exception:
                d["architectural_tags"] = []
        else:
            d["architectural_tags"] = []
        result.append(d)

    return result


@app.get("/api/search")
def search_archive(q: str = Query(min_length=2)):
    query_embedding = create_embedding(q)
    ranked = []

    # 1. Search Heritage Knowledge Base (Instant ground-truth matches)
    for record, rec_embedding in KNOWLEDGE_BASE_EMBEDDINGS:
        sim = cosine_similarity(query_embedding, rec_embedding)
        rel_pct = max(0.0, min(100.0, round(float(sim) * 100, 1)))
        if rel_pct > 25.0:  # Relevance threshold
            ranked.append({
                "id": record.id,
                "file_name": record.name,
                "location_name": f"{record.location}, {record.state}",
                "summary": record.description,
                "extracted_text": f"Historical Period: {record.period} | Category: {record.category}",
                "translated_text": record.description,
                "similarity_score": round(sim, 3),
                "relevance_percentage": rel_pct,
                "architectural_tags": record.tags,
            })

    # 2. Search User Uploads
    conn = get_database_connection()
    uploads = conn.execute(
        """
        SELECT id, file_name, extracted_text, translated_text, summary, embedding, location_name, architectural_tags
        FROM uploads WHERE embedding IS NOT NULL
        """
    ).fetchall()
    conn.close()

    for up in uploads:
        d = dict(up)
        up_embedding = json.loads(d["embedding"])
        sim = cosine_similarity(query_embedding, up_embedding)
        rel_pct = max(0.0, min(100.0, round(float(sim) * 100, 1)))
        
        tags = []
        if d.get("architectural_tags"):
            try:
                tags = json.loads(d["architectural_tags"])
            except Exception:
                pass

        ranked.append({
            "id": 1000 + d["id"],
            "file_name": d["file_name"],
            "location_name": d["location_name"] or "User Upload",
            "summary": d["summary"],
            "extracted_text": d["extracted_text"],
            "translated_text": d["translated_text"],
            "similarity_score": round(sim, 3),
            "relevance_percentage": rel_pct,
            "architectural_tags": tags,
        })

    ranked.sort(key=lambda r: r["similarity_score"], reverse=True)
    return ranked[:12]