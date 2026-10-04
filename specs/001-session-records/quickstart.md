# Quickstart Validation: Reproducible Session Records

## Local verification

```bash
npm install
npm test
npm run build
npm run dev
```

## Scenario A — finalized hidden-target round

1. Select Symbol, Color, or Number.
2. Start a round.
3. Confirm the target remains hidden.
4. Enter a receiver observation.
5. Capture/reveal the round.
6. Open history and verify observation and target are distinct fields.
7. Reload the page.
8. Confirm the finalized round remains present with the same ordering.

Expected: the observation precedes reveal and cannot be altered as the pre-reveal response after finalization.

## Scenario B — refresh before reveal

1. Start a hidden-target round.
2. Enter/capture the receiver observation.
3. Reload before reveal.
4. Confirm the active round resumes.
5. Confirm the target is still hidden.
6. Reveal and finalize.

Expected: no target value is visible until explicit reveal.

## Scenario C — abandon

1. Start a hidden-target round.
2. Attempt to switch protocol or start another round.
3. Explicitly abandon the current round.
4. Inspect history/export.

Expected: the attempt is marked abandoned, excluded from finalized results, and an unrevealed target is not exposed.

## Scenario D — group attention

1. Select Sincronização em Grupo.
2. Start the practice.
3. Record participant notes.
4. Complete the round.
5. Inspect history/export.

Expected: no randomized target exists anywhere in the group record.

## Scenario E — export

1. Complete at least two rounds.
2. Export the session.
3. Inspect downloaded JSON.

Expected:
- `schemaVersion: 1`;
- stable session/round IDs;
- chronological ordering;
- observation and target separated;
- Unicode text preserved;
- disclaimer present.

## Scenario F — persistence failure

Simulate unavailable or throwing local storage.

Expected: the UI shows a visible warning before the participant could reasonably assume the session is durably saved.
