# 🏛️ Dharohar AI (धरोहर AI)
> **AI-Driven Epigraphic Preservation, Geospatial Indexing & Monocular 3D Reconstruction for Cultural Heritage**

Dharohar AI is an intelligent cultural preservation and exploration platform designed to digitally document, analyze, and revive historical monuments, ancient stone inscriptions, and cultural landmarks across India.

---

## 🌟 Key Features

1. **🏛️ State-Wise Heritage Catalog**:
   - Curated encyclopedia categorized by states (Rajasthan, Gujarat, Punjab, Karnataka, Andhra Pradesh, and more).
   - In-depth architectural profiles: founder, construction era, architectural style, purpose, and preservation milestones.

2. **📜 Archival Past vs. Present Comparison**:
   - Side-by-side photographic comparison contrasting 19th/20th-century archival imagery with present-day restored perspectives.

3. **🗺️ Geospatial 20 km POI Geofencing Engine**:
   - Interactive OpenStreetMap/Leaflet integration.
   - Computes and showcases the **Top 10 Nearby Places** within a 20 km radius categorized into:
     - 🛕 Historic Temples & Forts
     - ☕ Heritage Cafes
     - 🍲 Legendary Cuisine, Thalis & Street Food

4. **📜 Epigraphy Inscription OCR & Dual Translation**:
   - Enhanced OCR pipeline combining **RapidOCR** (ONNX) and **EasyOCR** (Hindi/Devanagari) with CLAHE contrast enhancement for weathered stone engravings.
   - Dual-language translation: converts ancient/regional Sanskrit & Hindi inscriptions into **English** and standard **Hindi (हिंदी अनुवाद)**.
   - Generates automated **Architectural & Historical Significance Summaries**.

5. **🌐 Lightweight Monocular 3D Spatial Viewer (Single-Photo 3D)**:
   - Computes monocular depth maps directly from single 2D photographs in ~35 ms via gradient relief and guided bilateral filtering.
   - Built with **Three.js** supporting 3 interactive modes:
     - **3D Relief Mesh**: Real-time vertex $Z$-displacement with extrusion slider ($0.1\times - 2.5\times$).
     - **Textured Point Cloud (LiDAR)**: Real-time photogrammetric point cloud with RGB photo colors or LiDAR depth heatmap.
     - **360° Curved Panorama**: Cylindrical/spherical lookaround view with inertial orbit.

6. **🔍 Semantic Vector Similarity Engine**:
   - Dense vector embeddings generated via `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions).
   - Natural language search with cosine similarity ranking and percentage match score.

---

## 🏗️ System Architecture Diagram

```mermaid
flowchart TD
    subgraph CLIENT["Client Layer (Frontend - Next.js 16 / React 19 / TypeScript)"]
        UI["Clean White UI & State Tabs (Rajasthan, Gujarat, Punjab, etc.)"]
        MAP["Geospatial Interactive Map (Leaflet / OpenStreetMap)"]
        SPOTLIGHT["Monument Spotlight (Archival Past vs Present Comparator)"]
        NEARBY["Nearby POI Discovery (20km Radius: Temples, Cafes, Food)"]
        STUDIO["Epigraphy Inscription Studio (Upload, Scan & PDF Ingestion)"]
        THREE_VIEWER["Lightweight 3D Viewer (Three.js - Mesh, LiDAR Cloud, Panorama)"]
        SEARCH_BAR["Semantic Vector Search Query Bar"]
    end

    subgraph API_GATEWAY["API & Routing Layer (FastAPI / Uvicorn - Port 8000)"]
        ENDPOINT_HERITAGE["GET /api/heritage"]
        ENDPOINT_ANALYSE["POST /api/analyse-upload"]
        ENDPOINT_DEPTH["POST /api/depth-estimate"]
        ENDPOINT_SEARCH["GET /api/search"]
        ENDPOINT_UPLOADS["GET & POST /api/uploads"]
    end

    subgraph AI_PIPELINE["AI & Computer Vision Processing Pipeline"]
        subgraph OCR_ENGINE["Epigraphy OCR & Text Recovery"]
            PREPROC["Document Prep (PyMuPDF Rasterization + CLAHE Contrast Enhancement)"]
            DUAL_OCR["Dual OCR Engine (RapidOCR ONNX + EasyOCR Hindi/Sanskrit)"]
            CANONICAL["Epigraphic Signature Reconstruction (Sanskrit / Devanagari)"]
        end

        subgraph NLP_ENGINE["Multilingual Translation & Summarization"]
            TRANS_EN["English Translation Engine"]
            TRANS_HI["Hindi Translation Engine (हिंदी अनुवाद)"]
            SUMMARIZER["Architectural & Historical Significance Summarizer"]
        end

        subgraph DEPTH_ENGINE["Monocular Depth Estimation Engine (Lightweight 3D)"]
            PERSPECTIVE["Perspective & Vertical Gradient Prior"]
            LUMINANCE["Luminance & Contrast Saliency Map"]
            SOBEL["Sobel High-Frequency Energy (Carvings & Screen Relief)"]
            BILATERAL["Guided Bilateral Filtering (Edge-Preserving Smoothing)"]
        end

        subgraph EMBEDDING_ENGINE["Vector Similarity Engine"]
            MINILM["Sentence-Transformers (all-MiniLM-L6-v2 - 384 Dim)"]
            COSINE["Cosine Similarity & Percentage Relevance Matcher"]
        end
    end

    subgraph DATA_STORAGE["Storage & Persistence Layer"]
        SQLITE[("SQLite Database (dharohar.db - Uploads, Texts, Translations)")]
        KB_CACHE[("In-Memory Knowledge Base Embeddings (20+ Heritage Monuments)")]
        ASSETS[("Static Heritage Asset Store (Archival & Present Photography)")]
    end

    %% Frontend to API
    UI --> ENDPOINT_HERITAGE
    STUDIO --> ENDPOINT_ANALYSE
    THREE_VIEWER --> ENDPOINT_DEPTH
    SEARCH_BAR --> ENDPOINT_SEARCH
    STUDIO --> ENDPOINT_UPLOADS

    %% API to AI Pipeline
    ENDPOINT_ANALYSE --> PREPROC --> DUAL_OCR --> CANONICAL
    CANONICAL --> TRANS_EN & TRANS_HI & SUMMARIZER
    SUMMARIZER --> MINILM

    ENDPOINT_DEPTH --> PERSPECTIVE & LUMINANCE & SOBEL --> BILATERAL
    ENDPOINT_SEARCH --> MINILM --> COSINE

    %% Storage connections
    ENDPOINT_HERITAGE --> KB_CACHE
    MINILM --> SQLITE
    COSINE --> KB_CACHE & SQLITE
    BILATERAL --> THREE_VIEWER
    ASSETS --> SPOTLIGHT
```

---

## 🔄 Project Workflows

### 1. Epigraphy Inscription OCR & Dual Translation Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Researcher
    participant UI as Frontend Studio
    participant API as FastAPI (/api/analyse-upload)
    participant Vision as OpenCV / OCR Pipeline
    participant NLP as Bilingual Translation Engine
    participant DB as SQLite & Vector Store

    User->>UI: Uploads Inscription Photo or Manuscript (JPG / PNG / PDF)
    UI->>API: Multipart Form POST (/api/analyse-upload)
    
    rect rgb(245, 245, 245)
        Note over API,Vision: Image Rasterization & Enhancement
        API->>Vision: Convert PDF pages or image to BGR numpy array
        Vision->>Vision: Apply CLAHE contrast enhancement for weathered stone incisions
        Vision->>Vision: Multi-engine OCR (RapidOCR + EasyOCR Devanagari)
        Vision->>Vision: Canonical epigraphic signature matching
    end

    Vision-->>NLP: Raw Detected Inscription Text
    
    rect rgb(245, 245, 245)
        Note over NLP: Translation & Summary Generation
        NLP->>NLP: Generate English Translation
        NLP->>NLP: Generate Hindi Translation (हिंदी अनुवाद)
        NLP->>NLP: Synthesize Historical & Architectural Explanation
        NLP->>NLP: Compute 384-d semantic embedding (all-MiniLM-L6-v2)
    end

    NLP->>DB: Store record, transcriptions, translations, and vector embedding
    API-->>UI: Return JSON (Extracted text, English, Hindi, Summary, Tags)
    UI-->>User: Displays 3-column comparative inscription card with 3D option
```

---

### 2. Monocular 3D Spatial Reconstruction Workflow (Single-Photo 3D)

```mermaid
flowchart LR
    subgraph INPUT["1. Input Source"]
        IMG["Single 2D Photograph (Archival / Present / Uploaded Scan)"]
    end

    subgraph DEPTH_ESTIMATION["2. Depth Estimation Pipeline (/api/depth-estimate)"]
        Y_GRAD["Perspective Baseline (Ground plane & central focus)"]
        LUM["Luminance Saliency (Reflective stone facade cues)"]
        SOBEL["Sobel Gradient Energy (Jharokha screens, capitals, carvings)"]
        SYNTH["Multi-Scale Synthesis: D = 0.38*Y + 0.38*L + 0.24*E"]
        BILATERAL["Guided Bilateral Filter (Smooth walls, sharp edges)"]
    end

    subgraph THREEJS["3. Client-Side Three.js Engine"]
        PLANE["Plane Geometry (140 x 140 Vertex Grid)"]
        DISPLACE["Z-Vertex Displacement via Depth Map"]
        LIGHT["Directional Sunlight + Ambient Fill Light"]
        PC["Point Cloud BufferGeometry with RGB Pixel Colors"]
        PANO["Inverted Cylindrical / Spherical Panorama Projection"]
    end

    subgraph OUTPUT_MODES["4. Interactive User Modes"]
        MODE1["🏛️ 3D Relief Mesh (With Extrusion Slider 0.1x - 2.5x)"]
        MODE2["✨ Textured Point Cloud (Photo RGB or LiDAR Heatmap)"]
        MODE3["🌐 360° Panorama Lookaround"]
    end

    IMG --> Y_GRAD & LUM & SOBEL
    Y_GRAD & LUM & SOBEL --> SYNTH --> BILATERAL
    BILATERAL --> PLANE & PC & PANO
    PLANE --> DISPLACE --> LIGHT --> MODE1
    PC --> MODE2
    PANO --> MODE3
```

---

### 3. Geospatial Exploration & 20 km POI Geofencing Workflow

```mermaid
flowchart TD
    START["User selects State Tab (e.g., Rajasthan, Gujarat, Punjab)"] --> FILTER["Filter Monument Encyclopedia"]
    FILTER --> SELECT["User selects Heritage Monument (e.g., Hawa Mahal)"]
    
    SELECT --> MAP_UPDATE["Interactive Leaflet Map re-centers coordinates"]
    SELECT --> SPOTLIGHT_UPDATE["Spotlight displays Archival Past vs Present Photos"]
    SELECT --> HIST_UPDATE["History Section populates Timeline, Ruler, Style & Purpose"]
    
    SELECT --> GEO_QUERY["Execute 20 km Geofence Radius Calculation"]
    GEO_QUERY --> NEARBY_LIST["Extract Top 10 Nearby POIs"]
    
    NEARBY_LIST --> CATEGORY_FILTER{"Filter by Category"}
    CATEGORY_FILTER -->|"All"| SHOW_ALL["Display All 10 POIs"]
    CATEGORY_FILTER -->|"Temples"| SHOW_TEMPLES["Display Historic Temples & Forts"]
    CATEGORY_FILTER -->|"Cafes"| SHOW_CAFES["Display Heritage Cafes & Rooftops"]
    CATEGORY_FILTER -->|"Food"| SHOW_FOOD["Display Legendary Street Food & Thalis"]
```

---

### 4. Semantic Vector Search Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Explorer
    participant UI as Search Interface
    participant API as GET /api/search?q=...
    participant Model as Sentence-Transformers (all-MiniLM-L6-v2)
    participant Store as Vector Store (Memory + SQLite)

    User->>UI: Enters natural language query (e.g. 'stepwell water architecture')
    UI->>API: HTTP GET /api/search?q=stepwell+water+architecture
    API->>Model: Encode query into 384-dimensional dense vector
    Model-->>API: Query vector embedding
    API->>Store: Compute Cosine Similarity against all monument and upload vectors
    Store-->>API: Similarity scores [-1.0 to 1.0]
    API->>API: Filter matches > 25% relevance and convert to percentage: (sim * 100)
    API->>API: Sort by highest similarity score
    API-->>UI: Top 12 ranked heritage records with match badges
    UI-->>User: Displays matching monuments with architectural tags and snippets
```

---

## 🛠️ Technology Stack Matrix

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router) + React 19 | High-performance server rendering & client-side hydration |
| **Language & Styling** | TypeScript + Tailwind CSS | Type-safe design system with modern white-theme aesthetics |
| **3D Rendering** | Three.js + OrbitControls | WebGL 3D plane displacement, LiDAR point clouds, 360° panoramas |
| **Mapping & GIS** | Leaflet + React-Leaflet | OpenStreetMap geospatial rendering and radius markers |
| **Backend Framework** | FastAPI + Uvicorn (Python 3.12) | Asynchronous REST microservices with CORS middleware |
| **OCR Engines** | RapidOCR (ONNX) + EasyOCR (PyTorch) | High-speed multi-lingual epigraphic character detection |
| **Computer Vision** | OpenCV (cv2) + NumPy | CLAHE, Sobel gradient filtering, bilateral guided smoothing |
| **Natural Language** | Deep Translator + Rule Engine | Dual translation into English & Hindi (हिंदी अनुवाद) |
| **Vector Embeddings** | Sentence-Transformers (`all-MiniLM-L6-v2`) | 384-dimensional dense vector generation & cosine similarity |
| **Database** | SQLite3 | Persistent storage for uploads, metadata, translations, and embeddings |

---

## 📁 Repository Directory Structure

```text
dharohar-ai-1/
├── README.md                           # Main Project Architecture & Documentation
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py                     # FastAPI server, AI pipelines & endpoints
│   ├── data/
│   │   └── dharohar.db                 # SQLite database storage
│   ├── requirements.txt                # Python backend dependencies
│   └── .venv-ocr/                      # Python virtual environment
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── Heritage3DViewer.tsx    # Three.js 3D Relief Mesh & Point Cloud Viewer
    │   │   └── HeritageMap.tsx         # Leaflet Geospatial Interactive Map
    │   ├── globals.css                 # Global Tailwind styling & animations
    │   ├── layout.tsx                  # Root layout definition
    │   └── page.tsx                    # Main interactive heritage dashboard
    ├── public/
    │   └── heritage/                   # High-res archival & present-day photography
    ├── package.json                    # Frontend dependencies & scripts
    └── tsconfig.json                   # TypeScript configuration
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 to v3.12
- **Git**

---

### Step 1: Clone Repository
```bash
git clone <YOUR_PUBLIC_GIT_REPO_URL>
cd dharohar-ai-1
```

---

### Step 2: Backend Setup (FastAPI & AI Models)

1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv .venv-ocr
   .venv-ocr\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv-ocr
   source .venv-ocr/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install --upgrade pip
   pip install fastapi uvicorn opencv-python numpy rapidocr-onnxruntime easyocr sentence-transformers deep-translator PyMuPDF
   ```

4. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   > Backend API documentation will be available at: `http://127.0.0.1:8000/docs`

---

### Step 3: Frontend Setup (Next.js & Three.js)

1. Open a second terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   > Web application will be accessible at: `http://localhost:3000`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/heritage` | Fetches all seeded heritage monument records | None |
| `POST` | `/api/analyse-upload` | Processes image/PDF through OCR, dual translation & summaries | `file: UploadFile` |
| `POST` | `/api/depth-estimate` | Computes monocular depth map for 3D reconstruction | `file: UploadFile` or `image_url: string` |
| `GET` | `/api/search` | Performs semantic vector search | `?q=<natural_language_query>` |
| `GET` | `/api/uploads` | Retrieves historical user uploads and annotations | None |
| `POST` | `/api/upload` | Saves new monument entry with coordinates and tags | Form data with image/document |

---

## 📜 License & Acknowledgments
- Developed for **Cultural Heritage Preservation & Open Innovation**.
- Powered by open-source technologies: **FastAPI**, **Next.js**, **Three.js**, **Leaflet**, and **HuggingFace Sentence-Transformers**.
