---
type: index
summary: "What lives in workspace/ — your active work projects (peer of agent_brain/, distinct from artifacts/)."
---

# workspace/

This is where **your work projects** live. Code, draft videos, written drafts, in-flight assets — anything you're actively building.

## What goes here

- A coding project: `workspace/my-side-project/` — git repo with src/, tests/, package.json
- A YouTube video in production: `workspace/youtube-video-on-X/` — script, b-roll, thumbnails
- A piece of writing: `workspace/essay-on-Y/` — draft, research, outline
- Anything you'd otherwise scatter across Desktop or Downloads

One folder per project. Cross-link to the project's knowledge page in `agent_brain/projects/<slug>/<slug>.md`.

## How this differs from the brain and artifacts

- **`agent_brain/`** — *knowledge* about your projects (status, decisions, people, notes). Read-mostly.
- **`workspace/`** — *the active work itself* (code, drafts, assets). Read-write, sometimes versioned with git.
- **`artifacts/`** — *generated outputs* from skills (rendered diagrams, podcast transcripts, daily research dumps). Disposable.

When you want to understand a project, start in `agent_brain/projects/`. When you want to work on it, come here.

## Conventions

- Slug folder names (kebab-case): `workspace/my-newsletter/`, not `workspace/My Newsletter/`.
- Each project folder can have its own `.git`, `.gitignore`, etc. — they don't affect the vault.
- Optionally, drop a `README.md` in each project folder pointing at the brain page: `See [[../../agent_brain/projects/my-newsletter/my-newsletter.md]]`.
- Delete this README once you've made your first project folder; it's just a placeholder explaining the convention.
