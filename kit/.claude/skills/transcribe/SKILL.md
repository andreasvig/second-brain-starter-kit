---
name: transcribe
description: "Transcribe an audio file (.wav/.m4a/.mp3/.ogg/.webm/.mp4) into a text transcript saved in raw/. Optionally chains to /ingest after transcription completes. Used for meetings, voice notes, podcasts, and any spoken content the user wants in the brain."
---

# /transcribe — Audio → text in raw/

Takes an audio file, produces a transcript, drops it in `raw/`. Then offers to chain into `/ingest` to actually process the transcript into the brain.

**Why split from `/ingest`**: transcription is a different capability — needs a model like Whisper or a hosted service. Keeping it as its own skill keeps `/ingest` simple (text-only) and lets transcription be configured independently.

<!-- Config: adapt during setup -->
<!-- transcription_tool: {{TRANSCRIPTION_COMMAND}} -->
<!-- recordings_path: {{RECORDINGS_DIRECTORY}} -->

## Arguments

- `[path]` — path to audio file (`.wav`, `.m4a`, `.mp3`, `.ogg`, `.webm`, `.mp4`).
- If no path given, list audio files in the recordings directory and ask the user which to transcribe.

## Procedure

### 1. Find the audio file

If a path was given, use it. Otherwise list candidates from the configured recordings directory and ask.

### 2. Optional: pull calendar context

If the audio's timestamp can be matched to a calendar event (and `/check`'s calendar template is connected):
- Find events overlapping the recording time.
- Capture: meeting title, attendees, description.
- This becomes the slug + frontmatter for the saved transcript.

### 3. Transcribe

Run the configured transcription tool on the audio file. If no tool is configured, ask the user how they'd like to transcribe — common options:
- **Whisper** (`whisper <file>`) — local, free, good quality
- **OpenAI / Anthropic / similar hosted** — fast, costs per minute
- **Manual paste** — user transcribes themselves, pastes the text

### 4. Save transcript

Save to `raw/<category>/YYYY-MM-DD-<slug>.md`. Category default is `meetings/` if the audio looks like a meeting; otherwise `voice-notes/` or `audio/`. Format:

```markdown
# [Title — from calendar event or user-provided]

**Date**: YYYY-MM-DD
**Source**: <original audio filename>
**Duration**: <from audio length>
**Attendees**: [if known]

---

[Transcript content]
```

### 5. Offer to chain into /ingest

Ask the user:

> *"Transcript saved to `raw/<path>`. Want me to run `/ingest` on it now? It'll classify (probably as a meeting or self-reflection) and process accordingly."*

If yes, invoke `/ingest <path>`. If no, stop — the transcript stays in `raw/` until the user runs `/ingest` themselves.

## Notes

- Audio files stay in their original location. The transcript is the durable artifact; the audio is reference-only.
- For very long audio (>1hr), consider chunking before transcription if the tool struggles.
- If the user records frequently and ingests less frequently, transcripts can accumulate in `raw/`. `/ingest` with no argument lists unprocessed transcripts.
