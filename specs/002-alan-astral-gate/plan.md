# Implementation Plan: Alan Astral Meditation Gate

**Branch**: `002-alan-astral-gate` | **Date**: 2026-10-04 | **Spec**: `specs/002-alan-astral-gate/spec.md`

## Summary

Add a reusable-in-place meditation gate to the existing AZ-Sync React interface. The gate uses a central contemplative anchor, an explicit idle/active lifecycle, and optional browser-local MP3/WAV playback. Activation also changes the existing Three.js field so the state is visually unambiguous.

The implementation intentionally does not introduce a backend, persistent audio storage, fixed-frequency claims, or a generalized servitor framework.

## Technical Context

**Language/Version**: TypeScript 5.9 + React 19  
**Primary Dependencies**: React, React DOM, Three.js, React Three Fiber, Drei, Vite  
**Storage**: N/A; local audio uses browser object URLs only  
**Testing**: repository CI build gate via `npm run build`; deployed visual/mobile validation is the feature exit gate  
**Target Platform**: modern desktop/mobile browsers  
**Project Type**: single-page web application  
**Performance Goals**: preserve current interactive Three.js performance; no blocking upload path  
**Constraints**: audio optional; no cloud upload; respect reduced motion; closing must synchronously clear active state and stop playback  
**Scale/Scope**: one meditation-gate component integrated into the existing primary screen

## Constitution Check

- **Spec Before Implementation**: reconciled by repository-backed spec, roadmap, plan, and tasks in this branch.
- **Subjective Experience Is Not Evidence**: PASS. Copy keeps meditation/Chi/Ki/astral framing subjective and makes no paranormal or neurological efficacy claim.
- **Blindness Before Reveal**: N/A. Alan Astral is not a hidden-target protocol.
- **Reproducible Experimental Records**: N/A for this meditation-only slice.
- **Experience Without Suggestion**: PASS. The visual field signals state but does not imply a hidden target or objective result.
- **Small, Verifiable Increments**: PASS. One component + integration + styles; CI build gate required.

## Project Structure

```text
specs/002-alan-astral-gate/
├── spec.md
├── plan.md
└── tasks.md

src/
├── App.tsx
├── components/
│   ├── GrimoireScene.tsx
│   └── MeditationGate.tsx
└── styles.css
```

**Structure Decision**: keep Alan Astral in the existing single-page React architecture. `MeditationGate` owns its local lifecycle/audio state; `App.tsx` receives only active/inactive state to synchronize the main visual field.

## Design Decisions

1. **Activation lifecycle**: explicit idle → active → idle transition. No background persistence after closing.
2. **Audio**: user-selected local MP3/WAV through `URL.createObjectURL`; never uploaded.
3. **Visual state**: dedicated concentric anchor animation plus palette/intensity shift in the existing Three.js field.
4. **Accessibility**: reduced-motion media query removes continuous animation while retaining visible state differences.
5. **Daypart phrase**: choose the activation greeting from the participant device's local clock.
6. **No premature abstraction**: generalized servitor configuration belongs to roadmap R04 only after R03 visual validation.

## Verification

1. CI: `npm install` + `npm run build`.
2. Merge only on a green exact PR head.
3. After merge, verify GitHub Pages deployment.
4. Validate desktop/mobile rendering and the complete open → audio optional → close lifecycle.
