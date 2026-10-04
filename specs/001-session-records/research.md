# Research: Reproducible Session Records

## Decision 1 — Browser-local persistence

**Decision:** use `localStorage` behind a small storage module.

**Why:** the spec explicitly scopes R02 to one browser/device and excludes accounts/cloud sync. `localStorage` is sufficient for the expected record volume, survives normal reloads, and requires no backend.

**Rejected:** IndexedDB for the first increment. It adds schema/transaction complexity without a current volume or binary-storage requirement.

## Decision 2 — Versioned document format

Persist one versioned root document:

```text
azsync.session-records.v1
└── { schemaVersion, activeSessionId, sessions[] }
```

**Why:** a version marker makes future migrations explicit and avoids scattering partially-related keys.

## Decision 3 — Pure record transitions

Round/session state transitions are implemented as pure functions where practical, with persistence performed separately.

**Why:** target hiding, response freezing, abandonment, ordering and export are deterministic behavior required by the constitution to be independently testable.

## Decision 4 — Test framework

Add **Vitest** as a development dependency for record-model and serialization tests.

**Why:** the project is already Vite + TypeScript; Vitest integrates with the existing toolchain and allows deterministic state-transition tests without introducing a browser E2E stack in this increment.

## Decision 5 — Export format

Export completed sessions as UTF-8 JSON via a browser Blob/download.

**Why:** JSON preserves structure/order, supports external analysis, handles Unicode participant text, and satisfies the machine-readable requirement.

## Decision 6 — Hidden target persistence

An active hidden-target round may persist its selected target so the round can survive refresh. Presentation selectors must never expose that value before reveal.

On abandonment before reveal, exported/history-facing data omits the target value.

**Why:** refresh recovery and target secrecy both need to hold. The threat model is normal product UI behavior, not adversarial inspection of browser developer storage.

## Decision 7 — Group practice is targetless

The group-attention flow gets a targetless recording path rather than reusing hidden-target selection.

**Why:** the current generic target console contradicts the protocol semantics and FR-010.

## Decision 8 — Storage failure

All writes return a success/failure result. A failed write raises persistent UI warning state before the participant can rely on the record.

**Why:** required by FR-017; silent persistence failure would invalidate the product's reproducibility claim.

## Non-decisions

No server API, authentication, encryption-at-rest, cross-device sync, statistics engine, import/replay or leaderboard is introduced in R02.
