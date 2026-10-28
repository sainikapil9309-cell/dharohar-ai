"use client";

import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import dynamic from "next/dynamic";

type Analysis = {
  file_name: string;
  suggested_type: string;
  summary: string;
  suggested_tags: string[];
  extracted_text?: string;
  confidence_scores?: number[];
  translated_text?: string;
};

type HeritageRecord = any;

 type SavedUpload = {
  id: number;
  file_name: string;
  extracted_text: string;
  translated_text: string;
  summary: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
};

const HeritageMap = dynamic(
  () => import("./components/HeritageMap"),
  { ssr: false }
);

const places = [
  { name: "Chand Baori", place: "Abhaneri, Rajasthan", type: "Stepwell" },
  { name: "Rani ki Vav", place: "Patan, Gujarat", type: "Stepwell" },
  { name: "Mehrangarh Fort", place: "Jodhpur, Rajasthan", type: "Fort" },
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [heritageRecords, setHeritageRecords] = useState<HeritageRecord[]>([]);
  const [savedUploads, setSavedUploads] = useState<SavedUpload[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SavedUpload[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/uploads")
      .then((response) => response.json())
      .then((data) => setSavedUploads(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/heritage")
      .then((response) => response.json())
      .then((data) => setHeritageRecords(data))
      .catch(() => undefined);
  }, []);

  async function analyseUpload() {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    // Attempt to get the user's current location before uploading
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      formData.append("latitude", position.coords.latitude.toString());
      formData.append("longitude", position.coords.longitude.toString());
      formData.append("location_name", "User Upload Location");
    } catch (error) {
      console.warn("Geolocation denied or unavailable. Uploading without location.", error);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyse-upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setAnalysis(data);

      // Refresh the saved uploads list after a successful new upload
      const savedResponse = await fetch("http://127.0.0.1:8000/api/uploads");
      const savedData = await savedResponse.json();
      setSavedUploads(savedData);
      
    } catch {
      setAnalysis({
        file_name: file.name,
        suggested_type: "Upload waiting",
        summary: "The browser could not reach the backend. Check that the backend terminal is running.",
        suggested_tags: ["needs connection"],
      });
    } finally {
      setLoading(false);
    }
  }

 async function searchArchive() {
  if (searchQuery.trim().length < 2) {
    setSearchResults([]);
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/search?q=${encodeURIComponent(searchQuery)}`
    );

    const data = await response.json();

    setSearchResults(data);
  } catch {
    setSearchResults([]);
  }
}
  return (
    <main className="min-h-screen bg-stone-50 text-teal-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-bold">Dharohar <span className="text-amber-700">AI</span></div>
        <span className="rounded-full bg-teal-800 px-4 py-2 text-sm font-semibold text-white">Living heritage archive</span>
      </nav>
      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <p className="text-sm font-bold uppercase tracking-[.22em] text-amber-700">Explore India’s cultural memory</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold md:text-6xl">Discover heritage beyond the archive.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-teal-900/70">Turn photographs and historical documents into a searchable cultural collection.</p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-10 md:grid-cols-3">
        {places.map((place) => <article key={place.name} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-amber-700">{place.type}</p><h2 className="mt-2 font-serif text-2xl">{place.name}</h2><p className="mt-3 text-sm text-teal-900/65">⌖ {place.place}</p></article>)}
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-dashed border-teal-700/40 bg-teal-50 p-7 md:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-amber-700">Add to the archive</p>
          <h2 className="mt-2 font-serif text-3xl">Upload a heritage photo or document</h2>
          <p className="mt-3 max-w-2xl text-teal-900/70">The file is sent to the Dharohar API. OCR, translation, and visual tags are coming next.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input className="block w-full rounded-xl border border-stone-300 bg-white p-3 text-sm" type="file" accept="image/*,.pdf" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setAnalysis(null); }} />
            <button disabled={!file || loading} onClick={analyseUpload} className="rounded-xl bg-teal-800 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Analysing..." : "Analyse upload"}</button>
          </div>
          {file && <p className="mt-3 text-sm text-teal-800">Selected: {file.name}</p>}
          {analysis && <div className="mt-6 rounded-2xl border border-teal-200 bg-white p-5"><p className="font-bold">{analysis.file_name}</p><p className="mt-1 text-sm font-semibold text-amber-700">{analysis.suggested_type}</p><p className="mt-3 leading-7 text-teal-900/75">{analysis.summary}</p>

{analysis.extracted_text && (
  <div className="mt-5 rounded-xl bg-stone-50 p-4">
    <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
      Extracted text
    </p>
    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-teal-900">
      {analysis.extracted_text}
    </p>
  </div>
)}  {analysis.translated_text && (
  <div className="mt-5 rounded-xl bg-amber-50 p-4">
    <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
      English translation
    </p>
    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-teal-900">
      {analysis.translated_text}
    </p>
  </div>
)}<div className="mt-4 flex flex-wrap gap-2">{analysis.suggested_tags.map((tag) => <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-teal-800">{tag}</span>)}</div></div>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
  <p className="text-sm font-bold uppercase tracking-wider text-amber-700">
    Search the archive
  </p>

  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
    <input
      className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none ring-teal-700 focus:ring-2"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      placeholder="Search OCR text, file name, or translated text..."
    />

    <button
      onClick={searchArchive}
      className="rounded-xl bg-teal-800 px-6 py-3 font-semibold text-white"
    >
      Search
    </button>
  </div>

  {searchResults.length > 0 && (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {searchResults.map((record) => (
        <article
          key={record.id}
          className="rounded-2xl border border-teal-200 bg-teal-50 p-5"
        >
          <p className="font-bold">{record.file_name}</p>

          <p className="mt-3 text-sm leading-6 text-teal-900/75">
            {record.translated_text || record.extracted_text}
          </p>
        </article>
      ))}
    </div>
  )}
</section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
  <p className="text-sm font-bold uppercase tracking-wider text-amber-700">
    Saved archive
  </p>

  <h2 className="mt-2 font-serif text-3xl">
    Digitised heritage records
  </h2>

 <section className="mx-auto max-w-6xl px-6 pb-12">
  <p className="text-sm font-bold uppercase tracking-wider text-amber-700">
    Explore geographically
  </p>

  <h2 className="mt-2 font-serif text-3xl">
    Heritage map
  </h2>

  <HeritageMap records={[...heritageRecords, ...savedUploads.filter(u => u.latitude && u.longitude)]} />
</section>



  <div className="mt-6 grid gap-4 md:grid-cols-2">
    {savedUploads.map((upload) => (
      <article
        key={upload.id}
        className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
          OCR record #{upload.id}
        </p>

        <h3 className="mt-2 text-lg font-bold">
          {upload.file_name}
        </h3>

        <p className="mt-3 text-sm leading-6 text-teal-900/70">
          {upload.summary}
        </p>

        {upload.translated_text && (
          <p className="mt-3 text-sm text-teal-800">
            {upload.translated_text}
          </p>
        )}
      </article>
    ))}
  </div>

  {savedUploads.length === 0 && (
    <p className="mt-6 text-teal-900/60">
      No digitised records yet. Upload your first document or heritage image.
    </p>
  )}
</section>
    </main>
  );
}

