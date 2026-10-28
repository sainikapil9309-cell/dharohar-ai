import urllib.request
import json
import os
import ssl

OUTPUT_DIR = r"C:\Users\Asus\OneDrive\Desktop\dharohar-ai-1\frontend\public\heritage"

TARGETS = [
    ("rani_ki_vav_present.jpg", "Rani_ki_Vav"),
    ("nirona_present.jpg", "Rogan_painting"),
    ("kinhal_present.jpg", "Kinnal_craft"),
]

headers = {
    "User-Agent": "DharoharHeritagePreservationBot/1.0 (educational research bot; contact: info@dharohar.ai)"
}
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for fname, title in TARGETS:
    out_path = os.path.join(OUTPUT_DIR, fname)
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=960"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            img_url = None
            for p_id, p_val in pages.items():
                if "thumbnail" in p_val:
                    img_url = p_val["thumbnail"]["source"]
                    break
                elif "original" in p_val:
                    img_url = p_val["original"]["source"]
                    break

            if img_url:
                print(f"Downloading {title} -> {fname} from {img_url}")
                img_req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(img_req, context=ctx, timeout=15) as img_resp:
                    with open(out_path, "wb") as f:
                        f.write(img_resp.read())
                print(f"Saved: {fname} ({os.path.getsize(out_path)} bytes)")
            else:
                print(f"No thumbnail found for {title}")
    except Exception as e:
        print(f"Error fetching {title}: {e}")
