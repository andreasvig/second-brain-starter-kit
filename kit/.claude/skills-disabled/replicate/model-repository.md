# Model Repository — per-model quirks for the `/replicate` skill

> Operational layer. Accumulates model-specific knowledge learned by running models. **Complements (does not duplicate) the brain's `agent_brain/references/image-models.md` and `video-models.md` hubs.** The hubs are opinion-laden ("this model is good for X"); this file is mechanical ("this model needs `images` as an array, returns output as a single string, costs $X per image").
>
> **After every successful run of an un-catalogued model, add an entry here.** Future sessions will read this before firing to avoid re-learning the same quirks. Prices and rankings shipped with the kit were verified via LMArena / Artificial Analysis / Replicate model pages on 2026-04-22 — re-verify if a model entry feels stale.

## How to use this file

- Step 3 of the skill (schema check) reads this first. If the model is here, skip the schema fetch.
- Step 8 of the skill (post-run) appends a new entry if the model wasn't here.
- Entries are alphabetical by `owner/model-slug` within the per-model section.

---

## Response-object conventions (cross-cutting)

Things true of all Replicate predictions, regardless of model. The skill assumes these unless a model entry below says otherwise.

- **`.output` shape** — the dominant pattern is **single URL string** (verified 2026-04-22: z-image-turbo, real-esrgan, minimax/speech-*, google/lyria-3 all do this). The main exception is **`openai/gpt-image-2` family**, which wraps even a single image in an array (use `.output[0]`). Multi-output models (batch generation, 4-variant image models) return arrays of URLs. Always check with `jq 'type'` if the model isn't in a verified entry below — don't assume.
- **`.urls.web`** is the authoritative web-view link. Prefer it over constructing `https://replicate.com/p/{id}` manually.
- **`.urls.get`** is the poll URL pre-built.
- **`.urls.cancel`** is the abort URL — useful if a prediction hangs.
- **First-call 503**: the very first POST after a quiet period often returns `{"detail":"Internal server error","status":503}`. Wait 5s and retry once before escalating. After that, 502/503 are rarer — genuine intermittent errors.
- **Status progression**: `starting` → `processing` → (`succeeded` | `failed` | `canceled`). On `failed`, read `.error` for the reason.
- **Polling cadence**: never <10s between polls. For long gens (T2V), 30–60s is better.

---

## Defaults by task

Picked automatically when the user doesn't name a model. Cheap-tier picks apply when the scale triggers fire (SKILL.md Step 2: ≥10 images or ≥30s video).

### Workhorse tier (quality)

| Task | Model | Replicate slug | Price (2026-04-22) | Basis |
|------|-------|----------------|--------------------|-------|
| Text-to-image | GPT Image 2 | `openai/gpt-image-2` | $0.128/img (high) · $0.047 (med) · $0.012 (low) | LMArena #1 @ 1512 Elo |
| Image editing | GPT Image 2 | `openai/gpt-image-2` | same tiers as above | LMArena #1 covers edits |
| Reference-image-to-image | GPT Image 2 | `openai/gpt-image-2` | same tiers as above | Native multi-panel character consistency per 2026-04-21 release; Nano Banana Pro (1244 Elo) is 268 points behind |
| Text-to-video | Seedance 2.0 | `bytedance/seedance-2.0` | $0.10/s (480p) · $0.18–0.22 (720p) · $0.45–0.55 (1080p) | AA T2V #2 @ 1270 (HappyHorse #1 not on Replicate) |
| Image-to-video | Seedance 2.0 | `bytedance/seedance-2.0` | same as above | AA I2V #2 @ 1346 (HappyHorse #1 not on Replicate) |
| Text-to-speech | Gemini 3.1 Flash TTS | `google/gemini-3.1-flash-tts` | $2.00 / 1M input tokens · $0.04 / 1K output tokens | AA TTS #2 @ 1206 (Inworld #1 not on Replicate) |
| Text-to-music | Lyria 3 Pro | `google/lyria-3-pro` | $0.08 per audio file | Google's top music tier; up to 3-min tracks; no public leaderboard |
| Image upscaling | Topaz Image Upscale | `topazlabs/image-upscale` | $0.08 per unit | Commercial quality standard; no leaderboard |

### Cheap tier (batch / long-form)

| Task | Model | Replicate slug | Price (2026-04-22) | Why this over workhorse |
|------|-------|----------------|--------------------|--------------------------|
| Text-to-image | Z-Image Turbo | `prunaai/z-image-turbo` | $0.0025 @ 0.5MP · $0.005 @ 1MP · $0.01 @ 2MP | 5–50× cheaper than GPT Image 2; fast diffusion workhorse |
| Image editing | P-Image-Edit | `prunaai/p-image-edit` | $0.01/img (100 for $1) | 12× cheaper than GPT Image 2 medium; canonical "commodity edit" anchor |
| Reference-image-to-image | GPT Image 2 (low quality) | `openai/gpt-image-2` | $0.012/img | Same model as workhorse, `quality: "low"` mode — no reason to drop to a different model family |
| Text-to-video | Seedance 2.0 Fast | `bytedance/seedance-2.0-fast` | $0.07–0.17/s | Middle-tier of the Seedance 2.0 family; ~35–55% cheaper than standard 2.0 |
| Image-to-video | Grok Imagine Video | `xai/grok-imagine-video` | $0.05/s | AA I2V #3 @ 1325 at half Seedance 2.0's price; best quality-per-dollar |
| Text-to-speech | MiniMax Speech 2.8 Turbo | `minimax/speech-2.8-turbo` | $0.06 per 1K input tokens | ~40% cheaper than Speech 2.8 HD; HD was AA #4, turbo is the batch pick |
| Text-to-music | Lyria 3 | `google/lyria-3` | $0.04 per audio file | Half the price of Lyria 3 Pro; MiniMax Music 2.6 is $0.15/file (more expensive) |
| Image upscaling | Real-ESRGAN | `nightmareai/real-esrgan` | $0.002/img ($2 per 1000) | 40× cheaper than Topaz; canonical OSS upscaler on Replicate |

### Known-good fallbacks

When a preferred slug 404s, fall back to these before asking the user:

- Fast T2I → `prunaai/z-image-turbo`
- Quality T2I, editing, and reference/character consistency → `openai/gpt-image-2` (fallback `openai/gpt-image-1.5` if 2.0 is rate-limited)
- Upscale → `nightmareai/real-esrgan`

### Explicitly NOT on Replicate (don't try these slugs)

Pulled from the 2026-04-22 verification. Several of these appear on leaderboards but are fal.ai-only or gated:
- **HappyHorse-1.0** (Alibaba) — AA #1 T2V and I2V. Not on Replicate.
- **Inworld TTS 1.5 Max** — AA #1 TTS. Not on Replicate.
- **Kling 2.5 / 3.0**, **Runway Gen-4.5**, **Vidu Q3 Pro**, **Eleven v3**, **Lyra 2.0**, **PixVerse C1/V6**, **SkyReels V4**, **LTX-2.3**, **Reve v1.5**, **Microsoft mai-image-2** — all fal.ai-only or private.
- **`bytedance/seedream-turbo`** — does not exist as a Replicate slug. The earlier brain note of "$5–8 per 1000" may have been for a fal.ai variant. ByteDance's cheap-image options on Replicate are `bytedance/seedream-5-lite` ($0.035), `seedream-4.5` ($0.04), `seedream-4` ($0.03) — but Z-Image Turbo still wins on raw price.

---

## Per-model entries

### openai/gpt-image-2

- **Task**: text-to-image, image editing, reference-image-to-image (workhorse-quality default as of 2026-04-22)
- **Price**: $0.128 high · $0.047 medium · $0.012 low *per image* (verified 2026-04-22)
- **Image input field**: `input_images` (array of URLs) — same as GPT-Image 1.5
- **Size params**: `aspect_ratio` enum — `1:1` / `3:2` / `2:3` only (same limited enum as 1.5; `16:9` still 422s)
- **Quality param**: `quality` (`low` / `medium` / `high`)
- **Output shape**: array with single URL string — `.output[0]` is the image URL (differs from 1.5 which returned a bare string)
- **Output format**: WebP by default; convert to JPG with `sips -s format jpeg -s formatOptions 90 input.webp --out output.jpg` (macOS native — `magick` from ImageMagick is the cross-platform alt)
- **Typical generation time**: ~90s at `quality: high` with a reference image + complex prompt
- **Basis**: LMArena #1 @ 1512 Elo (242-point gap over Nano Banana 2) — launched 2026-04-21, capability-solved multilingual text rendering + 2K dense UI mockups + thinking-mode (web-search, batch-gen, self-verify)
- **Verified**: 2026-04-22 — `input_images` + `aspect_ratio: 3:2` + `quality: high` succeeded on first call in ~90s, ~306KB WebP output

### openai/gpt-image-1.5

- **Task**: text-to-image, image editing (previous-generation fallback; not the default anymore since 2.0 is same-price-curve and better)
- **Price**: $0.013 low · $0.05 medium · $0.136 high *per image* (verified 2026-04-22)
- **Image input field**: `input_images` (array)
- **Size params**: `aspect_ratio` enum (`1:1`, `3:2`, `2:3` only)
- **Quality param**: `quality` (`low` / `medium` / `high`) — `high` is 60–90s
- **Output shape**: single URL string
- **Output format**: WebP by default; convert to JPG with `sips -s format jpeg -s formatOptions 90 input.webp --out output.jpg` (macOS native) or `magick input.webp -quality 90 output.jpg`
- **Verified**: kept as a rate-limit fallback for `openai/gpt-image-2`; superseded as the default 2026-04-22

### google/nano-banana-pro

- **Task**: image editing (specialty — structure-preserving edits, "Nano Banana 2" / Gemini 3 Pro Image)
- **Price**: *(verify — Replicate model page; not in schema)*
- **Image input field**: `image_input` (array of strings — even single image goes in an array)
- **Size params**: `aspect_ratio` (default `match_input_image` — inherits from first input image) · `resolution` (default `2K`)
- **Output shape**: single URL string (not array)
- **Output format**: `output_format` param — `jpg` by default, `png` available. No conversion needed for Notion/Slack if you pass `output_format: "png"`.
- **Other params**: `safety_filter_level` (default `block_only_high`) · `allow_fallback_model` (default `false`)
- **Typical generation time**: 36s for a 2K diagram edit with structure-preservation prompt (verified 2026-05-01)
- **Basis**: LMArena #2 image @ 1244 Elo (behind gpt-image-2 at 1512). **Strength is preservation, not raw aesthetic** — Google DeepMind's prompt guide describes "annotation editing... surgical precision on marked areas without affecting the rest". The right pick when the goal is "keep this exact image, change only [X]" rather than "redraw better".
- **Prompt pattern**: preservation-first, enumerate what to keep verbatim. Quote text labels explicitly — multi-language text rendering is a known strength when labels are reproduced in quotes.
- **Used by**: `templates/cinematic-photography.md` (Mode B — edit existing photo); `templates/graph-prettify.md` (Excalidraw → polished diagram).
- **Verified**: 2026-05-01 — ran `templates/graph-prettify.md` on `artifacts/draw-diagrams/tests/pipeline.png`. All 4 labels preserved verbatim, all 3 arrows + directions intact, title preserved, semantic color coding (academic blue accent on `write`) preserved. 2.7 MB PNG output at 2K resolution. Prediction id `vhfs0055ynrmw0cxweytw8jm04`.
- **Gotcha**: API response sometimes contains literal newlines inside the echoed `prompt` field, breaking strict JSON parsers. Use a regex or relaxed parser to pull `id`, `status`, `output` out of the response body — don't `json.load()` it directly. Doesn't affect functionality, just the response handling.

### prunaai/z-image-turbo

- **Task**: text-to-image (cheap-tier default — generation only, no image input)
- **Price**: $0.0025 @ 0.5MP · $0.005 @ 1MP · $0.01 @ 2MP *per image* (verified 2026-04-22)
- **Size params**: `width` / `height` (NOT `aspect_ratio`)
- **Output shape**: single URL string (not array)
- **Input schema keys**: `go_fast`, `guidance_scale`, `height`, `num_inference_steps`, `output_format`, `output_quality`, `prompt`, `seed`, `width`
- **Known-good defaults**: `num_inference_steps: 4` produces clean multi-element cartoon scenes in ~2–3s actual generation time
- **Typical file size**: ~50 KB for 1024×1024 WebP
- **Verified**: 2026-04-22 — 1024×1024 multi-element cartoon portrait, prompt ~80 words, succeeded on retry after first-call 503

### prunaai/p-image-edit

- **Task**: image editing (cheap-tier default)
- **Price**: $0.01/image = 100 edits per $1 (verified 2026-04-22)
- **Image input field**: `images` (array)
- **Output shape**: *(verify on first use)*
- **Verified**: not yet run from this skill; pricing confirmed 2026-04-22

### bytedance/seedance-2.0

- **Task**: text-to-video, image-to-video (workhorse-quality default)
- **Price**: $0.10/s (480p) · $0.18–0.22/s (720p) · $0.45–0.55/s (1080p) — *per second of generated video* (verified 2026-04-22)
- **Slug quirk**: note the dot-zero — `bytedance/seedance-2` does NOT exist, must use `bytedance/seedance-2.0`
- **Image input field** (for I2V): *(verify on first use)*
- **Output shape**: *(verify — likely single URL to MP4)*
- **Basis**: AA T2V #2 @ 1270 Elo, AA I2V #2 @ 1346 Elo (HappyHorse-1.0 #1 on both but not on Replicate)
- **Verified**: not yet run from this skill; pricing confirmed 2026-04-22

### bytedance/seedance-2.0-fast

- **Task**: text-to-video, image-to-video (cheap-tier default — middle tier of the Seedance 2.0 family)
- **Price**: $0.07–0.17/s *per second of generated video* (verified 2026-04-22)
- **Basis**: ~35–55% cheaper than standard Seedance 2.0; same architecture family, degraded speed/fidelity tradeoff
- **Verified**: not yet run from this skill

### xai/grok-imagine-video

- **Task**: image-to-video (cheap-tier default)
- **Price**: $0.05/s *per second of generated video* (verified 2026-04-22)
- **Basis**: AA I2V #3 @ 1325 Elo at half Seedance 2.0's price — best quality-per-dollar for I2V
- **Verified**: not yet run from this skill

### google/gemini-3.1-flash-tts

- **Task**: text-to-speech (workhorse-quality default)
- **Price**: $2.00 / 1M input tokens · $0.04 / 1K output tokens (verified 2026-04-22)
- **Basis**: AA TTS #2 @ 1206 Elo (Inworld TTS 1.5 Max #1 but not on Replicate); granular voice-direction tags
- **Voice param**: *(verify schema — voice enum is model-specific)*
- **Verified**: not yet run from this skill

### minimax/speech-2.8-turbo

- **Task**: text-to-speech (cheap-tier default)
- **Price**: $0.06 per 1K input tokens (verified 2026-04-22)
- **Input field**: `text` (string, required)
- **Optional params**: `voice_id`, `emotion`, `speed`, `pitch`, `volume`, `bitrate`, `channel`, `sample_rate`, `audio_format`, `language_boost`, `subtitle_enable`, `english_normalization`
- **Output shape**: single URL string (mp3)
- **Typical generation time**: ~2s for a one-sentence utterance (verified 2026-04-22)
- **File size**: ~15 KB/s of audio (so 137 KB for a ~9s clip)
- **Basis**: ~40% cheaper than MiniMax Speech 2.8 HD; HD was AA #4, turbo is the batch pick
- **Verified**: 2026-04-22 — a one-sentence test utterance succeeded in 2.05s, default voice, default format (mp3)

**Sibling**: `minimax/speech-02-turbo` also exists on Replicate with the identical field set — earlier version, use 2.8-turbo unless rolling back.

### google/lyria-3-pro

- **Task**: text-to-music (workhorse-quality default)
- **Price**: $0.08 per audio file (verified 2026-04-22)
- **Basis**: Google's top music tier; up to 3-min tracks; no public music leaderboard
- **Verified**: not yet run from this skill

### google/lyria-3

- **Task**: text-to-music (cheap-tier default)
- **Price**: $0.04 per audio file (verified 2026-04-22)
- **Input field**: `prompt` (string, required). Optional `images` (array) — allows image-conditioning, unusual for music models.
- **Output shape**: single URL string (mp3)
- **Typical generation time**: ~11s for a short clip (verified 2026-04-22)
- **Default clip length**: ~30s (returned ~727 KB mp3 even when prompted for "5 seconds" — the prompt duration hint didn't shorten the output, model produces its own fixed-ish length)
- **Basis**: Half the price of Lyria 3 Pro; MiniMax Music 2.6 is $0.15/file so actually more expensive than Lyria 3 Pro — Lyria 3 is the clear cheap pick
- **Verified**: 2026-04-22 — ran "A cheerful upbeat cartoon jingle, soft piano and playful bells, 5 seconds, no vocals" succeeded in 10.89s, output was a ~30s mp3 (model ignored duration hint in prompt)

**Sibling**: `google/lyria-2` still on Replicate with a different schema (`seed`, `prompt`, `negative_prompt` — no image conditioning). Previous-gen, use lyria-3 unless rolling back.

### topazlabs/image-upscale

- **Task**: image upscaling (workhorse-quality default)
- **Price**: $0.08 per unit (verified 2026-04-22)
- **Basis**: Commercial quality standard; no public upscaler leaderboard
- **Verified**: not yet run from this skill

### nightmareai/real-esrgan

- **Task**: image upscaling (cheap-tier default)
- **Price**: $0.002/image = $2 per 1000 (verified 2026-04-22)
- **Image input field**: `image` (string URL, NOT an array — singular)
- **Optional params**: `scale` (int, default 4), `face_enhance` (bool, default false)
- **Output shape**: single URL string (PNG — converts WebP/JPG input to PNG on output)
- **Output format**: always PNG regardless of input format
- **Typical generation time**: ~11s for 2× upscale of a 1024×1024 image (verified 2026-04-22)
- **File size**: PNG output is ~3.2 MB for a 2048×2048 from a 49 KB input WebP — PNGs get big fast, consider downstream conversion to JPG if going to web
- **Basis**: 40× cheaper than Topaz; canonical OSS upscaler with the longest track record at scale
- **Verified**: 2026-04-22 — upscaled a 1024→2048 image (scale=2) in 11.06s; input passed via Replicate files API (uploaded URL)

---

## Template for new entries

When adding a new model after a successful run, use this structure:

```markdown
### owner/model-slug

- **Task**: <what task this model covers>
- **Price**: <per-image / per-second-video / per-call / per-compute-sec — include the unit and date verified>
- **Image input field** (if applicable): `field_name` (string / array)
- **Size params**: `aspect_ratio` or `width`/`height` (or neither)
- **Output shape**: single URL string / array of URLs / array of text / other
- **Output format**: <e.g. WebP default / always PNG / mp3 / mp4 — what the bytes actually are>
- **Known-good defaults**: <params + values that produced good results>
- **Typical generation time**: <seconds / minutes — pulled from sidecar `.metrics.predict_time`>
- **Verified**: YYYY-MM-DD — <one-line outcome>
- **Siblings** (optional): `owner/related-model` — one-line note on why you'd pick the sibling (e.g. "previous generation", "different schema", "HD variant, 3× price")
```

**Extract the sidecar numbers directly.** After a run, read `YYYYMMDD_HHMMSS_<slug>.json` and pull `.metrics.predict_time`, `type(.output)`, and `sorted(.input.keys())`. These map 1:1 to the three quantitative fields above. Don't eyeball or round — paste the numbers.

### Price field conventions

- **Per-image models** (most T2I, image editing): `$0.00X per image` — normalize to per-image even if Replicate quotes per-1000
- **Per-second-of-output video models**: `$0.XX per second of generated video` — what matters to a budget is output seconds, not compute seconds
- **Per-call fixed-price models** (some TTS, music): `$0.XX per call` or `$0.XX per audio file`
- **Compute-billed models** (most open-source models on Replicate): `$X.XX per compute-second on <hardware>` — flag as volatile since compute-second pricing × generation time gives a rough per-output number but varies with input size
- **Unknown**: write "unknown — check https://replicate.com/owner/model-slug" and flag to the user when you pick the model so they can check before running at scale
- **Stale-price warning**: include the date verified. Replicate re-prices models regularly — if it's been >90 days since verification and the run is a batch, re-verify before firing.

Keep entries short. Bullet points, not paragraphs. The goal is to be scannable at call-time — this file gets read before every unfamiliar-model run.
