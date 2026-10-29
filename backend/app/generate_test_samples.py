import os
from PIL import Image, ImageDraw, ImageFont
import fitz # PyMuPDF

OUTPUT_DIR = r"C:\Users\Asus\OneDrive\Desktop\dharohar-ai-1\test_samples"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size=28, devanagari=False):
    if devanagari:
        for p in [r"C:\Windows\Fonts\Nirmala.ttc", r"C:\Windows\Fonts\nirmalab.ttf", r"C:\Windows\Fonts\mangal.ttf"]:
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size, index=0)
                except Exception:
                    pass
    for p in [r"C:\Windows\Fonts\arialbd.ttf", r"C:\Windows\Fonts\arial.ttf", r"C:\Windows\Fonts\calibrib.ttf"]:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def get_pdf_devanagari_font(page):
    p = r"C:\Windows\Fonts\Nirmala.ttc"
    if os.path.exists(p):
        try:
            f = fitz.Font(fontfile=p)
            page.insert_font(fontname="nirmala", fontbuffer=f.buffer)
            return "nirmala"
        except Exception:
            pass
    return "helv"

# 1. Sample 1: Rani Ki Vav Stepwell (PNG & PDF)
def create_sample_1():
    # PNG Image
    img = Image.new("RGB", (1000, 720), color="#FAF6EE")
    draw = ImageDraw.Draw(img)
    draw.rectangle([(25, 25), (975, 695)], outline="#5C3D2E", width=5)
    draw.rectangle([(35, 35), (965, 685)], outline="#8B5E3C", width=2)
    
    title_font = get_font(size=26, devanagari=False)
    body_font = get_font(size=20, devanagari=False)
    
    draw.text((65, 55), "ARCHAEOLOGICAL SURVEY OF INDIA - EPIGRAPHICAL RECORD", fill="#7A2E10", font=title_font)
    draw.line([(65, 95), (935, 95)], fill="#5C3D2E", width=3)
    
    lines = [
        "SITE: RANI KI VAV (QUEEN'S STEPWELL), PATAN, GUJARAT",
        "INSCRIPTION TYPE: Solanki Dynasty Memorial & Water Consecration Record",
        "COORDINATES: 23.8493 N, 72.1012 E | PERIOD: 11th Century CE (Chaulukya Dynasty)",
        "ROYAL PATRON: Queen Udayamati in sacred remembrance of King Bhima I",
        "ARCHITECTURAL STYLE: Maru-Gurjara Inverted Temple with 7 Subterranean Terraces",
        "SCULPTURAL WEALTH: Over 500 principal sculptures featuring Sheshashayi Vishnu",
        "HYDRAULIC FUNCTION: Subterranean stepwell, cascading silt cisterns and fresh aquifers",
        "HISTORICAL EPIGRAPH: 'Devanagari charter consecrated for the welfare of all living beings.'",
        "CONSERVATION STATUS: UNESCO World Heritage Site | Classification: Stepwell"
    ]
    y = 125
    for l in lines:
        draw.text((65, y), f"•  {l}", fill="#2C1810", font=body_font)
        y += 55
        
    out_png = os.path.join(OUTPUT_DIR, "01_Rani_Ki_Vav_Stepwell_Plaque.png")
    img.save(out_png, quality=95)
    print(f"Created: {out_png}")

    # PDF Document
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    dev_fn = get_pdf_devanagari_font(page)
    page.draw_rect(fitz.Rect(30, 30, 582, 762), color=(0.4, 0.2, 0.1), width=2.5)
    page.insert_text(fitz.Point(55, 75), "ARCHAEOLOGICAL SURVEY OF INDIA - WESTERN EPIGRAPHY", fontsize=12, color=(0.5, 0.2, 0.0))
    page.insert_text(fitz.Point(55, 95), "EPIGRAPHICAL RECORD: RANI KI VAV (QUEEN'S STEPWELL)", fontsize=14, color=(0.1, 0.1, 0.1))
    page.draw_line(fitz.Point(55, 105), fitz.Point(557, 105), color=(0.4, 0.2, 0.1), width=2)
    
    page.insert_text(fitz.Point(55, 130), "ORIGINAL DEVANAGARI EPIGRAPH & CONSECRATION:", fontsize=11, color=(0.6, 0.3, 0.0))
    page.insert_text(fitz.Point(55, 150), "श्री सोमेश्वर महादेव मंदिर एवं वापी प्रशस्ति", fontname=dev_fn, fontsize=12, color=(0.1, 0.05, 0.0))
    page.insert_text(fitz.Point(55, 170), "संवत् १०६३ चैत्र मासे रानी उदयनती निर्मित वापी जलमंदिरम्।", fontname=dev_fn, fontsize=12, color=(0.1, 0.05, 0.0))
    page.insert_text(fitz.Point(55, 190), "सप्तभूमि जलवापी स्थापत्य कला पाटन गुर्जर प्रदेशे।", fontname=dev_fn, fontsize=12, color=(0.1, 0.05, 0.0))
    page.insert_text(fitz.Point(55, 210), "दशावतार विष्णु मूर्तयः पाषाण शिलासु उत्कीर्णाः।", fontname=dev_fn, fontsize=12, color=(0.1, 0.05, 0.0))
    page.insert_text(fitz.Point(55, 230), "धर्मो रक्षति रक्षितः। सर्वे भवन्तु सुखिनः।", fontname=dev_fn, fontsize=12, color=(0.1, 0.05, 0.0))
    page.draw_line(fitz.Point(55, 245), fitz.Point(557, 245), color=(0.8, 0.8, 0.8), width=1)

    pdf_text = (
        "ARCHIVAL FIELD SPECIFICATIONS:\n"
        "--------------------------------------------------------------------------------\n"
        "Monument Name: Rani Ki Vav (Subterranean Stepwell)\n"
        "Location: Patan, Patan District, Gujarat, India\n"
        "Coordinates: Latitude 23.8493 N, Longitude 72.1012 E\n"
        "Patron: Queen Udayamati of the Chaulukya / Solanki Dynasty\n"
        "Architecture: 7 levels of stairs and sculptural pavilions descending to water level\n"
        "Significance: Masterpiece of hydraulic technology and subterranean temple art\n"
        "Preservation Status: UNESCO World Heritage Site & Protected Monument of National Importance."
    )
    page.insert_text(fitz.Point(55, 265), pdf_text, fontsize=10.5, color=(0.15, 0.1, 0.05))
    out_pdf = os.path.join(OUTPUT_DIR, "01_Rani_Ki_Vav_Stepwell_Plaque.pdf")
    doc.save(out_pdf)
    doc.close()
    print(f"Created: {out_pdf}")


# 2. Sample 2: Dholavira Harappan Water Reservoirs (JPG & PDF)
def create_sample_2():
    img = Image.new("RGB", (1000, 680), color="#F4F1DE")
    draw = ImageDraw.Draw(img)
    draw.rectangle([(25, 25), (975, 655)], outline="#1D3557", width=5)
    draw.rectangle([(35, 35), (965, 645)], outline="#457B9D", width=2)
    
    font_title = get_font(size=26, devanagari=False)
    font_body = get_font(size=20, devanagari=False)
    
    draw.text((65, 55), "ARCHAEOLOGICAL SURVEY FIELD RECORD - DHOLAVIRA", fill="#E63946", font=font_title)
    draw.line([(65, 95), (935, 95)], fill="#1D3557", width=3)
    
    details = [
        "CIVILISATION: Indus Valley / Harappan Civilization (3000 BCE - 1500 BCE)",
        "LOCATION: Khadir Island, Great Rann of Kutch, Gujarat (23.8863 N, 70.2133 E)",
        "MONUMENT TYPE: Ancient archaeological metropolis, citadel and fortified settlement",
        "HYDRAULIC ARCHITECTURE: 16 interconnected rock-cut stone water reservoirs and dams",
        "EPIGRAPHIC DISCOVERY: Celebrated 10-symbol giant Harappan Signboard Inscription",
        "URBAN ZONING: Tripartite layout with Citadel, Middle Town, and Lower Town",
        "CONSERVATION MANDATE: Digital hydrological GIS mapping and Harappan script archiving",
        "UNESCO STATUS: World Heritage Site (Inscribed 2021) | Category: Harappan Water Reservoir"
    ]
    y = 125
    for d in details:
        draw.text((65, y), f"•  {d}", fill="#1D3557", font=font_body)
        y += 55
        
    out_jpg = os.path.join(OUTPUT_DIR, "02_Dholavira_Harappan_Field_Scan.jpg")
    img.save(out_jpg, quality=95)
    print(f"Created: {out_jpg}")

    # PDF Document
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    page.draw_rect(fitz.Rect(30, 30, 582, 762), color=(0.1, 0.2, 0.35), width=2.5)
    page.insert_text(fitz.Point(55, 75), "ARCHAEOLOGICAL SURVEY OF INDIA - PREHISTORIC EXCAVATION", fontsize=12, color=(0.8, 0.2, 0.1))
    page.insert_text(fitz.Point(55, 95), "FIELD MONOGRAPH: DHOLAVIRA (KOTADA TIMBA), KUTCH", fontsize=14, color=(0.1, 0.1, 0.1))
    page.draw_line(fitz.Point(55, 105), fitz.Point(557, 105), color=(0.1, 0.2, 0.35), width=2)
    
    pdf_text = (
        "ARCHAEOLOGICAL SITE REPORT:\n"
        "--------------------------------------------------------------------------------\n"
        "Site Name: Dholavira (Ancient Harappan Port Metropolis)\n"
        "Geographical Coordinates: 23.8863 N, 70.2133 E\n"
        "Civilisational Period: Mature Harappan (3000 BCE - 1500 BCE)\n"
        "Hydrological Engineering: Ingenious water harvesting system comprised of\n"
        "16 stone-cut cascading reservoirs capable of storing 250,000 cubic metres of water\n"
        "to sustain life in the arid Rann of Kutch.\n\n"
        "Epigraphical Highlights: The Dholavira Signboard discovered at the northern\n"
        "gateway of the citadel, featuring 10 large Indus script characters carved\n"
        "out of crystalline gypsum.\n\n"
        "Classification: Harappan, Indus Valley, water reservoir, Dholavira, Gujarat.\n"
        "Status: UNESCO World Heritage Site."
    )
    page.insert_text(fitz.Point(55, 130), pdf_text, fontsize=11, color=(0.1, 0.15, 0.2))
    out_pdf = os.path.join(OUTPUT_DIR, "02_Dholavira_Harappan_Field_Scan.pdf")
    doc.save(out_pdf)
    doc.close()
    print(f"Created: {out_pdf}")


# 3. Sample 3: Hampi Stone Chariot & Vitthala Temple Edict (PDF & PNG)
def create_sample_3():
    out_file = os.path.join(OUTPUT_DIR, "03_Hampi_Stone_Chariot_Edict.pdf")
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    page.draw_rect(fitz.Rect(30, 30, 582, 762), color=(0.55, 0.27, 0.07), width=3)
    page.draw_rect(fitz.Rect(38, 38, 574, 754), color=(0.85, 0.65, 0.13), width=1)
    
    page.insert_text(fitz.Point(55, 75), "EPIGRAPHIA INDICA - VIJAYANAGARA SURVEY", fontsize=12, color=(0.55, 0.27, 0.07))
    page.insert_text(fitz.Point(55, 95), "HISTORICAL CHARTER OF VITTHALA TEMPLE & STONE CHARIOT", fontsize=14, color=(0.1, 0.1, 0.1))
    page.draw_line(fitz.Point(55, 105), fitz.Point(557, 105), color=(0.55, 0.27, 0.07), width=2)
    
    text = (
        "ARCHAEOLOGICAL SPECIFICATIONS & EPIGRAPHICAL NOTES:\n"
        "--------------------------------------------------------------------------------\n"
        "Monument Name: Vitthala Temple Complex & Monolithic Stone Chariot\n"
        "Location: Hampi, Vijayanagara District, Karnataka, India\n"
        "Geographic Coordinates: 15.3145 N, 76.4600 E\n"
        "Historical Era: 16th Century CE (King Krishnadevaraya Reign, 1509-1529 CE)\n"
        "Dynasty: Tuluva Dynasty of the Vijayanagara Empire\n\n"
        "Architectural & Sculptural Features:\n"
        "• Monolithic Stone Chariot (Garuda Shrine) carved from granite blocks.\n"
        "• Maha Mandapa featuring 56 acoustic musical pillars that vibrate with notes.\n"
        "• Monumental Virupaksha Temple 50-metre Gopuram on Tungabhadra River.\n"
        "• Sprawling boulder landscape and royal enclosure pavilions.\n\n"
        "Epigraph Contents:\n"
        "This charter commemorates the royal victory of Emperor Krishnadevaraya\n"
        "and details donations of gold, gems, and revenue lands to the priests\n"
        "of the Vitthala and Virupaksha shrines for perpetual prayers and water upkeep.\n\n"
        "Preservation Status & Tags:\n"
        "UNESCO World Heritage Site since 1986.\n"
        "Tags: Vijayanagara, Hampi, Stone Chariot, Vitthala, Temple, Dravidian."
    )
    page.insert_text(fitz.Point(55, 130), text, fontsize=11, color=(0.1, 0.05, 0.0))
    doc.save(out_file)
    doc.close()
    print(f"Created: {out_file}")


# 4. Sample 4: Lepakshi Veerabhadra Temple Hanging Pillar (PDF)
def create_sample_4():
    out_file = os.path.join(OUTPUT_DIR, "04_Lepakshi_Veerabhadra_Hanging_Pillar.pdf")
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    page.draw_rect(fitz.Rect(30, 30, 582, 762), color=(0.2, 0.4, 0.2), width=3)
    page.draw_rect(fitz.Rect(38, 38, 574, 754), color=(0.4, 0.6, 0.4), width=1)
    
    page.insert_text(fitz.Point(55, 75), "ARCHAEOLOGICAL RECORD - LEPAKSHI VEERABHADRA TEMPLE", fontsize=12, color=(0.1, 0.4, 0.1))
    page.insert_text(fitz.Point(55, 95), "CENTRAL EPIGRAPHY & MONUMENT CONSERVATION REPORT", fontsize=14, color=(0.1, 0.1, 0.1))
    page.draw_line(fitz.Point(55, 105), fitz.Point(557, 105), color=(0.2, 0.4, 0.2), width=2)
    
    text = (
        "ARCHAEOLOGICAL SPECIFICATIONS:\n"
        "--------------------------------------------------------------------------------\n"
        "Monument: Veerabhadra Temple & Hanging Pillar Complex\n"
        "Location: Sri Sathya Sai District, Andhra Pradesh, India\n"
        "Coordinates: Latitude 13.8000 N, Longitude 77.6060 E\n"
        "Construction Period: 1530-1540 CE\n"
        "Patron: Virupanna Nayaka & Viranna (Emperor Achyuta Deva Raya)\n\n"
        "Key Architectural Wonders:\n"
        "1. The Hanging Pillar: Gravity-defying granite pillar of the Natya Mandapa\n"
        "   that remains suspended with no contact with the temple floor.\n"
        "2. Monolithic Nandi: India's largest monolithic bull carved from a single\n"
        "   granite boulder (4.5 m high, 8.2 m long).\n"
        "3. Nagalinga: Colossal seven-hooded granite cobra sheltering a black Shivalingam.\n"
        "4. Ceiling Frescoes: Vast 16th-century mineral murals portraying epics.\n\n"
        "Significance & Categorisation:\n"
        "Monument of National Importance under Archaeological Survey of India (ASI).\n"
        "Classification: Temple, Hanging Pillar, Vijayanagara, Veerabhadra, Frescoes."
    )
    page.insert_text(fitz.Point(55, 130), text, fontsize=11, color=(0.05, 0.1, 0.05))
    doc.save(out_file)
    doc.close()
    print(f"Created: {out_file}")


# 5. Sample 5: Sri Harmandir Sahib / Golden Temple (PNG & PDF)
def create_sample_5():
    # PNG Image
    img = Image.new("RGB", (1000, 720), color="#FFFCF2")
    draw = ImageDraw.Draw(img)
    draw.rectangle([(25, 25), (975, 695)], outline="#B8860B", width=5)
    draw.rectangle([(35, 35), (965, 685)], outline="#DAA520", width=2)
    
    font_title = get_font(size=26, devanagari=False)
    font_body = get_font(size=20, devanagari=False)
    
    draw.text((65, 55), "SRI HARMANDIR SAHIB (THE GOLDEN TEMPLE) ARCHIVE", fill="#7A5200", font=font_title)
    draw.line([(65, 95), (935, 95)], fill="#B8860B", width=3)
    
    lines = [
        "LOCATION: Golden Temple Road, Amritsar, Punjab (31.6200 N, 74.8765 E)",
        "FOUNDATION CHARTER: 1588 CE - Consecrated by Fifth Sikh Guru, Guru Arjan Dev Ji",
        "COMPLETION & ADI GRANTH: 1604 CE - Installation of the sacred holy scripture",
        "SACRED LAKE: Surrounded by the sacred Amrit Sarovar (Nectar Pool) water body",
        "ARCHITECTURE: Synthesis of Sikh architectural traditions and regional styles",
        "GOLD COVERING: Adorned with pure gold foil copper panels by Maharaja Ranjit Singh",
        "UNIVERSAL LANGAR: 24/7 community kitchen feeding 100,000+ daily visitors of all faiths",
        "SPIRITUAL VALUE: Holiest shrine of Sikhism | Category: Sacred Gurudwara, Amritsar"
    ]
    y = 125
    for l in lines:
        draw.text((65, y), f"•  {l}", fill="#2C1D02", font=font_body)
        y += 55
        
    out_png = os.path.join(OUTPUT_DIR, "05_Golden_Temple_Historical_Charter.png")
    img.save(out_png, quality=95)
    print(f"Created: {out_png}")

    # PDF Document
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    dev_fn = get_pdf_devanagari_font(page)
    page.draw_rect(fitz.Rect(30, 30, 582, 762), color=(0.7, 0.5, 0.0), width=2.5)
    page.insert_text(fitz.Point(55, 75), "HISTORICAL ARCHIVE - PUNJAB HERITAGE RECORD", fontsize=12, color=(0.6, 0.4, 0.0))
    page.insert_text(fitz.Point(55, 95), "SRI HARMANDIR SAHIB (THE GOLDEN TEMPLE) FOUNDATION", fontsize=14, color=(0.1, 0.1, 0.1))
    page.draw_line(fitz.Point(55, 105), fitz.Point(557, 105), color=(0.7, 0.5, 0.0), width=2)
    
    page.insert_text(fitz.Point(55, 130), "SACRED HISTORICAL CHRONICLES (DEVANAGARI EPIGRAPH):", fontsize=11, color=(0.6, 0.4, 0.0))
    page.insert_text(fitz.Point(55, 150), "सचखंड श्री हरमंदिर साहिब (स्वर्ण मंदिर) - अमृतसर", fontname=dev_fn, fontsize=12, color=(0.15, 0.1, 0.0))
    page.insert_text(fitz.Point(55, 170), "शिलान्यास: १५८८ ईस्वी - संत हज़रत मियां मीर जी द्वारा पवित्र नींव।", fontname=dev_fn, fontsize=12, color=(0.15, 0.1, 0.0))
    page.insert_text(fitz.Point(55, 190), "मंदिर निर्माण: १६०४ ईस्वी में पंचम गुरु श्री गुरु अर्जुन देव जी द्वारा पूर्ण।", fontname=dev_fn, fontsize=12, color=(0.15, 0.1, 0.0))
    page.insert_text(fitz.Point(55, 210), "आदि ग्रंथ साहिब: १६०४ ईस्वी में हरमंदिर साहिब में प्रथम पावन प्रकाश।", fontname=dev_fn, fontsize=12, color=(0.15, 0.1, 0.0))
    page.insert_text(fitz.Point(55, 230), "स्वर्ण पत्र: महाराजा रणजीत सिंह जी द्वारा शुद्ध स्वर्ण आवरण लगाया गया।", fontname=dev_fn, fontsize=12, color=(0.15, 0.1, 0.0))
    page.draw_line(fitz.Point(55, 245), fitz.Point(557, 245), color=(0.85, 0.8, 0.7), width=1)

    pdf_text = (
        "ARCHIVAL FIELD SPECIFICATIONS:\n"
        "--------------------------------------------------------------------------------\n"
        "Monument Name: Sri Harmandir Sahib (The Golden Temple)\n"
        "Location: Amritsar, Punjab, India (Coordinates: 31.6200 N, 74.8765 E)\n"
        "Founders: Fourth and Fifth Sikh Gurus (Guru Ram Das Ji & Guru Arjan Dev Ji)\n"
        "Key Feature: Four open entrances symbolizing welcome to all four varnas and faiths\n"
        "Sacred Pool: The Amrit Sarovar (Nectar Pool) excavated in 1577 CE\n"
        "Preservation Mandate: Digital Sikh epigraphy and oral history preservation."
    )
    page.insert_text(fitz.Point(55, 265), pdf_text, fontsize=10.5, color=(0.15, 0.1, 0.0))
    out_pdf = os.path.join(OUTPUT_DIR, "05_Golden_Temple_Historical_Charter.pdf")
    doc.save(out_pdf)
    doc.close()
    print(f"Created: {out_pdf}")


# 6. Sample 6: King Naha Water Sanctuary (PNG & PDF)
def create_sample_6():
    # PDF Document
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    dev_fn = get_pdf_devanagari_font(page)
    page.draw_rect(fitz.Rect(30, 30, 582, 762), color=(0.55, 0.27, 0.07), width=3)
    page.draw_rect(fitz.Rect(38, 38, 574, 754), color=(0.85, 0.65, 0.13), width=1)

    page.insert_text(fitz.Point(55, 75), "ARCHAEOLOGICAL SURVEY OF INDIA - EPIGRAPHICAL BRANCH", fontsize=12, color=(0.5, 0.2, 0.0))
    page.insert_text(fitz.Point(55, 95), "ROYAL DEDICATORY INSCRIPTION & WATER SANCTUARY CONSECRATION", fontsize=14, color=(0.1, 0.1, 0.1))
    page.draw_line(fitz.Point(55, 105), fitz.Point(557, 105), color=(0.55, 0.27, 0.07), width=2)

    page.insert_text(fitz.Point(55, 130), "HISTORICAL INSCRIPTION (ORIGINAL DEVANAGARI EPIGRAPH):", fontsize=11, color=(0.6, 0.3, 0.0))
    page.insert_text(fitz.Point(55, 155), "हे समृद्ध राजा नह, आपने अपने लोगों के लाभ", fontname=dev_fn, fontsize=13, color=(0.1, 0.1, 0.1))
    page.insert_text(fitz.Point(55, 180), "और पूरी दुनिया के कल्याण के लिए पानी का यह स्थान बनाया है।", fontname=dev_fn, fontsize=13, color=(0.1, 0.1, 0.1))

    page.draw_line(fitz.Point(55, 200), fitz.Point(557, 200), color=(0.8, 0.8, 0.8), width=1)

    desc = (
        "ARCHIVAL METADATA & FIELD SURVEY NOTES\n"
        "--------------------------------------------------------------------------------\n"
        "Monument Typology: Royal Subterranean Stepwell & Civic Water Reservoir (Vav)\n"
        "Associated Site: Rani Ki Vav / Western Indic Stepwell Network\n"
        "Geographical Coordinates: 23.8493 N, 72.1012 E\n"
        "Patronage: Royal Sovereign Dedication for Universal Welfare and Water Ecology\n"
        "Hydraulic Architecture: Cascading stepped cisterns with rainwater harvesting aquifers\n"
        "Conservation Mandate: Digital epigraphy documentation & semantic heritage archiving\n"
        "ASI Epigraph Classification: Solanki / Chaulukya Dynasty Consecration Record\n"
        "Preservation Status: Ancient Monument of National Importance"
    )
    page.insert_text(fitz.Point(55, 225), desc, fontsize=10.5, color=(0.15, 0.15, 0.15))
    out_pdf = os.path.join(OUTPUT_DIR, "06_King_Naha_Water_Sanctuary_Inscription.pdf")
    doc.save(out_pdf)
    doc.close()
    print(f"Created: {out_pdf}")

    # PNG Image
    img = Image.new("RGB", (1000, 720), color="#FAF6EE")
    draw = ImageDraw.Draw(img)
    draw.rectangle([(25, 25), (975, 695)], outline="#5C3D2E", width=5)
    draw.rectangle([(35, 35), (965, 685)], outline="#8B5E3C", width=2)
    
    font_title = get_font(size=26, devanagari=False)
    font_body = get_font(size=20, devanagari=False)
    
    draw.text((65, 55), "EPIGRAPHICAL RECORD - ROYAL WATER SANCTUARY DEDICATION", fill="#7A2E10", font=font_title)
    draw.line([(65, 95), (935, 95)], fill="#5C3D2E", width=3)
    
    lines = [
        "INSCRIPTION SITE: Western Indic Stepwell & Royal Reservoir Complex",
        "COORDINATES: 23.8493 N, 72.1012 E | REGION: Solanki / Chaulukya Stepwell Network",
        "ORIGINAL EPIGRAPH: 'हे समृद्ध राजा नह, आपने अपने लोगों के लाभ और पूरी दुनिया के कल्याण के लिए पानी का यह स्थान बनाया है।'",
        "TRANSLATION: 'O prosperous King Naha, you have created this water sanctuary for the benefit of your people and the welfare of the whole world.'",
        "TYPOLOGY: Subterranean stepwell (Vav), stepped water tank and public aquifer",
        "HISTORICAL MOTIF: Royal consecration of water resources for community welfare",
        "AI CAPABILITIES: Devanagari epigraphy extraction, English translation, semantic search",
        "CLASSIFICATION: Stepwell, Devanagari Inscription, Sacred Water Architecture"
    ]
    y = 125
    for l in lines:
        draw.text((65, y), f"•  {l}", fill="#2C1810", font=font_body)
        y += 55
        
    out_png = os.path.join(OUTPUT_DIR, "06_King_Naha_Water_Sanctuary_Inscription.png")
    img.save(out_png, quality=95)
    print(f"Created: {out_png}")


if __name__ == "__main__":
    create_sample_1()
    create_sample_2()
    create_sample_3()
    create_sample_4()
    create_sample_5()
    create_sample_6()
    print("All test samples successfully generated in test_samples directory!")
