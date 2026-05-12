# Cinematic photography template

**Trigger.** "shoot it cinematic", "cinematic photo of [X]", "make this photo cinematic", "film-look portrait of [X]", "movie-still of [X]".

**Purpose.** Two modes inside one template:

- **Mode A — generate from scratch (T2I).** The user describes a scene, we produce a cinematic still: shallow DOF, controlled lighting, named lens + film stock vibe.
- **Mode B — transform an existing photo (image-edit).** The user hands us a photo, we keep the subject's identity / pose / framing and re-render the lighting, grade, and grain to look cinematic.

Pick mode by whether the user attaches an image. If they do, default to Mode B unless they explicitly say "use the photo as inspiration only" or similar.

**Model.**

| Mode | Model | Why |
|---|---|---|
| A — T2I | `openai/gpt-image-2` | Workhorse-quality default (LMArena #1 @ 1512 Elo). Good at cinematic if prompted with concrete gear vocab. |
| B — edit existing photo | `google/nano-banana-pro` | Best at preservation edits per Google DeepMind's prompt guide. Behind gpt-image-2 on aesthetic Elo (1244) but ahead on "keep this exact subject, change only the rendering" — which is the metric that matters here. |

**Fixed params.**

Mode A (gpt-image-2):

```json
{
  "aspect_ratio": "3:2",
  "quality": "high"
}
```

Mode B (nano-banana-pro): aspect ratio inherits from input photo. `quality: "high"` if the schema exposes it (verify on first run — model entry is provisional in `model-repository.md`).

```json
{
  "input_image": "<UPLOADED_URL>"
}
```

Use `aspect_ratio: "2:3"` for portraits, `"3:2"` for landscape, `"1:1"` for IG. **gpt-image-2 does NOT accept `16:9`** — it 422s. If the user wants 16:9, render 3:2 then crop with `sips -c <h> <w>`.

**Prompt scaffold (Mode A — generate from scratch).**

The 4-layer stack: Subject+action / Visual / Technical / Atmosphere. Don't write keyword soup; describe the scene in narrative paragraphs.

```
[SHOT_TYPE], [SUBJECT] [ACTION] in [SETTING_WITH_LAYERED_DEPTH].

LIGHTING: [LIGHTING_DESIGN]. [PRIMARY_SOURCE] from [DIRECTION] at [COLOR_TEMP]; [SECONDARY_SOURCE_OR_FILL] from [DIRECTION] at [COLOR_TEMP].

COLOR GRADE: [NAMED_GRADE] palette of [KEY_COLORS]. [HIGHLIGHT_TREATMENT] in highlights; [SHADOW_TREATMENT] in shadows.

TECHNICAL: shot on [CAMERA_BODY] with a [LENS_FOCAL_LENGTH] [LENS_NAME], [APERTURE], [FILM_STOCK]. [DOF_INTENT].

MOOD: [TONE]. [ERA_OR_GENRE_REFERENCE].
```

**Filling the placeholders (Mode A).**

`[SHOT_TYPE]` — controls framing:

| Shot type | Use for |
|---|---|
| `extreme close-up` | Macro detail, tension |
| `close-up` | Faces, hands, single object |
| `medium shot` | Person waist-up, conversation framing |
| `wide shot` | Person + environment |
| `establishing shot` | Setting / location reveal |
| `over-the-shoulder` | Two-subject conversation |
| `low angle` | Subject feels powerful / imposing |
| `dutch angle` | Tension, off-balance |

`[LENS_FOCAL_LENGTH]` + `[LENS_NAME]` — gear vocab that actually moves results:

| Focal | Name | Look |
|---|---|---|
| `24mm` | Sigma Art / Canon L wide | Expansive, environmental, slight distortion at edges |
| `35mm` | Voigtländer 35mm / Cooke Mini S4 | Documentary natural immersion — closest to human eye |
| `50mm` | Canon 50mm f/0.95 / Zeiss Planar | Neutral compression, classic look |
| `85mm` | Canon 85mm f/1.2 / Zeiss Otus | Creamy portrait compression, blurred backgrounds |
| `anamorphic` | Cooke S4 anamorphic / Atlas Orion | Oval bokeh + horizontal lens flares = instant cinema |

`[APERTURE]` — depth of field control:

| f-stop | Effect |
|---|---|
| `f/1.4` | Very shallow, eyelashes sharp / ears soft |
| `f/2.8` | Shallow, subject pops from background |
| `f/5.6` | Medium, subject + immediate context |
| `f/8` | Deep, everything in focus |

`[FILM_STOCK]` — color-grade shortcut:

| Stock | Use for |
|---|---|
| `Kodak Portra 400` | Warm, skin-flattering portraits — neutral and forgiving |
| `Kodak Vision3 500T` | Modern sharp + vibrant motion-picture look |
| `CineStill 800T` | Tungsten-balanced, cinematic halation on highlights — instant night-cinema |
| `Kodak Ektar 100` | Saturated landscapes, deep greens and blues |
| `Fuji Superia` | Greener cooler everyday vibe |
| `Ilford HP5` (B&W) | Classic black-and-white photojournalism grain |
| `1960 Kodachrome` | Vintage muted colors |

`[LIGHTING_DESIGN]` — name what light *does*, not just where it comes from:

| Setup | What it does |
|---|---|
| `golden hour, low warm sun raking across the scene` | Long shadows, warm color temp |
| `blue hour, ambient sky-blue with practical lights popping` | Dusk magic, contrast between sky and warm interiors |
| `Rembrandt lighting, key from upper-left creating triangle of light on the cheek` | Classical portrait |
| `split lighting, half face in shadow` | Tension, drama |
| `window light from camera-left, soft white curtain diffusion` | Soft natural portrait |
| `hard direct flash with deep falloff` | Documentary / fashion / harsh |
| `dappled canopy light through leaves` | Outdoor portrait, organic patterns |
| `practical neons + wet pavement reflection` | Cyberpunk, blade-runner |

If mixing sources, **state color temp per source** ("warm tungsten desk lamp from the left, cool blue moonlight from the window behind") — otherwise the model averages them to flat neutral.

`[NAMED_GRADE]`:

| Grade | Look |
|---|---|
| `teal-and-orange` | Hollywood blockbuster — warm skin, cool everything else |
| `desaturated muted with crushed blacks` | Indie drama, prestige TV |
| `high-contrast warm` | Wong Kar-wai, neon-night |
| `pastel soft` | Wes Anderson, dreamy |
| `bleach-bypass` | Saving Private Ryan, gritty |

**Prompt scaffold (Mode B — transform existing photo).**

Preservation-first per Google DeepMind's nano-banana guide. Enumerate what to keep:

```
Using the provided photo, keep the subject's identity, pose, framing, and composition exactly the same. Do not change the subject's face, body, expression, or position in the frame.

Re-render only the lighting, color grade, and film texture:
- LIGHTING: replace the existing light with [LIGHTING_DESIGN].
- COLOR GRADE: apply a [NAMED_GRADE] grade with [KEY_COLORS].
- TEXTURE: add subtle film grain consistent with [FILM_STOCK]. Soft halation in highlights.
- LENS CHARACTER: render as if shot on a [LENS_FOCAL_LENGTH] [LENS_NAME] at [APERTURE] — [DOF_BEHAVIOR if it changes].

Keep all other elements of the photo unchanged. Do not add or remove objects. Do not redraw the subject from scratch.
```

The placeholder vocab tables from Mode A apply identically.

**Post-processing.**

The raw output is **WebP**. If the user wants JPG/PNG (most cases), convert:

```bash
sips -s format jpeg -s formatOptions 92 input.webp --out output.jpg
```

For 16:9 from a 3:2 gpt-image-2 output, crop:

```bash
# 3:2 input is e.g. 1500x1000 → crop to 1500x844 for 16:9
sips -c 844 1500 input.jpg --out output_16x9.jpg
```

**File naming.** `YYYYMMDD_HHMMSS_cinematic_<descriptor>.jpg` in `artifacts/replicate-outputs/` — e.g. `20260501_1430_cinematic_portrait.jpg`.

**Example end-to-end (Mode A — generate).**

*Request*: "Cinematic photo of a woman walking alone down a rainy Tokyo alley at night."

*Filled prompt*:

```
Medium-wide shot, a woman walking alone down a narrow rainy Tokyo alley at night, hands in coat pockets, neon signs in Japanese kanji glowing on both sides of the alley, wet pavement reflecting the signs in long vertical streaks.

LIGHTING: practical-light heavy. Warm pink and red neon from camera-left at ~3000K, cooler blue neon from camera-right at ~5500K, key bounce off the wet pavement filling the lower frame. No fill on the subject's face — let half stay in shadow.

COLOR GRADE: teal-and-orange, leaning toward the cool side — saturated cyan in the shadows and pavement reflections, warm coral and pink in the highlights from the signs. Crushed blacks.

TECHNICAL: shot on an Arri Alexa Mini with a 50mm Cooke S4 anamorphic lens at f/2.0, CineStill 800T. Subject in focus, signs blurring into oval bokeh and horizontal lens flares.

MOOD: lonely, dreamlike, neo-noir. Blade Runner 2049 / Wong Kar-wai reference.
```

Fire gpt-image-2 at `aspect_ratio: 3:2`, `quality: high` → poll 60–90s → download WebP → `sips` → JPG.

**Example end-to-end (Mode B — edit).**

*Request*: "Make this photo of me at the desk look cinematic — like a film still." *(attaches `~/Desktop/desk.jpg`)*

Upload via Replicate files API → get URL.

*Filled prompt*:

```
Using the provided photo, keep the subject's identity, pose, framing, and composition exactly the same. Do not change the subject's face, body, expression, or position in the frame.

Re-render only the lighting, color grade, and film texture:
- LIGHTING: replace the existing fluorescent overhead light with warm window light from camera-left at ~3200K, soft falloff into shadow on the right side of the face. Add practical desk-lamp glow on the keyboard.
- COLOR GRADE: apply a teal-and-orange grade — warm skin tones, cool desaturated blues in the wall and shadows. Slight green push in the midtones.
- TEXTURE: add subtle film grain consistent with Kodak Portra 400. Soft halation in highlights from the window.
- LENS CHARACTER: render as if shot on an 85mm Canon f/1.2 at f/2.0 — slightly creamier background blur than the original, ears soft while eyes stay sharp.

Keep all other elements of the photo unchanged. Do not add or remove objects. Do not redraw the subject from scratch.
```

Fire nano-banana-pro with the uploaded URL → poll → download → save.

**Troubleshooting.**

| Issue | Fix |
|-------|-----|
| Output looks generic, "AI cinematic" with no specifics | The prompt is keyword-soupy. Rewrite as narrative paragraphs, name specific gear (focal length + lens name + aperture). Don't use the bare word "cinematic" without supporting specifics. |
| Lighting is flat / averaged | Mixed sources without color temp specified. State temp per source ("3200K tungsten from left, 5500K daylight from window"). |
| Subject identity drifts in Mode B | gpt-image-2 was selected instead of nano-banana-pro. Switch model — gpt-image-2 redraws, nano-banana-pro preserves. |
| Mode B added/removed objects | Prompt didn't enumerate "do not add or remove objects". Be explicit; the model defaults to creative latitude on unconstrained edits. |
| Film grain too aggressive | Drop "heavy grain" and add "subtle" + name a low-ISO stock (Portra 400 instead of 800T). |
| `aspect_ratio: "16:9"` errored | gpt-image-2 enum is `1:1 / 3:2 / 2:3`. Render 3:2, crop with `sips`. |
| Want true 16:9 with no crop loss | Try Z-Image Turbo (`prunaai/z-image-turbo`) which uses width/height — cheaper but less photoreal. Different look; verify it fits the request. |
