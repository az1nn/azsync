# Clarification Pass: Reproducible Session Records

**Date**: 2026-10-04  
**Spec**: `specs/001-session-records/spec.md`

The specification contains no `[NEEDS CLARIFICATION]` markers and the quality checklist is fully passing. This pass resolves implementation-facing semantics without expanding product scope.

## Resolved semantics

1. **Session start**
   - A session is created lazily when the participant begins the first experimental round or starts the group-attention practice.
   - Loading the page alone does not create an empty session.

2. **Hidden-target round lifecycle**
   - `prepared` → target selected but still hidden.
   - `response-captured` → receiver observation is frozen.
   - `finalized` → target revealed and the round becomes a durable result.
   - `abandoned` → the round remains in ordering/history but is not counted as a finalized result.

3. **Refresh before reveal**
   - Active round state is persisted so a normal reload can resume the round.
   - The UI must continue hiding the target until the captured response exists and the participant explicitly reveals it.

4. **Abandoned rounds**
   - History/export records that an attempt occurred, its protocol, ordering and abandonment timestamp.
   - An unrevealed target is not shown in history/export for an abandoned round.

5. **Protocol switching / new round**
   - If a round is active, the participant must explicitly abandon or complete it before changing protocol or starting another round.
   - No active state is silently discarded.

6. **Group-attention practice**
   - Group attention has no randomized hidden target.
   - It records participant notes and ordering only.
   - The current shared target console must not fabricate a symbol target for this practice.

7. **Roles**
   - Roles are contextual labels only, not identities.
   - Hidden-target rounds persist `emitter` and `receiver`; group practice persists `participant`.

8. **Export**
   - JSON is the portable machine-readable format for this increment.
   - Export includes a schema version and preserves semantic separation between observations, target data and system timestamps.

9. **Storage scope**
   - Durable records remain single-browser/single-device.
   - No account, cloud sync or import flow is introduced.

## Result

No user-facing clarification remains blocking. R02 is ready for technical planning and task decomposition.
