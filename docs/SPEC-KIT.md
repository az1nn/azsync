# Spec Kit — AZ-Sync

AZ-Sync uses GitHub Spec Kit **v1.0.11** with the official **Codex skills layout**.

## Canonical locations

- `.specify/memory/constitution.md` — project constitution
- `.specify/templates/` — specification, plan, checklist, and task templates
- `.specify/scripts/bash/` — Spec Kit helper scripts
- `.specify/workflows/speckit/workflow.yml` — bundled SDD workflow
- `.agents/skills/speckit-*/SKILL.md` — Codex-compatible Spec Kit skills
- `specs/` — feature specifications created by the workflow
- `docs/ROADMAP.md` — canonical product sequence, milestone state, and next Spec Kit phase

## Project workflow

Use the complete path for production-facing work:

1. `$speckit-specify <feature intent>`
2. `$speckit-clarify`
3. `$speckit-plan`
4. `$speckit-checklist`
5. `$speckit-tasks`
6. `$speckit-analyze`
7. `$speckit-implement`
8. `$speckit-converge`

The constitution is already ratified for AZ-Sync. Run `$speckit-constitution` only when governance itself needs amendment.

Before creating or advancing a feature, reconcile it against `docs/ROADMAP.md`. New scope must either map to an existing roadmap item or update the roadmap in the same change. The roadmap never replaces a feature spec; it only establishes sequence and state.

## CLI

Pinned installation:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.0.11
specify version
specify integration status
```

If the local installation must be reconstructed from the official CLI, initialize the existing repository with:

```bash
specify init --here --force --integration codex --script sh
```

Review diffs before committing because AZ-Sync keeps a repository-local `siga` skill beside the Spec Kit skills.

## Relationship with SIGA

Spec Kit defines and decomposes work. SIGA decides whether current repository state should be **RESUME**, **WATCH**, or **ADVANCE**.

The two protocols are complementary:

```text
SIGA verify-first
    ↓
Spec / plan / tasks
    ↓
implementation + CI
    ↓
SIGA reconcile / watch / advance
```
