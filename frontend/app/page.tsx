
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

const PRESET_SITES: (HeritageRecord & { region: string })[] = [
  // Gujarat
  { id: 1, name: "Rani Ki Vav", location: "Patan", state: "Gujarat", latitude: 23.8493, longitude: 72.1012, period: "11th century CE", category: "Stepwell", description: "UNESCO World Heritage subterranean stepwell with 7 sculptural levels.", tags: ["UNESCO", "Stepwell", "Solanki"], colour: "#E9A93D", region: "Gujarat" },
  { id: 2, name: "Dholavira", location: "Khadir Island, Kutch", state: "Gujarat", latitude: 23.8863, longitude: 70.2133, period: "3000–1500 BCE", category: "Archaeological City", description: "Ancient Indus Valley metropolis with grand stone water reservoirs.", tags: ["UNESCO", "Harappan", "Reservoir"], colour: "#0077B6", region: "Gujarat" },
  { id: 3, name: "Nirona (Rogan Art)", location: "Kutch", state: "Gujarat", latitude: 23.3644, longitude: 69.6012, period: "Living Heritage", category: "Living Craft", description: "Centuries-old rare fabric art using boiled castor oil pigments and stylus.", tags: ["Rogan Art", "Craft", "Living Heritage"], colour: "#7B2CBF", region: "Crafts" },
  { id: 4, name: "Ajrakhpur (Block Print)", location: "Kutch", state: "Gujarat", latitude: 23.2200, longitude: 69.8300, period: "Living Heritage", category: "Living Craft", description: "Traditional geometric hand-block printing using organic indigo and madder dyes.", tags: ["Ajrakh", "Textile", "Living Craft"], colour: "#7B2CBF", region: "Crafts" },

  // Karnataka
  { id: 5, name: "Hampi Monuments", location: "Vijayanagara", state: "Karnataka", latitude: 15.3145, longitude: 76.4600, period: "14th–16th century CE", category: "Ancient Capital", description: "UNESCO capital of Vijayanagara Empire with iconic Stone Chariot & musical pillars.", tags: ["UNESCO", "Vijayanagara", "Chariot"], colour: "#DE6B48", region: "Karnataka" },
  { id: 6, name: "Badami Cave Temples", location: "Bagalkot", state: "Karnataka", latitude: 15.9194, longitude: 75.6825, period: "6th–8th century CE", category: "Rock-cut Temple", description: "Four monolithic cliff shrines excavated into red sandstone by Early Chalukyas.", tags: ["Chalukya", "Rock-cut", "Nataraja"], colour: "#E76F51", region: "Karnataka" },
  { id: 7, name: "Kinhal Wooden Toys", location: "Koppal", state: "Karnataka", latitude: 15.4217, longitude: 76.0592, period: "Living Craft (GI)", category: "Living Craft", description: "Lightweight artisan wooden figurines made with tamarind seed paste and lacquer.", tags: ["GI Tag", "Woodcraft", "Chitragar"], colour: "#7B2CBF", region: "Crafts" },
  { id: 8, name: "Guledgudda Khana", location: "Bagalkot", state: "Karnataka", latitude: 16.0519, longitude: 75.8858, period: "Living Craft", category: "Living Craft", description: "Handloom blouse textile weaving with ancient geometric and choli borders.", tags: ["Khana", "Handloom", "Textile"], colour: "#7B2CBF", region: "Crafts" },

  // Andhra Pradesh
  { id: 9, name: "Lepakshi Temple", location: "Sri Sathya Sai", state: "Andhra Pradesh", latitude: 13.8000, longitude: 77.6060, period: "16th century CE", category: "Temple", description: "Vijayanagara masterpiece famous for its Hanging Pillar and colossal monolithic Nandi.", tags: ["Hanging Pillar", "Vijayanagara", "Frescoes"], colour: "#E9A93D", region: "Andhra" },
  { id: 10, name: "Gandikota Fort", location: "YSR Kadapa", state: "Andhra Pradesh", latitude: 14.8167, longitude: 78.2833, period: "12th–17th century CE", category: "Fortress", description: "India's Grand Canyon gorge citadel overlooking Penna River canyon.", tags: ["Gorge", "Citadel", "Gandikota"], colour: "#DE6B48", region: "Andhra" },
  { id: 11, name: "Nimmalakunta (Shadow Puppets)", location: "Anantapur", state: "Andhra Pradesh", latitude: 14.3000, longitude: 77.5800, period: "Living Craft", category: "Living Craft", description: "Tholu Bommalata translucent goat leather puppets enacting epic folklore.", tags: ["Tholu Bommalata", "Puppetry", "Folk Art"], colour: "#7B2CBF", region: "Crafts" },
  { id: 12, name: "Budithi Brass Craft", location: "Srikakulam", state: "Andhra Pradesh", latitude: 18.6667, longitude: 84.1500, period: "Living Craft", category: "Living Craft", description: "Specialized alloy bell-metal and brass casting with distinctive black polish.", tags: ["Brassware", "Bell Metal", "Craft"], colour: "#7B2CBF", region: "Crafts" },

  // North & West
  { id: 13, name: "Ajanta Caves", location: "Chhatrapati Sambhajinagar", state: "Maharashtra", latitude: 20.5519, longitude: 75.7033, period: "2nd BCE – 6th CE", category: "Rock-cut Buddhist", description: "30 rock-hewn caves famous for vibrant Buddhist tempera murals of Jataka tales.", tags: ["UNESCO", "Buddhist", "Murals"], colour: "#0077B6", region: "North" },
  { id: 14, name: "Gateway of India", location: "Mumbai", state: "Maharashtra", latitude: 18.9220, longitude: 72.8347, period: "1911–1924 CE", category: "Monument", description: "Indo-Saracenic triumphal arch built in yellow basalt on Mumbai waterfront.", tags: ["Indo-Saracenic", "Basalt", "Colonial"], colour: "#2A9D8F", region: "North" },
  { id: 15, name: "Hawa Mahal", location: "Jaipur", state: "Rajasthan", latitude: 26.9240, longitude: 75.8267, period: "1799 CE", category: "Palace", description: "Five-storey pink sandstone facade featuring 953 honeycomb jharokha balconies.", tags: ["Rajput", "Pink City", "Jharokhas"], colour: "#E76F51", region: "North" },
  { id: 16, name: "Golden Temple", location: "Amritsar", state: "Punjab", latitude: 31.6200, longitude: 74.8765, period: "1604 CE", category: "Sacred Gurudwara", description: "Central sanctum of Sikhism plated in pure gold leaf within holy Amrit Sarovar.", tags: ["Harmandir", "Sikh", "Sarovar"], colour: "#E9A93D", region: "North" },
  { id: 17, name: "Doraha Sarai (Rang De Basanti)", location: "Ludhiana", state: "Punjab", latitude: 30.8000, longitude: 76.0333, period: "1667 CE", category: "Mughal Sarai", description: "Mughal era fortified sarai on Grand Trunk Road with monumental brick gateways.", tags: ["Mughal", "GT Road", "Sarai"], colour: "#DE6B48", region: "North" },
  { id: 18, name: "Vaishno Devi Shrine", location: "Reasi", state: "Jammu & Kashmir", latitude: 32.9929, longitude: 74.9403, period: "Ancient Shrine", category: "Cave Shrine", description: "Holiest mountain cave shrine situated in Trikuta peaks dedicated to Shakti.", tags: ["Pilgrimage", "Trikuta", "Cave"], colour: "#D90429", region: "North" },
  { id: 19, name: "Gurez Valley", location: "Bandipora", state: "Jammu & Kashmir", latitude: 34.6416, longitude: 74.8470, period: "Dard-Shina Heritage", category: "Landscape", description: "Remote Himalayan Silk Route valley with wooden log houses and Dardic folklore.", tags: ["Silk Route", "Himalayan", "Timber"], colour: "#2A9D8F", region: "North" },
];

const SEARCH_SUGGESTIONS = [
  "Hanging Pillar",
  "Harappan Water Reservoir",
  "Castor Oil Painting",
  "Shadow Puppets",
  "Stone Chariot",
  "Rock-cut Nataraja",
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [heritageRecords, setHeritageRecords] = useState<HeritageRecord[]>([]);
  const [savedUploads, setSavedUploads] = useState<SavedUpload[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SavedUpload[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Region Filter
  const [selectedRegion, setSelectedRegion] = useState("All");

  // Location selector state
  const [locationName, setLocationName] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPickerActive, setIsPickerActive] = useState(false);

  // Modal inspection state
  const [inspectRecord, setInspectRecord] = useState<any | null>(null);

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
      console.warn("Backend not reached on http://127.0.0.1:8000", err);
    }
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setAnalysis(null);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleSelectSite = (site: typeof PRESET_SITES[0]) => {
    setLocationName(`${site.name} (${site.location})`);
    setSelectedCoords({ lat: site.latitude, lng: site.longitude });
    // Scroll to map smoothly
    const mapElement = document.getElementById("heritage-map-section");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  async function analyseUpload() {
    if (!file) return;
    setLoading(true);
    setProcessingStage("Rasterizing document & detecting script...");

    const formData = new FormData();
    formData.append("file", file);

    if (selectedCoords) {
      formData.append("latitude", selectedCoords.lat.toString());
      formData.append("longitude", selectedCoords.lng.toString());
      formData.append("location_name", locationName || "Heritage Monument");
    }

    try {
      setTimeout(() => setProcessingStage("Running Devanagari OCR & local translation..."), 700);
      setTimeout(() => setProcessingStage("Extracting architectural tags & computing embeddings..."), 1500);

      const response = await fetch("http://127.0.0.1:8000/api/analyse-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();
      setAnalysis(data);
      await refreshData();
      setIsPickerActive(false);
    } catch (err: any) {
      setAnalysis({
        file_name: file.name,
        suggested_type: "Processing Error",
        summary: `Check backend terminal. Error: ${err.message}`,
        suggested_tags: ["error", "check-backend"],
      });
    } finally {
      setLoading(false);
      setProcessingStage("");
    }
  }

  async function searchArchive(queryToSearch?: string) {
    const q = (queryToSearch ?? searchQuery).trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/search?q=${encodeURIComponent(q)}`
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

  const filteredSites =
    selectedRegion === "All"
      ? PRESET_SITES
      : PRESET_SITES.filter((s) => s.region === selectedRegion);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-stone-800">
        <div className="font-serif text-lg animate-pulse tracking-wide">Loading Dharohar AI...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-stone-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-2xl shadow-xs">
              🏛️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                  Dharohar
                </span>
                <span className="rounded-md bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  AI 2.0
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Digital Preservation of India’s Cultural Memory</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-medium text-stone-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              FastAPI Engine Online
            </div>
            <a
              href="#upload-section"
              className="rounded-xl bg-stone-900 px-4 py-2 font-semibold text-white shadow-xs transition hover:bg-amber-700"
            >
              + Upload Document
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header with Live Stats Bar */}
      <section className="border-b border-stone-100 bg-gradient-to-b from-stone-50/60 to-white pt-14 pb-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <span>✨</span> Multilingual OCR · Semantic Search · Spatial Archiving
          </span>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-900 sm:text-6xl">
            India’s Inscriptions, Monuments & Living Crafts
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Digitise ancient stone epigraphy, Sanskrit & Devanagari manuscripts, and rare artisan traditions into an offline-first AI searchable geographic collection.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <p className="text-2xl font-bold text-stone-900">{PRESET_SITES.length}</p>
              <p className="text-xs font-medium text-stone-500">Indexed Monuments</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <p className="text-2xl font-bold text-amber-700">6</p>
              <p className="text-xs font-medium text-stone-500">UNESCO World Heritage</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <p className="text-2xl font-bold text-purple-700">6</p>
              <p className="text-xs font-medium text-stone-500">Rare Living Crafts (GI)</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <p className="text-2xl font-bold text-teal-700">{savedUploads.length}</p>
              <p className="text-xs font-medium text-stone-500">Community Scans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Region Filter & Showcase */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Explore Cultural Geographies
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Click any place card to pinpoint on the interactive map</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Gujarat", "Karnataka", "Andhra", "North", "Crafts"].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  selectedRegion === reg
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {reg === "Crafts" ? "✨ Living Crafts" : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Places Card Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredSites.map((site) => (
            <article
              key={site.id}
              onClick={() => handleSelectSite(site)}
              className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-amber-600 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: site.colour || "#DE6B48" }}
                  >
                    {site.category}
                  </span>
                  <span className="text-[11px] font-medium text-stone-400 group-hover:text-amber-700 transition">
                    Pin Map ↗
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition">
                  {site.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">📍 {site.location}, {site.state}</p>
                <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {site.description}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1 pt-2 border-t border-stone-100">
                {site.tags?.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-md bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 text-[10px] text-stone-600">
                    #{t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Spatial Heritage Map Section */}
      <section id="heritage-map-section" className="mx-auto max-w-7xl px-6 py-10 border-t border-stone-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Interactive Geospatial Map
            </span>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-900">
              Living Heritage Cartography
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-800 border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-[#E9A93D]"></span> Monuments
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-800 border border-purple-200">
              <span className="h-2 w-2 rounded-full bg-[#7B2CBF]"></span> Living Crafts
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

      {/* Digitisation & Upload Pipeline */}
      <section id="upload-section" className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-stone-200 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Document Digitisation Pipeline
            </span>
            <span className="rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
              PDF & Image Scans
            </span>
          </div>

          <h2 className="mt-2 font-serif text-3xl font-semibold text-stone-900">
            Upload Heritage Inscription or Scan
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Upload Sanskrit, Devanagari, or regional language monument photos. Dharohar performs local OCR, English translation, and architectural tagging.
          </p>

          {/* Interactive Drag and Drop Upload Area */}
          <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 p-6 text-center transition hover:border-amber-600 bg-stone-50/50">
            {filePreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={filePreview}
                  alt="Scan Preview"
                  className="max-h-48 rounded-xl object-contain shadow-xs border border-stone-200"
                />
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-medium text-stone-700">
                    {file?.name} ({(file?.size ? file.size / 1024 : 0).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => { setFile(null); setFilePreview(null); }}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-3xl">📄</span>
                <p className="mt-2 text-sm font-semibold text-stone-800">
                  Select a document scan or photograph
                </p>
                <p className="text-xs text-stone-400 mt-0.5">Supports JPG, PNG, WEBP, and multi-page PDF files</p>
                <label className="mt-4 inline-block cursor-pointer rounded-xl bg-white border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Location Geotagging Accordion */}
          <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                📍 Geographic Geotagging
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPickerActive(!isPickerActive)}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    isPickerActive
                      ? "bg-amber-600 text-white"
                      : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {isPickerActive ? "✓ Click Map to Pick" : "🗺️ Pick on Map"}
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-500">Site / Monument Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amber Fort, Jaipur"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs outline-none focus:border-amber-600"
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
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-amber-600"
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
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Action Button & Loading Progress */}
          <div className="mt-6">
            <button
              disabled={!file || loading}
              onClick={analyseUpload}
              className="w-full rounded-xl bg-stone-900 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Analysing Record..." : "Run AI Inscription Analysis"}
            </button>

            {loading && (
              <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent"></div>
                <span>{processingStage}</span>
              </div>
            )}
          </div>

          {/* Analysis Results Display */}
          {analysis && (
            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{analysis.file_name}</h3>
                  <span className="text-xs font-semibold text-amber-700">{analysis.suggested_type}</span>
                </div>
                {analysis.latitude && analysis.longitude && (
                  <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
                    📍 Added to Heritage Map
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-stone-700">{analysis.summary}</p>

              {analysis.suggested_tags && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {analysis.suggested_tags.map((t) => (
                    <span key={t} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-700">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {analysis.extracted_text && (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Detected Inscription
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-stone-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {analysis.extracted_text}
                    </p>
                  </div>
                )}
                {analysis.translated_text && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                      English Translation (Offline AI)
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-stone-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
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
      <section className="mx-auto max-w-5xl px-6 py-12 border-t border-stone-100">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Vector Similarity Engine
          </span>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-900">
            Semantic Heritage Search
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Search conceptual meanings without relying on exact keywords
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <input
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-amber-600 focus:ring-2 shadow-2xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchArchive()}
            placeholder="e.g. ancient water reservoir, hanging pillar, shadow puppet..."
          />
          <button
            onClick={() => searchArchive()}
            disabled={isSearching}
            className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 shrink-0"
          >
            {isSearching ? "Searching..." : "Vector Search"}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 justify-center">
          <span className="text-[11px] font-medium text-stone-400 mr-1">Try searching:</span>
          {SEARCH_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => {
                setSearchQuery(sug);
                searchArchive(sug);
              }}
              className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700 transition hover:border-amber-600 hover:bg-amber-50"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {searchResults.map((result) => (
              <article
                key={result.id}
                onClick={() => setInspectRecord(result)}
                className="cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-amber-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif font-bold text-stone-900 truncate">{result.file_name}</h4>
                  {result.relevance_percentage !== undefined && (
                    <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      {result.relevance_percentage}% Match
                    </span>
                  )}
                </div>

                {result.location_name && (
                  <p className="mt-1 text-xs text-stone-500">📍 {result.location_name}</p>
                )}

                <p className="mt-3 text-xs leading-relaxed text-stone-600 line-clamp-3">
                  {result.translated_text || result.extracted_text || result.summary}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2 text-[11px]">
                  <span className="text-amber-700 font-semibold">Inspect Full Record →</span>
                  <div className="flex gap-1">
                    {result.architectural_tags?.slice(0, 2).map((t) => (
                      <span key={t} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Inspect Record Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">{inspectRecord.file_name}</h3>
                <p className="text-xs text-stone-500">📍 {inspectRecord.location_name}</p>
              </div>
              <button
                onClick={() => setInspectRecord(null)}
                className="rounded-full bg-stone-100 p-2 text-xs font-bold text-stone-600 hover:bg-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {inspectRecord.relevance_percentage && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500">Semantic Relevance:</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    {inspectRecord.relevance_percentage}% Match
                  </span>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Summary & Historical Significance</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-700">{inspectRecord.summary}</p>
              </div>

              {inspectRecord.extracted_text && (
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-700">Archival Record Data</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-800 whitespace-pre-wrap">{inspectRecord.extracted_text}</p>
                </div>
              )}

              {inspectRecord.architectural_tags && (
                <div className="flex flex-wrap gap-1">
                  {inspectRecord.architectural_tags.map((t: string) => (
                    <span key={t} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectRecord(null)}
                className="rounded-xl bg-stone-900 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-10 text-center text-xs text-stone-400">
        <p className="font-serif text-sm font-semibold text-stone-800">Dharohar AI</p>
        <p className="mt-1">Preserving India’s cultural heritage through open-source AI & geospatial indexing.</p>
      </footer>
    </main>
  );
}