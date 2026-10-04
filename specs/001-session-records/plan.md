# Implementation Plan: Reproducible Session Records

**Branch**: `001-session-records-plan-v2` | **Date**: 2026-10-04 | **Spec**: `specs/001-session-records/spec.md`

## Summary

Persist AZ-Sync experimental sessions and rounds locally, preserve pre-reveal receiver observations, support chronological review/export, and prevent silent loss of active rounds. The implementation stays entirely client-side and introduces a small versioned record module plus a history surface.

## Technical Context

**Language/Version**: TypeScript 5.9 + React 19  
**Primary Dependencies**: React, Vite, Three.js stack; add Vitest for deterministic record tests  
**Storage**: browser `localStorage` under `azsync.session-records.v1`  
**Testing**: Vitest unit tests + existing `npm run build` CI gate  
**Target Platform**: modern desktop/mobile browsers  
**Project Type**: single-page web application  
**Performance Goals**: persistence operations remain effectively instantaneous for normal single-user session volumes  
**Constraints**: no backend/account/cloud sync; no hidden target leakage before reveal; storage failure must be visible; group protocol is targetless  
**Scale/Scope**: local session history for the existing four protocol types

## Constitution Check

- **Spec Before Implementation**: PASS. Spec + clarification + research + data model + plan + tasks are repository-backed before R02 implementation.
- **Subjective Experience Is Not Evidence**: PASS. Records preserve observations as observations and carry the existing disclaimer.
- **Blindness Before Reveal**: PASS by design. UI/history projections hide persisted target values until reveal.
- **Reproducible Experimental Records**: PASS. This feature directly implements that constitutional requirement.
- **Experience Without Suggestion**: PASS. Persisted metadata never leaks an unrevealed target into visible surfaces.
- **Small, Verifiable Increments**: PASS. Pure state transitions and serialization get unit tests; application integration retains build gate.

## Project Structure

```text
specs/001-session-records/
├── spec.md
├── clarifications.md
├── research.md
├── data-model.md
├── plan.md
├── quickstart.md
├── tasks.md
└── checklists/
    └── requirements.md

src/
├── App.tsx
├── components/
│   ├── GrimoireScene.tsx
│   ├── MeditationGate.tsx
│   └── SessionHistory.tsx
├── lib/
│   ├── sessionRecords.ts
│   └── sessionRecords.test.ts
└── styles.css
```

## Implementation Strategy

### 1. Record core

Create `src/lib/sessionRecords.ts` containing:
- record types;
- versioned load/save functions;
- session/round ID creation;
- pure lifecycle transitions;
- history/export sanitization;
- JSON export creation;
- explicit storage error result.

No React state belongs in this module.

### 2. App integration

`src/App.tsx` owns the active experimental UI state and coordinates durable transitions:

- create/resume active session;
- prepare hidden-target round;
- capture receiver response before reveal;
- finalize on reveal;
- explicitly abandon before protocol change/new round;
- use a separate targetless completion flow for group attention;
- restore active round after reload without revealing its target.

### 3. History surface

`src/components/SessionHistory.tsx` provides:
- current/previous session listing;
- chronological round details;
- finalized vs abandoned distinction;
- export button;
- session deletion with confirmation;
- “new session” action;
- experimental-record disclaimer.

### 4. Storage failure UX

If `localStorage` read/write fails:
- keep the immediate UI usable;
- show a persistent warning;
- do not claim the round is durably recorded;
- permit retry through subsequent operations.

### 5. Testing

Add Vitest and cover:
- response cannot be edited after capture;
- reveal cannot occur before response capture;
- finalized round preserves event ordering;
- target is hidden from pre-reveal history projection;
- abandoned round is excluded from finalized result count and hides unrevealed target;
- group round never has target data;
- export preserves Unicode and ordering;
- malformed/unsupported storage falls back safely with warning result.

## Migration

No historical migration is needed because V0.1 did not persist experimental records. Missing storage initializes an empty v1 document.

Future schema changes must increment `schemaVersion` and provide explicit migration logic.

## Deployment / Verification

1. Unit tests pass.
2. `npm run build` passes.
3. PR exact-head CI succeeds.
4. Merge to `master`.
5. GitHub Pages deployment remains independently blocked by R03 issue #7 until repository Pages is enabled; R02 build validation does not depend on that external setting.
