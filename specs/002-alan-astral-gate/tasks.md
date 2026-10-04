# Tasks: Alan Astral Meditation Gate

**Input**: `specs/002-alan-astral-gate/spec.md` and `plan.md`

## Phase 1 — Spec and lifecycle

- [x] T001 [US1] Define Alan Astral activation, closing phrase, state model and subjective-practice constraints in `specs/002-alan-astral-gate/spec.md`.
- [x] T002 [US1] Add the Alan Astral milestone to the canonical roadmap in `docs/ROADMAP.md`.

## Phase 2 — Visual gate

- [x] T003 [US1] Implement idle/active meditation gate UI in `src/components/MeditationGate.tsx`.
- [x] T004 [US1] Synchronize Alan Astral active state with the main Three.js field in `src/App.tsx`.
- [x] T005 [US1] Add contemplative active-state styling and reduced-motion behavior in `src/styles.css`.

## Phase 3 — Custom local audio

- [x] T006 [US2] Accept local MP3/WAV files without upload in `src/components/MeditationGate.tsx`.
- [x] T007 [US2] Add playback, loop and volume controls and stop/reset audio on closing.
- [x] T008 [US2] Preserve full gate functionality when no audio is selected.

## Phase 4 — Verification

- [x] T009 Run PR build gate with `npm run build`.
- [ ] T010 Merge PR #6 only after its exact current head is green and mergeable.
- [ ] T011 Verify post-merge GitHub Pages deployment.
- [ ] T012 Perform deployed visual/mobile validation of idle → active → close and record any corrective task before R03 is marked DONE.

## Exit Gate

R03 becomes **DONE** only when T010–T012 are complete. Until then SIGA must prioritize this exit gate over R04.
