# Implementation Plan: Reproducible Session Records

**Branch**: `001-session-records-plan` | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-session-records/spec.md`

## Summary

Add durable, single-device experimental session records to the existing React/Vite grimoire without introducing accounts, backend services, or cloud synchronization. Hidden-target rounds will persist lifecycle/order metadata and the receiver response before reveal, finalized rounds will remain reviewable after reload, group-attention rounds will use a no-target record path, and completed sessions will export as versioned JSON.

The implementation keeps experimental state in a small domain layer, browser persistence behind a storage adapter, and presentation/history/export concerns separate. Deterministic lifecycle, ordering, serialization, and failure behavior will be covered by automated tests.

## Technical Context

**Language/Version**: TypeScript 5.9.3 on Node.js 22 for build/CI

**Primary Dependencies**: React 19.2, React DOM 19.2, Three.js 0.180, React Three Fiber 9.3, Drei 10.7, Vite 7.1

**Storage**: Browser `localStorage` through a versioned storage adapter; no server persistence in this increment

**Testing**: Vitest for deterministic domain/storage/export tests; repository production build remains a mandatory gate

**Target Platform**: Modern mobile and desktop browsers served as a static GitHub Pages application

**Project Type**: Single-project client-side web application

**Performance Goals**: Session/history operations should remain effectively instantaneous for normal use; storage reads/writes are scoped to a small local dataset and must not block the Three.js interaction loop perceptibly

**Constraints**: Offline-capable after page load; no account/auth requirement; hidden targets must not be surfaced by application UI before the receiver response is captured; subjective notes must remain semantically distinct from target/event data; storage failures require visible warning

**Scale/Scope**: Personal single-browser history, expected tens to hundreds of sessions and low thousands of rounds; no multi-user concurrency or cross-device synchronization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Spec Before Implementation — PASS**: repository-backed specification exists and this plan traces directly to FR-001..FR-020 and SC-001..SC-008.
- **II. Subjective Experience Is Not Evidence — PASS**: model and export contract separate participant observations from target/system event data; existing non-evidential copy remains required.
- **III. Blindness Before Reveal — PASS**: lifecycle requires receiver capture before reveal; active-round UI/history selectors never render unrevealed target values.
- **IV. Reproducible Experimental Records — PASS**: session/round identifiers, ordering, roles, selection/reveal/completion timestamps, target values, and status transitions are explicit.
- **V. Experience Without Suggestion — PASS**: Three.js remains presentation-only and receives no unrevealed target value; mobile/desktop interaction remains in existing responsive surface.
- **VI. Small, Verifiable Increments — PASS**: no backend/auth/cloud scope; implementation is decomposed into domain, persistence, history/export UI, and tests.

No constitutional exceptions are required.

## Project Structure

### Documentation (this feature)

```text
specs/001-session-records/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   └── session-export.schema.json
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── App.tsx
├── components/
│   ├── GrimoireScene.tsx
│   ├── SessionControls.tsx
│   └── SessionHistory.tsx
├── content/
│   └── practices.ts
├── domain/
│   └── sessions.ts
├── storage/
│   └── sessionStore.ts
└── lib/
    └── exportSession.ts

tests/
├── sessions.test.ts
├── sessionStore.test.ts
└── exportSession.test.ts
```

**Structure Decision**: Keep the existing single Vite application. Introduce only feature-specific modules: `domain` owns lifecycle invariants, `storage` owns versioned persistence/failure handling, `lib` owns export serialization, and components render controls/history. `App.tsx` coordinates the active protocol and current session without becoming the source of persistence rules.

## Phase 0 Research Decisions

See [research.md](./research.md). Key decisions:

1. Use a versioned `localStorage` envelope rather than IndexedDB because the record set is small, synchronous atomic replacement is sufficient, and the feature explicitly excludes large/offline media or multi-tab collaboration.
2. Lazy-create a session on the first experimental action so passive page visits do not create empty historical records.
3. Persist active/abandoned/finalized round state, including the selected hidden target, but application selectors/UI must not expose that value until the lifecycle reaches `revealed`/finalized.
4. Add Vitest for pure deterministic rules; avoid a broader browser E2E stack in this increment.
5. Treat export JSON as a versioned public contract and validate it independently from UI rendering.

## Phase 1 Design

### Session lifecycle

- A session starts lazily when the participant first creates a hidden-target round or records a group-attention entry.
- Starting a new session closes the previous session when it has recorded activity; an empty in-memory session is not persisted.
- Hidden-target round transitions:
  `active_target_selected -> response_recorded -> revealed -> finalized`, with `abandoned` available from any non-final state through explicit user action.
- Protocol change or new-round request while a round is active must offer completion/abandonment; silent reset is removed.
- Group-attention entries use `protocolMode: "group"` and never contain target fields.

### Persistence

- Store one versioned envelope under a single application-owned key.
- Parse and validate the envelope defensively. Unsupported/corrupt payloads are ignored from active use and surface a storage warning rather than crashing the app.
- Every lifecycle mutation writes the updated envelope immediately so receiver-response ordering survives reload.
- Deletion is explicit and confirmed at the UI boundary.

### History and reveal isolation

- History reads through a projection that redacts `target.value` while a hidden round is not revealed/finalized.
- Three.js props remain driven only by protocol palette and reveal status; unrevealed target values never enter visual-scene props.
- Finalized and abandoned rounds are visually distinct; abandoned rounds remain ordered but excluded from completed-result counts.

### Export

- Export only an explicitly selected persisted session.
- JSON contains schema version, session metadata, ordered rounds, role labels, observations, event timestamps/order, lifecycle status, and target data only where applicable.
- Subjective observation/post-reveal interpretation fields are structurally separate from system-generated target/event fields.
- No import/replay support in this increment.

### Automated validation

- Domain tests cover legal/illegal lifecycle transitions and response-before-reveal invariants.
- Storage tests cover reload persistence, write failure signaling, deletion, and corrupt/unsupported payload behavior.
- Export tests validate ordering, schema version, group-vs-hidden fields, and semantic separation.
- `npm run build` remains required in CI; implementation adds `npm test` to the validation workflow.

## Post-Design Constitution Check

- Spec traceability preserved: **PASS**
- Subjective/evidential separation preserved in model/export: **PASS**
- Receiver capture precedes reveal by domain invariant: **PASS**
- Reproducible event ordering represented explicitly: **PASS**
- Visual layer receives no hidden target value: **PASS**
- Scope remains one static web application with no speculative services: **PASS**

No complexity exceptions are recorded.

## Complexity Tracking

No constitutional violations require justification.
