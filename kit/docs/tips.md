---
summary: "The canonical tip list for training-wheels mode. Single source of truth — the assistant rotates through these 1→30 when training_wheels is on, skipping conditional tips when the condition isn't met."
---

# Tips

When `training_wheels: true` in `.claude/constitution/config.yaml`, the assistant ends every response with one of these tips, rotating in order (1→2→…→30→1).

Some tips are **conditional** (currently Obsidian). The assistant skips a tip if its condition isn't met and picks the next number — so users only see tips relevant to their setup.

You can read them all here in one go. If you'd rather just have clean responses, tell the assistant *"turn off training wheels"* — it'll flip the flag and stop appending them.

---

## First-week basics (1–10)

1. Start with one real source. Drop a transcript, article, journal entry, meeting note, or exported doc into `raw/` and say *"ingest this"*. I'll turn it into linked notes, tasks, people, projects, and references.

2. Tell me about one active project: *"I'm working on X; help me track it."* I'll create the project page, link related people and tasks, and keep updating it as new context appears.

3. Capture action items in plain language. Say *"add a task to follow up with Sam by Friday"* or run `/create-task`; I'll add priority, due date, project links, and a traceable task file.

4. Want me to remember something durable? Say *"remember this: ..."*. I'll put it in the right long-term place instead of leaving it buried in chat.

5. Use `/morning-brief` when you start the day. It gives you a compact orientation: open tasks, relevant context, and any calendar/email/Slack streams you connected during setup.

6. Use `/check status` when you come back after context-switching. It's the quick version: current priorities plus recent brain changes, without scanning external tools.

7. Use `/remsleep` after substantial work — often at the end of a productive day, or less often if things were quiet. It cleans up loose notes, links related pages, catches stale tasks, and produces the full consolidation report.

8. You don't need to know where every file lives. Ask *"where should this go?"* or *"how does X work?"* and I'll answer from the kit docs and the current brain structure.

9. Ask *"what changed recently?"* when you come back after a few days. I'll read the changelog, tasks, and recent brain updates so you don't have to reconstruct state by hand.

10. Training wheels are optional. Say *"turn off training wheels"* whenever you want clean responses.

---

## Core skills + customization (11–20)

11. The brain has three main user-facing areas: `agent_brain/projects/` for ongoing work, `agent_brain/people/` for people, and `agent_brain/references/` for reusable knowledge and topic hubs.

12. Active work lives in `workspace/<project-slug>/`. The matching `agent_brain/projects/<slug>/` page is the memory and context about that work; `workspace/` is where drafts, code, assets, and working files live.

13. `/check` with no descriptor scans the connected streams you set up, such as tasks, calendar, Slack, or email. You can narrow it with `/check tasks`, `/check calendar tomorrow`, or `/check email`.

14. Run `/learn` before `/compact` in long sessions. `/learn` preserves durable decisions, preferences, tasks, and useful context before the chat gets compressed.

15. Run `/handover` when you need to pause a long piece of work. Next session, `/resume-handover` picks up the goal, current state, files touched, and next step.

16. Watch the context-size gauge if your agent CLI shows one. Around 300k tokens, run `/learn` and `/compact`; around 400k, do it before continuing.

17. `/remsleep` is one consolidation action. It includes cleanup, replay, synthesis, graph maintenance, reporting, and brain-health checks in one run.

18. Add more sources to `/morning-brief` when you want richer context: newsletters, RSS feeds, research sites, internal message boards, or team update pages. Say *"add X to my morning brief sources"* and I'll wire it into the right place.

19. Teach me what *"good"* looks like. Show me a post, deck, review, article, or note you respect; I'll save the pattern and use it as a reference next time.

20. Reminder: say *"turn off training wheels"* whenever you've had enough. Even with conditionals filtering, the reminders come back periodically.

---

## Later and optional-tool tips (21–32)

Most of these always show. The Obsidian tip is conditional; the assistant skips it when Obsidian is not part of the setup.

21. I'm not a fixed harness. If you want me to talk differently, prioritise differently, or notice different things — say so. My personality and rules live in `.claude/constitution/` and I can edit them on your word.

22. Two global dials govern how eagerly I capture knowledge and learn your patterns. To change them, edit `.claude/constitution/learning-aggressiveness.md` or ask me to make the behavior more cautious or more proactive.

23. Talking is faster than typing — especially for the setup interview. **Mac**: tap F5 or Fn+F5 for dictation. **Windows**: Win+H. **iOS**: mic icon on the keyboard. **Linux**: depends on your DE. Use it for stage 5 when describing your life context. *(Always show; user adapts to their OS.)*

24. Want a new skill? Say *"make a skill that does X"*. I'll scaffold it, ask you to confirm before installing, and wire it into the system. See `docs/05-customising.md`.

25. Want calendar, email, or Slack context later? Say *"connect Google Calendar"*, *"connect Gmail"*, *"connect Outlook"*, or *"connect Slack"*. Those integrations go through MCP, and I'll walk you through the auth flow.

26. Got a meeting, coffee, or important conversation coming up? `/prep <person-or-topic>` pulls context, open items, and recent updates so you walk in prepared. Run it if active, or say *"activate prep"* if it is disabled.

27. Recordings can become brain context. `/transcribe` turns meeting audio or voice notes into text; `/ingest` then turns the transcript into structured notes, action items, and brain updates. Run it if active, or say *"activate transcribe"* if it is disabled.

28. Diagrams can be generated from plain-language descriptions. `/draw-diagrams` produces editable `.excalidraw` files with PNG previews for architectures, flows, pipelines, and before/after comparisons. Run it if active, or say *"activate draw-diagrams"* if it is disabled.

29. Media generation is available as an optional utility. `/replicate` can create images, short videos, voiceover, music, or upscales and writes a sidecar JSON for each run. Run it if active, or say *"activate replicate"* if it is disabled.

30. **[only if Obsidian]** Open the graph view (`Ctrl/Cmd+G`) to see `agent_brain/` as a network. Hubs become visible clusters; orphans show up too. The Backlinks pane shows every page that links *to* the one you're on.

31. If you're unsure what to do next, ask *"what should I do with this?"* or *"what should I run next?"*. I'll pick the right skill or explain the tradeoff.

32. Don't want a full second brain? Tell me which slice you actually want this for — just work, just side projects, just family logistics, just one project — and I'll prune everything else. The kit is a starting shape, not a required one.

---

## Editing this list

If you want to swap tips, edit this file directly. The training-wheels behaviour reads from here, not from a separate copy.

- Keep the list around ~30 items so rotation completes within a few sessions; growth past that is fine when new tips earn their slot.
- Keep tips at positions 10 and 20 as the *"you can turn this off"* reminders, so the off-switch surfaces early without dominating the rotation.
- Renumber if you add or remove items so rotation stays clean.
- For conditional tips, tag them `[only if <condition>]` in the tip text; the assistant skips and rotates forward when the condition isn't met.
- Conditions the assistant currently understands:
  - `[only if /<skill> available]` — checks `.claude/skills/<skill>/` (active) or `.claude/skills-disabled/<skill>/` (disabled but recoverable)
  - `[only if Obsidian]` — checks `.obsidian/` exists at vault root
- Behaviour rules (when to apply, format, when to skip, off-switch) live in `.claude/constitution/training-wheels.md` — that file references this one for the actual content.
