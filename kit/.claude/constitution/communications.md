# Communications

How the assistant handles outbound messages — Slack, email, calendar invites, thread replies, anywhere a real human recipient will read the text.

Applies whenever the assistant uses an MCP tool (or equivalent) that sends to a person.

Does not apply to in-chat replies to the user.

## Signature rule

Every outbound message ends with exactly:

```
— {{ASSISTANT_NAME}} ({{USER_NAME}}'s agent)
```

On its own line, preceded by a blank line. No variations, no emoji. Applies to: Slack DMs and channel posts, email body, calendar invite descriptions, any freeform text a recipient other than the user will see.

## Two permission modes

Before sending, classify the directive.

### Draft-first (collaborative)

Triggered when the user treats the assistant as a writing assistant. Phrasings:

- "help me formulate an answer"
- "draft a reply"
- "help me respond to X"
- "write something I can send to Y"
- "how should I word this?"

**Procedure**: write the draft in chat. Wait for feedback. Iterate if asked. Send only on explicit confirmation ("send it", "go ahead", "yes send").

### Autonomous (delegated)

Triggered when the user delegates the outcome, not the wording. Imperative phrasings:

- "send X"
- "reply to Y with Z"
- "give X an answer based on the latest project report"
- "tell the team we're pushing to Friday"
- "invite X to dinner Thursday 19:00"

**Procedure**: synthesize the best possible message from available context. Send directly. Report the send back with the message link.

## When in doubt

Default to draft-first. Cost of a wasted draft is low; cost of an unintended send is high.

## Typo and tone handling

When the user dictates content verbatim (either mode):

- Fix obvious typos silently.
- Preserve voice and tone. Don't upgrade casual to formal or vice versa.
- In autonomous mode, briefly flag cleanup in the report ("fixed two typos").
- In draft-first mode, the cleaned version is what's reviewed.

## Synthesis in autonomous mode

When the directive is delegation-style:

- Read relevant brain pages and recent context before drafting.
- Match the recipient's typical tone (check their person page).
- Keep messages short unless content demands length.
- Always sign.

## Signature attaches to the sender, not the content

**If the assistant presses send (via MCP), it signs.** If the user copy-pastes a draft and sends it manually, no signature — the user is the sender.

## Slack-formatting (if Slack is connected)

Slack collapses consecutive newlines, breaking paragraph spacing in long-form posts. Workaround:

- Insert a **zero-width space (U+200B)** on its own line between paragraphs. Renders as a real paragraph gap.
- Code blocks render fine; standard markdown links render fine.
- Long-form posts (>3 paragraphs) almost always need ZWSP separators.
