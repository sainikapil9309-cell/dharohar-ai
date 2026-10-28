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

# 1. Sample 1: Rani Ki Vav (Stepwell & Devanagari)
def create_sample_1():
    img = Image.new("RGB", (1000, 680), color="#FAF6EE") # Clean stone off-white
    draw = ImageDraw.Draw(img)
    
    # Outer etched border
    draw.rectangle([(25, 25), (975, 655)], outline="#5C3D2E", width=5)
    draw.rectangle([(35, 35), (965, 645)], outline="#8B5E3C", width=2)
    
    title_font = get_font(size=30, devanagari=True)
    body_font = get_font(size=24, devanagari=True)
    en_title = get_font(size=26, devanagari=False)
    en_body = get_font(size=22, devanagari=False)
    
    draw.text((70, 60), "श्री सोमेश्वर महादेव मंदिर एवं वापी प्रशस्ति", fill="#2C1810", font=title_font)
    draw.line([(70, 105), (930, 105)], fill="#5C3D2E", width=3)
    
    draw.text((70, 125), "संवत् १०६३ चैत्र मासे रानी उदयनती निर्मित वापी जलमंदिरम्।", fill="#1C1008", font=body_font)
    draw.text((70, 175), "सप्तभूमि जलवापी स्थापत्य कला पाटन गुर्जर प्रदेशे।", fill="#1C1008", font=body_font)
    draw.text((70, 225), "दशावतार विष्णु मूर्तयः पाषाण शिलासु उत्कीर्णाः।", fill="#1C1008", font=body_font)
    draw.text((70, 275), "धर्मो रक्षति रक्षितः। सर्वे भवन्तु सुखिनः।", fill="#1C1008", font=body_font)
    
    draw.line([(70, 335), (930, 335)], fill="#B08968", width=2)
    
    draw.text((70, 360), "RANI KI VAV - SUBTERRANEAN STEPWELL INSCRIPTION", fill="#7A2E10", font=en_title)
    draw.text((70, 410), "Location: Patan, Gujarat, India (Coordinates: 23.8493 N, 72.1012 E)", fill="#2C1810", font=en_body)
    draw.text((70, 455), "Patron: Queen Udayamati in memory of King Bhima I (Solanki Dynasty)", fill="#2C1810", font=en_body)
    draw.text((70, 500), "Architecture: Maru-Gurjara style inverted temple with 7 sculptural levels", fill="#2C1810", font=en_body)
    draw.text((70, 545), "Purpose: Water conservation, stepwell reservoirs and Dashavatara pilgrimage", fill="#2C1810", font=en_body)
    draw.text((70, 590), "Status: UNESCO World Heritage Site | Category: Stepwell Water Architecture", fill="#1E4620", font=en_body)
    
    out_file = os.path.join(OUTPUT_DIR, "01_Rani_Ki_Vav_Stepwell_Plaque.png")
    img.save(out_file, quality=95)
    print(f"Created: {out_file}")

# 2. Sample 2: Dholavira (Harappan Water Reservoirs)
def create_sample_2():
    img = Image.new("RGB", (1000, 650), color="#F4F1DE")
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([(25, 25), (975, 625)], outline="#1D3557", width=5)
    draw.rectangle([(35, 35), (965, 615)], outline="#457B9D", width=2)
    
    font_title = get_font(size=28, devanagari=False)
    font_body = get_font(size=22, devanagari=False)
    
    draw.text((65, 60), "ARCHAEOLOGICAL SURVEY FIELD RECORD - DHOLAVIRA", fill="#E63946", font=font_title)
    draw.line([(65, 105), (935, 105)], fill="#1D3557", width=3)
    
    details = [
        "Civilisation: Indus Valley / Harappan Civilization (3000 BCE - 1500 BCE)",
        "Location: Khadir Island, Great Rann of Kutch, Gujarat (23.8863 N, 70.2133 E)",
        "Monument Type: Ancient archaeological metropolis and fortified city",
        "Hydraulic Engineering: 16 interconnected rock-cut stone water reservoirs",
        "Epigraphic Discovery: Famous ten-symbol giant Harappan Signboard inscription",
        "Urban Planning: Monumental Citadel, Middle Town, and Lower Town ramparts",
        "Preservation Goal: Digital hydrological mapping & Harappan script archiving",
        "UNESCO Status: World Heritage Site inscribed in 2021",
        "Classification: Harappan, Indus Valley, water reservoir, Dholavira"
    ]
    
    y = 130
    for d in details:
        draw.text((65, y), f"•  {d}", fill="#1D3557", font=font_body)
        y += 50
        
    out_file = os.path.join(OUTPUT_DIR, "02_Dholavira_Harappan_Field_Scan.jpg")
    img.save(out_file, quality=95)
    print(f"Created: {out_file}")

# 3. Sample 3: Hampi (Stone Chariot & Vitthala Temple Edict - PDF)
def create_sample_3():
    out_file = os.path.join(OUTPUT_DIR, "03_Hampi_Stone_Chariot_Edict.pdf")
    doc = fitz.open()
    page = doc.new_page(width=612, height=792) # Standard Letter
    
    rect = fitz.Rect(30, 30, 582, 762)
    page.draw_rect(rect, color=(0.6, 0.3, 0.1), width=2)
    
    text = (
        "EPIGRAPHIA INDICA - VIJAYANAGARA SURVEY\n"
        "HISTORICAL CHARTER OF VITTHALA TEMPLE\n"
        "==========================================================\n\n"
        "Monument Name: Vitthala Temple Complex & Monolithic Stone Chariot\n"
        "Location: Hampi, Vijayanagara District, Karnataka, India\n"
        "Geographic Coordinates: 15.3145 N, 76.4600 E\n"
        "Historical Era: 16th Century CE (King Krishnadevaraya Reign, 1509-1529)\n"
        "Dynasty: Tuluva Dynasty of the Vijayanagara Empire\n\n"
        "Architectural & Sculptural Specifications:\n"
        "• Monolithic Stone Chariot (Garuda Shrine) carved from granite.\n"
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
    
    page.insert_text(fitz.Point(55, 70), text, fontsize=12.5, color=(0.1, 0.05, 0.0))
    doc.save(out_file)
    doc.close()
    print(f"Created: {out_file}")

# 4. Sample 4: Lepakshi Veerabhadra Hanging Pillar (PDF)
def create_sample_4():
    out_file = os.path.join(OUTPUT_DIR, "04_Lepakshi_Veerabhadra_Hanging_Pillar.pdf")
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    
    rect = fitz.Rect(30, 30, 582, 762)
    page.draw_rect(rect, color=(0.7, 0.4, 0.05), width=2)
    
    text = (
        "ARCHAEOLOGICAL RECORD - LEPAKSHI VEERABHADRA TEMPLE\n"
        "CENTRAL EPIGRAPHY & MONUMENT CONSERVATION REPORT\n"
        "==========================================================\n\n"
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
    
    page.insert_text(fitz.Point(55, 70), text, fontsize=12.5, color=(0.1, 0.05, 0.0))
    doc.save(out_file)
    doc.close()
    print(f"Created: {out_file}")

# 5. Sample 5: Sri Harmandir Sahib / Golden Temple (PNG)
def create_sample_5():
    img = Image.new("RGB", (1000, 680), color="#FFFCF2")
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([(25, 25), (975, 655)], outline="#B8860B", width=5)
    draw.rectangle([(35, 35), (965, 645)], outline="#DAA520", width=2)
    
    font_title = get_font(size=28, devanagari=True)
    font_body = get_font(size=22, devanagari=True)
    en_title = get_font(size=24, devanagari=False)
    en_body = get_font(size=20, devanagari=False)
    
    draw.text((65, 55), "सचखंड श्री हरमंदिर साहिब (स्वर्ण मंदिर) - अमृतसर", fill="#7A5200", font=font_title)
    draw.line([(65, 95), (935, 95)], fill="#B8860B", width=3)
    
    draw.text((65, 115), "शिलान्यास: १५८८ ईस्वी - संत हज़रत मियां मीर जी द्वारा पवित्र नींव।", fill="#2C1D02", font=font_body)
    draw.text((65, 160), "मंदिर निर्माण: १६०४ ईस्वी में पंचम गुरु श्री गुरु अर्जुन देव जी द्वारा पूर्ण।", fill="#2C1D02", font=font_body)
    draw.text((65, 205), "आदि ग्रंथ साहिब: १६०४ ईस्वी में हरमंदिर साहिब में प्रथम पावन प्रकाश।", fill="#2C1D02", font=font_body)
    draw.text((65, 250), "स्वर्ण पत्र: महाराजा रणजीत सिंह जी द्वारा शुद्ध स्वर्ण आवरण लगाया गया।", fill="#2C1D02", font=font_body)
    
    draw.line([(65, 305), (935, 305)], fill="#DAA520", width=2)
    
    draw.text((65, 330), "SRI HARMANDIR SAHIB (THE GOLDEN TEMPLE) ARCHIVE", fill="#7A5200", font=en_title)
    draw.text((65, 375), "Location: Golden Temple Road, Amritsar, Punjab (31.6200 N, 74.8765 E)", fill="#2C1D02", font=en_body)
    draw.text((65, 415), "Sacred Pool: Surrounded by the sacred holy Amrit Sarovar water body", fill="#2C1D02", font=en_body)
    draw.text((65, 455), "Architecture: Synthesis of Sikh architectural traditions and regional styles", fill="#2C1D02", font=en_body)
    draw.text((65, 495), "Universal Langar: 24/7 free community kitchen feeding all people equally", fill="#2C1D02", font=en_body)
    draw.text((65, 535), "Status: Holiest spiritual shrine of Sikhism & premier pilgrimage landmark", fill="#2C1D02", font=en_body)
    draw.text((65, 575), "Classification: Sacred Gurudwara, Harmandir, Golden Temple, Amritsar", fill="#184E18", font=en_body)
    
    out_file = os.path.join(OUTPUT_DIR, "05_Golden_Temple_Historical_Charter.png")
    img.save(out_file, quality=95)
    print(f"Created: {out_file}")

if __name__ == "__main__":
    create_sample_1()
    create_sample_2()
    create_sample_3()
    create_sample_4()
    create_sample_5()
    print("All 5 high-contrast test samples generated successfully!")
