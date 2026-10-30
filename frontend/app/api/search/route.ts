import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const KNOWLEDGE_BASE_ITEMS = [
  {
    id: 1,
    file_name: "Rani Ki Vav",
    location_name: "Patan, Gujarat",
    summary: "UNESCO World Heritage subterranean stepwell commissioned by Queen Udayamati. Built in Maru-Gurjara style with 7 terraced levels and over 500 principal sculptures.",
    extracted_text: "Subterranean stepwell architecture, Solanki Dynasty, water harvesting sanctuary",
    translated_text: "Subterranean stepwell architecture, Solanki Dynasty, water harvesting sanctuary",
    similarity_score: 0.94,
    relevance_percentage: 94.0,
    architectural_tags: ["Stepwell", "Water Conservation", "Maru-Gurjara", "UNESCO", "Patan"],
  },
  {
    id: 2,
    file_name: "Hawa Mahal (Palace of Winds)",
    location_name: "Jaipur, Rajasthan",
    summary: "Five-storey pink sandstone facade featuring 953 honeycomb jharokhas with intricate latticework, built in 1799 by Maharaja Sawai Pratap Singh.",
    extracted_text: "Rajput architecture, 953 jharokhas, pink sandstone, venturi cooling facade",
    translated_text: "Rajput architecture, 953 jharokhas, pink sandstone, venturi cooling facade",
    similarity_score: 0.92,
    relevance_percentage: 92.0,
    architectural_tags: ["Rajput", "Pink City", "Palace", "Jaipur", "Jharokha"],
  },
  {
    id: 3,
    file_name: "Sri Harmandir Sahib (Golden Temple)",
    location_name: "Amritsar, Punjab",
    summary: "The holiest shrine of Sikhism, completed in 1604 by Guru Arjan Dev Ji. Surrounded by the Amrit Sarovar with gold-plated copper panels.",
    extracted_text: "Sikh architecture, Amrit Sarovar, sacred shrine, golden copper facade",
    translated_text: "Sikh architecture, Amrit Sarovar, sacred shrine, golden copper facade",
    similarity_score: 0.91,
    relevance_percentage: 91.0,
    architectural_tags: ["Sikh Architecture", "Golden Temple", "Amrit Sarovar", "Amritsar"],
  },
  {
    id: 4,
    file_name: "Dholavira Archaeological Metropolis",
    location_name: "Khadir Island, Kutch, Gujarat",
    summary: "Ancient Indus Valley Civilization city featuring 16 grand rock-cut cascading water reservoirs, fortified citadels, and Harappan signboard inscriptions.",
    extracted_text: "Indus Valley Civilization, Harappan signboard, rock-cut reservoirs",
    translated_text: "Indus Valley Civilization, Harappan signboard, rock-cut reservoirs",
    similarity_score: 0.89,
    relevance_percentage: 89.0,
    architectural_tags: ["Harappan", "Indus Valley", "Water Reservoir", "UNESCO"],
  },
  {
    id: 5,
    file_name: "Tijara Fort-Palace",
    location_name: "Alwar, Rajasthan",
    summary: "19th-century hilltop citadel in the Aravalli hills initiated in 1835 by Maharaja Balwant Singh, combining Rajput and regional architectural motifs.",
    extracted_text: "Hilltop citadel, Aravalli hills, Rajput courtyards, marble chhatris",
    translated_text: "Hilltop citadel, Aravalli hills, Rajput courtyards, marble chhatris",
    similarity_score: 0.88,
    relevance_percentage: 88.0,
    architectural_tags: ["Rajput", "Aravalli", "Fortress", "Alwar"],
  },
  {
    id: 6,
    file_name: "Nirona Rogan Art & Copper Chimes",
    location_name: "Kutch, Gujarat",
    summary: "Rare living craft traditions: 400-year-old Persian-origin Rogan castor-oil painting, bell-making, and lacquer woodwork.",
    extracted_text: "Rogan textile art, castor oil pigments, copper bells, living craft heritage",
    translated_text: "Rogan textile art, castor oil pigments, copper bells, living craft heritage",
    similarity_score: 0.86,
    relevance_percentage: 86.0,
    architectural_tags: ["Rogan Art", "Copper Bells", "GI Tag", "Living Heritage"],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  // Filter and score matches
  const matches = KNOWLEDGE_BASE_ITEMS.filter((item) => {
    const hay = `${item.file_name} ${item.location_name} ${item.summary} ${item.extracted_text} ${item.architectural_tags.join(" ")}`.toLowerCase();
    const words = q.split(/\s+/);
    return words.some((w) => hay.includes(w));
  });

  return NextResponse.json(matches.length > 0 ? matches : KNOWLEDGE_BASE_ITEMS.slice(0, 3));
}
