# Tasks: Reproducible Session Records

**Input**: `spec.md`, `clarifications.md`, `research.md`, `data-model.md`, `plan.md`

## Phase 1 — Record foundation

- [x] T001 [P] Add Vitest and `npm test` configuration in `package.json`.
- [x] T002 [US1] Implement versioned types, storage adapter and ID helpers in `src/lib/sessionRecords.ts`.
- [x] T003 [US1] Implement pure hidden-target lifecycle transitions: prepare → response-captured → finalized / abandoned.
- [x] T004 [US1] Implement target-safe history/export projections in `src/lib/sessionRecords.ts`.
- [x] T005 [P] [US1] Add deterministic tests in `src/lib/sessionRecords.test.ts` for ordering, response freezing, reveal gating, abandonment and target hiding.

## Phase 2 — Durable hidden-target flow

- [x] T006 [US1] Load/create the active session in `src/App.tsx` and restore resumable active round state after reload.
- [x] T007 [US1] Persist target selection and receiver response in the correct event order.
- [x] T008 [US1] Finalize the durable round only on explicit reveal.
- [x] T009 [US1] Require explicit abandonment before protocol change or new round while a round is active.
- [x] T010 [US1] Surface durable-storage failure state visibly in the main interface.

## Phase 3 — Group practice correctness

- [x] T011 [US2] Remove hidden-target selection/reveal behavior from the group-attention practice in `src/App.tsx`.
- [x] T012 [US2] Record group participant notes as a targetless finalized round.
- [x] T013 [P] [US2] Add tests proving group records cannot contain target fields.

## Phase 4 — Session history

- [x] T014 [US2] Create `src/components/SessionHistory.tsx` with chronological current/previous session review.
- [x] T015 [US2] Distinguish finalized, active and abandoned rounds visually.
- [x] T016 [US2] Add explicit “new session” behavior without deleting prior sessions.
- [x] T017 [US2] Add deliberate session deletion with confirmation.
- [x] T018 [US2] Add the experimental-record / no-paranormal-evidence disclaimer to history.

## Phase 5 — Export

- [x] T019 [US3] Implement versioned UTF-8 JSON export in `src/lib/sessionRecords.ts`.
- [x] T020 [US3] Add export action to `SessionHistory.tsx`.
- [x] T021 [P] [US3] Test export ordering, Unicode preservation, target sanitization and empty-session behavior.

## Phase 6 — Visual integration and verification

- [x] T022 Integrate history/warning styles in `src/styles.css` for desktop and mobile.
- [x] T023 Run `npm test` and fix deterministic regressions.
- [x] T024 Run `npm run build`.
- [x] T025 Open implementation PR and verify exact-head CI.
- [x] T026 Merge only after green gates. PR #11 merged after exact-head CI #28 passed tests and build.
- [ ] T027 Validate the scenarios in `quickstart.md`. **BLOCKED by issue #7:** GitHub Pages is not enabled, so the post-merge workflow builds successfully but cannot publish a runnable surface for interactive validation.

## Dependencies

- T002–T004 precede App integration.
- T006–T010 precede history correctness.
- T011–T013 may proceed after the record core exists.
- T014–T021 depend on stable record projections.
- T023–T027 are the exit gate.

## Definition of Done

R02 is DONE only when durable records survive reload, hidden targets remain hidden before reveal, abandoned/group semantics are correct, export is machine-readable, deterministic tests pass, and the exact implementation PR head is green.
