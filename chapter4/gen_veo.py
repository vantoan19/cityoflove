import os, sys, time, json, base64, urllib.request

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Set GEMINI_API_KEY in your environment.", file=sys.stderr)
    sys.exit(1)
MODEL       = "veo-3.1-fast-generate-preview"
INPUT_IMAGE = r"C:\Projects\city\chapter4\backgrounds\bg_restaurant_table.png"
OUTPUT_PATH = r"C:\Projects\city\chapter4\backgrounds\bg_restaurant_table.mp4"
DURATION    = "8"
RESOLUTION  = "4k"

PROMPT = (
    "Animate this top-down colored pencil illustration of a cozy ramen restaurant table for two. "
    "Gentle wisps of steam rise continuously from both ramen bowls — soft, curling tendrils drifting upward slowly, "
    "each bowl with its own slightly different steam rhythm. "
    "The warm ambient restaurant lighting glows softly and breathes gently, creating a golden warmth across the wooden table surface "
    "that slowly pulses and shifts, making the whole scene feel alive and inviting. "
    "The overall atmosphere is cozy, warm, and intimate — like a perfect quiet dinner together. "
    "All motion is extremely subtle and slow. "
    "The overall illustrated style remains consistent throughout. "
    "The animation loops seamlessly."
)

BASE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:predictLongRunning"

with open(INPUT_IMAGE, "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

body = {
    "instances": [{
        "prompt": PROMPT,
        "image": {"bytesBase64Encoded": img_b64, "mimeType": "image/png"}
    }],
    "parameters": {
        "aspectRatio": "16:9",
        "durationSeconds": int(DURATION),
        "resolution": RESOLUTION,
        "sampleCount": 1,
    }
}

print(f"Submitting to Veo ({MODEL}, {RESOLUTION}, {DURATION}s)...")
req = urllib.request.Request(
    BASE_URL,
    data=json.dumps(body).encode(),
    headers={"x-goog-api-key": API_KEY, "Content-Type": "application/json"},
    method="POST"
)
try:
    with urllib.request.urlopen(req) as r:
        op = json.loads(r.read())
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode())
    sys.exit(1)

op_name = op.get("name", "")
print(f"Operation: {op_name}")

poll_url = f"https://generativelanguage.googleapis.com/v1beta/{op_name}"
attempt = 0
while True:
    attempt += 1
    time.sleep(10)
    req2 = urllib.request.Request(poll_url, headers={"x-goog-api-key": API_KEY}, method="GET")
    with urllib.request.urlopen(req2) as r:
        status = json.loads(r.read())
    if status.get("done"):
        break
    elapsed = attempt * 10
    print(f"  [{elapsed}s] generating...")
    if attempt >= 42:
        print("Timed out after 7 minutes.")
        sys.exit(1)

try:
    samples = status["response"]["generateVideoResponse"]["generatedSamples"]
    video_uri = samples[0]["video"]["uri"]
except (KeyError, IndexError):
    print("Unexpected response structure:", json.dumps(status, indent=2))
    sys.exit(1)

print(f"Downloading to {OUTPUT_PATH} ...")
dl_req = urllib.request.Request(video_uri, headers={"x-goog-api-key": API_KEY}, method="GET")
with urllib.request.urlopen(dl_req) as r, open(OUTPUT_PATH, "wb") as out:
    out.write(r.read())

size_mb = os.path.getsize(OUTPUT_PATH) / 1024 / 1024
print(f"\nDone! {OUTPUT_PATH} ({size_mb:.1f} MB)")
