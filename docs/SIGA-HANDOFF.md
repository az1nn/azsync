# SIGA HANDOFF v1 — AZ-Sync

## Canonical scope

This handoff belongs only to `az1nn/azsync`.

**REAL REPOSITORY STATE > REPOSITORY HANDOFFS / SPECS / ADRs > MODEL MEMORY > CHAT**

Do not use another repository's SIGA state as canonical.

## Verification snapshot

- Repository: `az1nn/azsync`
- Default branch: `master`
- Verified base HEAD before Spec Kit work: `5d2612bbd6f2af3df237f9295cf45515493dea70`
- Active branch: `chore/spec-kit-bootstrap`
- Bootstrap commit before this handoff update: `7b0215859ed24cc9ebc4d238a49b033af13a3edd`
- PR: #3 — `chore: bootstrap Spec Kit v1.0.11`
- Current classification: **WATCH**

## Transition recorded in this run

The previous state was **ADVANCE** with no repository-backed roadmap/specification for the next product increment.

The user explicitly selected Spec Kit as the next infrastructure unit. The repository was reconciled before mutation, and no open pull requests existed.

A dedicated branch was created from the exact verified `master` head. GitHub Spec Kit v1.0.11 was then bootstrapped using the official Codex skills layout.

## Completed in this work unit

- Pinned Spec Kit to upstream `github/spec-kit@v1.0.11`.
- Added all 10 core Codex-compatible Spec Kit skills under `.agents/skills/speckit-*/SKILL.md`.
- Preserved the existing repository-local `.agents/skills/siga/SKILL.md`.
- Added official Bash workflow scripts under `.specify/scripts/bash/`.
- Added specification, constitution, plan, checklist, and task templates under `.specify/templates/`.
- Added the bundled Spec Kit SDD workflow and workflow registry.
- Added Codex integration metadata and SHA-256 manifests.
- Ratified `.specify/memory/constitution.md` for AZ-Sync.
- Added `docs/SPEC-KIT.md`.
- Updated the README with the Spec-Driven Development entry point.
- Opened PR #3.

## AZ-Sync constitution invariants

The ratified constitution requires:

1. specification before non-trivial implementation;
2. explicit separation of subjective experience from evidential claims;
3. receiver logging before hidden-target reveal;
4. reproducible experimental records;
5. immersive UX that does not suggest or leak target answers;
6. small, independently verifiable increments with build validation.

## Spec Kit operating model

Canonical flow:

1. `$speckit-specify`
2. `$speckit-clarify`
3. `$speckit-plan`
4. `$speckit-checklist`
5. `$speckit-tasks`
6. `$speckit-analyze`
7. `$speckit-implement`
8. `$speckit-converge`

SIGA remains the verify-first continuation layer around this flow.

## Validation / gates

Before this handoff-only update:

- branch vs `master`: 1 commit ahead / 0 behind;
- changed files: 32;
- application/product source changes: none;
- PR #3: open;
- pull-request CI for the final handoff HEAD: pending re-read after this commit.

Because this handoff update changes the PR head, any CI result from the previous head is historical only.

## Exact next action

1. Re-read PR #3 and its exact current head.
2. Inspect CI for that exact head.
3. If CI is queued/running, remain **WATCH**.
4. If CI fails, classify **RESUME** and apply the smallest corrective change.
5. If CI succeeds and no other required gate remains, merge PR #3 with expected-head protection.
6. After merge, re-read `master` and classify **ADVANCE**.
7. The next product unit after successful Spec Kit merge is to create the first repository-backed AZ-Sync product specification with `$speckit-specify`; do not start product implementation before that spec exists.

## Concurrency note

All SHAs are point-in-time observations. Re-read current refs before any mutation. Never force-push, overwrite unrelated changes, or assume an earlier CI result applies to a newer PR head.
