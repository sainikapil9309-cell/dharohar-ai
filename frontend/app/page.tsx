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
  hindi_translation?: string;
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
  hindi_translation?: string;
  summary: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  architectural_tags?: string[];
  relevance_percentage?: number;
  similarity_score?: number;
};

type NearbyPlace = {
  name: string;
  category: "Temple" | "Cafe" | "Food" | "Monument" | "Craft";
  distance: string;
  description: string;
  icon: string;
  tag: string;
};

type SpotlightData = {
  title: string;
  subtitle: string;
  location: string;
  state: string;
  pastImage: {
    url: string;
    caption: string;
    era: string;
  };
  presentImage: {
    url: string;
    caption: string;
    era: string;
  };
  nearbyPlaces: NearbyPlace[];
};

type HistoricalMilestone = {
  yearOrEra: string;
  title: string;
  description: string;
};

type HeritageHistory = {
  placeName: string;
  location: string;
  builtYear: string;
  founderOrRuler: string;
  architect?: string;
  structureOrLevels?: string;
  monumentType: string;
  architecturalStyle: string;
  specialFeature: string;
  purpose: string;
  historicalImportance: string;
  currentStatus: string;
  projectGoal: string;
  timeline: HistoricalMilestone[];
};

type HeritagePlaceEntry = HeritageRecord & {
  spotlight: SpotlightData;
  history: HeritageHistory;
  stateCategory: string;
  thumbUrl: string;
};

const HeritageMap = dynamic(
  () => import("./components/HeritageMap"),
  { ssr: false }
);

const Heritage3DViewer = dynamic(
  () => import("./components/Heritage3DViewer"),
  { ssr: false }
);

// Comprehensive Encyclopedia of Places Organized by State with 100% Unique Local Archival Assets
const ALL_HERITAGE_PLACES: HeritagePlaceEntry[] = [
  // --- RAJASTHAN ---
  {
    id: 1,
    name: "Hawa Mahal",
    location: "Jaipur",
    state: "Rajasthan",
    stateCategory: "Rajasthan",
    latitude: 26.9240,
    longitude: 75.8267,
    period: "1799 CE",
    category: "Palace",
    description: "Five-storey pink sandstone facade featuring 953 honeycomb jharokhas.",
    tags: ["Rajput", "Pink City", "Palace"],
    colour: "#E76F51",
    thumbUrl: "/heritage/hawa_mahal_present.jpg",
    spotlight: {
      title: "Hawa Mahal (Palace of Winds)",
      subtitle: "Royal viewing pavilion built by Maharaja Sawai Pratap Singh",
      location: "Badi Choupad, Pink City, Jaipur",
      state: "Rajasthan",
      pastImage: {
        url: "/heritage/hawa_mahal_past.jpg",
        caption: "Historic late 19th-century archival photograph of Hawa Mahal with elephant procession and street bazaar",
        era: "Late 19th Century (Archival Photograph)",
      },
      presentImage: {
        url: "/heritage/hawa_mahal_present.jpg",
        caption: "Present-day vibrant pink sandstone facade glowing under azure blue skies",
        era: "Present Day (Heritage Protected)",
      },
      nearbyPlaces: [
        { name: "Wind View Cafe", category: "Cafe", distance: "50 m", description: "Rooftop terrace directly facing the 953 jharokhas.", icon: "☕", tag: "Rooftop Cafe" },
        { name: "The Tattoo Cafe & Lounge", category: "Cafe", distance: "70 m", description: "Scenic dining facing the palace facade; famous for sunset coffee.", icon: "☕", tag: "Scenic Dining" },
        { name: "Govind Dev Ji Temple", category: "Temple", distance: "1.1 km", description: "Sacred 18th-century Krishna temple inside City Palace complex.", icon: "🛕", tag: "Historic Mandir" },
        { name: "LMB (Laxmi Mishthan Bhandar)", category: "Food", distance: "850 m", description: "Johari Bazaar landmark established 1727; famous for Ghewar & Pyaaz Kachori.", icon: "🍲", tag: "Heritage Sweets" },
        { name: "City Palace & Mubarak Mahal", category: "Monument", distance: "700 m", description: "Regal residence of the Jaipur royal family with courtyards and armory.", icon: "🏛️", tag: "Royal Palace" },
        { name: "Jantar Mantar", category: "Monument", distance: "600 m", description: "UNESCO stone astronomical observatory built by Sawai Jai Singh II.", icon: "🏛️", tag: "UNESCO Heritage" },
        { name: "Rawat Mishthan Bhandar", category: "Food", distance: "3.5 km", description: "World-famous stop for crisp Mawa Kachoris and spicy Mirchi Vadas.", icon: "🍲", tag: "Legendary Snacks" },
        { name: "Galtaji (Monkey Temple)", category: "Temple", distance: "9.2 km", description: "Ancient natural spring gorge temple with holy freshwater kunds.", icon: "🛕", tag: "Gorge Temple" },
        { name: "Amer Fort & Maota Lake", category: "Monument", distance: "10.5 km", description: "Monumental hilltop Rajput citadel with the famous Sheesh Mahal.", icon: "🏰", tag: "Hilltop Fort" },
        { name: "Padao Restaurant, Nahargarh", category: "Food", distance: "14.8 km", description: "Open-air dining on the cliff edge with 360-degree sunset city views.", icon: "🍽️", tag: "Fort Dining" },
      ],
    },
    history: {
      placeName: "Hawa Mahal (Palace of Winds)",
      location: "Jaipur, Rajasthan, India",
      builtYear: "1799 CE",
      founderOrRuler: "Maharaja Sawai Pratap Singh",
      architect: "Lal Chand Ustad",
      structureOrLevels: "Five-storey pyramidal palace",
      monumentType: "Royal Palace Pavilion",
      architecturalStyle: "Rajput architectural style with distinctive Mughal-influenced latticework",
      specialFeature: "953 small windows called Jharokhas with intricate sandstone screen tracery",
      purpose: "Allowed royal women to observe street life, royal processions, and daily bazaars while remaining out of public view (Purdah tradition)",
      historicalImportance: "Represents Jaipur's royal history, architectural ingenuity, and rich cultural heritage",
      currentStatus: "A major historical monument and globally celebrated tourist attraction",
      projectGoal: "To preserve Hawa Mahal's history using modern technology and make it accessible to future generations.",
      timeline: [
        { yearOrEra: "1799", title: "Royal Commission", description: "Initiated by Maharaja Sawai Pratap Singh, grandson of Jaipur's illustrious founder Maharaja Sawai Jai Singh." },
        { yearOrEra: "1799", title: "Architectural Genius", description: "Master architect Lal Chand Ustad sculpted the 5-storey facade to evoke the sacred crown of Lord Krishna." },
        { yearOrEra: "Historic", title: "Venturi Air Cooling", description: "Engineered with the Venturi effect: cool breezes pass through the 953 jharokhas, naturally cooling the palace in desert summers." },
        { yearOrEra: "Present", title: "World Heritage City Icon", description: "Protected landmark under the Archaeological Department of Rajasthan and centerpiece of Jaipur UNESCO World Heritage City." },
      ],
    },
  },
  {
    id: 2,
    name: "Tijara Fort Palace",
    location: "Alwar",
    state: "Rajasthan",
    stateCategory: "Rajasthan",
    latitude: 27.9340,
    longitude: 76.8560,
    period: "1835 CE",
    category: "Fort / Palace",
    description: "Historic hilltop fort-palace in the Aravalli range with traditional courtyards.",
    tags: ["Rajput", "Aravalli", "Fortress"],
    colour: "#DE6B48",
    thumbUrl: "/heritage/tijara_present.jpg",
    spotlight: {
      title: "Tijara Fort Palace",
      subtitle: "19th-century hilltop palace overlooking mustard fields of Alwar",
      location: "Tijara, Alwar District",
      state: "Rajasthan",
      pastImage: {
        url: "/heritage/tijara_past.jpg",
        caption: "Historic perspective of Tijara Fort Palace arcades, chhatris and battlements",
        era: "19th Century (Historical Perspective)",
      },
      presentImage: {
        url: "/heritage/tijara_present.jpg",
        caption: "Spectacular aerial panoramic view of restored hilltop Tijara Fort Palace and surrounding Aravalli hills",
        era: "Present Day (Heritage Restored)",
      },
      nearbyPlaces: [
        { name: "Tijara Jain Temple", category: "Temple", distance: "3.2 km", description: "Historic Digambara Jain Atishaya Kshetra dedicated to Chandraprabhu.", icon: "🛕", tag: "Jain Pilgrimage" },
        { name: "Alwar City Palace (Vinay Vilas)", category: "Monument", distance: "18.5 km", description: "Royal palace museum showcasing Rajput weapons and miniature manuscripts.", icon: "🏛️", tag: "Royal Museum" },
        { name: "Bala Qila (Alwar Fort)", category: "Monument", distance: "19.2 km", description: "Medieval fortress perched on a 300m cliff with 5km of rampart walls.", icon: "🏰", tag: "Cliff Citadel" },
        { name: "Alwar Kalakand Hub (Baba Thakur Das)", category: "Food", distance: "18.0 km", description: "The birthplace of authentic Alwar Milk Cake (Kalakand) since 1947.", icon: "🍲", tag: "Iconic Kalakand" },
        { name: "Siliserh Lake Palace", category: "Cafe", distance: "19.8 km", description: "Lakefront heritage palace cafe offering boating and tranquil waters.", icon: "☕", tag: "Lakeside Dining" },
        { name: "Moosi Maharani ki Chhatri", category: "Monument", distance: "18.8 km", description: "Double-storey red sandstone and white marble royal cenotaph.", icon: "🏛️", tag: "Marble Chhatri" },
        { name: "Fateh Jung Gumbad", category: "Monument", distance: "17.5 km", description: "5-storey tomb combining Mughal and Rajput architecture.", icon: "🏛️", tag: "Historical Tomb" },
        { name: "Prem Pavitra Bhojnalaya", category: "Food", distance: "18.2 km", description: "Famous local eatery for pure desi ghee Gatte ki Sabzi and Missi Roti.", icon: "🍽️", tag: "Rajasthani Thali" },
        { name: "Aravalli Hill Nature Trails", category: "Monument", distance: "1.5 km", description: "Ancient walking trails with panoramic valley viewpoints.", icon: "⛰️", tag: "Nature Trail" },
        { name: "Kishangarh Bas Handicrafts", category: "Craft", distance: "15.0 km", description: "Local artisans weaving handspun durries and clay pottery.", icon: "🧵", tag: "Handloom Durries" },
      ],
    },
    history: {
      placeName: "Tijara Fort-Palace",
      location: "Tijara, Alwar district, Rajasthan, India",
      builtYear: "Initiated 1835 CE",
      founderOrRuler: "Maharaja Balwant Singh",
      architect: "Rajput & Regional Master Guilds",
      structureOrLevels: "Hilltop multi-tier citadel, courtyards, and panoramic chhatris",
      monumentType: "Hilltop Fort-Palace",
      architecturalStyle: "Reflects a blend of architectural influences, including Rajput and other regional styles",
      specialFeature: "Colossal bastion walls commanding the Aravalli horizon, marble jharokhas, and stepwell terraces",
      purpose: "Constructed by Maharaja Balwant Singh in memory of his mother, Moosi Maharani",
      historicalImportance: "Represents the royal legacy, architectural ambition, and scenic bastion fortifications of the Alwar kingdom",
      currentStatus: "Restored after remaining unfinished for many years, developed as a celebrated heritage hotel",
      projectGoal: "To document and digitally preserve the historical and architectural legacy and restoration journey of Tijara Fort-Palace.",
      timeline: [
        { yearOrEra: "1835", title: "Construction Initiated", description: "Construction of Tijara Fort-Palace was initiated by Maharaja Balwant Singh in memory of his mother, Moosi Maharani." },
        { yearOrEra: "1845", title: "Construction Halted", description: "Following Maharaja Balwant Singh’s death in 1845, the construction remained incomplete for over a century." },
        { yearOrEra: "Restoration", title: "Heritage Revival", description: "After remaining unfinished for many years, the property was meticulously restored and developed as an acclaimed heritage hotel." },
        { yearOrEra: "Architecture", title: "Regional Synthesis", description: "The complex reflects a harmonious blend of architectural influences, including Rajput and other regional styles." },
      ],
    },
  },

  // --- GUJARAT ---
  {
    id: 3,
    name: "Rani Ki Vav",
    location: "Patan",
    state: "Gujarat",
    stateCategory: "Gujarat",
    latitude: 23.8493,
    longitude: 72.1012,
    period: "11th century CE",
    category: "Stepwell",
    description: "UNESCO World Heritage subterranean stepwell with 7 sculptural levels.",
    tags: ["UNESCO", "Stepwell", "Solanki"],
    colour: "#DE6B48",
    thumbUrl: "/heritage/rani_ki_vav_present.jpg",
    spotlight: {
      title: "Rani Ki Vav (The Queen's Stepwell)",
      subtitle: "Subterranean masterpiece commissioned by Queen Udayamati",
      location: "Patan",
      state: "Gujarat",
      pastImage: {
        url: "/heritage/rani_ki_vav_past.jpg",
        caption: "Archival perspective of Rani Ki Vav subterranean corridors and tiered galleries",
        era: "Archival Survey Record",
      },
      presentImage: {
        url: "/heritage/rani_ki_vav_present.jpg",
        caption: "7 tiers of ornate Maru-Gurjara sculptures honoring Lord Vishnu",
        era: "Present Day (UNESCO World Heritage)",
      },
      nearbyPlaces: [
        { name: "Patan Patola Heritage Museum", category: "Craft", distance: "1.5 km", description: "Museum of ancient double-ikat silk weaving taking 6 months per sari.", icon: "🧵", tag: "Double Ikat" },
        { name: "Sahastralinga Talav", category: "Monument", distance: "1.2 km", description: "Medieval 11th-century reservoir ruins with stone water sluices.", icon: "🏛️", tag: "Water Heritage" },
        { name: "Kalika Mata Mandir", category: "Temple", distance: "2.1 km", description: "Ancient pilgrimage temple revered across North Gujarat.", icon: "🛕", tag: "Historic Shrine" },
        { name: "Patan Famous Khaja Sweets", category: "Food", distance: "1.8 km", description: "Crisp multi-layered flaky ghee sweet delicacy of Patan.", icon: "🍲", tag: "Heritage Sweets" },
        { name: "Khan Sarovar", category: "Monument", distance: "2.8 km", description: "Stone masonry water reservoir constructed by Mughal governor Khan.", icon: "🏛️", tag: "Mughal Reservoir" },
        { name: "Siddhpur Rudra Mahalaya", category: "Monument", distance: "18.2 km", description: "Monumental carved stone pillars of the grand 10th-century Shiva temple.", icon: "🏛️", tag: "Solanki Temple" },
        { name: "Bindu Sarovar, Siddhpur", category: "Temple", distance: "18.5 km", description: "Sacred lake where Lord Parashurama performed rituals for his mother.", icon: "🛕", tag: "Holy Lake" },
        { name: "Anand Dining Hall", category: "Food", distance: "1.9 km", description: "Unlimited authentic Gujarati thali with Kadhi, Khichdi, and Farsan.", icon: "🍽️", tag: "Gujarati Thali" },
        { name: "Old City Wood-Carved Havelis", category: "Monument", distance: "2.0 km", description: "Intricate wooden carved residential facades in ancient Patan pols.", icon: "🏘️", tag: "Wooden Havelis" },
        { name: "Patan Handloom Weavers Colony", category: "Craft", distance: "1.7 km", description: "Watch Salvi master weavers operate traditional wooden loom shuttles.", icon: "🎨", tag: "Living Loom" },
      ],
    },
    history: {
      placeName: "Rani Ki Vav — Patan",
      location: "Patan, Gujarat, India",
      builtYear: "11th century CE (c. 1063 CE)",
      founderOrRuler: "Queen Udayamati, who commissioned it in memory of King Bhima I",
      architect: "Solanki / Chaulukya Master Sculptors",
      structureOrLevels: "Seven subterranean levels of terraced stairs with over 500 major sculptures",
      monumentType: "Subterranean Stepwell / Inverted Water Temple",
      architecturalStyle: "Maru-Gurjara architectural style",
      specialFeature: "Seven levels of stairs with elaborate sculptures, intricately depicting Dashavatara forms of Lord Vishnu",
      purpose: "Water storage and conservation, with religious significance and spiritual pilgrimage",
      historicalImportance: "One of India's finest examples of ancient water architecture and hydraulic craftsmanship",
      currentStatus: "UNESCO World Heritage Site since 2014; featured on the reverse of the Indian ₹100 banknote",
      projectGoal: "To capture high-resolution 3D geometric models of subterranean tiers and catalogue classical Sanskrit inscriptions.",
      timeline: [
        { yearOrEra: "1063 CE", title: "Memorial Inception", description: "Queen Udayamati commissioned the subterranean stepwell to honour her late husband, King Bhima I of Chaulukya dynasty." },
        { yearOrEra: "13th C.", title: "Silt Inundation", description: "Flooding of the ancient Saraswati River buried the monument in silt, preserving the exquisite friezes undisturbed." },
        { yearOrEra: "1980s", title: "Archaeological Excavation", description: "The Archaeological Survey of India (ASI) cleared tonnes of sand, revealing 7 pristine sculptural levels." },
        { yearOrEra: "2014", title: "UNESCO World Heritage", description: "Inscribed as a World Heritage Site as a triumph of ancient Indian hydraulic technology and sculptural art." },
      ],
    },
  },
  {
    id: 4,
    name: "Dholavira",
    location: "Khadir Island, Kutch",
    state: "Gujarat",
    stateCategory: "Gujarat",
    latitude: 23.8863,
    longitude: 70.2133,
    period: "3000–1500 BCE",
    category: "Archaeological City",
    description: "Ancient Indus Valley metropolis with grand stone water reservoirs.",
    tags: ["UNESCO", "Harappan", "Reservoir"],
    colour: "#0077B6",
    thumbUrl: "/heritage/dholavira_present.jpg",
    spotlight: {
      title: "Dholavira — Harappan Metropolis",
      subtitle: "5,000-year-old Indus Valley city with world's earliest water harvesting",
      location: "Khadir Island, Great Rann of Kutch",
      state: "Gujarat",
      pastImage: {
        url: "/heritage/dholavira_past.jpg",
        caption: "Archaeological excavation survey revealing massive stone reservoirs and gateways",
        era: "Archaeological Survey Record",
      },
      presentImage: {
        url: "/heritage/dholavira_present.jpg",
        caption: "Excavated citadels and monumental stone water channels open to visitors",
        era: "Present Day (UNESCO World Heritage 2021)",
      },
      nearbyPlaces: [
        { name: "Dholavira Site Museum", category: "Monument", distance: "200 m", description: "Displays Harappan beads, painted seals, terracotta pottery and weights.", icon: "🏛️", tag: "Site Museum" },
        { name: "Kutch Fossil Park", category: "Monument", distance: "7.5 km", description: "Ancient fossilised wood trees dating millions of years before humans.", icon: "🪵", tag: "Natural Fossils" },
        { name: "Flamingo City Viewpoint", category: "Monument", distance: "12.0 km", description: "Vast white salt desert breeding grounds of greater and lesser flamingos.", icon: "🦩", tag: "Rann Wildlife" },
        { name: "Khadir Bet Salt Plains", category: "Monument", distance: "4.5 km", description: "Surreal crystalline white salt landscape surrounding the island.", icon: "🧂", tag: "White Desert" },
        { name: "Toran Dholavira Resort Dining", category: "Food", distance: "1.0 km", description: "Warm Kutchi bajra rotla, fresh butter, and spicy country dal.", icon: "🍲", tag: "Local Food" },
        { name: "Bhanjano Hills View", category: "Monument", distance: "5.2 km", description: "Panoramic hilltop overview looking out over the ancient Harappan citadel.", icon: "⛰️", tag: "Panoramic View" },
        { name: "Sunset Point Khadir", category: "Monument", distance: "6.0 km", description: "Spectacular crimson sunset over the white salt marsh horizon.", icon: "🌅", tag: "Sunset Point" },
        { name: "Rapar Local Spiced Tea Stalls", category: "Food", distance: "19.5 km", description: "Authentic spiced Kutchi lemongrass tea and fresh fried farsan.", icon: "☕", tag: "Kutchi Chai" },
        { name: "Ancient Harappan Signboard Well", category: "Monument", distance: "300 m", description: "The famous 10-symbol script inscription found near northern gateway.", icon: "📜", tag: "Harappan Script" },
        { name: "Khadir Bet Rural Village Homes", category: "Craft", distance: "2.5 km", description: "Traditional round bhungas with clay mirror-work (lippan kaam) interiors.", icon: "🏡", tag: "Lippan Art" },
      ],
    },
    history: {
      placeName: "Dholavira — Harappan Civilisation",
      location: "Khadir Island, Kutch district, Gujarat, India",
      builtYear: "Approximately 3000–1500 BCE",
      founderOrRuler: "Indus Valley or Harappan Civilisation",
      architect: "Harappan Urban Planners & Hydraulic Engineers",
      structureOrLevels: "Fortified tripartite city: Citadel, Middle Town, and Lower Town",
      monumentType: "Ancient archaeological city & metropolis",
      architecturalStyle: "Precision dressed stone masonry, stepped rock-cut cisterns, and monumental gateways",
      specialFeature: "Advanced water conservation and reservoir systems (16 stone reservoirs) & 10-symbol giant signboard",
      purpose: "Urban civic living, marine and inland trade, lapidary manufacturing of agate beads, and rainwater harvesting",
      historicalImportance: "Provides evidence of sophisticated ancient urban planning and water management spanning 1,500 years",
      currentStatus: "UNESCO World Heritage Site since 2021",
      projectGoal: "To digitally map Harappan storm-water channels, simulate hydraulic flow, and preserve epigraphic signboards.",
      timeline: [
        { yearOrEra: "3000 BCE", title: "Pre-Harappan Settlement", description: "Settlers inhabit the island of Khadir Bet, initiating copper metallurgical trade and pottery." },
        { yearOrEra: "2500 BCE", title: "Mature Urban Planning", description: "Citadels built of dressed stone with 16 interconnected reservoirs harvesting every droplet of monsoon rain." },
        { yearOrEra: "1968", title: "Archaeological Discovery", description: "Discovered by J.P. Joshi; extensive excavations from 1990 led by Dr. R.S. Bisht of the ASI." },
        { yearOrEra: "2021", title: "UNESCO World Heritage", description: "Inscribed as UNESCO World Heritage Site, recognizing Dholavira as South Asia's preeminent Bronze Age metropolis." },
      ],
    },
  },

  // --- KARNATAKA ---
  {
    id: 5,
    name: "Hampi Monuments",
    location: "Vijayanagara",
    state: "Karnataka",
    stateCategory: "Karnataka",
    latitude: 15.3145,
    longitude: 76.4600,
    period: "14th–16th century CE",
    category: "Ancient Capital",
    description: "UNESCO capital of Vijayanagara Empire with iconic Stone Chariot & musical pillars.",
    tags: ["UNESCO", "Vijayanagara", "Chariot"],
    colour: "#DE6B48",
    thumbUrl: "/heritage/hampi_present.jpg",
    spotlight: {
      title: "Hampi (Vijayanagara Empire)",
      subtitle: "Granite boulder kingdom and monumental medieval temple city",
      location: "Vijayanagara District",
      state: "Karnataka",
      pastImage: {
        url: "/heritage/hampi_past.jpg",
        caption: "Historic ruins of ancient Vijayanagara bazaars, temples and boulder landscapes",
        era: "Archival Survey Record",
      },
      presentImage: {
        url: "/heritage/hampi_present.jpg",
        caption: "Towering Galigopuram of Virupaksha Temple against the Hampi horizon",
        era: "Present Day (UNESCO World Heritage)",
      },
      nearbyPlaces: [
        { name: "Virupaksha Temple", category: "Temple", distance: "1.2 km", description: "Active 7th-century shrine with a 50m gopuram on Tungabhadra banks.", icon: "🛕", tag: "Living Temple" },
        { name: "Mango Tree Restaurant", category: "Food", distance: "900 m", description: "Famous courtyard cafe serving South Indian thalis and fresh juices.", icon: "🍲", tag: "Heritage Cafe" },
        { name: "Vitthala Temple & Musical Pillars", category: "Temple", distance: "2.5 km", description: "Pillars that emit acoustic musical notes when gently tapped.", icon: "🏛️", tag: "Musical Pillars" },
        { name: "Matanga Hill Sunrise Point", category: "Monument", distance: "1.5 km", description: "Highest peak in Hampi offering 360-degree sunrise view of ruins.", icon: "🌅", tag: "Panoramic Trek" },
        { name: "Sanapur Lake & Bouldering", category: "Monument", distance: "6.8 km", description: "Scenic granite lake famous for ancient circular coracle boat rides.", icon: "🛶", tag: "Coracle Ride" },
        { name: "Elephant Stables & Lotus Mahal", category: "Monument", distance: "3.1 km", description: "Indo-Islamic domed stables built for royal ceremonial elephants.", icon: "🏛️", tag: "Royal Enclosure" },
        { name: "Anegundi (Anjanadri Hill)", category: "Temple", distance: "5.5 km", description: "Legendary birthplace of Lord Hanuman across Tungabhadra River.", icon: "🛕", tag: "Mythological Site" },
        { name: "Tungabhadra Riverside Ghats", category: "Monument", distance: "800 m", description: "Ancient carved stone steps leading directly into the sacred river.", icon: "🌊", tag: "River Ghats" },
        { name: "Ugra Narasimha Colossal Statue", category: "Monument", distance: "1.7 km", description: "6.7m high monolithic stone sculpture of the fierce Narasimha avatar.", icon: "🗿", tag: "Monolithic Idol" },
        { name: "Gagan Mahal Anegundi", category: "Monument", distance: "5.8 km", description: "Ancient royal palace of the early Vijayanagara rulers with stone arches.", icon: "🏰", tag: "Early Palace" },
      ],
    },
    history: {
      placeName: "Hampi — Vijayanagara Empire",
      location: "Vijayanagara District, Karnataka, India",
      builtYear: "1336–1565 CE",
      founderOrRuler: "Harihara I & Bukka Raya I; expanded by Emperor Krishnadevaraya",
      architect: "Vijayanagara Royal Guilds",
      structureOrLevels: "Over 1,600 monuments spread across 41.5 square kilometres of granite terrain",
      monumentType: "Imperial Capital City & Temple Metropolis",
      architecturalStyle: "Vijayanagara Dravidian architecture with colossal monolithic stone carvings",
      specialFeature: "Temples, Stone Chariot (Garuda shrine), 56 musical acoustic pillars, and royal pavilions",
      purpose: "Capital of Vijayanagara Empire, administrative nerve center, and global trading market for diamonds and silk",
      historicalImportance: "One of the richest and largest medieval cities in the world during the 15th and 16th centuries",
      currentStatus: "UNESCO World Heritage Site since 1986",
      projectGoal: "To digitise Kannada and Sanskrit stone epigraphs, scan monolithic sculptures, and archive architectural plans.",
      timeline: [
        { yearOrEra: "1336", title: "Empire Founded", description: "Harihara and Bukka establish the Vijayanagara Empire on the banks of the Tungabhadra River." },
        { yearOrEra: "1509–29", title: "Golden Era of Krishnadevaraya", description: "Peak of cultural and architectural glory; Vitthala Temple, Krishna Temple, and royal bazaars flourish." },
        { yearOrEra: "1565", title: "Battle of Talikota", description: "The capital was sacked after the battle, leaving behind picturesque and monumental stone ruins." },
        { yearOrEra: "1986", title: "UNESCO Inscription", description: "Recognized as a UNESCO World Heritage Site for its unique integration of granite geology and monumental art." },
      ],
    },
  },
  {
    id: 6,
    name: "Badami Cave Temples",
    location: "Bagalkot",
    state: "Karnataka",
    stateCategory: "Karnataka",
    latitude: 15.9194,
    longitude: 75.6825,
    period: "6th–8th century CE",
    category: "Rock-cut Temple",
    description: "Four monolithic cliff shrines excavated into red sandstone by Early Chalukyas.",
    tags: ["Chalukya", "Rock-cut", "Nataraja"],
    colour: "#E76F51",
    thumbUrl: "/heritage/badami_present.jpg",
    spotlight: {
      title: "Badami Cave Temples",
      subtitle: "Ancient rock-hewn sandstone caves of the Early Chalukya dynasty",
      location: "Bagalkot District",
      state: "Karnataka",
      pastImage: {
        url: "/heritage/badami_past.jpg",
        caption: "6th-century Old Kannada inscription carved in rock inside Cave 3 at Badami",
        era: "c. 578 CE Epigraphic Record",
      },
      presentImage: {
        url: "/heritage/badami_present.jpg",
        caption: "Magnificent monolithic relief of Lord Vishnu seated on serpent couch in Cave 3",
        era: "Present Day (National Monument)",
      },
      nearbyPlaces: [
        { name: "Agastya Lake & Ghats", category: "Monument", distance: "200 m", description: "Ancient holy lake with stone steps surrounded by sandstone cliffs.", icon: "🌊", tag: "Holy Lake" },
        { name: "Bhutanatha Temple Complex", category: "Temple", distance: "450 m", description: "7th-century stone temple built right onto the water's edge of the lake.", icon: "🛕", tag: "Lakeside Mandir" },
        { name: "Badami North Fort & Cannon", category: "Monument", distance: "900 m", description: "Historic hilltop fort featuring Tipu Sultan's cannon and granaries.", icon: "🏰", tag: "Hilltop Fort" },
        { name: "Banashankari Amma Temple", category: "Temple", distance: "5.2 km", description: "Famous ancient temple with a large tiered Haridra Tirtha water tank.", icon: "🛕", tag: "Sacred Shakti" },
        { name: "Hotel Mayura Chalukya Dining", category: "Food", distance: "1.2 km", description: "Authentic North Karnataka Jowar Roti oota with Yennegai (brinjal curry).", icon: "🍲", tag: "Jowar Roti Meals" },
        { name: "Mahakuta Temple Complex", category: "Temple", distance: "12.5 km", description: "Serene sacred forest spring with ancient natural lotus tank and Shivalingams.", icon: "🛕", tag: "Sacred Spring" },
        { name: "Pattadakal UNESCO Monuments", category: "Monument", distance: "14.2 km", description: "Cradle of temple architecture with harmonious Dravidian & Nagara styles.", icon: "🏛️", tag: "UNESCO Group" },
        { name: "Aihole Historical Complex", category: "Monument", distance: "19.5 km", description: "Over 120 stone temples including the famous apsidal Durga Temple.", icon: "🏛️", tag: "Cradle of Architecture" },
        { name: "Ravalphadi Rock-Cut Cave, Aihole", category: "Monument", distance: "19.8 km", description: "One of the earliest rock-cut shrines with magnificent Harihara sculptures.", icon: "🗿", tag: "Rock Sculpture" },
        { name: "Badami Local Khanavali", category: "Food", distance: "800 m", description: "Traditional hot Jolada Roti with shenga chutney (peanut powder) and fresh curd.", icon: "🍛", tag: "Karnataka Oota" },
      ],
    },
    history: {
      placeName: "Badami Cave Temples",
      location: "Bagalkot District, Karnataka, India",
      builtYear: "6th–8th century CE (dedicated starting 578 CE)",
      founderOrRuler: "Early Chalukya Dynasty (King Pulakeshin I & King Mangalesha)",
      architect: "Chalukyan Monolithic Rock Sculptors",
      structureOrLevels: "Four carved cave shrines excavated into vertical sandstone cliffs",
      monumentType: "Rock-cut Cave Temples",
      architecturalStyle: "Rock-cut caves and stone sculptures blending Nagara and Dravidian forms",
      specialFeature: "Cave 1 with 18-armed dancing Nataraja, Cave 3 Vishnu reclining on Sheshanaga, and Agastya Lake views",
      purpose: "Chalukya period ke ancient cave temples dedicated to Shaivite, Vaishnavite, and Jain spiritual traditions",
      historicalImportance: "Cradle of South Indian temple architecture establishing rock-cut sculptural standards across the Deccan",
      currentStatus: "Protected Monument of National Importance under Archaeological Survey of India",
      projectGoal: "To 3D laser-scan rock reliefs, digitise 6th-century Old Kannada cliff epigraphs, and monitor stone weathering.",
      timeline: [
        { yearOrEra: "543 CE", title: "Vatapi Capital", description: "Pulakeshin I fortified the sandstone gorge of Vatapi as the imperial capital of the Chalukyas." },
        { yearOrEra: "578 CE", title: "Cave 3 Inscription", description: "King Mangalesha consecrates Vishnu Cave 3, carving the earliest dated inscription in Chalukyan rock architecture." },
        { yearOrEra: "7th C.", title: "Cave 1 & Cave 4", description: "Excavation of Cave 1 with the 18-armed Nataraja performing Tandava, and Cave 4 dedicated to Jain Tirthankaras." },
        { yearOrEra: "Present", title: "National Treasure", description: "Admired globally for the sheer grandeur of its cliff carvings reflecting on the sacred waters of Agastya Lake." },
      ],
    },
  },

  // --- ANDHRA PRADESH ---
  {
    id: 7,
    name: "Lepakshi Temple",
    location: "Sri Sathya Sai",
    state: "Andhra Pradesh",
    stateCategory: "Andhra",
    latitude: 13.8000,
    longitude: 77.6060,
    period: "16th century CE",
    category: "Temple",
    description: "Vijayanagara masterpiece famous for its Hanging Pillar and colossal monolithic Nandi.",
    tags: ["Hanging Pillar", "Vijayanagara", "Frescoes"],
    colour: "#E9A93D",
    thumbUrl: "/heritage/lepakshi_present.jpg",
    spotlight: {
      title: "Lepakshi Veerabhadra Temple",
      subtitle: "Miracle of Vijayanagara architecture with the famous Hanging Pillar",
      location: "Sri Sathya Sai District",
      state: "Andhra Pradesh",
      pastImage: {
        url: "/heritage/lepakshi_past.jpg",
        caption: "Historic granite entrance and mandapa colonnade of Veerabhadra Temple",
        era: "Archival Survey Record",
      },
      presentImage: {
        url: "/heritage/lepakshi_present.jpg",
        caption: "Front elevation of the sacred 16th-century Veerabhadra Temple complex",
        era: "Present Day (ASI National Monument)",
      },
      nearbyPlaces: [
        { name: "The Hanging Pillar", category: "Monument", distance: "10 m", description: "Stone pillar that does not touch the temple floor; visitors pass cloth underneath.", icon: "🏛️", tag: "Gravity Defier" },
        { name: "Monolithic Nandi Bull", category: "Monument", distance: "450 m", description: "India's largest single-granite Nandi bull carved with garlands and bells.", icon: "🐂", tag: "Colossal Granite" },
        { name: "Nagalinga 7-Hooded Serpent", category: "Temple", distance: "30 m", description: "Carved multi-hooded granite cobra sheltering a black stone Shiva lingam.", icon: "🛕", tag: "Granite Cobra" },
        { name: "Jatayu Theme Park", category: "Monument", distance: "900 m", description: "Hilltop monument honoring Jatayu who fought Ravana at this spot.", icon: "🦅", tag: "Mythological Park" },
        { name: "Kalyana Mandapa Pavilion", category: "Monument", distance: "40 m", description: "Unfinished wedding pavilion with lifelike stone carvings of gods and demigods.", icon: "🏛️", tag: "Carved Mandapa" },
        { name: "Hindupur Silk Saree Bazaar", category: "Craft", distance: "14.2 km", description: "Major traditional weaving hub for rich mulberry silk sarees.", icon: "🧵", tag: "Silk Bazaar" },
        { name: "Sri Andhra Spicy Mess", category: "Food", distance: "13.8 km", description: "Fiery authentic Andhra meals with Gongura Pachadi, Pappu, and Ghee.", icon: "🍲", tag: "Andhra Meals" },
        { name: "Penukonda Fort Citadel", category: "Monument", distance: "19.5 km", description: "Secondary capital of Vijayanagara with Gagan Mahal and watchtowers.", icon: "🏰", tag: "Hill Citadel" },
        { name: "Babayya Dargah, Penukonda", category: "Temple", distance: "19.2 km", description: "Centuries-old Sufi shrine symbolizing regional syncretic heritage.", icon: "🕌", tag: "Sufi Shrine" },
        { name: "Lepakshi Pottery & Clay Works", category: "Craft", distance: "1.2 km", description: "Handmade terracotta lamps and stone mini-replicas of the Nandi bull.", icon: "🏺", tag: "Stone Craft" },
      ],
    },
    history: {
      placeName: "Lepakshi Veerabhadra Temple",
      location: "Sri Sathya Sai District, Andhra Pradesh, India",
      builtYear: "16th century CE (1530–1540 CE)",
      founderOrRuler: "Virupanna Nayaka & Viranna, royal treasurers under Emperor Achyuta Deva Raya",
      architect: "Vijayanagara Royal Sculptors",
      structureOrLevels: "Granite hill complex with Natya Mandapa, Ardha Mandapa, and Kalyana Mandapa",
      monumentType: "Historical Temple Complex",
      architecturalStyle: "Hanging Pillar, stone carvings aur murals of Vijayanagara architectural style",
      specialFeature: "Gravity-defying Hanging Pillar that does not touch the floor; largest monolithic Nandi bull in India",
      purpose: "Vijayanagara period se associated historical temple dedicated to Veerabhadra Swamy and Shaivite art",
      historicalImportance: "Exemplifies the crowning artistic achievements of Vijayanagara ceiling murals and structural engineering",
      currentStatus: "Protected Monument of National Importance under ASI; on UNESCO World Heritage Tentative List",
      projectGoal: "To capture multispectral scans of fragile 16th-century ceiling frescoes and digitise Telugu-Kannada epigraphs.",
      timeline: [
        { yearOrEra: "1530", title: "Temple Consecration", description: "Brothers Virupanna and Viranna initiate construction on the sacred Kurma Saila (tortoise-shaped hill)." },
        { yearOrEra: "1538", title: "Colossal Monolithic Nandi", description: "Artisans carve India's largest single-granite Nandi bull (4.5m high, 8.2m long) from a nearby granite outcrop." },
        { yearOrEra: "1540", title: "Ceiling Fresco Splendour", description: "Creation of India's largest ceiling mural depicting the 14 incarnations of Lord Shiva with mineral dyes." },
        { yearOrEra: "Present", title: "Engineering Wonder", description: "Visited worldwide by scholars and tourists testing the miracle of the gravity-defying Hanging Pillar." },
      ],
    },
  },
  {
    id: 8,
    name: "Gandikota Fort",
    location: "YSR Kadapa",
    state: "Andhra Pradesh",
    stateCategory: "Andhra",
    latitude: 14.8167,
    longitude: 78.2833,
    period: "12th–17th century CE",
    category: "Fortress",
    description: "India's Grand Canyon gorge citadel overlooking Penna River canyon.",
    tags: ["Gorge", "Citadel", "Gandikota"],
    colour: "#DE6B48",
    thumbUrl: "/heritage/gandikota_present.jpg",
    spotlight: {
      title: "Gandikota — The Grand Canyon Citadel",
      subtitle: "300-foot red granite gorge fort over the dramatic Penna River",
      location: "YSR Kadapa District",
      state: "Andhra Pradesh",
      pastImage: {
        url: "/heritage/gandikota_past.jpg",
        caption: "Historic stone entrance and ramparts of Gandikota fortress",
        era: "Archival Fort Survey",
      },
      presentImage: {
        url: "/heritage/gandikota_present.jpg",
        caption: "Breathtaking canyon cliff viewpoint overlooking the emerald Penna River",
        era: "Present Day (National Heritage Landmark)",
      },
      nearbyPlaces: [
        { name: "Penna River Gorge Viewpoint", category: "Monument", distance: "250 m", description: "Natural red sandstone canyon chasm dubbed India's Grand Canyon.", icon: "🏞️", tag: "Grand Canyon" },
        { name: "Madhavaraya Temple", category: "Temple", distance: "400 m", description: "Monumental Vijayanagara temple tower adorned with elaborate friezes.", icon: "🛕", tag: "Vijayanagara Tower" },
        { name: "Jamia Masjid & Minarets", category: "Monument", distance: "300 m", description: "Elegant Islamic stone mosque standing adjacent to the grand temple.", icon: "🕌", tag: "Gorge Mosque" },
        { name: "Gandikota Granary (Danyagar)", category: "Monument", distance: "200 m", description: "Massive stone vault used to stockpile grain during medieval sieges.", icon: "🏛️", tag: "Historic Granary" },
        { name: "Rayalaseema Spicy Dining", category: "Food", distance: "1.2 km", description: "Local Ragi Sangati (millet balls) with spicy Natu Kodi Pulusu chicken.", icon: "🍲", tag: "Rayalaseema Food" },
        { name: "Raghunatha Temple Ruins", category: "Temple", distance: "500 m", description: "Pillarless sanctum built directly above the sheer river precipice.", icon: "🛕", tag: "Cliff Shrine" },
        { name: "Mylavaram Dam & Reservoir", category: "Monument", distance: "8.5 km", description: "Peaceful reservoir with watersports and sunset embankment view.", icon: "🌊", tag: "Dam Reservoir" },
        { name: "Jammalamadugu Handloom Colony", category: "Craft", distance: "14.5 km", description: "Traditional weavers making Khadi and cotton lungis on wooden pit looms.", icon: "🧵", tag: "Pit Loom" },
        { name: "Gorge Kayaking & Camping", category: "Monument", distance: "600 m", description: "Adventure camping on the clifftop with seasonal kayaking in Penna waters.", icon: "⛺", tag: "Adventure Camp" },
        { name: "Rayalaseema Chutney & Podi Point", category: "Food", distance: "14.0 km", description: "Fresh roasted peanut and ground chilli podis with hot steamed idlis.", icon: "🍛", tag: "Local Breakfast" },
      ],
    },
    history: {
      placeName: "Gandikota Fort — Grand Canyon of India",
      location: "YSR Kadapa District, Andhra Pradesh, India",
      builtYear: "Founded 1123 CE; expanded 14th–17th century CE",
      founderOrRuler: "Kapa Raja; fortified by Pemmasani Nayaks & later Qutb Shahi rulers",
      architect: "Nayaka & Deccan Fortification Engineers",
      structureOrLevels: "Five-mile stone rampart perimeter with 101 bastions perched on 300-ft cliff",
      monumentType: "Hilltop Gorge Citadel",
      architecturalStyle: "Deccan fortified military architecture blending Vijayanagara temples with Islamic civil structures",
      specialFeature: "Constructed directly above the 300-ft vertical red sandstone gorge carved by the Penna River",
      purpose: "Defensive military bastion guarding strategic trade lines across Rayalaseema and the Deccan Plateau",
      historicalImportance: "Impregnable bastion for half a millennium; celebrated for spectacular natural and structural confluence",
      currentStatus: "Protected Heritage Site & acclaimed geological and ecotourism landmark",
      projectGoal: "To generate 3D photogrammetry of the gorge fort ramparts, digitise Telugu and Persian inscriptions, and archive granaries.",
      timeline: [
        { yearOrEra: "1123 CE", title: "Fort Foundation", description: "Kapa Raja of Bommanapalle constructs the initial sand-and-stone garrison above the gorge." },
        { yearOrEra: "14th–16th C.", title: "Pemmasani Nayak Rule", description: "Transformed into an impenetrable sandstone fortress with the monumental Madhavaraya Temple." },
        { yearOrEra: "1650", title: "Qutb Shahi Conquest", description: "Mir Jumla captures the fort for the Sultan of Golconda; Jamia Masjid and imperial granary erected." },
        { yearOrEra: "Present", title: "Grand Canyon of India", description: "Celebrated nationally as one of the most stunning geological and historical canyon fortresses in Asia." },
      ],
    },
  },

  // --- PUNJAB ---
  {
    id: 9,
    name: "Golden Temple",
    location: "Amritsar",
    state: "Punjab",
    stateCategory: "Punjab",
    latitude: 31.6200,
    longitude: 74.8765,
    period: "1588–1604 CE",
    category: "Sacred Gurudwara",
    description: "Central spiritual sanctum of Sikhism floating within the holy Amrit Sarovar.",
    tags: ["Harmandir", "Sikh", "Sarovar"],
    colour: "#E9A93D",
    thumbUrl: "/heritage/golden_temple_present.jpg",
    spotlight: {
      title: "Sri Harmandir Sahib (Golden Temple)",
      subtitle: "The holiest Gurudwara of Sikhism plated in pure gold leaf",
      location: "Golden Temple Road, Amritsar",
      state: "Punjab",
      pastImage: {
        url: "/heritage/golden_temple_past.jpg",
        caption: "Historic 19th-century archival photograph of Sri Harmandir Sahib reflecting on the serene Amrit Sarovar",
        era: "19th Century (Archival Photograph)",
      },
      presentImage: {
        url: "/heritage/golden_temple_present.jpg",
        caption: "Magnificent sunlit Golden Temple with pure golden reflection in sacred Amrit Sarovar pool",
        era: "Present Day (Active Spiritual Sanctum)",
      },
      nearbyPlaces: [
        { name: "Jallianwala Bagh", category: "Monument", distance: "300 m", description: "Historic memorial park preserving bullet-marked brick walls and martyr's well.", icon: "🏛️", tag: "National Memorial" },
        { name: "Kesar Da Dhaba", category: "Food", distance: "650 m", description: "Operating since 1916 in Chowk Passian; renowned for 24-hr slow-cooked Dal Makhani.", icon: "🍲", tag: "Historic Dhaba" },
        { name: "Bhai Kulwant Singh Kulche", category: "Food", distance: "400 m", description: "Flaky wood-fired tandoori Amritsari kulchas served with tangy chole & tamarind onions.", icon: "🍲", tag: "Iconic Kulcha" },
        { name: "Gian Chand Lassi Wale", category: "Food", distance: "800 m", description: "Legendary sweet lassi served in earthen cups topped with thick malai.", icon: "🥛", tag: "Punjabi Lassi" },
        { name: "Durgiana Temple", category: "Temple", distance: "1.8 km", description: "16th-century Hindu temple situated in a holy water lake.", icon: "🛕", tag: "Sacred Lake Shrine" },
        { name: "Ahuja Milk Bhandar", category: "Food", distance: "2.2 km", description: "Celebrated for chilled kesar badam kheer and thickened sweet milk.", icon: "🥛", tag: "Kesar Milk" },
        { name: "Gobindgarh Fort", category: "Monument", distance: "2.5 km", description: "Historic military fort built by Maharaja Ranjit Singh with heritage museums.", icon: "🏰", tag: "Military Fort" },
        { name: "Partition Museum", category: "Monument", distance: "900 m", description: "World's premier museum recording oral testimonies and artefacts from 1947.", icon: "🏛️", tag: "Heritage Museum" },
        { name: "Kanha Sweets", category: "Food", distance: "4.2 km", description: "Famous Lawrence Road breakfast spot for spicy Poori Chana and Halwa.", icon: "🍲", tag: "Heritage Breakfast" },
        { name: "Wagah-Attari Border", category: "Monument", distance: "19.8 km", description: "Iconic international border with the daily military flag-lowering parade.", icon: "🎖️", tag: "Border Ceremony" },
      ],
    },
    history: {
      placeName: "Sri Harmandir Sahib (Golden Temple)",
      location: "Amritsar, Punjab, India",
      builtYear: "Foundation 1588; Completed 1604 CE",
      founderOrRuler: "Guru Arjan Dev Ji initiated its construction; foundation laid by Sufi saint Hazrat Mian Mir",
      architect: "Sikh Master Builders under the guidance of Guru Arjan Dev Ji",
      structureOrLevels: "Three-storey marble and gold sanctum linked by causeway to the circumambulatory parikrama",
      monumentType: "Central Spiritual Sanctum & Gurudwara",
      architecturalStyle: "Combines Sikh architectural traditions with influences from other regional styles",
      specialFeature: "The upper structure is covered with gold-plated copper panels; surrounded by the sacred Amrit Sarovar",
      purpose: "Universal spiritual sanctuary welcoming all humanity; housing the holy scripture and offering free community meals",
      historicalImportance: "It is the holiest shrine of Sikhism; repository of the original Adi Granth installed by Guru Arjan Dev Ji",
      currentStatus: "A major religious, cultural, and tourist destination serving free meals (Langar) to 100,000+ people daily",
      projectGoal: "To preserve Sikh heritage digitally and make historical and cultural information accessible to everyone.",
      timeline: [
        { yearOrEra: "1588", title: "Foundation Laid", description: "Guru Arjan Dev Ji initiated its construction; foundation stone laid by Sufi saint Hazrat Mian Mir of Lahore." },
        { yearOrEra: "1604", title: "Completion & Adi Granth", description: "The temple was completed around 1604; Guru Arjan Dev Ji installed the holy scripture Adi Granth." },
        { yearOrEra: "1830", title: "Golden Gilded Panels", description: "Maharaja Ranjit Singh, leader of the Sikh Empire, embellished the upper sanctum with 750 kg of pure gold-plated copper panels." },
        { yearOrEra: "Langar", title: "Universal Community Kitchen", description: "The world's largest community kitchen serves free meals to visitors regardless of religion, caste, or background." },
      ],
    },
  },
  {
    id: 10,
    name: "Doraha Sarai (Rang De Basanti)",
    location: "Ludhiana",
    state: "Punjab",
    stateCategory: "Punjab",
    latitude: 30.8000,
    longitude: 76.0333,
    period: "1667 CE",
    category: "Mughal Sarai",
    description: "Mughal-era fortified sarai on Grand Trunk Road with monumental brick gateways.",
    tags: ["Mughal", "GT Road", "Sarai"],
    colour: "#DE6B48",
    thumbUrl: "/heritage/doraha_present.jpg",
    spotlight: {
      title: "Doraha Fort / Sarai (Rang De Basanti Fort)",
      subtitle: "17th-century Mughal caravanserai built during Emperor Aurangzeb's reign",
      location: "Doraha, Ludhiana District",
      state: "Punjab",
      pastImage: {
        url: "/heritage/doraha_past.jpg",
        caption: "Historic inner gateway arch and overgrown courtyard of the 17th-century Mughal Sarai",
        era: "17th Century Mughal Architecture",
      },
      presentImage: {
        url: "/heritage/doraha_present.jpg",
        caption: "Monumental main red-brick gateway with octagonal minaret towers and floral blue tilework",
        era: "Present Day (Historical Heritage Site)",
      },
      nearbyPlaces: [
        { name: "Grand Trunk Road Sarai Gate", category: "Monument", distance: "10 m", description: "Massive 2-storey Mughal brick gate with carved glazed tile remnants.", icon: "🏛️", tag: "Mughal Gateway" },
        { name: "Doraha Canal Bridge & View", category: "Monument", distance: "1.2 km", description: "Peaceful Sirhind canal bank lined with eucalyptus trees.", icon: "🌊", tag: "Canal Walk" },
        { name: "Gurudwara Degsar Sahib Katana", category: "Temple", distance: "6.5 km", description: "Historic Sikh shrine visited by Guru Gobind Singh Ji.", icon: "🛕", tag: "Historic Gurudwara" },
        { name: "Lucky Dhaba, GT Road", category: "Food", distance: "4.8 km", description: "Classic highway dhaba famous for hot tandoori parathas with white butter.", icon: "🍲", tag: "Highway Dhaba" },
        { name: "Ludhiana Clock Tower (Ghanta Ghar)", category: "Monument", distance: "19.5 km", description: "Iconic colonial clock tower erected in 1906 in the heart of old city.", icon: "🏛️", tag: "Colonial Landmark" },
        { name: "Maharaja Ranjit Singh War Museum", category: "Monument", distance: "18.2 km", description: "Galleries depicting Punjab's military history and gallantry awards.", icon: "🎖️", tag: "War Museum" },
        { name: "Ludhiana Hosiery & Wool Bazaar", category: "Craft", distance: "19.0 km", description: "India's largest woollen garment manufacturing and wholesale market.", icon: "🧶", tag: "Textile Hub" },
        { name: "Chawla Chicken, Ludhiana", category: "Food", distance: "18.8 km", description: "Home of original mild Cream Chicken and roasted tandoori delicacies.", icon: "🍗", tag: "Legendary Cream Chicken" },
        { name: "Payal Fort Ruins", category: "Monument", distance: "11.2 km", description: "Medieval mud and brick fort of the Maharaja of Patiala.", icon: "🏰", tag: "Patiala Heritage" },
        { name: "Pandit Ji Di Kulfi", category: "Food", distance: "19.2 km", description: "Century-old falooda kulfi sweetened with rabri and rose water.", icon: "🍨", tag: "Heritage Kulfi" },
      ],
    },
    history: {
      placeName: "Doraha Sarai (Mughal Sarai / Sarai Lashkari Khan)",
      location: "Doraha, Ludhiana district, Punjab, India",
      builtYear: "17th century CE (c. 1667 CE)",
      founderOrRuler: "Built during the Mughal period (Reign of Emperor Aurangzeb / Lashkari Khan)",
      architect: "Mughal Highway Engineers & Master Masons",
      structureOrLevels: "Quadrangular brick enclosure with two monumental double-storey gateways",
      monumentType: "Historical Monument / Fortified Caravanserai",
      architecturalStyle: "Features Mughal-style gateways, brickwork, arches, and enclosures",
      specialFeature: "Octagonal minaret bastions, floral blue and yellow glazed tilework, and vaulted traveller suites",
      purpose: "Served as a resting place for travellers, merchants, and their animals along the Grand Trunk Road",
      historicalImportance: "One of the best surviving examples of 17th-century secular Mughal highway architecture",
      currentStatus: "Historical monument; also known for being featured in popular media (such as the movie Rang De Basanti)",
      projectGoal: "To document and digitally preserve the historical and architectural legacy of Doraha Sarai for educational and research purposes.",
      timeline: [
        { yearOrEra: "1667", title: "Mughal Highway Inception", description: "Built during the Mughal period, in the 17th century as a key security checkpoint on the imperial Grand Trunk Road." },
        { yearOrEra: "17th C.", title: "Caravan Sanctuary", description: "Served as a resting place for travellers, merchants, and their animals, offering vaulted rooms, stables, and a mosque." },
        { yearOrEra: "2006", title: "Cinematic Prominence", description: "Featured as the central nostalgic backdrop in the Bollywood blockbuster movie Rang De Basanti." },
        { yearOrEra: "Present", title: "Archaeological Preservation", description: "Protected by the Punjab Archaeology Department as a valuable relic of medieval trade and transportation." },
      ],
    },
  },

  // --- LIVING CRAFTS (GI) ---
  {
    id: 11,
    name: "Nirona (Rogan Art)",
    location: "Kutch",
    state: "Gujarat",
    stateCategory: "Crafts",
    latitude: 23.3644,
    longitude: 69.6012,
    period: "Living Heritage",
    category: "Living Craft",
    description: "Centuries-old rare fabric art using boiled castor oil pigments and stylus.",
    tags: ["Rogan Art", "Craft", "Living Heritage"],
    colour: "#7B2CBF",
    thumbUrl: "/heritage/nirona_present.jpg",
    spotlight: {
      title: "Nirona — Rogan Art & Artisan Village",
      subtitle: "The world's only surviving home of castor-oil thread painting",
      location: "Nakhatrana Taluka, Kutch",
      state: "Gujarat",
      pastImage: {
        url: "/heritage/nirona_past.jpg",
        caption: "Master artisan Kansara demonstrating traditional Rogan castor oil stylus art",
        era: "Traditional Workshop Survey",
      },
      presentImage: {
        url: "/heritage/nirona_present.jpg",
        caption: "Padma Shri Abdul Gafur Khatri detailing the iconic 'Tree of Life' motif",
        era: "Present Day (Living Master Workshop)",
      },
      nearbyPlaces: [
        { name: "Khatri Rogan Art Studio", category: "Craft", distance: "50 m", description: "Ancestral studio of Padma Shri Abdul Gafur Khatri; watch live stylus painting.", icon: "🎨", tag: "Living Studio" },
        { name: "Luhar Copper Bell Workshops", category: "Craft", distance: "200 m", description: "Iron & copper alloy bells hand-tuned by ear using ancient mud kilns.", icon: "🔔", tag: "Acoustic Craft" },
        { name: "Kutch Lacquer Woodcraft", category: "Craft", distance: "350 m", description: "Wada artisans turning wild wood with colorful natural heated lacquer.", icon: "🪵", tag: "Wood Craft" },
        { name: "Toran Kutchi Dining", category: "Food", distance: "1.2 km", description: "Traditional Bajra Rotla, smoked Ringna no Olo, garlic chutney & fresh chaas.", icon: "🍲", tag: "Kutchi Thali" },
        { name: "Chhari Dhand Wetland Reserve", category: "Monument", distance: "14.2 km", description: "Rann wetland hosting thousands of migratory pink flamingos and cranes.", icon: "🦩", tag: "Bird Sanctuary" },
        { name: "Nakhatrana Bazaar & Sweets", category: "Food", distance: "16.5 km", description: "Renowned for authentic Kutchi Gulab Pak, Mesub and spicy dabelis.", icon: "🍲", tag: "Regional Delights" },
        { name: "Dhinodhar Hills & Shrine", category: "Temple", distance: "17.8 km", description: "Volcanic hill peak with historic Gorakhnath monastery overlooking the Rann.", icon: "🛕", tag: "Hilltop Temple" },
        { name: "Virani Moti Stepwell", category: "Monument", distance: "12.0 km", description: "Ancient sandstone caravan stepwell on historic Kutch-Sindh trade route.", icon: "🏛️", tag: "Ancient Stepwell" },
        { name: "Khavda Terracotta Studios", category: "Craft", distance: "18.5 km", description: "Potters creating hand-painted red earthenware jars with natural clay dyes.", icon: "🏺", tag: "Clay Art" },
        { name: "Bhirandiyara Mawa Village", category: "Food", distance: "19.0 km", description: "Folk village celebrated for fresh warm buffalo milk Mawa sweet.", icon: "🥛", tag: "Fresh Mawa" },
      ],
    },
    history: {
      placeName: "Nirona — Rogan Art & Living Crafts",
      location: "Nakhatrana, Kutch District, Gujarat, India",
      builtYear: "Over 300 years of unbroken living heritage",
      founderOrRuler: "Khatri artisan family lineage (spearheaded by Padma Shri Abdul Gafur Khatri)",
      architect: "Generational Master Craftsmen (Khatri, Luhar, and Wada guilds)",
      structureOrLevels: "Living artisan village studios and mud-brick bhungas",
      monumentType: "Intangible Cultural Living Heritage (Rare Traditional Craft)",
      architecturalStyle: "Vernacular Kutchi architecture with round bhungas and lippan mud mirror-work",
      specialFeature: "Rogan painting mein oil-based colours se kapde par intricate designs banaye jaate hain",
      purpose: "Artists ki stories, painting process aur traditional designs ka digital archive banana aur preservation",
      historicalImportance: "Famous for traditional fabric painting, copper bells aur lacquer work; world's only home of Rogan art",
      currentStatus: "Protected living master art form; gifted by the Prime Minister to world leaders including US President",
      projectGoal: "Artists ki stories, painting process aur traditional designs ka digital archive banana.",
      timeline: [
        { yearOrEra: "17th C.", title: "Ancestral Heritage", description: "Khatri artisans migrate from Sindh to Kutch, preserving the secret 48-hour boiled castor oil pigment formula." },
        { yearOrEra: "1980s", title: "Resolute Revival", description: "Faced with industrial mill fabric competition, Abdul Gafur Khatri pledged to keep the rare art alive in Nirona." },
        { yearOrEra: "2014", title: "Global Acclaim", description: "Prime Minister Narendra Modi presented a Rogan 'Tree of Life' masterpiece to US President Barack Obama." },
        { yearOrEra: "2019", title: "Padma Shri Honour", description: "Abdul Gafur Khatri was conferred the prestigious Padma Shri by the President of India for preserving rare heritage." },
      ],
    },
  },
  {
    id: 12,
    name: "Kinhal Wooden Toys",
    location: "Koppal",
    state: "Karnataka",
    stateCategory: "Crafts",
    latitude: 15.4217,
    longitude: 76.0592,
    period: "Living Craft (GI)",
    category: "Living Craft",
    description: "Lightweight artisan wooden figurines made with tamarind seed paste and lacquer.",
    tags: ["GI Tag", "Woodcraft", "Chitragar"],
    colour: "#7B2CBF",
    thumbUrl: "/heritage/kinhal_present.jpg",
    spotlight: {
      title: "Kinhal — Traditional Wooden Toys & Idols",
      subtitle: "Centuries-old GI craft originating from the golden age of Vijayanagara",
      location: "Koppal District",
      state: "Karnataka",
      pastImage: {
        url: "/heritage/kinhal_past.jpg",
        caption: "Traditional Kinhal wooden idols hand-painted using natural pigments",
        era: "Traditional Craft Record",
      },
      presentImage: {
        url: "/heritage/kinhal_present.jpg",
        caption: "Vibrantly painted lightweight wooden idols with natural lacquer finish",
        era: "Present Day (GI Protected Craft)",
      },
      nearbyPlaces: [
        { name: "Chitragar Artisan Lane", category: "Craft", distance: "50 m", description: "Street of generational toy craftsmen carving soft Polki wood into idols.", icon: "🎨", tag: "Toy Workshops" },
        { name: "Koppal Fort Citadel", category: "Monument", distance: "13.5 km", description: "Ancient hill fort rebuilt by French engineers for Tipu Sultan.", icon: "🏰", tag: "Hill Fort" },
        { name: "Koppal Gavi Matha", category: "Temple", distance: "14.2 km", description: "Venerated cave monastery known for spiritual heritage and community dining.", icon: "🛕", tag: "Cave Matha" },
        { name: "Munirabad Tungabhadra Dam", category: "Monument", distance: "16.8 km", description: "Vast reservoir with Japanese garden and musical fountains.", icon: "🌊", tag: "Dam Reservoir" },
        { name: "Koppal Khanavali", category: "Food", distance: "13.0 km", description: "Authentic North Karnataka meals with sajje roti (bajra), brinjal & curd.", icon: "🍲", tag: "Karnataka Oota" },
        { name: "Hampi Western Border", category: "Monument", distance: "19.0 km", description: "Outer ruins and watchtowers of the Vijayanagara empire.", icon: "🏛️", tag: "Historic Ruins" },
        { name: "Kinhal Pottery Studios", category: "Craft", distance: "800 m", description: "Local earthenware potters shaping water pots and decorative tiles.", icon: "🏺", tag: "Earthen Pottery" },
        { name: "Anegundi Ferry Point", category: "Monument", distance: "18.5 km", description: "River crossing point with traditional circular coracle boats.", icon: "🛶", tag: "Coracle Ghat" },
        { name: "Ashoka Rock Edict, Palkigundu", category: "Monument", distance: "15.0 km", description: "3rd-century BCE rock inscription carved by Emperor Ashoka.", icon: "📜", tag: "Brahmi Edict" },
        { name: "Koppal Fresh Churn Dairy", category: "Food", distance: "13.2 km", description: "Fresh buffalo milk peda and sweet khova made daily.", icon: "🥛", tag: "Koppal Peda" },
      ],
    },
    history: {
      placeName: "Kinhal — Traditional Wooden Toys & Idols",
      location: "Koppal District, Karnataka, India",
      builtYear: "15th–16th century CE origins",
      founderOrRuler: "Chitragar artisan community under Vijayanagara royal patronage",
      architect: "Master Woodcarvers & Painters (Chitragars)",
      structureOrLevels: "Hereditary artisan ateliers and carving workshops",
      monumentType: "Geographical Indication (GI) Living Craft",
      architecturalStyle: "Indigenous wood joinery using Polki wood, tamarind seed adhesive, and liquid pebble chalk",
      specialFeature: "Ultra-lightweight figurines coated with natural lacquer, vibrant enamel hues, and gold foil embossing",
      purpose: "Crafting temple festival palanquins, sacred wooden deities, and traditional folk toys",
      historicalImportance: "Direct heirs to the master craftsmen who built the wooden chariots of the Vijayanagara Empire",
      currentStatus: "GI-protected traditional Indian craft preserved by master artisan guilds in Koppal",
      projectGoal: "To establish a 3D digital model library of Kinhal wooden deities and archive ancestral natural dye recipes.",
      timeline: [
        { yearOrEra: "15th C.", title: "Vijayanagara Royal Guild", description: "Chitragar artisans crafted royal thrones, wooden chariots, and ceiling frescoes for Vijayanagara kings." },
        { yearOrEra: "18th C.", title: "Folk Toy Evolution", description: "Artisans evolved their skills into distinctive lightweight wooden toys and devotional idols." },
        { yearOrEra: "2012", title: "GI Status Awarded", description: "Conferred official Geographical Indication (GI) status by the Government of India for exceptional cultural uniqueness." },
        { yearOrEra: "Present", title: "Digital Preservation", description: "Artisan cooperatives safeguard the rare technique for international collectors and museum archives." },
      ],
    },
  },
  {
    id: 13,
    name: "Ajrakhpur (Block Printing)",
    location: "Kutch",
    state: "Gujarat",
    stateCategory: "Crafts",
    latitude: 23.2386,
    longitude: 69.7547,
    period: "4000+ Years Ancient Heritage",
    category: "Living Craft",
    description: "Centuries-old 16-step natural dye resist block printing using teakwood blocks.",
    tags: ["Ajrakh", "Natural Dye", "GI Craft"],
    colour: "#0077B6",
    thumbUrl: "/heritage/ajrakhpur_present.jpg",
    spotlight: {
      title: "Ajrakhpur — Traditional Block Printing",
      subtitle: "Ancient 16-step natural dyeing and geometric block printing of Kutch",
      location: "Bhuj Taluka, Kutch",
      state: "Gujarat",
      pastImage: {
        url: "/heritage/ajrakhpur_past.jpg",
        caption: "Historic hand block printing pattern and carved wooden blocks",
        era: "Traditional Craft Archive",
      },
      presentImage: {
        url: "/heritage/ajrakhpur_present.jpg",
        caption: "Intricate natural indigo and madder geometric resist block printing",
        era: "Present Day (Ajrakhpur Craft Sanctuary)",
      },
      nearbyPlaces: [
        { name: "Dr. Ismail Khatri Studio", category: "Craft", distance: "50 m", description: "Workshop of master natural indigo dyer awarded honorary doctorate.", icon: "🎨", tag: "Master Studio" },
        { name: "Living & Learning Design Centre (LLDC)", category: "Monument", distance: "3.5 km", description: "Grand textile crafts museum preserving over 40 Kutchi embroidery styles.", icon: "🏛️", tag: "Craft Museum" },
        { name: "Dhamadka Village", category: "Monument", distance: "18.0 km", description: "Original ancestral riverside home of the Ajrakh printing community.", icon: "🏡", tag: "Historic Village" },
        { name: "Bhuj Aina Mahal & Prag Mahal", category: "Monument", distance: "14.2 km", description: "18th-century mirror palace with Venetian chandeliers and stone clocks.", icon: "🏰", tag: "Royal Palace" },
        { name: "Bhujodi Weaver Village", category: "Craft", distance: "6.5 km", description: "National awardee Vankar weavers making pure sheep-wool Kutchi shawls.", icon: "🧵", tag: "Weaving Hub" },
        { name: "Swaminarayan Temple Bhuj", category: "Temple", distance: "13.8 km", description: "Magnificent carved white marble temple with gold leaf domes.", icon: "🛕", tag: "Marble Temple" },
        { name: "Kutchi Dabeli Landmark (Bhuj)", category: "Food", distance: "14.0 km", description: "Original birthplace of spicy potato dabeli with roasted peanuts and chutney.", icon: "🍲", tag: "Kutchi Dabeli" },
        { name: "Kutch Khavda Mesuk Sweets", category: "Food", distance: "14.5 km", description: "Centuries-old sweet shop famous for melt-in-the-mouth gram flour Mesuk.", icon: "🍲", tag: "Traditional Sweets" },
        { name: "Kukma Lake & Birding", category: "Monument", distance: "4.8 km", description: "Scenic desert wetland attracting winter migratory cranes and pelicans.", icon: "🦆", tag: "Lake View" },
        { name: "Pethapur Wood Carving Hub", category: "Craft", distance: "19.5 km", description: "Artisans carving intricate teakwood blocks used for printing.", icon: "🪵", tag: "Block Carving" },
      ],
    },
    history: {
      placeName: "Ajrakhpur — Traditional Block Printing",
      location: "Kutch, Gujarat, India",
      builtYear: "Over 4,000 years of living heritage tracing back to Harappan civilization",
      founderOrRuler: "Khatri artisan community; village founded under master dyer Dr. Ismail Mohammad Khatri",
      architect: "Master Block Carvers and Natural Indigo Dyers",
      structureOrLevels: "Specialized artisan settlement with solar drying fields, natural dye tanks, and washing wells",
      monumentType: "Intangible Cultural Living Heritage (Hand Block Printing)",
      architecturalStyle: "Eco-conscious craft colony built with subterranean dye pits and rain-harvesting reservoirs",
      specialFeature: "Artisans wooden blocks aur traditional dyeing techniques se intricate geometric patterns banate hain",
      purpose: "Different designs, printing process aur natural dyes ko visually document karna",
      historicalImportance: "Traces lineage to Harappan dyed cloth excavated at Mohenjo-daro; represents pinnacle of eco-dyeing chemistry",
      currentStatus: "Internationally acclaimed sustainable craft village and cultural tourism landmark",
      projectGoal: "Different designs, printing process aur natural dyes ko visually document karna.",
      timeline: [
        { yearOrEra: "c. 2500 BCE", title: "Indus Valley Origins", description: "Excavations in Mohenjo-daro reveal the famous King-Priest statue draped in an Ajrakh-style trefoil patterned shawl." },
        { yearOrEra: "16th C.", title: "Rao Bharmalji I Invitation", description: "Ruler of Kutch invites Khatri artisans from Sindh to settle along desert rivers rich in mineral salts." },
        { yearOrEra: "2001", title: "Creation of Ajrakhpur", description: "Following the devastating 2001 Bhuj earthquake, artisans established Ajrakhpur as a model eco-printing sanctuary." },
        { yearOrEra: "Present", title: "Global Eco-Textile Standard", description: "Celebrated worldwide for using 100% natural indigo, pomegranate rind, harda, and iron rust." },
      ],
    },
  },
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

  // Active State Filter
  const [selectedStateTab, setSelectedStateTab] = useState<string>("All");

  // Selected Place for Spotlight & History
  const [selectedPlaceId, setSelectedPlaceId] = useState<number>(1);
  const [nearbyFilter, setNearbyFilter] = useState<string>("All");

  // Location selector state
  const [locationName, setLocationName] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPickerActive, setIsPickerActive] = useState(false);

  // 3D Spatial View State
  const [viewer3D, setViewer3D] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    subtitle?: string;
    initialDepthMapUrl?: string;
  }>({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

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

  const currentPlace =
    ALL_HERITAGE_PLACES.find((p) => p.id === selectedPlaceId) ||
    ALL_HERITAGE_PLACES[0];

  const handleSelectPlace = (place: HeritagePlaceEntry) => {
    setSelectedPlaceId(place.id);
    setLocationName(`${place.name} (${place.location})`);
    setSelectedCoords({ lat: place.latitude, lng: place.longitude });

    const spotlightSection = document.getElementById("heritage-spotlight-section");
    if (spotlightSection) {
      spotlightSection.scrollIntoView({ behavior: "smooth" });
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

  // Filter places based on selected state tab
  const displayedPlaces =
    selectedStateTab === "All"
      ? ALL_HERITAGE_PLACES
      : selectedStateTab === "Crafts"
      ? ALL_HERITAGE_PLACES.filter((p) => p.stateCategory === "Crafts")
      : ALL_HERITAGE_PLACES.filter((p) => p.stateCategory === selectedStateTab);

  const filteredNearby = currentPlace.spotlight.nearbyPlaces.filter((place) => {
    if (nearbyFilter === "All") return true;
    if (nearbyFilter === "Temples") return place.category === "Temple" || place.category === "Monument";
    if (nearbyFilter === "Cafes") return place.category === "Cafe";
    if (nearbyFilter === "Food") return place.category === "Food";
    return true;
  });

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
              href="#heritage-history-section"
              className="hidden md:inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              📜 History & Annals
            </a>
            <a
              href="#upload-section"
              className="rounded-xl bg-stone-900 px-4 py-2 font-semibold text-white shadow-xs transition hover:bg-amber-700"
            >
              + Upload Document
            </a>
          </div>
        </div>
      </header>

      {/* 🌟 GRAND HERO SECTION 🌟 */}
      <section className="border-b border-stone-100 bg-gradient-to-b from-stone-50/70 to-white pt-16 pb-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/90 px-4 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs">
            <span className="animate-spin text-sm">✨</span>
            <span>Multilingual OCR · Semantic Search · Spatial Archiving · Historical Chronicles</span>
          </div>

          <h1 className="mt-5 font-serif text-5xl font-bold tracking-tight text-stone-900 sm:text-7xl leading-tight">
            India’s Inscriptions, Monuments & Living Crafts
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Digitise ancient stone epigraphy, Sanskrit & Devanagari manuscripts, and rare artisan traditions into an offline-first AI searchable geographic collection.
          </p>

          {/* 4 Interactive Statistics Cards with Hover Lift */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-md">
              <p className="text-3xl font-bold text-stone-900 group-hover:text-amber-700 transition">25+</p>
              <p className="mt-1 text-xs font-medium text-stone-500">Indexed Monuments</p>
            </div>

            <div className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-md">
              <p className="text-3xl font-bold text-amber-700">8</p>
              <p className="mt-1 text-xs font-medium text-stone-500">UNESCO World Heritage</p>
            </div>

            <div className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 hover:shadow-md">
              <p className="text-3xl font-bold text-purple-700">6</p>
              <p className="mt-1 text-xs font-medium text-stone-500">Rare Living Crafts (GI)</p>
            </div>

            <div className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 hover:shadow-md">
              <p className="text-3xl font-bold text-teal-700">{savedUploads.length || "Live"}</p>
              <p className="mt-1 text-xs font-medium text-stone-500">Community Scans</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ STATE-WISE EXPLORATION SECTION 🗺️ */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Explore Cultural Geographies
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Select a state to explore monuments, click any card to inspect Past vs. Present archival views, history & nearby places
            </p>
          </div>

          {/* State Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "All", label: "🇮🇳 All States" },
              { id: "Rajasthan", label: "🏰 Rajasthan" },
              { id: "Gujarat", label: "🌾 Gujarat" },
              { id: "Karnataka", label: "🛕 Karnataka" },
              { id: "Andhra", label: "🚩 Andhra Pradesh" },
              { id: "Punjab", label: "✨ Punjab" },
              { id: "Crafts", label: "🎨 Living Crafts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStateTab(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedStateTab === tab.id
                    ? "bg-stone-900 text-white shadow-xs scale-105"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Places Grid with Animation */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayedPlaces.map((place) => (
            <article
              key={place.id}
              onClick={() => handleSelectPlace(place)}
              className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 shadow-xs hover:-translate-y-1.5 hover:shadow-lg flex flex-col justify-between ${
                selectedPlaceId === place.id
                  ? "border-amber-600 bg-amber-50/40 ring-2 ring-amber-600/30"
                  : "border-stone-200 bg-white hover:border-amber-400"
              }`}
            >
              <div>
                <div className="relative h-36 w-full overflow-hidden rounded-xl bg-stone-100 mb-3">
                  <img
                    src={place.thumbUrl}
                    alt={place.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Keep the element clean without replacing it with another monument's image
                      (e.target as HTMLImageElement).style.filter = "contrast(1.05)";
                    }}
                  />
                  <span
                    className="absolute top-2 left-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: place.colour || "#DE6B48" }}
                  >
                    {place.category}
                  </span>
                  {selectedPlaceId === place.id && (
                    <span className="absolute top-2 right-2 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition">
                  {place.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">📍 {place.location}, {place.state}</p>
                <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {place.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-amber-700 group-hover:underline">
                  Inspect Heritage Guide →
                </span>
                <span className="text-stone-400 font-mono text-[10px]">10 Places</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 🗺️ INTERACTIVE MAP SECTION 🗺️ */}
      <section id="heritage-map-section" className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Interactive Geospatial Map
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-stone-900">
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
          selectedLocation={selectedCoords || { lat: currentPlace.latitude, lng: currentPlace.longitude }}
          onLocationSelect={(lat, lng) => setSelectedCoords({ lat, lng })}
          isPickerMode={isPickerActive}
        />
      </section>

      {/* 🌟 HERITAGE SPOTLIGHT: PAST vs PRESENT & TOP 10 NEARBY (Within 20 km) 🌟 */}
      <section id="heritage-spotlight-section" className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Spotlight Header with Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-bold text-amber-900 uppercase">
                  Heritage Spotlight
                </span>
                <span className="text-xs font-semibold text-stone-500">· Max 20 km Proximity Analysis</span>
              </div>
              <h2 className="mt-1 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
                {currentPlace.spotlight.title}
              </h2>
              <p className="text-xs text-stone-500 mt-1">📍 {currentPlace.spotlight.location}, {currentPlace.state}</p>
            </div>

            {/* Quick Switcher dropdown buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-50 p-1.5 rounded-2xl border border-stone-200">
              {ALL_HERITAGE_PLACES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlace(p)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    selectedPlaceId === p.id
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {p.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 🖼️ PAST vs PRESENT PHOTO ARCHIVE */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>🕰️</span> Visual Evolution: Past vs. Present Era
              </h3>
              <span className="text-[11px] text-stone-500 font-medium">Archival comparison</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Past Image Card */}
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3">
                  <span className="rounded-md bg-stone-200 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-800">
                    📜 Historical Archival Era
                  </span>
                  <span className="text-xs font-semibold text-stone-600">{currentPlace.spotlight.pastImage.era}</span>
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-xl bg-stone-300">
                  <img
                    src={currentPlace.spotlight.pastImage.url}
                    alt={`${currentPlace.name} Past`}
                    style={{ filter: "sepia(0.5) contrast(1.1) brightness(0.95)" }}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur-xs">
                    ARCHIVAL VINTAGE
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-stone-700">
                  {currentPlace.spotlight.pastImage.caption}
                </p>
                <button
                  onClick={() =>
                    setViewer3D({
                      isOpen: true,
                      imageUrl: currentPlace.spotlight.pastImage.url,
                      title: `${currentPlace.name} (Archival Era)`,
                      subtitle: `Monocular 3D spatial perspective of historic archival photography • ${currentPlace.spotlight.pastImage.era}`,
                    })
                  }
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-100 hover:border-amber-300 transition"
                >
                  <span>🌐</span>
                  <span>Explore 3D Spatial View</span>
                </button>
              </div>

              {/* Present Image Card */}
              <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/20 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3">
                  <span className="rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    📸 Present Day Era
                  </span>
                  <span className="text-xs font-semibold text-amber-900">{currentPlace.spotlight.presentImage.era}</span>
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-xl bg-stone-200">
                  <img
                    src={currentPlace.spotlight.presentImage.url}
                    alt={`${currentPlace.name} Present`}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    ACTIVE ARCHIVE
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-stone-700">
                  {currentPlace.spotlight.presentImage.caption}
                </p>
                <button
                  onClick={() =>
                    setViewer3D({
                      isOpen: true,
                      imageUrl: currentPlace.spotlight.presentImage.url,
                      title: `${currentPlace.name} (Present Day)`,
                      subtitle: `Monocular 3D depth mesh, point cloud & panorama • ${currentPlace.location}, ${currentPlace.state}`,
                    })
                  }
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-500/20 hover:border-amber-400 transition"
                >
                  <span>🌐</span>
                  <span>Explore 3D Spatial View</span>
                </button>
              </div>
            </div>
          </div>

          {/* 📍 TOP 10 NEARBY PLACES (Temples, Cafes, Restaurants & Best Food) */}
          <div className="mt-12 border-t border-stone-200/80 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <span>🗺️</span> Top 10 Nearby Places within 20 km
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Handpicked historic temples, cafes, legendary food spots & artisan workshops around {currentPlace.name}
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "All", label: "All (10)" },
                  { key: "Temples", label: "🛕 Temples & Forts" },
                  { key: "Cafes", label: "☕ Cafes" },
                  { key: "Food", label: "🍲 Food & Cuisine" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setNearbyFilter(f.key)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      nearbyFilter === f.key
                        ? "bg-stone-900 text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 10 Places Grid */}
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-2">
              {filteredNearby.map((place, idx) => (
                <div
                  key={idx}
                  className="group flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs transition hover:border-amber-600 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-200 text-2xl shadow-2xs group-hover:bg-amber-50 group-hover:border-amber-200 transition">
                    {place.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif text-base font-bold text-stone-900 truncate group-hover:text-amber-800 transition">
                        {place.name}
                      </h4>
                      <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-700">
                        📍 {place.distance}
                      </span>
                    </div>

                    <span className="inline-block rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 text-[10px] font-semibold mt-1">
                      {place.tag}
                    </span>

                    <p className="mt-2 text-xs leading-relaxed text-stone-600 line-clamp-2">
                      {place.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📜 HISTORICAL & ARCHITECTURAL CHRONICLES SECTION (Directly Preceding Upload) 📜 */}
      <section id="heritage-history-section" className="mx-auto max-w-7xl px-6 py-12 border-t border-stone-200/80">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 uppercase">
                  📜 Archival Chronicles
                </span>
                <span className="text-xs font-semibold text-stone-500">· Historical & Architectural Annals</span>
              </div>
              <h2 className="mt-1 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
                Historical Chronicles: {currentPlace.history.placeName}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                📍 {currentPlace.history.location} · {currentPlace.history.builtYear} · {currentPlace.history.monumentType}
              </p>
            </div>

            {/* Status & Category Badge */}
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {currentPlace.history.currentStatus}
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Epoch: {currentPlace.history.builtYear}
              </span>
            </div>
          </div>

          {/* Place Switcher Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5 bg-stone-50 p-2 rounded-2xl border border-stone-200">
            {ALL_HERITAGE_PLACES.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPlace(p)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  selectedPlaceId === p.id
                    ? "bg-stone-900 text-white shadow-xs scale-102"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Architectural Fact Specification Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Box 1: Architecture & Style */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 shadow-2xs hover:border-amber-400 transition">
              <span className="text-2xl">🏛️</span>
              <h4 className="mt-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                Architectural Style
              </h4>
              <p className="mt-1 font-serif text-base font-bold text-stone-900">
                {currentPlace.history.architecturalStyle}
              </p>
              {currentPlace.history.structureOrLevels && (
                <p className="mt-1.5 text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">Structure:</span> {currentPlace.history.structureOrLevels}
                </p>
              )}
            </div>

            {/* Box 2: Patron & Builder */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 shadow-2xs hover:border-amber-400 transition">
              <span className="text-2xl">👑</span>
              <h4 className="mt-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                Patron & Founder
              </h4>
              <p className="mt-1 font-serif text-base font-bold text-stone-900">
                {currentPlace.history.founderOrRuler}
              </p>
              {currentPlace.history.architect && (
                <p className="mt-1.5 text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">Architect:</span> {currentPlace.history.architect}
                </p>
              )}
            </div>

            {/* Box 3: Special Feature */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 shadow-2xs hover:border-amber-400 transition">
              <span className="text-2xl">🌟</span>
              <h4 className="mt-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                Special Architectural Feature
              </h4>
              <p className="mt-1 text-xs leading-relaxed font-medium text-stone-800">
                {currentPlace.history.specialFeature}
              </p>
            </div>

            {/* Box 4: Historical Purpose */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 shadow-2xs hover:border-amber-400 transition">
              <span className="text-2xl">📜</span>
              <h4 className="mt-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                Purpose & Significance
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-stone-700">
                {currentPlace.history.purpose}
              </p>
              <p className="mt-1.5 text-[11px] text-amber-800 font-medium">
                {currentPlace.history.historicalImportance}
              </p>
            </div>
          </div>

          {/* Chronological Timeline / Historical Milestones */}
          <div className="mt-10 border-t border-stone-200/80 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                <span>⏳</span> Chronological Milestones & Historical Record
              </h3>
              <span className="text-xs font-semibold text-stone-500 font-mono">
                {currentPlace.history.timeline.length} Recorded Milestones
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentPlace.history.timeline.map((evt, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-amber-500 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-stone-900 text-white font-mono text-xs font-bold px-2.5 py-1">
                        {evt.yearOrEra}
                      </span>
                      <span className="text-xs text-amber-700 font-semibold font-mono">
                        Phase 0{idx + 1}
                      </span>
                    </div>

                    <h4 className="mt-3 font-serif text-base font-bold text-stone-900">
                      {evt.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-stone-600">
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🎯 Dharohar AI Digital Preservation Project Goal Banner */}
          <div className="mt-10 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/60 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white text-2xl shadow-xs">
                🎯
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  Dharohar AI Preservation Mission
                </span>
                <h4 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                  Project Goal: {currentPlace.name}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-stone-700 max-w-3xl">
                  {currentPlace.history.projectGoal}
                </p>
              </div>
            </div>

            <a
              href="#upload-section"
              onClick={() => {
                setLocationName(`${currentPlace.name} (${currentPlace.location})`);
                setSelectedCoords({ lat: currentPlace.latitude, lng: currentPlace.longitude });
              }}
              className="shrink-0 rounded-xl bg-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-800 transition"
            >
              Digitise Inscription ↓
            </a>
          </div>
        </div>
      </section>

      {/* Upload and AI Processing Section */}
      <section id="upload-section" className="mx-auto max-w-5xl px-6 py-12 border-t border-stone-100">
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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="file"
              accept="image/*,.pdf"
              className="block w-full rounded-xl border border-stone-300 bg-white p-3 text-sm"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setAnalysis(null);
              }}
            />
            <button
              disabled={!file || loading}
              onClick={analyseUpload}
              className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-amber-700 disabled:opacity-40"
            >
              {loading ? "Analysing..." : "Analyse Upload"}
            </button>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent"></div>
              <span>{processingStage}</span>
            </div>
          )}

          {analysis && (
            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Heritage Epigraphy & Transcription</span>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{analysis.file_name}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {file && (
                    <button
                      onClick={() => {
                        const previewUrl = URL.createObjectURL(file);
                        setViewer3D({
                          isOpen: true,
                          imageUrl: previewUrl,
                          title: analysis.file_name,
                          subtitle: `Monocular 3D spatial reconstruction of uploaded inscription • ${analysis.suggested_type || "Heritage Artifact"}`,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 hover:bg-amber-700 px-3 py-1 text-xs font-semibold text-white shadow-xs transition"
                    >
                      <span>🌐</span>
                      <span>Explore in 3D</span>
                    </button>
                  )}
                  {analysis.suggested_type && (
                    <span className="self-start sm:self-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
                      🏛️ {analysis.suggested_type}
                    </span>
                  )}
                </div>
              </div>

              {/* Short Historical & Architectural Explanation */}
              <div className="mt-4 rounded-xl bg-amber-50/50 border border-amber-200/80 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  🏛️ Short Explanation & Historical Significance
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-800">{analysis.summary}</p>
              </div>

              {/* Detected Text, English Translation, and Hindi Translation Grid */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {analysis.extracted_text && (
                  <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
                    <p className="text-[11px] font-bold uppercase text-stone-600">📜 Detected Inscription / Text</p>
                    <p className="mt-2 text-xs leading-relaxed text-stone-900 whitespace-pre-wrap font-serif">
                      {analysis.extracted_text}
                    </p>
                  </div>
                )}
                {analysis.translated_text && (
                  <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase text-amber-800">🇬🇧 English Translation</p>
                    <p className="mt-2 text-xs leading-relaxed text-stone-800 whitespace-pre-wrap">
                      {analysis.translated_text}
                    </p>
                  </div>
                )}
                {analysis.hindi_translation && (
                  <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase text-emerald-800">🇮🇳 Hindi Translation (हिंदी अनुवाद)</p>
                    <p className="mt-2 text-xs leading-relaxed text-stone-800 whitespace-pre-wrap font-serif">
                      {analysis.hindi_translation}
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
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <input
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-amber-600 focus:ring-2 shadow-2xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchArchive()}
            placeholder="Search concepts e.g. hanging pillar, water reservoir, castor oil..."
          />
          <button
            onClick={searchArchive}
            disabled={isSearching}
            className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
          >
            {isSearching ? "Searching..." : "Vector Search"}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {searchResults.map((result) => (
              <article key={result.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif font-bold text-stone-900 truncate">{result.file_name}</h4>
                  {result.relevance_percentage !== undefined && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      {result.relevance_percentage}% Match
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-stone-600 line-clamp-3">{result.summary || result.translated_text}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-10 text-center text-xs text-stone-400">
        <p className="font-serif text-sm font-semibold text-stone-800">Dharohar AI</p>
        <p className="mt-1">Preserving India’s cultural heritage through open-source AI & geospatial indexing.</p>
      </footer>

      {/* Lightweight Monocular 3D Spatial Viewer Modal */}
      {viewer3D.isOpen && (
        <Heritage3DViewer
          imageUrl={viewer3D.imageUrl}
          title={viewer3D.title}
          subtitle={viewer3D.subtitle}
          initialDepthMapUrl={viewer3D.initialDepthMapUrl}
          onClose={() => setViewer3D((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
    </main>
  );
}