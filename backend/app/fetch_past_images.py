import urllib.request
import json
import os
import ssl

OUTPUT_DIR = r"C:\Users\Asus\OneDrive\Desktop\dharohar-ai-1\frontend\public\heritage"

TARGETS = [
    ("rani_ki_vav_past.jpg", "Rani_ki_Vav"),
    ("dholavira_past.jpg", "Dholavira"),
    ("hampi_past.jpg", "Hampi"),
    ("badami_past.jpg", "Badami_cave_temples"),
    ("lepakshi_past.jpg", "Lepakshi"),
    ("gandikota_past.jpg", "Gandikota"),
    ("nirona_past.jpg", "Rogan_painting"),
    ("kinhal_past.jpg", "Kinnal_craft"),
    ("ajrakhpur_past.jpg", "Ajrak"),
]

headers = {
    "User-Agent": "DharoharHeritagePreservationBot/1.0 (educational research bot; contact: info@dharohar.ai)"
}
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for fname, title in TARGETS:
    out_path = os.path.join(OUTPUT_DIR, fname)
    # Get all images from the page
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=images&format=json"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            img_titles = []
            for p_id, p_val in pages.items():
                for im in p_val.get("images", []):
                    t = im.get("title", "")
                    if any(t.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png"]):
                        if not any(skip in t.lower() for skip in ["icon", "flag", "logo", "portal", "stub"]):
                            img_titles.append(t)
            
            print(f"{title} candidates: {len(img_titles)}")
            chosen = None
            if len(img_titles) > 1:
                # pick a second or third image that is not the main one
                chosen = img_titles[1]
            elif img_titles:
                chosen = img_titles[0]
            
            if chosen:
                info_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(chosen)}&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json"
                info_req = urllib.request.Request(info_url, headers=headers)
                with urllib.request.urlopen(info_req, context=ctx, timeout=10) as info_resp:
                    info_data = json.loads(info_resp.read().decode("utf-8"))
                    p2 = info_data.get("query", {}).get("pages", {})
                    for _, v2 in p2.items():
                        ii = v2.get("imageinfo", [{}])[0]
                        download_url = ii.get("thumburl") or ii.get("url")
                        if download_url:
                            print(f"Downloading {chosen} -> {fname}")
                            img_req = urllib.request.Request(download_url, headers=headers)
                            with urllib.request.urlopen(img_req, context=ctx, timeout=15) as dl:
                                with open(out_path, "wb") as f:
                                    f.write(dl.read())
                            print(f"Saved: {fname} ({os.path.getsize(out_path)} bytes)")
                            break
            else:
                # Fallback copy from present if no second image
                present_path = os.path.join(OUTPUT_DIR, fname.replace("_past.jpg", "_present.jpg"))
                if os.path.exists(present_path):
                    with open(present_path, "rb") as rf, open(out_path, "wb") as wf:
                        wf.write(rf.read())
                    print(f"Copied present to past for {fname}")
    except Exception as e:
        print(f"Error on {title}: {e}")
        present_path = os.path.join(OUTPUT_DIR, fname.replace("_past.jpg", "_present.jpg"))
        if os.path.exists(present_path):
            with open(present_path, "rb") as rf, open(out_path, "wb") as wf:
                wf.write(rf.read())
            print(f"Fallback copied present to past for {fname}")
