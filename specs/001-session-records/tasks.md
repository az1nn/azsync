# Tasks: Reproducible Session Records

**Input**: `spec.md`, `clarifications.md`, `research.md`, `data-model.md`, `plan.md`

## Phase 1 — Record foundation

- [x] T001 [P] Add Vitest and `npm test` configuration in `package.json`.
- [x] T002 [US1] Implement versioned types, storage adapter and ID helpers in `src/lib/sessionRecords.ts`.
- [x] T003 [US1] Implement pure hidden-target lifecycle transitions: prepare → response-captured → finalized / abandoned.
- [x] T004 [US1] Implement target-safe history/export projections in `src/lib/sessionRecords.ts`.
- [x] T005 [P] [US1] Add deterministic tests in `src/lib/sessionRecords.test.ts` for ordering, response freezing, reveal gating, abandonment and target hiding.

## Phase 2 — Durable hidden-target flow

- [ ] T006 [US1] Load/create the active session in `src/App.tsx` and restore resumable active round state after reload.
- [ ] T007 [US1] Persist target selection and receiver response in the correct event order.
- [ ] T008 [US1] Finalize the durable round only on explicit reveal.
- [ ] T009 [US1] Require explicit abandonment before protocol change or new round while a round is active.
- [ ] T010 [US1] Surface durable-storage failure state visibly in the main interface.

## Phase 3 — Group practice correctness

- [ ] T011 [US2] Remove hidden-target selection/reveal behavior from the group-attention practice in `src/App.tsx`.
- [ ] T012 [US2] Record group participant notes as a targetless finalized round.
- [ ] T013 [P] [US2] Add tests proving group records cannot contain target fields.

## Phase 4 — Session history

- [ ] T014 [US2] Create `src/components/SessionHistory.tsx` with chronological current/previous session review.
- [ ] T015 [US2] Distinguish finalized, active and abandoned rounds visually.
- [ ] T016 [US2] Add explicit “new session” behavior without deleting prior sessions.
- [ ] T017 [US2] Add deliberate session deletion with confirmation.
- [ ] T018 [US2] Add the experimental-record / no-paranormal-evidence disclaimer to history.

## Phase 5 — Export

- [ ] T019 [US3] Implement versioned UTF-8 JSON export in `src/lib/sessionRecords.ts`.
- [ ] T020 [US3] Add export action to `SessionHistory.tsx`.
- [ ] T021 [P] [US3] Test export ordering, Unicode preservation, target sanitization and empty-session behavior.

## Phase 6 — Visual integration and verification

- [ ] T022 Integrate history/warning styles in `src/styles.css` for desktop and mobile.
- [ ] T023 Run `npm test` and fix deterministic regressions.
- [ ] T024 Run `npm run build`.
- [ ] T025 Open implementation PR and verify exact-head CI.
- [ ] T026 Merge only after green gates.
- [ ] T027 Validate the scenarios in `quickstart.md`.

## Dependencies

- T002–T004 precede App integration.
- T006–T010 precede history correctness.
- T011–T013 may proceed after the record core exists.
- T014–T021 depend on stable record projections.
- T023–T027 are the exit gate.

## Definition of Done

R02 is DONE only when durable records survive reload, hidden targets remain hidden before reveal, abandoned/group semantics are correct, export is machine-readable, deterministic tests pass, and the exact implementation PR head is green.
