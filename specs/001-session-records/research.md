# Research: Reproducible Session Records

## Decision 1 — Browser persistence

**Decision**: Use a versioned `localStorage` envelope behind a dedicated storage adapter.

**Rationale**: AZ-Sync is a static single-browser application and the feature stores small structured records. The specification excludes accounts, cloud sync, and large data. A storage adapter keeps persistence replaceable without adding infrastructure.

**Alternatives considered**:
- **IndexedDB**: better for large/transactional datasets, but unnecessary for the expected scale and adds async/data-migration complexity.
- **Backend database**: rejected by explicit single-device/no-account scope.
- **In-memory only**: rejected because FR-006 requires persistence across reload.

## Decision 2 — Session creation

**Decision**: Create/persist a session lazily on the first experimental action rather than page load.

**Rationale**: Prevents empty records from passive visits and aligns "begins an experimental session" with an intentional experimental action.

**Alternatives considered**:
- Persist on page load: creates misleading empty history.
- Require a mandatory start wizard: adds friction not required by the specification.

## Decision 3 — Hidden-target persistence

**Decision**: Persist the selected target in the active round record immediately after selection, while redacting it from all application projections until reveal eligibility is satisfied.

**Rationale**: Refresh/close between response and reveal is an explicit edge case. Persisting the target allows the exact round to resume; UI redaction maintains application-level blinding.

**Alternatives considered**:
- Persist only after reveal: loses the target on refresh and breaks round reproducibility.
- Store a recoverable RNG seed only: adds reproducibility coupling to RNG implementation and pool ordering without user value.

## Decision 4 — State machine

**Decision**: Model round state explicitly instead of inferring it from nullable fields.

**Rationale**: The feature has meaningful distinctions between active, response-recorded, revealed, finalized, and abandoned states. Explicit transitions make illegal reveal/edit sequences testable.

**Alternatives considered**:
- Boolean flags only: permits contradictory combinations and weakens testability.
- UI-only state: does not survive reload and makes storage semantics ambiguous.

## Decision 5 — Testing

**Decision**: Add Vitest for pure domain, storage-adapter, and export tests; keep browser E2E as manual quickstart validation for this increment.

**Rationale**: Constitution VI requires deterministic behavior to be automatically validated. The core invariants are pure and high-value to test; a full browser automation stack would increase scope substantially.

**Alternatives considered**:
- Build-only validation: insufficient for lifecycle/order invariants.
- Playwright/Cypress now: useful later, but disproportionate for the first persistence slice.

## Decision 6 — Export contract

**Decision**: Export versioned JSON conforming to `contracts/session-export.schema.json`.

**Rationale**: JSON is machine-readable, portable, and preserves semantic separation between observations, targets, and system event metadata. Versioning allows future additive evolution.

**Alternatives considered**:
- CSV: weak fit for nested sessions/round lifecycle and optional group fields.
- Screenshot/PDF: not machine-readable and does not preserve raw structured records.
