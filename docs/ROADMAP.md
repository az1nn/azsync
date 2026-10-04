# AZ-Sync — Product Roadmap

This file is the canonical product roadmap for Spec Kit work in `az1nn/azsync`.

**Rule:** roadmap scope is implemented only through repository-backed specs under `specs/`. SIGA reconciles real repository state before advancing any item.

## R01 — Grimoire Foundation

**Status:** DONE

- React + TypeScript + Vite shell
- Three.js / React Three Fiber visual field
- four structured attention / symbolic protocols
- blind-target receiver log before reveal
- CI + GitHub Pages workflow
- constitutional separation between subjective experience and evidence

## R02 — Reproducible Session Records

**Spec:** `specs/001-session-records/spec.md`  
**Status:** PLANNED / READY FOR IMPLEMENTATION

Outcome:
- durable session and round records
- pre-reveal receiver response preservation
- chronological history
- incomplete/abandoned round handling
- portable export
- strict separation of observations, target data and interpretation

**Spec Kit:** clarification ✅ → research/data model ✅ → plan ✅ → tasks ✅

**Next phase:** implementation, beginning with the tested record core (T001–T005).

## R03 — Alan Astral Meditation Gate

**Spec:** `specs/002-alan-astral-gate/spec.md`  
**Status:** MERGED / DEPLOYMENT BLOCKED — issue #7

Outcome:
- visual meditation gate for Alan Astral
- idle ↔ active visual state connected to the main Three.js field
- local MP3/WAV loading
- volume + loop controls
- audio stopped/reset on closing
- no mandatory timer or audio
- reduced-motion support
- subjective/symbolic framing preserved

**Activation:** “Bom dia Alan” / “Boa tarde Alan” / “Boa noite Alan” by local daypart.  
**Closing:** “obrigado Alan, é para isso que você existe”.

**Exit gate:** PR CI green ✅ → merge ✅ → Pages enablement/deployment ⏳ → visual/mobile verification ⏳.

**Blocker:** GitHub Pages is not enabled for the repository. Workflow run #7 built successfully but `actions/configure-pages@v5` could not create the Pages site because the workflow integration lacks repository-admin permission. Tracked in issue #7.

## R04 — Servitor Practice Framework

**Status:** PLANNED

Turn the Alan Astral slice into a reusable, data-driven practice surface without weakening each servitor's explicit purpose.

Candidate scope:
- reusable servitor/practice schema
- configurable activation and closing phrases
- visual anchor configuration
- optional local audio profile
- clear per-servitor state lifecycle
- Hermes as the next concrete profile only after its own repository-backed specification

**Constraint:** no generalized framework work may precede successful R03 visual validation unless required to fix R03.

## Priority

1. Finish R03 exit gate as soon as Pages is enabled.
2. While R03 is blocked only by repository Pages enablement, R02 clarification/planning may advance in parallel.
3. Specify R04 only after R03 is validated in the deployed UI.
