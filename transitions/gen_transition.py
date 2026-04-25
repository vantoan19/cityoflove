import os, sys, time, json, base64, urllib.request

API_KEY     = "AIzaSyDyFvFTuoBkeDU_AfSFYwkubgKsKPdCqYA"
MODEL       = "veo-3.1-fast-generate-preview"
INPUT_IMAGE = r"C:\Projects\city\transitions\ref_004.png"
OUTPUT_PATH = r"C:\Projects\city\transitions\ch2_to_ch3_hd.mp4"
DURATION    = 4  # keeping 4s but prompting faster motion
# No resolution param = default 720p HD for quick test

PROMPT = (
    "Copy this exact cloud wipe transition animation but in pastel pink and white colors instead of blue. "
    "The animation has the same structure as the reference: "
    "two passes of large stacked circular bubble cloud shapes sweeping from the RIGHT side of the screen to the LEFT. "
    "First pass: two columns of large round pastel pink cloud bubbles enter from the right edge and slide smoothly left, "
    "covering the screen completely, then exiting off the left edge. The background behind them is soft warm white. "
    "Brief white screen between passes. "
    "Second pass: another wall of large soft pink bubble clouds enters from the right and sweeps left, "
    "completely covering then clearing the screen. Final frame is clean white. "
    "Colors: soft pastel pink (#FFB7C5) cloud bubbles on a pure white background — two-tone flat clean style, "
    "exactly matching the geometric scalloped edge shape of the reference. "
    "Flat, clean, simple — no texture, no gradients, no sketch lines. "
    "Fast, snappy motion right to left — each pass takes about 1 second to fully cross the screen. "
    "The whole transition is quick and punchy. No characters, no text."
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
        "durationSeconds": DURATION,
        "sampleCount": 1,
    }
}

print(f"Submitting transition to Veo ({MODEL}, 720p HD test, {DURATION}s)...")
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
    print(f"  [{attempt * 10}s] generating...")
    if attempt >= 42:
        print("Timed out.")
        sys.exit(1)

try:
    samples = status["response"]["generateVideoResponse"]["generatedSamples"]
    video_uri = samples[0]["video"]["uri"]
except (KeyError, IndexError):
    print("Unexpected response:", json.dumps(status, indent=2))
    sys.exit(1)

print(f"Downloading to {OUTPUT_PATH} ...")
dl_req = urllib.request.Request(video_uri, headers={"x-goog-api-key": API_KEY}, method="GET")
with urllib.request.urlopen(dl_req) as r, open(OUTPUT_PATH, "wb") as out:
    out.write(r.read())

size_mb = os.path.getsize(OUTPUT_PATH) / 1024 / 1024
print(f"\nDone! {OUTPUT_PATH} ({size_mb:.1f} MB)")
