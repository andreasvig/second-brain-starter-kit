---
name: replicate
description: Generic wrapper for running any Replicate model via the REST API (curl). Supports text-to-image, image editing, reference-image-to-image, text-to-video, image-to-video, image-to-3D/explorable video, text-to-speech, text-to-music, and upscaling. If the user doesn't name a model, consults model-repository.md and picks a sensible default. Auto-switches to a cheap tier for batch tasks (10+ images or 30+ seconds of video). Uses REPLICATE_API_TOKEN from the vault's .env — more stable than the MCP path.
---

# /replicate — Generic Replicate runner

> Utility skill (ships disabled). Activate with *"activate replicate"*.

Fires any Replicate model with sensible defaults. Uses the REST API directly (curl) — more stable than the MCP approach, works even when no MCP is connected. The goal is "do the thing" without the user having to remember model slugs or choose between workhorse and cheap tiers manually.

## Capabilities this skill covers

The user can ask for any of these without naming a specific model:

- **Text-to-image** — prompt → still image
- **Image editing** — image + prompt → edited image (inpainting, style transfer, local edits)
- **Reference-image-to-image** — reference photo + prompt → new image preserving character/style
- **Text-to-video** — prompt → video clip
- **Image-to-video** — still image + prompt → animated clip
- **Reference-video-to-video** — source clip + prompt → restyled/edited clip
- **Image-to-3D / explorable video** — single still → camera-motion / 3D-ish output
- **Text-to-speech (TTS)** — text + voice → audio
- **Text-to-music** — lyrics/description → music track
- **Upscaling / enhancement** — low-res image or video → higher-res

For any task not in this list (LLM calls, embeddings, video understanding), the skill still works — just ask the user to name the model since the repository doesn't have strong defaults outside the creative multimodal lane.

## Prerequisites

**API token**. Add `REPLICATE_API_TOKEN=...` to your vault's `.env` (vault root). Load it before any call:

```bash
TOKEN=$(grep -h '^REPLICATE_API_TOKEN=' .env | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'")
```

If `$TOKEN` is empty, tell the user:

> `REPLICATE_API_TOKEN` is blank in `.env`. Get one at https://replicate.com/account/api-tokens and paste it into the `REPLICATE_API_TOKEN=` line in `.env` at the vault root, then re-invoke.

Don't try to proceed without a token.

## Arguments

- No argument — the user will describe what they want in the next turn
- `[task] [prompt]` — shorthand: e.g. `text-to-image a duck in a spaceship`, `text-to-video 10s of waves crashing`
- `[model_slug] [prompt]` — explicit model override: e.g. `openai/gpt-image-2 a cartoon duck`
- `cheap [task] [prompt]` — force cheap tier even for small requests
- `batch N [task] [prompt]` — generate N variants; auto-switches to cheap tier if N ≥ 10

## Core rules (carried over from the curl pattern)

1. **Single-line curl commands** — multi-line breaks shell parsing
2. **Always poll** — `Prefer: wait` header is unreliable for long generations
3. **Save outputs to `artifacts/replicate-outputs/`** at the vault root — create folder first
4. **Retry on first-call 503** — Replicate often 503s on the very first POST after a quiet period. Wait 5s and retry once. Genuine 502/503 are rarer after that.
5. **Check schema for unfamiliar models** — input field names vary
6. **Write a metadata sidecar** (`<timestamp>.json`) alongside every downloaded output — see Step 6

## What to do

### Step 1: Load token + classify task

Load `$TOKEN` per Prerequisites. Parse the request into one of the capabilities above. If ambiguous (e.g. "make me something with this image"), ask a single clarifying question — don't guess between image editing and image-to-video.

### Step 1.5: Check `templates/` first

Before picking a model from defaults, scan `.claude/skills/replicate/templates/README.md` — it's the index of opinionated recipes for specific outputs the user makes often (cinematic photos, diagram prettify, plus any custom templates the user has added). Templates fix the model, params, prompt scaffold, and post-processing.

If a template's trigger matches the request → open the corresponding `templates/<slug>.md` file, use it. Skip Step 2 (model picking) and jump to Step 4 with the template's fixed params + filled prompt. Follow the template's post-processing in Step 6.

If no template matches → proceed to Step 2.

**Adding a new template.** When the user describes an output they produce repeatedly with stable model + params, drop a new file in `templates/` using the skeleton in `templates/README.md` and add a row to its index table. Templates are opinionated — if there's a third way the user sometimes does X, that's a second template, not branching inside the first.

### Step 2: Pick a model

**If the user named a model** → use it. Skip to Step 3.

**If they didn't**, pick from `.claude/skills/replicate/model-repository.md` — see the **"Defaults by task"** section at the top. The repository keeps the workhorse-tier and cheap-tier picks per task, alongside per-model pricing and quirks.

**Scale triggers** (auto-apply unless the user says otherwise):
- ≥10 images in one batch → cheap tier
- ≥30 seconds of video total → cheap tier
- If the user prepends `cheap` → cheap tier regardless of size

**Slug drift is expected.** Always verify with a schema check before firing (Step 3); if it 404s, fall back to the closest known-good model in the repository and flag the drift to the user.

**Announce the model choice before firing.** One line: "Defaulting to [model] — [workhorse / cheap / frontier]. Override?" Give them a beat to redirect.

### Step 3: Check the model repository, then schema if needed

**First**: read `.claude/skills/replicate/model-repository.md`. If the model you're about to call has an entry there, use the documented field names, output shape, and defaults — skip the schema fetch.

**If the model isn't in the repository**, fetch its schema:

```bash
curl -s -H "Authorization: Bearer $TOKEN" "https://api.replicate.com/v1/models/OWNER/MODEL" | jq '.latest_version.openapi_schema.components.schemas.Input'
```

Why this matters: input field names vary between models. The same "give it an image" concept is `images` (array) on one model, `image_input` (array) on another, `image` (string) on a third. Size is `aspect_ratio` on some, `width`/`height` on others. Output is sometimes a single URL string, sometimes an array — don't assume.

The repository's "Response-object conventions" section also covers cross-cutting behaviors (first-call 503, `.urls.web` / `.urls.get` shortcuts, status progression) that apply to every model.

### Step 3.5: Upload local files if the input needs one

If the prompt references a local image/video/audio file, Replicate needs a URL — it cannot read your disk. Two supported paths:

**(a) Replicate files API** — preferred. Upload via `POST /v1/files`, get back a URL valid for **24 hours** (`expires_at` in the response). The returned URL works as an image input for Replicate predictions without further authentication (the prediction worker auto-auths against the files endpoint):

```bash
UPLOAD_JSON=$(curl -s -X POST "https://api.replicate.com/v1/files" -H "Authorization: Bearer $TOKEN" -F "content=@/absolute/path/to/input.jpg")
UPLOAD_URL=$(echo "$UPLOAD_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['urls']['get'])")
# Now pass $UPLOAD_URL into the prediction's input field
```

**(b) Public URL already hosted** — if the file is already at e.g. an R2 bucket or a raw GitHub URL, skip the upload and use that URL directly.

Don't try to inline base64 — most Replicate models accept `data:` URIs but they bloat the request and some models reject large payloads. Use the files API instead.

### Step 4: Start the prediction

```bash
mkdir -p artifacts/replicate-outputs && curl -s -X POST "https://api.replicate.com/v1/models/OWNER/MODEL/predictions" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"input":{"prompt":"...","aspect_ratio":"3:2","quality":"high"}}'
```

Extract the prediction ID from the response (`.id` field). Don't use `Prefer: wait` — unreliable for long generations.

Common input params:

- `prompt` — always required
- `aspect_ratio` — for images (`1:1`, `3:2`, `2:3` on `openai/gpt-image-2` / `openai/gpt-image-1.5`; other model families vary — always check `model-repository.md` or the schema)
- `quality` — `"high"` for quality defaults, `"low"` / `"medium"` for cheap batch
- Image-input field — varies per model (see Step 3 table)
- `num_outputs` — when batching
- `duration` — for video (seconds)
- `voice` — for TTS (model-specific enum)

### Step 5: Poll

```bash
curl -s -H "Authorization: Bearer $TOKEN" "https://api.replicate.com/v1/predictions/PREDICTION_ID"
```

**Poll cadence — adapt to the model's known speed.** Read the "Typical generation time" field in that model's `model-repository.md` entry and size polls accordingly:

- **If typical < 10s** (e.g. MiniMax TTS ~2s, Z-Image Turbo ~3s, Real-ESRGAN ~11s, Lyria-3 ~11s): single poll at ~5s, then 10s intervals if still processing. Don't over-poll fast models.
- **If typical 10–60s** (most cheap-tier image): 10s floor, poll every 10–15s.
- **If typical 60s–5min** (workhorse image, music, short video): 15–30s interval.
- **If typical >5min** (text-to-video, long jobs): 30–60s interval.

**Never drop below 10s between polls once a model has entered `processing`** — rapid polling wastes API calls and clutters the conversation. The short first-poll exception above is for the gap between `starting` and `processing`, which is often instant on fast models.

Rough defaults when the model is un-catalogued:
- Text-to-image (quality): 60–90s · (cheap): 5–20s
- Image editing: 30–60s · Upscaling: 10–60s
- TTS: 2–30s · Music: 10–90s
- Text-to-video: 2–8 minutes

Status values: `starting` → `processing` → `succeeded` / `failed` / `canceled`. On `failed`, read `.error` and report.

### Step 6: Download output + write metadata sidecar

Create `artifacts/replicate-outputs/` if missing, download with a timestamped filename, then write a sidecar JSON capturing the run:

```bash
OUT_DIR=artifacts/replicate-outputs
mkdir -p "$OUT_DIR"
TS=$(date +%Y%m%d_%H%M%S)
SLUG=<short-descriptor>  # e.g. "thumbnail", "upscaled", "portrait"

# 1. Download the output
curl -s -o "${OUT_DIR}/${TS}_${SLUG}.webp" "OUTPUT_URL"

# 2. Write the sidecar metadata — full prediction response
curl -s -H "Authorization: Bearer $TOKEN" "https://api.replicate.com/v1/predictions/PREDICTION_ID" > "${OUT_DIR}/${TS}_${SLUG}.json"
```

The sidecar is the full prediction object (prompt, input params, model version, output URL, timings, cost where available) — lets us reproduce or audit runs later. Don't skip it.

Naming convention:
- `YYYYMMDD_HHMMSS_<slug>.webp` / `.jpg` / `.png` — images
- `YYYYMMDD_HHMMSS_<slug>.mp4` — video
- `YYYYMMDD_HHMMSS_<slug>.mp3` / `.wav` — audio / TTS / music
- `YYYYMMDD_HHMMSS_<slug>.json` — sidecar metadata (always)

**If the output is WebP and the user needs JPG/PNG**, convert. `sips` is the default on macOS — `magick` (ImageMagick) is the cross-platform alt:

```bash
# macOS native, no install
sips -s format jpeg -s formatOptions 90 input.webp --out output.jpg

# Cross-platform, requires ImageMagick
magick input.webp -quality 90 output.jpg
```

### Step 7: Report

Give the user:
- Local file path(s)
- Replicate web view link — use `.urls.web` from the start-response (authoritative); `https://replicate.com/p/{prediction_id}` works as a fallback
- Model used + cost tier ("workhorse gpt-image-2 @ high" / "cheap z-image-turbo")

### Step 8: Mine the sidecar and update model-repository.md

The sidecar JSON from Step 6 contains exactly the facts the repository needs. Extract:

```bash
python3 -c "
import json
d = json.load(open('OUT_DIR/TS_SLUG.json'))
print('model:        ', d['model'])
print('predict_time: ', d.get('metrics',{}).get('predict_time'))
print('output_type:  ', type(d['output']).__name__)
print('output:       ', str(d['output'])[:120])
print('input_fields: ', sorted(d['input'].keys()))
"
```

Use the extracted values to update `.claude/skills/replicate/model-repository.md`:

- **If the model wasn't in the repository** → add a full entry using the template. Include pricing — if not on the Replicate model page or schema, fetch the page with WebFetch or ask the user before batch-running.
- **If the model was there but marked `*(verify on first use)*`** → replace with the sidecar's actual values. Specifically:
  - `predict_time` → populates the "Typical generation time" field
  - `type(d['output'])` (`str` vs `list`) → "Output shape: single URL string" vs "array of URLs"
  - `sorted(d['input'].keys())` → confirms the input field names the model actually accepted
- **If pricing is unknown** → flag to the user in the Step 7 report. Don't batch-run an unknown-price model without their OK.

This step is mandatory — the repository only stays useful if every session leaves it better than it found it. Skipping means the next session re-learns the same quirks and the Step 5 poll-cadence heuristic degrades to the rough defaults.

## Error handling

| Error | Fix |
|-------|-----|
| `503 Internal server error` on first POST | Expected — wait 5s and retry once. After that, 503s are genuine and should be escalated. |
| `502 Bad Gateway` | Wait 2–5s, retry (intermittent Replicate issue) |
| `status: starting` on poll | Poll again after 10s |
| Status stuck >expected generation time | Bail after 3× expected time; check the web view link for detail; cancel via `.urls.cancel` if needed |
| `No images provided` | Wrong image field name — fetch schema, check `image` vs `images` vs `image_input` vs `input_images` |
| `422 Validation error` | Fetch schema, check required fields; common culprit is an out-of-enum value (e.g. `aspect_ratio: "16:9"` on gpt-image-2 which only accepts `1:1 / 3:2 / 2:3`) |
| Token empty / 401 Unauthorized | `REPLICATE_API_TOKEN` missing from `.env` — see Prerequisites |
| Local file reference in prompt but no upload happened | Re-read Step 3.5 — Replicate needs a URL, not a local path |

## Parallel predictions

For multiple variants (e.g. 3 thumbnail options), fire all predictions in parallel and poll them together — serial is ~N× slower for no reason.

```bash
# Fire N predictions in parallel, capture IDs
IDS=()
for i in 1 2 3; do
  ID=$(curl -s -X POST "https://api.replicate.com/v1/models/OWNER/MODEL/predictions" \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "{\"input\":{\"prompt\":\"...variant $i...\"}}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
  IDS+=("$ID")
done

# Poll all until each terminal (succeeded/failed/canceled)
for ID in "${IDS[@]}"; do
  until curl -s -H "Authorization: Bearer $TOKEN" "https://api.replicate.com/v1/predictions/$ID" \
    | python3 -c "import sys,json; s=json.load(sys.stdin)['status']; sys.exit(0 if s in ('succeeded','failed','canceled') else 1)"; do
    sleep 12
  done
done

# Then download each output + write a sidecar per Step 6
```

When firing parallel, keep concurrency ≤ 5 unless the user has confirmed the account tier can handle it — Replicate's free-tier concurrency limit will silently queue beyond that.

## Examples

### Example 1 — simple text-to-image (small task)

**User**: `/replicate text-to-image a cartoon duck riding a skateboard in a neon city`

**Assistant**:
1. Loads `$TOKEN` from `.env`.
2. Classifies: text-to-image, 1 image → small task.
3. No template match. Reads `model-repository.md` → defaults table, picks GPT Image 2 (workhorse T2I).
4. Announces: "Defaulting to `openai/gpt-image-2` at quality=high (workhorse). Override?"
5. Starts prediction, polls every 10s.
6. Downloads to `artifacts/replicate-outputs/20260422_1540_duck.webp` + sidecar `.json`.
7. Reports path + `.urls.web`.

### Example 2 — batch images (cheap tier auto-engaged)

**User**: `/replicate batch 20 text-to-image art-deco album covers`

**Assistant**:
1. Loads `$TOKEN`.
2. Classifies: text-to-image, 20 outputs → **cheap tier auto-engaged**.
3. Picks Z-Image Turbo (verifies slug via schema fetch).
4. Announces: "20 images → switching to Z-Image Turbo (cheap at scale). Override?"
5. Fires in batches if `num_outputs` has a per-call ceiling; polls each; downloads all.
6. Reports all paths + total cost estimate.

### Example 3 — explicit model override with local-file input

**User**: `/replicate openai/gpt-image-2 edit this image to be in anime style --input=~/Downloads/photo.jpg`

**Assistant**:
1. Loads `$TOKEN`.
2. Uses the explicit model — no defaults lookup needed.
3. **Step 3.5**: uploads `~/Downloads/photo.jpg` via `POST /v1/files`, captures the returned `urls.get`.
4. Fires prediction with `input_images: ["<returned-url>"]`, polls, downloads, writes sidecar.

### Example 4 — video, long duration

**User**: `/replicate text-to-video 60 seconds of a sun rising over mountains, cinematic`

**Assistant**:
1. Loads `$TOKEN`.
2. Classifies: text-to-video, 60s → **cheap tier auto-engaged** (≥30s).
3. Reads `model-repository.md`, picks the cheap-tier video model.
4. Announces the choice; gives the user a beat to override with the workhorse.
5. Fires + polls every 30s (2–8 min); downloads.

### Example 5 — TTS

**User**: `/replicate text-to-speech "Welcome to the weekly brief" --voice=warm-female`

**Assistant**:
1. Loads `$TOKEN`.
2. Picks MiniMax Speech 2.8 Turbo (cheap default for TTS — workhorse if user prepends `quality`).
3. Fetches schema to confirm voice param name + enum.
4. Fires + polls + downloads `artifacts/replicate-outputs/20260422_1540.mp3`.

### Example 6 — upscale

**User**: `/replicate upscale ~/Downloads/low-res.jpg`

**Assistant**:
1. Loads `$TOKEN`.
2. Picks Real-ESRGAN (4x default).
3. Uploads image, fires, polls, downloads `artifacts/replicate-outputs/20260422_1540_upscaled.png`.

## Notes

- **Model-repository.md is the source of truth for model choice in this skill.** Update it after every successful run of an un-catalogued model so future sessions don't re-learn the same quirks.
- **If the repository has no entry for a task type**, surface the gap: "No default model in the repository for [task]. Suggest one, or I can search Replicate for you."
- **Scale triggers are defaults, not laws.** If the user says "20 hero shots, use the good model," honor that — the 10+ rule is a heuristic for unattended batch, not a budget ceiling.
- **Why curl over MCP**: the MCP path requires the Replicate MCP to be connected and sometimes hangs; curl + REST API works in any session with the token present. This is a deliberate stability choice.
- **Related skills**:
  - `/draw-diagrams` — the upstream end of the `graph-prettify` template. Chain: `/draw-diagrams build <folder>` → "prettify it" → templates/graph-prettify/README.md.
