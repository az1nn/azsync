# SIGA — Repository-local continuation protocol

## Trigger

Run this protocol when the user says `SIGA`, `Siga`, or otherwise explicitly asks to continue this repository's work.

## Canonical rule

**REAL REPOSITORY STATE > REPOSITORY HANDOFFS / SPECS / ADRs > MODEL MEMORY > CHAT**

The repository is the only canonical persistence location for SIGA state in AZ-Sync.

Do not:
- use another repository's SIGA state as canonical;
- create or maintain a global SIGA state outside this repository;
- trust chat history alone as evidence that work is complete;
- mutate before reconciling current repository state.

## 1. RECONCILE — verify first

Before any mutation, inspect the real repository and establish:

- repository identity and default branch;
- exact current default-branch HEAD;
- relevant feature branches;
- open and recently merged pull requests;
- PR review state, checks, GitHub Actions runs, and deployment gates when available;
- changed files for active work;
- roadmap, specs, ADRs, issues, README, and existing repository handoffs;
- current implementation surface, build/test commands, and deployment configuration;
- whether another agent or branch has advanced the same work since the last handoff.

If an expected repository artifact is missing, treat it as missing. Do not silently reconstruct it from memory and call it verified.

## 2. DECIDE — classify continuation

Choose exactly one operating mode.

### RESUME

Use when prior work is incomplete, interrupted, partially persisted, failed validation, or has a repository handoff that names unfinished work.

Action: continue the unfinished unit before starting unrelated work.

### WATCH

Use when work has already been dispatched and the remaining state is an active external gate such as CI, review, deployment, approval, or another non-local dependency.

Action: inspect the gate and only mutate when evidence shows an actionable failure or requested change.

### ADVANCE

Use only when the previous unit is verifiably complete and all applicable gates are green or intentionally closed.

Action: select the next coherent repository-backed unit from roadmap/spec/handoff state.

## 3. CONCURRENCY SAFETY

Before writing:

1. Record the verified base/ref used for the intended mutation.
2. Re-read the target branch or PR state immediately before the first mutation when concurrent work is plausible.
3. Never force-push or overwrite unrelated changes.
4. Prefer one isolated branch per coherent work unit.
5. If the base branch advanced after reconciliation, compare the new state before continuing.
6. If another branch or PR overlaps the same files or objective, reconcile first rather than creating duplicate work.
7. Treat stale handoff SHAs as historical evidence, not current truth.
8. Keep repository mutations idempotent where practical: check for an artifact before creating it.
9. Do not merge merely because a PR exists; verify checks, review requirements, and current head/base state first.
10. After any write, re-read the mutated state before declaring completion.

## 4. EXECUTE

Perform the smallest coherent unit that satisfies the selected mode.

Preferred Git workflow:

- branch from a verified base;
- make focused changes;
- run or inspect the repository's declared validation gates;
- open or update a pull request;
- inspect CI/check results;
- merge only when repository policy and user intent allow it.

Do not mix unrelated cleanup, feature work, or speculative refactors into a SIGA continuation.

## 5. PERSIST

Update `docs/SIGA-HANDOFF.md` whenever a SIGA run changes repository state or materially changes the next action.

The handoff should include, when applicable:

- repository;
- verified default branch and baseline SHA;
- active branch;
- PR number/state;
- classification: RESUME, WATCH, or ADVANCE;
- completed work;
- validation/check state;
- blockers or external gates;
- exact next action;
- important files/specs/ADRs;
- concurrency notes if overlapping work exists.

A handoff SHA is a point-in-time observation. Repository refs must still be re-read on the next SIGA run.

## Completion rule

Never claim completion from intent, chat history, or an earlier handoff alone.

A SIGA unit is complete only when the real repository state proves the intended work is persisted and all required validation gates for that unit have been satisfied or explicitly documented as pending.
