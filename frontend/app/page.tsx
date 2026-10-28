
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type Analysis = {
  file_name: string;
  suggested_type: string;
  summary: string;
  suggested_tags: string[];
  extracted_text?: string;
  confidence_scores?: number[];
  translated_text?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
};

type HeritageRecord = {
  id: number;
  name: string;
  location: string;
  state?: string;
  latitude: number;
  longitude: number;
  period?: string;
  category?: string;
  description?: string;
  tags?: string[];
  colour?: string;
};

type SavedUpload = {
  id: number;
  file_name: string;
  extracted_text: string;
  translated_text: string;
  summary: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  architectural_tags?: string[];
  relevance_percentage?: number;
  similarity_score?: number;
};

const HeritageMap = dynamic(
  () => import("./components/HeritageMap"),
  { ssr: false }
);

const PRESET_SITES = [
  { name: "Chand Baori", place: "Abhaneri, Rajasthan", type: "Stepwell", lat: 27.0070, lng: 76.6060 },
  { name: "Rani ki Vav", place: "Patan, Gujarat", type: "Stepwell", lat: 23.8493, lng: 72.1012 },
  { name: "Hampi Monuments", place: "Hampi, Karnataka", type: "Temple Complex", lat: 15.3350, lng: 76.4600 },
  { name: "Khajuraho Temples", place: "Chhatarpur, MP", type: "Nagara Architecture", lat: 24.8318, lng: 79.9199 },
  { name: "Ajanta Caves", place: "Aurangabad, Maharashtra", type: "Rock-cut Buddhist", lat: 20.5519, lng: 75.7033 },
  { name: "Konark Sun Temple", place: "Konark, Odisha", type: "Kalinga Style", lat: 19.8876, lng: 86.0945 },
];

export default function Home() {
    const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [heritageRecords, setHeritageRecords] = useState<HeritageRecord[]>([]);
  const [savedUploads, setSavedUploads] = useState<SavedUpload[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SavedUpload[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Location selector state
  const [locationName, setLocationName] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPickerActive, setIsPickerActive] = useState(false);

  // Load heritage sites and uploads on mount
  useEffect(() => {
    refreshData();
  }, []);

  

  const refreshData = async () => {
    try {
      const [heritageRes, uploadsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/heritage"),
        fetch("http://127.0.0.1:8000/api/uploads"),
      ]);
      if (heritageRes.ok) setHeritageRecords(await heritageRes.json());
      if (uploadsRes.ok) setSavedUploads(await uploadsRes.json());
    } catch (err) {
      console.warn("Backend not yet reachable on http://127.0.0.1:8000", err);
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedCoords({
          lat: parseFloat(pos.coords.latitude.toFixed(5)),
          lng: parseFloat(pos.coords.longitude.toFixed(5)),
        });
        setLocationName((prev) => prev || "Field Survey Location");
      },
      (err) => alert("Could not fetch GPS: " + err.message)
    );
  };

  const handleSelectPreset = (preset: typeof PRESET_SITES[0]) => {
    setLocationName(`${preset.name} (${preset.place})`);
    setSelectedCoords({ lat: preset.lat, lng: preset.lng });
  };

  async function analyseUpload() {
    if (!file) return;
    setLoading(true);
    setProcessingStage("Extracting Devanagari/English text & rasterizing...");

    const formData = new FormData();
    formData.append("file", file);

    if (selectedCoords) {
      formData.append("latitude", selectedCoords.lat.toString());
      formData.append("longitude", selectedCoords.lng.toString());
      formData.append("location_name", locationName || "Heritage Site");
    }

    try {
      setTimeout(() => setProcessingStage("Running local translation & architectural tagging..."), 800);
      setTimeout(() => setProcessingStage("Generating semantic vector embeddings..."), 1600);

      const response = await fetch("http://127.0.0.1:8000/api/analyse-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);

      // Refresh maps and uploads
      await refreshData();
      setIsPickerActive(false);
    } catch (err: any) {
      setAnalysis({
        file_name: file.name,
        suggested_type: "Processing Error",
        summary: `Could not complete analysis. Check backend terminal. Error: ${err.message}`,
        suggested_tags: ["error", "check-backend"],
      });
    } finally {
      setLoading(false);
      setProcessingStage("");
    }
  }

  async function searchArchive() {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

    if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-teal-900">
        <div className="font-serif text-lg animate-pulse">Loading Dharohar AI...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-teal-950 font-sans">
      
      {/* Top Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 border-b border-stone-200/60 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="text-3xl">🏛️</span>
          <span>Dharohar</span>
          <span className="rounded-md bg-amber-700/10 px-2 py-0.5 text-xs font-semibold text-amber-700">AI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
            {savedUploads.length} Archived Records
          </span>
          <span className="rounded-full bg-teal-800 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm">
            Living Heritage Archive
          </span>
        </div>
      </nav>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
  <input
    suppressHydrationWarning
    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none ring-teal-700 focus:ring-2"
    value={searchQuery}
    onChange={(event) => setSearchQuery(event.target.value)}
    placeholder="Search OCR text, file name, or translated text..."
  />

  <button
    suppressHydrationWarning
    onClick={searchArchive}
    className="rounded-xl bg-teal-800 px-6 py-3 font-semibold text-white"
  >
    Search
  </button>
</div>

      {/* Hero Header */}
      <section className="mx-auto max-w-6xl px-6 py-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-700">
          Digital Preservation of India’s Cultural Memory
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl text-stone-900 leading-tight">
          Preserve, Translate & Map Heritage Inscriptions
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">
          Transform historical scans, manuscripts, stone inscriptions, and monument photos into an AI-searchable multilingual collection.
        </p>
      </section>

      {/* Preset Heritage Showcase */}
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-10 sm:grid-cols-2 md:grid-cols-3">
        {PRESET_SITES.slice(0, 3).map((site) => (
          <article
            key={site.name}
            onClick={() => handleSelectPreset(site)}
            className="group cursor-pointer rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition hover:border-amber-600 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                {site.type}
              </span>
              <span className="text-xs text-stone-400 group-hover:text-amber-700 transition">Quick Tag →</span>
            </div>
            <h2 className="mt-2 font-serif text-xl text-stone-900 font-semibold">{site.name}</h2>
            <p className="mt-2 text-xs text-stone-500">📍 {site.place}</p>
          </article>
        ))}
      </section>

      {/* Interactive Heritage Map Section */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Geographic Exploration & Visual Archive
            </p>
            <h2 className="mt-1 font-serif text-3xl text-stone-900 font-semibold">
              Heritage Spatial Map
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-800 border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-[#DE6B48]"></span> Verified Monuments
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-800 border border-teal-200">
              <span className="h-2 w-2 rounded-full bg-[#2A9D8F]"></span> Community Uploads
            </span>
          </div>
        </div>

        <HeritageMap
          records={heritageRecords}
          selectedLocation={selectedCoords}
          onLocationSelect={(lat, lng) => {
            setSelectedCoords({ lat, lng });
            if (!locationName) setLocationName("Custom Geotagged Site");
          }}
          isPickerMode={isPickerActive}
        />
      </section>

      {/* Upload and AI Processing Section */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-dashed border-teal-700/30 bg-teal-50/60 p-6 md:p-10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Multilingual Digitisation Pipeline
            </p>
            <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
              PDF & Images Supported
            </span>
          </div>

          <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-900">
            Digitise a Heritage Scan or Document
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Upload Sanskrit/Hindi/Devanagari manuscripts, ASI site records, or monument photos. Dharohar runs local OCR, English translation, and architectural tagging.
          </p>

          {/* Location Tagging Controls */}
          <div className="mt-6 rounded-2xl border border-teal-200/80 bg-white p-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                📍 Geographic Location Tagging
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPickerActive(!isPickerActive)}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                    isPickerActive
                      ? "bg-amber-600 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {isPickerActive ? "✓ Click Map to Pick" : "🗺️ Pick on Map"}
                </button>
                <button
                  type="button"
                  onClick={handleUseGPS}
                  className="rounded-lg bg-stone-100 px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-200 transition"
                >
                  🧭 Auto GPS
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-500">Location / Monument Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amber Palace, Jaipur"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-xs outline-none focus:border-teal-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 26.9855"
                  value={selectedCoords?.lat ?? ""}
                  onChange={(e) =>
                    setSelectedCoords({
                      lat: parseFloat(e.target.value) || 0,
                      lng: selectedCoords?.lng || 0,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-xs font-mono outline-none focus:border-teal-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 75.8513"
                  value={selectedCoords?.lng ?? ""}
                  onChange={(e) =>
                    setSelectedCoords({
                      lat: selectedCoords?.lat || 0,
                      lng: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-xs font-mono outline-none focus:border-teal-700"
                />
              </div>
            </div>
          </div>

          {/* File Picker and Analyse Button */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              className="block w-full cursor-pointer rounded-xl border border-stone-300 bg-white p-3 text-sm text-stone-700 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-teal-800"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setAnalysis(null);
              }}
            />
            <button
              disabled={!file || loading}
              onClick={analyseUpload}
              className="rounded-xl bg-teal-800 px-6 py-3 font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-56 shrink-0 shadow-xs"
            >
              {loading ? "Analysing..." : "Analyse Upload"}
            </button>
          </div>

          {/* Dynamic Loading State Feedback */}
          {loading && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent"></div>
                <span className="text-xs font-semibold text-amber-900">{processingStage}</span>
              </div>
            </div>
          )}

          {file && !loading && (
            <p className="mt-2 text-xs font-medium text-teal-800">
              Selected: <span className="font-mono">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}

          {/* Output Analysis Card */}
          {analysis && (
            <div className="mt-6 rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">{analysis.file_name}</h3>
                  <p className="text-xs font-semibold text-amber-700">{analysis.suggested_type}</p>
                </div>
                {analysis.latitude && analysis.longitude && (
                  <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
                    📍 Pin Added to Heritage Map
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-stone-700">{analysis.summary}</p>

              {/* Architectural Tags */}
              {analysis.suggested_tags && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-stone-500 mr-1">Classification:</span>
                  {analysis.suggested_tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-teal-900 border border-stone-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Extracted and Translated Panes */}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {analysis.extracted_text && (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                      Detected Inscription / Scan Text
                    </p>
                    <p className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-stone-800 max-h-48 overflow-y-auto">
                      {analysis.extracted_text}
                    </p>
                  </div>
                )}

                {analysis.translated_text && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      English Translation (Offline Model)
                    </p>
                    <p className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-amber-950 max-h-48 overflow-y-auto">
                      {analysis.translated_text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Semantic Search Section */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Neural Vector Search
        </p>
        <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-900">
          Semantic Archive Search
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Search by conceptual meaning (e.g. "water reservoir steps", "royal Sanskrit decree", "granite temple pillars")
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-teal-700 focus:ring-2 shadow-2xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchArchive()}
            placeholder="Type query to search embeddings..."
          />
          <button
            onClick={searchArchive}
            disabled={isSearching}
            className="rounded-xl bg-teal-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 shrink-0"
          >
            {isSearching ? "Searching..." : "Vector Search"}
          </button>
        </div>

        {/* Enhanced Search Results Display */}
        {searchResults.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {searchResults.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-teal-200 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-stone-900 truncate">{record.file_name}</h4>
                  {record.relevance_percentage !== undefined && (
                    <span className="shrink-0 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      {record.relevance_percentage}% Match
                    </span>
                  )}
                </div>

                {record.location_name && (
                  <p className="mt-1 text-xs text-stone-500">📍 {record.location_name}</p>
                )}

                <p className="mt-3 text-xs leading-relaxed text-stone-700 line-clamp-3">
                  {record.translated_text || record.extracted_text || record.summary}
                </p>

                {record.architectural_tags && record.architectural_tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {record.architectural_tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Saved Archive Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Permanent Storage (SQLite)
        </p>
        <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-900">
          Digitised Records Collection
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedUploads.map((upload) => (
            <article
              key={upload.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider text-amber-700">
                  Record #{upload.id}
                </span>
                <span className="text-stone-400">
                  {new Date(upload.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="mt-2 font-bold text-stone-900 truncate" title={upload.file_name}>
                {upload.file_name}
              </h3>

              {upload.location_name && (
                <p className="mt-1 text-xs font-medium text-teal-800">
                  📍 {upload.location_name}
                </p>
              )}

              <p className="mt-2 text-xs leading-5 text-stone-600 line-clamp-3">
                {upload.summary}
              </p>

              {upload.architectural_tags && upload.architectural_tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {upload.architectural_tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {savedUploads.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
            No records digitised yet. Upload a heritage scan or PDF above to begin.
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-500">
        Dharohar AI — Preserving India’s cultural heritage through open AI & geospatial indexing.
      </footer>
    </main>
  );
}