import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory store for session / cloud demo uploads
const UPLOADS_STORE: Array<{
  id: number;
  file_name: string;
  extracted_text: string;
  translated_text: string;
  hindi_translation?: string;
  summary: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
}> = [
  {
    id: 1,
    file_name: "King_Naha_Water_Sanctuary_Plaque.jpg",
    extracted_text: "हे समृद्ध राजा नह, आपने अपने लोगों के लाभ और पूरी दुनिया के कल्याण के लिए पानी का यह स्थान बनाया है।",
    translated_text: "O prosperous King Naha, you have created this water sanctuary for the benefit of your people and the welfare of the whole world.",
    hindi_translation: "हे समृद्ध राजा नह, आपने अपने लोगों के लाभ और पूरी दुनिया के कल्याण के लिए पानी का यह स्थान बनाया है।",
    summary: "Royal subterranean stepwell and civic water reservoir dedicatory plaque. Commemorates sovereign patronage dedicated to water security, environmental conservation, and public welfare.",
    created_at: new Date().toISOString(),
    latitude: 23.8493,
    longitude: 72.1012,
    location_name: "Patan, Gujarat",
  },
];

export async function GET() {
  return NextResponse.json(UPLOADS_STORE);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newEntry = {
      id: Date.now(),
      file_name: data.file_name || "Uploaded_Heritage_Inscription.jpg",
      extracted_text: data.extracted_text || "",
      translated_text: data.translated_text || "",
      hindi_translation: data.hindi_translation || "",
      summary: data.summary || "",
      created_at: new Date().toISOString(),
      latitude: data.latitude,
      longitude: data.longitude,
      location_name: data.location_name || "Heritage Site",
    };
    UPLOADS_STORE.unshift(newEntry);
    return NextResponse.json(newEntry);
  } catch {
    return NextResponse.json({ status: "success" });
  }
}
