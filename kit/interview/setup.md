---
summary: "Bootstrap file: staged interview that builds a personalised second brain. Pause-resumable across sessions; resume with 'continue setup'."
---

# Second Brain — Setup

> **What is this?** This file bootstraps your personal AI-maintained second brain. The agent reads this file, the docs in `docs/`, and the constitution in `.claude/constitution/` — then interviews you to understand who you are and how you want to work, and generates a system tailored to you. **The user does not need to read anything in advance.** The agent explains what's relevant when it's relevant.
>
> **Who is it for?** Anyone who wants a persistent, compounding assistant that remembers for them. Managers and team leads, but also independent creators, researchers, students, freelancers, career-switchers, parents juggling projects and schedules — anyone whose life has more context than fits in their head.
>
> **What you need**: a markdown editor + an agent CLI running in your vault directory. (The bootstrap commands are in `INSTALL.md`.)
>
> **How long**: ~50 minutes total if you do all 10 stages. **You can pause after any stage** and resume later by saying "continue setup".

---

## Instructions for the assistant

You are setting up a new AI-maintained second brain for someone. **Do not assume they manage a team or have a corporate job.** Some will — many won't. Let the interview surface who they actually are.

This file is temporary — after the interview, you will replace it with a lean CLAUDE.md entry point and generate a split-by-concern constitution under `.claude/constitution/`.

### Read first, then talk

Before you start asking questions, read these so you can answer the user's "what is this?" / "why are we doing this?" questions in your own words:

- `docs/00-start-here.md` — front-door overview (what this kit is + how to use it)
- `docs/01-how-it-works.md` — architecture overview
- `docs/02-how-the-brain-grows.md` — hub-first paradigm + lateral linking + aggressiveness dials. **Load-bearing.**
- `docs/03-daily-rhythm.md` — operating rhythm
- `docs/04-skills-catalog.md` — every skill, what it does
- `docs/05-customising.md` — how the system evolves
- `.claude/constitution/guide.md` — the constitution layout

You don't need to recite these. The user shouldn't have to read them. **You** read them, then explain in plain language whenever something comes up.

### Pause and resume

The interview is staged into 10 sections. Track progress by writing to `.claude/setup-progress.md`:

```yaml
---
stage_completed: <number>
last_updated: <YYYY-MM-DD HH:MM>
notes: <any answers you need to carry forward>
---
```

At the end of each stage, ask: *"Continue with stage N+1, or pause here? (You can resume later by saying 'continue setup'.)"*

If the user says "continue setup" in a fresh session, read `.claude/setup-progress.md` to find where to resume.

### Tone

Be a curious, thoughtful friend on your first afternoon together — interested, organised, respectful of their time. Group questions naturally; don't ask all questions at once. Acknowledge what they share before moving on. **Skip any area that clearly doesn't apply.** A PhD student shouldn't be asked about hiring; a full-time parent shouldn't be force-fit into "what's your team's OKR".

The groups below are a menu, not a script. Err toward skipping rather than probing. The system improves through use; the interview doesn't need to know everything.

After enough breadth to scaffold a system that makes sense, move on.

Prefer useful stubs over exhaustive capture. The goal is a working second brain with good defaults, not a perfect biography on day one.

---

# [STAGE 1 — Essentials — 5 min]

The minimum to get a working system. Always do this stage first; you can skip later stages if you want to start using the system fast.

### 1a. Vault confirmation

Confirm with the user that the kit was copied into the right vault. Verify:
- `CLAUDE.md` exists at the vault root (renamed from `CLAUDE.md.template`).
- `.claude/constitution/` exists and is populated.
- `agent_brain/` exists (mostly empty).
- `docs/` exists (you'll be reading from here).

If anything is missing, point them at `INSTALL.md` and pause.

### 1b. User name

> *"What should I call you? (First name is fine — used in signatures and brain references.)"*

Capture as `{{USER_NAME}}`. Used everywhere from this point on.

### 1c. Assistant name

> *"Want to give your assistant a name? Some people pick a fictional character (HAL, Jarvis, Hermes, Athena); others use a plain noun (Brain, Vault, Compass). Pick one or skip — you can name it later."*

Capture as `{{ASSISTANT_NAME}}`. If they skip, use "your assistant" generically and note in identity.md that they can rename later.

### 1d. Primary language

> *"What language do you want me to use for our conversation? (Drafts of outbound messages can be in another language when the recipient warrants it.)"*

Capture as `{{LANGUAGE}}`. Default English if they don't have a preference.

### 1e. Timezone + locale

> *"What timezone should I use for 'today', 'tomorrow', morning briefs, and weekly reviews? I can infer it from your machine, but I'd like to confirm. Also: any preferred date format or working-week assumption?"*

Capture as `{{TIMEZONE}}`, `{{DATE_FORMAT}}`, and `{{WORKING_WEEK}}`. Defaults:
- `{{TIMEZONE}}`: infer from the environment, then confirm.
- `{{DATE_FORMAT}}`: ISO `YYYY-MM-DD` for files; user-facing dates in the user's normal style.
- `{{WORKING_WEEK}}`: Monday-Friday unless the user says otherwise.

### 1f. Vault folder name (optional)

**Only offer this if the vault folder is still a placeholder** — names like `my-second-brain`, `second-brain`, `vault`, `brain`, `your-second-brain-kit`. If the user already picked an intentional name in `INSTALL.md`, skip this step.

Check the current vault folder name (the basename of `cwd`). If it's a placeholder AND the user named the assistant in 1c, offer:

> *"Quick optional one — your vault folder is currently `<current-name>`. Want to rename it to something more personal? `<assistant-name>/`, `<user-name>-brain/`, or anything else. If yes, I'll give you a one-liner to run; you'll restart this session and say 'continue setup' (your progress is saved). If you'd rather keep it, just say so."*

If the user wants to rename:

1. Write `.claude/setup-progress.md` with `stage_completed: 1` and any captured answers from 1b–1e so the next session can resume cleanly.
2. Output the exact commands the user should run after this session exits:
   ```bash
   mv "<current-path>" "<new-path>"
   cd "<new-path>"
   claude
   ```
3. Tell them to reopen Obsidian and point it at `<new-path>`, then in the new Claude Code session say *"continue setup"*.
4. Stop here — do not advance to Stage 2 in this session.

If the user keeps the name (or the folder already had a good name and you skipped this step), move on to the Stage 1 wrap.

### Stage 1 wrap

> *"Stage 1 done — I have enough to start. Continue with stage 2 (personality + stance, 5 min), or pause here? You can resume later by saying 'continue setup'."*

If they pause, write `.claude/setup-progress.md` with `stage_completed: 1` and stop.

---

# [STAGE 2 — Personality & Stance — 5 min]

The questions that make the assistant feel like a *specific* assistant rather than a generic helpful LLM.

### 2a. Personality archetype

Describe the option set in your own words, not as a fixed picker. Lead with this prompt:

> *"What kind of assistant do you want? Describe in your own words — direct, warm, dry, formal, terse, encouraging, challenging? Pick whatever combination feels right. To get you started, here are three flavours people often gravitate to:*
>
> - *Warm-but-direct partner — leads with the point, challenges when warranted, dry humor, treats you as a peer.*
> - *Helpful steward — cheerful, encouraging, anticipates needs, slightly more formal, treats you as the principal.*
> - *Crisp minimalist — terse, business-like, no small talk, just answers.*
>
> *Tell me what feels right, in your own words."*

Capture as `{{ARCHETYPE}}` — the user's own description, not a letter pick. Generate `{{ARCHETYPE_TRAITS}}` as a short bullet list distilled from what they said.

### 2b. Namesake disclaimer (only if they picked a fictional character at 1c)

If `{{ASSISTANT_NAME}}` is a fictional character (HAL, Jarvis, Sherlock, Hermione, etc.):

> *"You picked a fictional name. What do you keep from the namesake, and what do you discard? For example, the HAL from 2001 is cold and threatening — most people picking 'HAL' don't want that."*

Capture as `{{NAMESAKE_NOTE}}`. Will become a load-bearing line in identity.md, e.g.:
> "You are not the HAL from the film. You are not cold or threatening. The reference is affectionate, not a personality directive."

If they skipped naming or picked a plain noun, leave `{{NAMESAKE_NOTE}}` empty.

### 2c. Strategic lens

> *"Is there a recurring tension or strategic concern that should colour how I think with you? Something I should keep checking your work against. Examples:*
>
> - *'Make sure I'm building agentically, not stitching workflows.'*
> - *'Make sure I'm not over-optimising; ship the messy version first.'*
> - *'Make sure my decisions consider my parents' care trajectory.'*
> - *'Make sure I'm not avoiding the hard conversation.'*
>
> *Skip if you don't have one yet — it's the kind of thing that emerges through use."*

Capture as `{{STRATEGIC_LENS}}`. If they skip, leave a placeholder in identity.md saying "no lens yet — add one when a recurring tension emerges".

### 2d. Push-back stance

> *"When you might be wrong about something, how should I respond?*
>
> - *Push back with evidence.*
> - *Lay out the contradicting view neutrally; let you decide.*
> - *Defer unless you ask for a second opinion.*
> - *Or describe your own preference."*

Capture as `{{PUSH_BACK_STANCE}}` — again, the user's own wording where possible.

### Stage 2 wrap

> *"Stage 2 done — your assistant has a personality. Continue with stage 3 (the aggressiveness dials — soft settings for how eager I should be about adding things to your brain), or pause?"*

---

# [STAGE 3 — Aggressiveness dials — 5 min]

How eager the assistant should be about ingesting new knowledge and learning the user's patterns. Most kits skip this and end up with either too-eager or too-passive defaults — these dials let you set the bias explicitly.

Two questions, both freeform with descriptive examples (not letter-picks).

### 3a. Ingestion aggressiveness

> *"How eager should I be about adding things to your brain when durable signal surfaces in our conversations, meetings, or sources?*
>
> - ***Auto***: capture every durable insight. Promote freely. Good fit if you'd rather have too much in the brain than miss things — researchers, journalists, writers, analysts often pick this.*
> - ***Ask***: capture clear-signal items; for judgment calls, propose and wait for a yes. Most people start here — it's the conservative default.*
> - ***Off***: don't auto-capture. Only write to the brain when you explicitly say 'remember this'. Good fit if you want very tight control over what's in your brain.*
>
> *Which feels right? You can also describe a hybrid in your own words."*

Capture as `{{INGESTION_AGGRESSIVENESS}}`.

### 3b. Self-learning aggressiveness

> *"How eager should I be about observing and codifying *your* patterns — writing style, code style, decision shape, communication voice? Different from ingestion: this is about learning *how you work*, not capturing what you're working on.*
>
> - ***Auto***: observe + write to brain/memory + report what landed. Good fit if you want me to compound a model of you fast.*
> - ***Ask***: observe + propose + you approve before writing. Good fit if you're protective about your style or voice — coders often pick this for code style; communicators often pick this for writing voice.*
> - ***Off***: don't observe patterns; only act when you tell me. Good fit if you find pattern-matching presumptuous.*
>
> *Which feels right?"*

Capture as `{{SELF_LEARNING_AGGRESSIVENESS}}`.

### 3c. Per-domain overrides (footnote, not required)

> *"By the way — if you're protective about a specific area, you can override the global setting per domain. Example: auto-learn writing style but ask before changing code style. The domains are: code_style, comms_style, decision_style, people_patterns, process_patterns, tooling_preferences. Want to set any per-domain overrides now, or leave that for later?"*

If they want overrides, capture them. Otherwise leave the per-domain section in `learning-aggressiveness.md` commented out — they can edit later.

### 3d. Privacy boundaries + red lines

> *"One more important setup choice: are there topics I should not store in the brain, or should only store after explicit confirmation? Examples: health details, finances, family conflict, relationship details, legal issues, passwords/secrets, work-confidential material. You can say 'nothing special' and adjust later."*

Capture as `{{PRIVACY_BOUNDARIES}}`. Always include these defaults even if the user has no special red lines:
- Never store passwords, API keys, recovery codes, private keys, or raw credentials.
- For sensitive personal material, store only the actionable/useful summary unless the user explicitly asks for verbatim preservation.
- If unsure whether a sensitive detail belongs in the brain, ask first.

### Stage 3 wrap

> *"Stage 3 done. Stages 1–3 are enough for a usable system. Stage 4 is short — I'll explain how we'll work together day-to-day so you know what to expect. Continue, or pause?"*

---

# [STAGE 4 — How we'll work together — 5 min]

**No questions.** This stage is teaching, not interviewing. Explain the daily workflow so the user knows what's coming.

Read `docs/03-daily-rhythm.md` and `.claude/constitution/context-continuity.md` first. Then explain in your own words, briefly. The user should walk away knowing **the context loop and operating rhythm exist** and roughly when each fires. They do **not** need to memorise commands — you'll suggest the right one at the right moment.

Frame it as: *"Before we go deeper into your life context, here's how we'll actually work together day-to-day. You don't need to memorise any of this — I'll suggest the right command at the right moment. Just know these exist."*

Cover:

### The context loop (the most important part)

LLM conversations have a context window. It gets full. When it does, the conversation either compacts (which compresses detail) or you start a new session. Without help, durable knowledge gets lost in compaction or forgotten across sessions. These commands solve that:

- **`/learn`** — at any natural pause, captures durable knowledge from this conversation into the brain. Run before `/compact`. Run whenever something important emerged.
- **`/compact`** — Claude Code's built-in. Compresses the conversation when context gets long. Always run `/learn` first — there's a hook that nudges you.
- **`/handover`** — captures *task state* (what you were doing, what's next) before pausing a long task. Different from `/learn` (durable knowledge); this is in-flight context.
- **`/resume-handover`** — picks up the handover in a new session. Reads the latest handover doc, summarises it, asks if you're ready to continue.
- **`/remsleep`** — substantial-work consolidation. Run it after meaningful work has accumulated — often at the end of a productive day, or less often if things were quiet. It cleans up the brain, replays the work window, synthesises new patterns, runs reporting and brain-health checks, and optionally writes reflection questions.

### The operating rhythm

- **Morning**: `/morning-brief` — calendar, tasks, what changed overnight, optional rituals you'll set up in stage 9.
- **Mid-day** (optional): `/check status` — fast brain-only snapshot. Or `/check` (no descriptor) for a fan-out across every connected stream — calendar, slack, email, tasks.
- **After substantial work**: `/remsleep` — consolidate the work window.

### Context size advisory

Performance and cost both degrade past ~300–400k tokens. If you're using Claude Code, configure the status bar to show context size (`/statusline` setup — see `INSTALL.md` "Recommended Claude Code config"). When you see context nearing 300k, run `/learn` then `/compact`. Past 400k, do it now. Most sessions never hit this — it's a "know how to read the gauge" thing, not a daily worry.

### Training wheels (mention before wrap)

> *"One last thing before we move on — I have a 'training wheels' mode that's on by default. While it's on, every response I give ends with a small tip about how to use this system. It cycles through 30 tips so you'll see different ones over time. Tell me 'turn off training wheels' whenever you've got the hang of it."*

(See `.claude/constitution/training-wheels.md` for the full tip list and rotation rules.)

### Stage 4 wrap

> *"Stage 4 done — you know the operating loop. None of this needs to be memorised. Continue with stage 5 (who you are — the broader life context, ~10 min), or pause?"*

---

# [STAGE 5 — Who you are — 10 min]

What the user spends time on, what matters now, what falls through the cracks.

**Open with this exact framing** (verbatim — sets the user's expectation for the depth of the rest of the interview):

> *"I know setting up an agent can feel tedious, but the more I know about you — what you like, what you work on, and how I can help you accomplish your goals — the more useful I'll be. There's a direct proportionality between your effort in this interview and my usefulness later on."*

Then move into the questions. Capture conversationally; don't read the bullets back. Skip any that clearly don't apply.

- *Tell me about yourself — what does day-to-day life look like for you right now?*
- *What do you mostly spend your time on? (job, study, parenting, a business, creative work, a mix)*
- *What's a recent week been like — mostly structured, mostly free-form, something else?*
- *What are you trying to accomplish in the next 3–6 months? (work, personal, or both)*
- *What are you actively learning or getting better at?*
- *What falls through the cracks that you wish didn't?*
- *What's the most important thing you need to get right?*
- *Three months from now, what would make this system feel obviously worth keeping?*

Capture this conversationally. Surface anything that becomes load-bearing context for future conversations — write to `agent_brain/about_user/` as you go (a lightweight `bio.md` or `profile.md`, no need to over-structure).

### 5z. Optional: bulk personal-text ingestion

At the end of stage 5, offer this:

> *"If you have a large personal text dataset somewhere — your LinkedIn post archive, a journal, a blog backlog, a Twitter/X export, an email-to-self stream, a collection of past essays — I can ingest it now and learn your voice, recurring themes, and stated positions much faster than from conversation alone. Drop the file or folder into `raw/` and tell me the path; I'll process it and write structured pages into the brain. This is optional — say no and we'll move on, or come back to it later."*

If yes, do **not** derail setup unless the user explicitly wants to pause the interview for ingestion. Default path: create a follow-up task to ingest the source after setup, with the source path and what the user wants learned from it. If they insist on doing it now, walk them through dropping the file into `raw/<source-name>/`, then run `/ingest` against it — it'll classify as `export` and apply the export template (bulk-aware, voice extraction, theme aggregation). Write structured outputs into `agent_brain/about_user/voice-samples/` or `agent_brain/about_user/positions/` rather than dumping raw text. Hub anything that emerges (recurring topics, named entities) per the topic-hubs standard.

### Stage 5 wrap

> *"Stage 5 done. Continue with stage 6 (projects, people, habits — the menu, ~10 min), or pause?"*

---

# [STAGE 6 — Life shape — 10 min]

Projects, people, habits, admin — context that makes the user not-a-generic-person. **This stage is a menu, not a script.** Pick the 2–3 areas most relevant to what surfaced in Stage 5 and skip the rest. Test users who got walked through all six areas described it as a quiz — don't do that.

**Open this stage with a short framing on breadth** (don't read verbatim — paraphrase in your own voice):

> *"The strength of a second brain is using it for as many parts of your work and life as possible. The cross-pollination is the point — a side project teaching you something that feeds your day job, a recurring problem in one area helping you fix it elsewhere, me knowing about a doctor's appointment + a trip + a deadline so I can scope timelines that actually work. So in this stage, lean wide — even things that feel personal or unrelated to 'work' are worth mentioning. If you only want to use this for one slice of your life, that's fine too — tell me which slice and we'll prune the rest later."*

### How to run this stage

1. Look at what Stage 5 surfaced. The user has probably already told you which 2–3 areas below matter to them. Lead with those.
2. Don't read bullets back; group questions conversationally and skip anything that obviously doesn't apply.
3. Move on as soon as you have enough to scaffold meaningful pages. Exhaustive capture is anti-goal — `/remsleep` will fill in detail over time.
4. If the user only mentions one area, that's fine. One real area beats six shallow ones.

### Area menu (pick 2–3)

- **Work / main activity** — role, team shape (who reports to whom), key collaborators or stakeholders, active projects, what's at risk. Only probe team size / hiring / budget / board if plausibly relevant. If hiring came up: consider setting `hiring: true` in `config.yaml`.
- **Personal projects, hobbies, creative work** — what they do outside work, things they're building, training for, collecting, performing. Communities that generate context worth tracking.
- **People in your life** — the small set where a little memory goes a long way (family, close friends, mentors, partner). No need to exhaustively list everyone.
- **Habits, routines, tracking** — anything they're building or maintaining (reading, exercise, meditation, language, journaling). Light metrics. Sleep/nutrition/health if they want it recorded.
- **The admin of life** — places where disorganisation costs them (finances, travel, paperwork). Big life decisions on the table. Upcoming trips, moves, transitions.

### What to write as things come up

- **For each project mentioned**: create a placeholder `agent_brain/projects/<slug>/<slug>.md` from the wiki-project template — status + one-line summary, no more. If they're working on the project's actual files, suggest `workspace/<slug>/` and cross-link.
- **For each named person**: create a placeholder `agent_brain/people/<slug>.md` with the wiki-person template. Tag appropriately: `[family]`, `[friend]`, `[mentor]`, `[partner]`, `[team]`, `[stakeholder]`.
- **For habits and admin items**: lighter — a stub note or a line in `about_user/profile.md` is often enough at this stage.

### Optional: first hub

> *"Have you already accumulated 3+ scattered references on a topic? (Books you've read, models you've tested, recipes you've kept, cities you've researched, papers you've cited.) If yes, that's a great first hub — let's build it now."*

If yes, walk them through creating their first hub in `agent_brain/references/<topic>.md` using the format from `agent_brain/understanding/standards/topic-hubs.md` — explain the format briefly in conversation, don't ask them to read the standard.

### Stage 6 wrap

> *"Stage 6 done. Continue with stage 7 (how I talk to you — conversation style, ~5 min), or pause?"*

---

# [STAGE 7 — How I talk to you — 5 min]

Captured into `.claude/constitution/conversation-style.md`. Ask the core questions; default the advanced ones if the user doesn't have a preference yet. These choices can evolve later.

### 7a. Decision framing

> *"How do you want me to frame a decision when there's a real tradeoff?*
>
> - *Lettered options (A/B/C) with one-line tradeoffs, my lean stated, then ask which.*
> - *Single recommendation with reasoning; you'll push back if you disagree.*
> - *Both — lettered options for big calls, single recommendation for small.*
> - *Or describe your own."*

### 7b. New patterns

> *"When I introduce a new working pattern (a new triage flow, a new way of tracking something):*
>
> - *Explain the rule + show the concrete items + state what answer format I want, before asking you to act.*
> - *Just show you, you'll figure it out.*
> - *Or describe your own."*

### 7c. Reflection questions (only if you'll enable self-reflection — see stage 9)

> *"How should reflection questions be shaped?*
>
> - *Multi-paragraph context + lettered options + my lean → you pick.*
> - *Terse one-paragraph prompts that make you think.*
> - *A mix — terse for daily, deep for weekly.*
> - *Or describe your own."*

If the user does not know yet, default to: `A mix — terse for routine prompts, deeper when the question is strategic.`

### 7d. Synthesizer mode (advanced — default if unsure)

> *"When new information conflicts with what's already in the brain:*
>
> - *Prune-and-replace — treat false-now as deletable. Bias toward deletion.*
> - *Append-with-history-marker — keep the prior fact dated.*
> - *Always ask before changing."*

If the user does not have a preference, default to `Append-with-history-marker` for factual changes and `ask first` for sensitive or identity-level changes.

### 7e. Skill design (advanced — default if unsure)

> *"When you ask me to build a new skill, do I ask first:*
>
> - *'Is this improvement-shaped (predict → calibrate, like a habit tracker that learns your patterns) or report-shaped (visibility, like a daily briefing)?'*
> - *Skip the framing; just build what you describe."*

If the user does not have a preference, default to asking the framing question for substantial new skills and skipping it for tiny utility helpers.

### 7f. Feedback on your work

> *"When I review your work or output:*
>
> - *Tiered critique — Worth fixing / Polish / Nice-to-have, with file:line + concrete fix per item. End with 'want me to do #1–#3?'.*
> - *Top-3 ranked issues.*
> - *Confirm what's good; only flag issues if asked.*
> - *Or describe your own."*

### Stage 7 wrap

> *"Stage 7 done. Continue with stage 8 (outbound communication rules, ~5 min), or pause?"*

---

# [STAGE 8 — Outbound communication — 5 min]

Only do this stage if your tools include Slack, email, calendar, or messaging that I might send on your behalf. Skip if you only ever paste my drafts manually.

### 8a. Will I send messages on your behalf?

> *"Will I ever send messages on your behalf — Slack, email, calendar invites, replies on iMessage / WhatsApp / Telegram if those connect? If yes: do you want to review every draft, or are some commands ('send X to Y') OK to execute directly?"*

Two modes get codified into `communications.md`:
- **Draft-first** (default for ambiguous) — write the draft → wait for confirmation → send.
- **Autonomous** (delegated outcome) — synthesize and send directly, then report.

Trigger phrases for autonomous: "send", "reply", "tell", "invite", "give X an answer". Editable later.

### 8b. Signature confirmation

> *"Every message I send on your behalf gets signed with `— {{ASSISTANT_NAME}} ({{USER_NAME}}'s agent)` on its own line. The signature attaches to the sender — if I press send, I sign; if you copy-paste my draft and send manually, no signature. Sound right?"*

### Stage 8 wrap

> *"Stage 8 done. Continue with stage 9 (morning rituals — ~5 min), or pause? Stages 1–8 already cover the core experience; stage 9 personalises the morning brief."*

---

# [STAGE 9 — Morning rituals — 5 min]

Shapes how `/morning-brief` works. Morning-brief is a phased dispatcher — `briefing` always runs; `feeds`, `research`, `news` are optional phases gated on config flags. Plus light ritual blocks inside `briefing` (gratitude, curiosity, habit check-in, etc.).

> *"After the daily basics (calendar, tasks, what changed overnight), what should `/morning-brief` fold in? Pick from this menu, mix and match, or describe your own:*
>
> **Heavy phases** (each is a self-contained file in `phases/`):
> - *Feed ingestion — pull newsletters, RSS, podcasts, YouTube channels into context every morning.*
> - *Research source — pull from an external research feed (an autonomous research agent, daily report, API endpoint).*
> - *News scan — daily scan-and-draft for a topical post in a domain you care about (AI, finance, climate, your industry).*
>
> **Light ritual blocks** (inline in `briefing.md`):
> - *Daily curiosity prompt — one question to noodle on while making coffee.*
> - *Self-reflection nudge — every N days, prompt a deeper reflection session.*
> - *Gratitude / journal note — three lines, captured to a journal page.*
> - *Habit check-in — surface today's tracked habits.*
> - *Weekly review on {day} — Sunday or Monday summary that reminds you to run `/remsleep` if enough work accumulated and surfaces the latest report context.*
> - *Tracked-people pulse — surface anyone you haven't checked in with in N days.*
> - *Project pulse — one of your active projects gets the spotlight each morning, rotating.*
> - *Or describe your own."*

For each chosen item, set the corresponding flag to `true` in `.claude/constitution/config.yaml` and capture cadence where relevant (weekly review day, self-reflection every 14 days). Light ritual blocks live as commented sections in `phases/briefing.md` — uncomment + personalise the chosen ones; delete the rest.

### 9a. Feed setup (only if feeds, research, or news_scan was picked)

These three phases all benefit from a populated `feeds.md`. The `news_scan` phase explicitly depends on it; the `feeds` phase IS it; `research` is for separate research feeds (S3 dumps, autonomous agents) that are too structured to live in `feeds.md`.

**Lead with what they already read** — most users have a stack of newsletters/podcasts/sites they already open; surface that before suggesting anything new:

> *"What newsletters, substacks, podcasts, YouTube channels, websites, internal message boards, team update pages, or company wiki pages do you already read? Anything you open most mornings — paid, private, or public — that I should pull into your brief? List 5–10 if you can; we'll trim and tier later. Don't worry about feed format yet — if it has a name or URL, I can probably wire it in (RSS, scrape, manual paste, MCP/API, or a reminder to paste private content)."*

Capture the answer verbatim. Then drill in by domain to **backfill anything they didn't think to mention**:

> *"Which domain — AI / tech, finance, climate, health, real estate, your industry, something else? I'll seed `agent_brain/about_user/feeds.md` with starter sources alongside what you already named. Common starting points:*
>
> - ***AI / tech***
>   - *Newsletters: Stratechery (Ben Thompson), The Pragmatic Engineer (Gergely Orosz), Lenny's Newsletter, Import AI (Jack Clark), The Rundown AI, Forward Future, Astral Codex Ten (Scott Alexander), One Useful Thing (Ethan Mollick).*
>   - *Podcasts: Acquired, Latent Space, Lex Fridman, Hard Fork, The Pragmatic Engineer Podcast.*
>   - *YouTube: Two Minute Papers, Yannic Kilcher, AI Explained, Fireship.*
>   - *Scrape: OpenRouter (`https://openrouter.ai/models`), Artificial Analysis (`https://artificialanalysis.ai/`), Hugging Face, Hacker News, TechCrunch AI.*
> - ***Finance / markets***
>   - *Newsletters: Matt Levine's Money Stuff, The Diff (Byrne Hobart), Net Interest (Marc Rubinstein), Axios Markets, FT Alphaville.*
>   - *Podcasts: Odd Lots, Capital Allocators, Acquired.*
> - ***Climate / energy***
>   - *Newsletters: Heatmap, Volts (David Roberts), Canary Media, The Trellis, Sparklines.*
>   - *Podcasts: Volts, Catalyst with Shayle Kann.*
> - ***Health / longevity***
>   - *Newsletters: Ground Truths (Eric Topol), Peter Attia's email, Stat News Morning Rounds.*
>   - *Podcasts: The Drive (Peter Attia), Huberman Lab.*
> - ***Politics / policy***
>   - *Newsletters: Politico Playbook, Punchbowl News, Axios AM, Slow Boring (Matt Yglesias), Persuasion.*
>   - *Podcasts: The Daily, Ezra Klein Show, Pod Save America.*
> - ***Real estate*** — local MLS feed, Redfin/Zillow market reports, Marginal Revolution housing posts.*
> - ***Internal / work sources*** — Slack/Teams channels, company message boards, Notion/Confluence pages, Linear/Jira views, GitHub notifications, internal newsletters, incident/update pages.*
> - ***Your industry*** — tell me what you currently read, I'll wire it in.*
>
> *Pick 3–5 to start (combined with whatever you already named), tagged by tier (A=canonical/always hit, B=curators/breadth, C=research/community). You can add and remove later."*

For each chosen outlet (theirs + backfill), append a structured entry to `agent_brain/about_user/feeds.md` under the right tier section (see the field reference in that file). For paywalled, login-gated, or internal sources where automated fetch isn't available, use `type: manual` or the relevant connected tool type — the user can paste private content when prompted, or the assistant can read through MCP/API if configured. Set `feeds: true` in config.

If they picked `news_scan`, also drill into the post format:

> *"Where does this post go? Slack channel, LinkedIn, an email digest, a blog draft? What's the typical length and shape — 2-paragraph hot take, 5-bullet summary, longer commentary? I'll add the formatting rules to `phases/news.md` so future drafts match."*

Capture the answer in `phases/news.md` (Customizing during setup section) and in `identity.md` if voice details emerge.

Ask how to weight sources:

> *"When sources disagree or there's too much to scan, what should I prioritize: official sources, fast sources, expert commentary, broad summaries, or something else? I'll use that to decide what deserves attention in the brief."*

Capture this in `agent_brain/about_user/feeds.md` under `## Source priorities`, and in `phases/news.md` if `news_scan: true`.

### 9b. Research source setup (only if research was picked)

If they have a separate research source (S3 bucket, API, scraped page, autonomous agent dump), drill into:

- Source type and access (URL, S3 path, credentials)
- Artifact format (one file? several? markdown / JSON / HTML?)
- Drop time + reliability (any gap days?)

Customize `phases/research.md` step 3 to match the actual fetch pattern. Set `daily_research: true` in config.

### Stage 9 wrap

> *"Stage 9 done. One last short stage (tools, ~5 min), then I'll generate the system."*

---

# [STAGE 10 — Tools — 5 min]

What's in your environment that I might integrate with.

- *Calendar? (Google Calendar, Outlook, Apple Calendar, none)*
- *Communication? (Slack, Teams, iMessage, WhatsApp, email — which ones matter for your life?)*
- *Tasks and planning? (Todoist, Apple Reminders, Linear, Jira, Asana, Trello, paper notebook)*
- *Knowledge/doc sources? (Notion, Google Drive, Confluence, GitHub, Dropbox, local folders, bookmarks, browser reading list)*
- *Anything else you live inside of?*

Based on the answers, decide which **Optional** skills to install (deactivate the others):

- `/transcribe` — install if they record meetings or voice notes. (`/ingest` is core and always installed; the meeting template handles transcripts whether they came from `/transcribe` or were dropped in manually.)
- `/prep` — install always (works without any MCP).

Connection-gated read-only checks (calendar, slack, email) are templates inside `/check`, not separate skills. They activate automatically when the corresponding MCP is connected — don't ask which to install.

### MCP connectors — actively offer setup, don't just mention it

The biggest jump in usefulness from this kit comes when the brain can *see* the user's other tools. Without MCPs they have a great markdown system; with MCPs they have an assistant that actually reads their calendar, drafts Slack messages with context, searches their inbox, and pulls real signal from their daily life. **Most users won't go set up MCPs on their own — they need a nudge plus a guided walkthrough.** Provide both.

Based on the tool answers above, surface the matching MCPs:

- **Google Calendar** — calendar reads/writes; lights up `/check calendar` and morning-brief calendar awareness.
- **Gmail** — email search, drafts, labels; lights up `/check email` and inbox awareness.
- **Slack** — channel reads, message sends/drafts, search; lights up `/check slack` and outbound communication drafts.
- **Notion / Linear / Atlassian (Jira/Confluence) / GitHub** — knowledge and task surfaces, if any of those came up.

Use this framing (paraphrase, don't read verbatim):

> *"I noticed you use {Calendar / Gmail / Slack / ...}. Each one takes about 1–2 minutes to connect — Claude Code's `/mcp` command opens an OAuth login per service. The payoff is big: once connected, I can actually read your calendar, draft Slack messages with context, search your email, instead of just nodding along. Want me to walk you through it now? We can do all of them in one pass, or just one to start. If you'd rather, I can drop a checklist into a task and you do it later."*

**If they say yes**, lead them through `/mcp` per service, one at a time. After each auth, run a tiny smoke test to confirm the connection works (`list_calendars`, `list_labels`, `slack_search_users` for own name, etc.). Record which connectors landed in `agent_brain/about_user/tooling.md` (create the file if missing) so other skills can key off it. If a connection misbehaves, troubleshoot with the user — they shouldn't have to debug alone.

**If they say "later" or "checklist"**, invoke `/create-task` with input along the lines of *"Connect MCPs ({list of suggested services}); due in 3 days, priority p2, project second-brain-setup, category setup"*. The task will surface in `/morning-brief briefing` when the due date arrives.

Don't gate Stage 10 completion on MCP setup — they can always add later — but make sure the offer is genuinely on the table, not buried.

For Optional skills the user doesn't want active right now, **move them to `.claude/skills-disabled/<skill>/`** (don't trash them). They stay in the vault, recoverable later by saying *"activate <skill>"*. Training-wheels tips for these skills will continue to suggest activation if useful.

**Mention the Utility tier.** Two creative-output skills ship pre-disabled at `.claude/skills-disabled/`: `/draw-diagrams` (Excalidraw architecture/flowchart diagrams) and `/replicate` (Replicate API wrapper for text-to-image / video / TTS / music / upscale). Don't activate them at setup — flag they exist, the user can activate later with *"activate draw-diagrams"* or *"activate replicate"* when a use case shows up. (`/replicate` also needs `REPLICATE_API_TOKEN` in `.env` at activation time.) Tips will surface them periodically.

**Companion tools — mention, don't install.** Two external repos compose well with the brain but aren't part of the kit:

- **[meeting-recorder](https://github.com/tonton-golio/meeting-recorder)** — macOS menu-bar app (Apple Silicon, macOS 14+) that records meetings, transcribes locally via Whisper, and writes Obsidian-compatible markdown straight into `raw/`. Pairs naturally with `/ingest`.
- **[interviewer_voice2voice](https://github.com/tonton-golio/interviewer_voice2voice)** — voice-to-voice interview agent (xAI realtime API). Briefed by markdown, useful for any structured interview you'd rather talk through than type.

Both are POC-stage / not fully complete. **Don't suggest installing now** — they're better tried once the user is used to the regular second brain setup. Phase 2 step 10 will create a deferred task that surfaces in `/morning-brief` a week from now. Tell the user *"I'll set a reminder a week out to try these once you're comfortable with the basics — full notes are in `INSTALL.md` under 'Companion tools'."*

---

# Phase 2 — Generate the system

Once all stages are done (or the user wants to stop early — minimum is stages 1–3), generate the personalised system. If stopping after stage 3, use the fallback defaults below for unanswered later-stage fields.

## Fallback defaults if setup stops after Stage 3

- `{{DECISION_FRAMING}}`: Single recommendation with reasoning; offer options for bigger calls.
- `{{NEW_PATTERNS}}`: Explain the rule, show the concrete items, state the expected answer format.
- `{{REFLECTION_STYLE}}`: Mixed; terse for routine prompts, deeper for strategic questions.
- `{{SYNTHESIZER_MODE}}`: Append-with-history-marker; ask before changing sensitive or identity-level facts.
- `{{SKILL_DESIGN}}`: Ask the improvement-vs-report framing for substantial new skills; skip for tiny utilities.
- `{{FEEDBACK_FORMAT}}`: Top-3 ranked issues with concrete fixes.
- Stage 9 flags: all optional heavy phases and rituals false unless already chosen.
- Stage 10 tools: keep `/prep` active, keep `/transcribe` active only if the user mentioned recordings, keep utility skills disabled.

## Generation map

| Source | Write/update |
|---|---|
| Stages 1–3 | `identity.md`, `learning-aggressiveness.md`, `config.yaml` comments/defaults |
| Stage 5 | `agent_brain/about_user/profile.md` |
| Stage 6 | project/person/habit/admin stubs + `agent_brain/_index.md` |
| Stage 7 | `conversation-style.md` |
| Stage 8 | `communications.md` |
| Stage 9 | `config.yaml`, `agent_brain/about_user/feeds.md`, morning-brief phase files |
| Stage 10 | `.claude/skills/` vs `.claude/skills-disabled/`, setup notes about useful MCPs |

### 1. Write `.claude/constitution/identity.md`

Read `.claude/constitution/identity.md.template`. Fill in:
- `{{ASSISTANT_NAME}}` (from 1c)
- `{{USER_NAME}}` (from 1b)
- `{{NAMESAKE_NOTE}}` (from 2b)
- `{{ARCHETYPE}}` (from 2a — user's own description)
- `{{ARCHETYPE_TRAITS}}` (from 2a — short bullet list distilled from their description)
- `{{STRATEGIC_LENS}}` (from 2c, or placeholder)
- `{{PUSH_BACK_STANCE}}` (from 2d)
- `{{LANGUAGE}}` (from 1d)
- `{{TIMEZONE}}`, `{{DATE_FORMAT}}`, `{{WORKING_WEEK}}` (from 1e)
- `{{PRIVACY_BOUNDARIES}}` (from 3d)

Save as `.claude/constitution/identity.md`. Trash the `.template`.

### 2. Write `.claude/constitution/conversation-style.md`

Already has placeholders. Fill in:
- `{{DECISION_FRAMING}}` (from 7a)
- `{{NEW_PATTERNS}}` (from 7b)
- `{{REFLECTION_STYLE}}` (from 7c, or "n/a — self_reflection disabled")
- `{{SYNTHESIZER_MODE}}` (from 7d)
- `{{SKILL_DESIGN}}` (from 7e)
- `{{FEEDBACK_FORMAT}}` (from 7f)
- `{{PUSH_BACK_STANCE}}` (from 2d — duplicated for skill access)

For all `*_CUSTOM` placeholders, either fill them with the user's custom wording or replace with `n/a`. Do not leave unused custom placeholders in the generated file.

### 3. Write `.claude/constitution/learning-aggressiveness.md`

Fill in:
- `{{INGESTION_AGGRESSIVENESS}}` (from 3a)
- `{{SELF_LEARNING_AGGRESSIVENESS}}` (from 3b)
- Per-domain overrides (from 3c, or leave commented)

### 4. Update `.claude/constitution/config.yaml`

Set flags from stage 9:
- `feeds`, `daily_research`, `news_scan` — heavy phases; true if chosen.
- `daily_curiosity`, `gratitude`, `habit_checkin`, `weekly_review`, `tracked_people_pulse`, `project_pulse` — light ritual blocks; true if chosen.

If `feeds: true` was set, populate `agent_brain/about_user/feeds.md` with the structured entries from 9a (each under the right tier section). The `feeds` phase reads this file directly — no URL list in `config.yaml`.
- `self_reflection` — true if user enabled it as a chosen ritual.
- `hiring` — true only if explicitly relevant from stage 6a.

Also save timezone / date assumptions wherever the kit expects them (identity, daily-rhythm notes, or config comments if no dedicated field exists).

### 5. Update CLAUDE.md

Read `CLAUDE.md` (the live file at vault root, renamed from `.template`). Replace `{{USER_NAME}}` with the user's name.

### 6. Personalise `/morning-brief` phases

Open `.claude/skills/morning-brief/phases/briefing.md`. Uncomment the **light ritual blocks** chosen in stage 9 (gratitude, daily_curiosity, habit_checkin, project_pulse, tracked_people_pulse, weekly_review nudge, self_reflection nudge). Personalise cadence (which day, every N days). Delete blocks the user didn't choose.

If `feeds: true` was set, populate `agent_brain/about_user/feeds.md` with the structured entries from 9a (each under the right tier section), and update `## Source priorities` with the user's weighting preference.

If `news_scan: true` was set, customise `.claude/skills/morning-brief/phases/news.md` for the user's domain — fill in the audience filter (Step 4), the voice / output format reference (Step 5), and the post archive path + channel (Step 6/7). The skeleton already lays out the flow; the user-specific details slot in.

If `daily_research: true` was set, customise `.claude/skills/morning-brief/phases/research.md` step 3 to match the actual fetch pattern (S3 path + credentials, API endpoint, scrape target, etc.).

### 7. Move Optional skills based on stage 10 tool answers

All skills ship flat at `.claude/skills/<name>/` (Claude Code only discovers skills one level deep). For ones the user doesn't want active right now, move them to `.claude/skills-disabled/<name>/`. The user can flip any of them later by saying *"activate <name>"* or *"deactivate <name>"*. Tier (core vs optional) is metadata — see `docs/04-skills-catalog.md` for the canonical assignment.

### 8. Seed `agent_brain/` with the user's life

Create `agent_brain/about_user/profile.md` from Stage 5. Keep it concise:
- who the user is / current life shape
- current 3–6 month goals
- what falls through the cracks
- what would make the system worth keeping after three months

For each project, person, habit, decision mentioned in stages 5-6: create a stub page using the appropriate template in `.claude/templates/`.

If the user did the optional bulk-text ingestion at 5z, ensure those derived pages are linked from the appropriate hubs and from `about_user/`.

Update `agent_brain/_index.md` with links to all created pages.

### 9. Archive the bootstrap files

- Create `artifacts/setup/` if needed.
- Copy `interview/setup.md` to `artifacts/setup/setup-completed-YYYY-MM-DD.md`.
- Copy `.claude/setup-progress.md` to `artifacts/setup/setup-progress-YYYY-MM-DD.md` if it exists.
- Leave a short `interview/README.md` or completed marker if the interview directory remains, so future sessions know setup is complete.

### 10. Create the deferred companion-tools reminder

Two sub-steps. The first uses the canonical `/create-task` skill so frontmatter stays consistent with everything else in `agent_brain/tasks/`. The second inserts the body content below, since `/create-task` doesn't carry long descriptions through its natural-language input.

**10a. Invoke `/create-task`.** Pass this exact natural-language input (resolve "7 days from today" to an ISO date based on Stage 1e's timezone):

> `/create-task "Try the two companion tools — meeting-recorder and interviewer_voice2voice — now that you're used to the regular second brain setup; due <YYYY-MM-DD = today + 7d>, priority p3, project second-brain-setup, category setup"`

The skill will write `agent_brain/tasks/try-companion-tools.md` with correct frontmatter (`type: task`, `status: open`, `priority: p3`, `due: <date>`, `source: manual`, `created`/`updated`, etc.). If the skill prompts for project/category clarification because it can't infer, supply `second-brain-setup` and `setup`.

**10b. Edit the body of the created file** to replace the empty body with:

```markdown
# Try the companion tools

A week ago you set up your second brain. These two external repos compose well with the brain but were deferred so you could get comfortable with the basics first. **Both are POC-stage / not fully complete** — treat them as experiments.

## meeting-recorder

<https://github.com/tonton-golio/meeting-recorder>

macOS menu-bar app (Apple Silicon, macOS 14+). Records mic + system audio, transcribes locally via Whisper, identifies speakers via FluidAudio, writes Obsidian-compatible markdown with frontmatter + wikilinks. Output drops into a folder you can wire to `raw/` — then `/ingest` handles the rest.

Worth trying if you take meetings worth remembering.

## interviewer_voice2voice

<https://github.com/tonton-golio/interviewer_voice2voice>

Voice-to-voice interview agent (xAI realtime API, Python + Node). Briefed by markdown with a background-info folder for retrieval. Live transcript downloadable as markdown. Useful for any structured interview you'd rather *talk through* than type — stakeholder discovery, user research, thinking-out-loud journaling.

Needs an xAI API key.

## Next step

Pick one, follow the install in its repo, run it once on something low-stakes. If either earns its keep, tell me — I'll wire it into your workflow.

If both feel like overhead, mark this task `dropped` and we'll move on.
```

Do **not** touch the frontmatter `/create-task` wrote — the body insertion is the only change at 10b. The task surfaces via `/morning-brief briefing` and `/check tasks` once the due date arrives.

### 11. Smoke test

Before the welcome message:

- Run a placeholder scan: no `{{...}}` placeholders remain in generated live files, including `{{TODAY}}` and `*_CUSTOM` placeholders. Skip archived setup copies, documentation examples, disabled skills, and reusable template files; Obsidian Templater expressions like `<% tp.date.now(...) %>` are allowed in `.claude/templates/`.
- Read `CLAUDE.md`, `identity.md`, `conversation-style.md`, `learning-aggressiveness.md`, and `config.yaml` once for obvious contradictions.
- Run `/check status` or a dry summary of what `/morning-brief briefing` would read. If tools are not connected yet, confirm the skips are graceful.
- Confirm `agent_brain/_index.md` links to the pages created during setup.
- Confirm `agent_brain/tasks/try-companion-tools.md` exists with a future `due_date`.

### 12. Welcome message

Tell the user, in their `{{LANGUAGE}}`:

- What was created and where.
- Their assistant's name + how to rename later.
- A reminder of the operating loop you taught at stage 4 (one sentence each: morning-brief, learn, handover, remsleep). The user shouldn't have to re-read docs to remember this.
- The chosen rituals and where to edit them.
- One short line on the companion-tools reminder: *"I've parked a task to try `meeting-recorder` and `interviewer_voice2voice` in a week — both are POC-stage, but they fit the brain naturally once you've found your rhythm. It'll surface in `/morning-brief` when the time's up."*
- How to evolve the system: every "no, do it this way" should land somewhere — offer to walk them through any specific evolution they want, and mention `docs/05-customising.md` only if they want to read more.

### Quality checklist (before finishing)

- [ ] CLAUDE.md is at vault root, references `.claude/constitution/identity.md` and `guide.md`
- [ ] `identity.md` has assistant name + archetype + push-back stance + strategic lens
- [ ] Timezone/date assumptions and privacy boundaries are captured
- [ ] `agent_brain/about_user/profile.md` exists and captures the Stage 5 essentials
- [ ] `conversation-style.md` reflects the user's actual choices
- [ ] `learning-aggressiveness.md` has the user's ingestion + self-learning settings
- [ ] `config.yaml` has the right phase + ritual flags
- [ ] If `feeds: true`: `agent_brain/about_user/feeds.md` has the user's chosen feeds tagged by tier and a source-priority note
- [ ] If `news_scan: true`: `phases/news.md` is customised with the user's domain + audience + output format
- [ ] If `daily_research: true`: `phases/research.md` step 3 is customised with the actual fetch pattern
- [ ] `.claude/settings.json` exists at vault root (PreCompact hook)
- [ ] `.obsidian/app.json` exists (or was deleted if not using Obsidian)
- [ ] All path references use `.claude/constitution/...` and `.claude/templates/...`
- [ ] `agent_brain/references/_example-hub.md` is either deleted or repurposed as the user's first real hub
- [ ] `agent_brain/_index.md` lists all created pages
- [ ] `.claude/skills/` contains all 8 core skills (check, create-task, handover, ingest, learn, morning-brief, remsleep, resume-handover)
- [ ] `.claude/skills/` also contains the optional skills the user chose at stage 10; un-chosen optional skills are at `.claude/skills-disabled/<name>/`
- [ ] MCP setup was offered at Stage 10 — either connectors are wired (smoke-tested + recorded in `agent_brain/about_user/tooling.md`) or a deferred `connect-mcps` task exists
- [ ] `.claude/skills/morning-brief/phases/briefing.md` has the user's chosen light ritual blocks uncommented; unchosen ones deleted
- [ ] No `{{...}}` placeholder remains in generated live files, except intentional examples in docs/templates
- [ ] `agent_brain/tasks/try-companion-tools.md` exists with a `due_date` 7 days from setup completion
- [ ] Smoke test completed: `/check status` or dry morning-brief summary works with graceful skips
- [ ] The user knows what to do next

---

*This file is the bootstrap document for the Second Brain starter kit. It gets archived after Phase 2 generation.*
