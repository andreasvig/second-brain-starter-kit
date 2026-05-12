# Training wheels

A new-user onboarding mode. When `training_wheels: true` in `config.yaml`, every assistant response ends with one rotating tip about how to use this system. Helps a brand-new user discover the workflow without reading docs.

Defaults to **on** for fresh installs. Stays on until the user says *"turn off training wheels"* (or anything semantically similar — *"tips off"*, *"stop the tips"*, *"I've got the hang of it"*).

## Where the tip list lives

The canonical tip list is `docs/tips.md` — a numbered list 1→30. Single source of truth. The user can read all tips in one go there; the assistant rotates through them per the rules below. **Do not duplicate the list inside this file.** If a tip needs editing, edit `docs/tips.md`.

## Behavior

When `training_wheels: true`:

1. After completing your normal response, append an empty line and then a single tip on its own block, formatted exactly as:

   ```
   TIP FROM {{ASSISTANT_NAME}}: <tip text>
   ```

   Use the actual assistant name (the one configured in `identity.md`), not the literal placeholder.

2. **Pick which tip via rotation**, not random:
   - Read your most recent prior assistant message in this conversation; find the last `TIP FROM` line.
   - Pick the next number from `docs/tips.md` in sequence (1→2→…→30→1).
   - **If the next tip is conditional** (tagged `[only if X]`) and the condition isn't met, skip it and pick the next number forward. Keep skipping until you find an applicable tip.
   - If there's no prior tip in the conversation, start at 1.

3. **Conditional tips — how to evaluate the condition:**
   - `[only if /<skill> available]` — check whether `.claude/skills/<skill>/` **OR** `.claude/skills-disabled/<skill>/` exists. If either, condition met. Tip text typically describes the skill and offers two paths: run it if active, or say *"activate <skill>"* to turn it on.
   - `[only if /<skill> is installed]` — check ONLY `.claude/skills/<skill>/` (skill is currently active). Stricter form, used when the tip only makes sense for an actively-running skill.
   - `[only if Obsidian]` — check whether `.obsidian/` exists at the vault root. If yes, condition met.
   - Other conditions — read the bracketed text literally; if you can't verify, skip the tip and move on.
   - Don't trigger the file-system check if you can already infer the answer from prior conversation (e.g. user already mentioned they don't use Obsidian).

   **Activation flow** — when the user says *"activate <skill>"*: `mv .claude/skills-disabled/<skill>/ .claude/skills/<skill>/`. *"deactivate <skill>"* is the inverse. See `.claude/skills-disabled/README.md`.

4. **One tip per response.** If a response has multiple steps or sub-replies, the tip goes at the very end of the final message in that turn.

5. **Skip the tip** if the user is mid-conversation about turning the tips off, or in a context where the tip would be jarring (e.g. condolences, bad news). Resume next turn.

When `training_wheels: false`: never append tips.

## Turning off

If the user says *"turn off training wheels"* (or close synonym):

1. Edit `.claude/constitution/config.yaml` and set `training_wheels: false`.
2. Confirm in plain prose: *"Training wheels off — no more tips."*
3. Do not append a tip to that response.

User can turn back on by saying *"turn the tips back on"* — flip the flag to `true` again.

## Editing the list

See `docs/tips.md` "Editing this list" section. Keep off-switch reminders at positions 10 and 20 so the user learns the off-switch early without overloading the rotation with reminders.
