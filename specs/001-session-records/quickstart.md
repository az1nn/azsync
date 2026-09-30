# Quickstart Validation: Reproducible Session Records

## Prerequisites

- Node.js 22
- npm
- Feature implementation checked out after `tasks.md` execution

## Install and run

```bash
npm install
npm test
npm run build
npm run dev
```

The automated tests must pass before manual validation.

## Scenario 1 — Hidden-target persistence and reveal ordering

1. Open the symbol protocol.
2. Draw a target.
3. Enter a receiver observation.
4. Reload the page before reveal.
5. Confirm the active round resumes without showing the target.
6. Reveal and finalize the round.
7. Reload again and open history.

**Expected**: the original observation is unchanged; the target appears only after reveal; the finalized round remains in the same session/order.

## Scenario 2 — Prevent silent round loss

1. Start a number round.
2. Enter an observation but do not reveal/finalize.
3. Attempt to start a new round or switch protocol.

**Expected**: the UI requires explicit completion or abandonment. Abandoning preserves an ordered incomplete record and does not count it as finalized.

## Scenario 3 — Group-attention record

1. Open the group protocol.
2. Record a group note.
3. Finalize the entry.
4. Open history.

**Expected**: the entry has no hidden-target fields and is clearly represented as a group record.

## Scenario 4 — Storage failure

Use browser tooling or a test harness to force the storage adapter write to fail.

**Expected**: the app remains usable but displays a visible warning before the participant can reasonably rely on the round as durably recorded.

## Scenario 5 — Export

1. Complete at least two hidden-target rounds and one group entry.
2. Export the persisted session.
3. Validate the JSON against `contracts/session-export.schema.json`.

**Expected**:
- schema version is present;
- round order matches history;
- pre-reveal observations and post-reveal interpretation are distinct fields;
- group entry has no target;
- finalized hidden-target rounds contain revealed target data;
- disclaimer is present.

## Scenario 6 — Delete

1. Select a saved session.
2. Trigger delete.
3. Cancel once, then repeat and confirm.

**Expected**: cancel preserves the session; confirm removes only the selected session.

## Regression gate

- Existing Three.js scene renders.
- Existing protocol navigation remains responsive on mobile/desktop widths.
- Unrevealed target values are never passed to the Three.js scene or displayed in active/history UI.
- First-time use still requires no account or synchronization setup.
