# Data Model: Reproducible Session Records

## StorageEnvelope

| Field | Type | Required | Notes |
|---|---|---:|---|
| `schemaVersion` | integer | yes | Starts at `1`; unsupported versions must not be silently interpreted |
| `sessions` | SessionRecord[] | yes | Ordered by `startedAt` ascending in storage; UI may sort for display |
| `updatedAt` | ISO-8601 string | yes | Last successful storage mutation |

## SessionRecord

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | string | yes | Stable locally generated identifier |
| `startedAt` | ISO-8601 string | yes | Creation ordering anchor |
| `endedAt` | ISO-8601 string or null | yes | Null while current/active |
| `rounds` | RoundRecord[] | yes | Preserves original sequence |
| `notes` | string or null | yes | Optional session-level subjective note |

### Validation rules

- `id` is unique within the envelope.
- Round `sequence` values are unique and monotonically increasing within a session.
- An empty session is not persisted.
- Deleting a session removes exactly one matching `id`.

## RoundRecord

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | string | yes | Stable within session |
| `sequence` | integer | yes | 1-based ordering |
| `protocolId` | `symbol\|chromatic\|number\|group` | yes | Canonical practice id |
| `protocolMode` | `hidden-target\|group` | yes | Controls target applicability |
| `status` | RoundStatus | yes | Explicit lifecycle state |
| `roles` | ParticipantRoles | yes | Context labels, not identities |
| `observation` | ObservationRecord or null | yes | Receiver/group note |
| `target` | TargetRecord or null | yes | Required only for hidden-target rounds |
| `selectedAt` | ISO-8601 string or null | yes | Hidden-target selection time |
| `responseRecordedAt` | ISO-8601 string or null | yes | Must precede reveal |
| `revealedAt` | ISO-8601 string or null | yes | Hidden-target only |
| `completedAt` | ISO-8601 string or null | yes | Finalization time |
| `abandonedAt` | ISO-8601 string or null | yes | Explicit abandonment time |
| `postRevealInterpretation` | string or null | yes | Subjective, editable only after reveal/finalization |

## RoundStatus

Canonical states:

- `active_target_selected`
- `response_recorded`
- `revealed`
- `finalized`
- `abandoned`

### Hidden-target transitions

```text
active_target_selected
  ├─ submit response ─> response_recorded
  └─ abandon ─────────> abandoned

response_recorded
  ├─ reveal ──────────> revealed
  └─ abandon ─────────> abandoned

revealed
  ├─ finalize ────────> finalized
  └─ abandon ─────────> abandoned

finalized / abandoned
  └─ terminal
```

Reveal is illegal unless a non-empty receiver observation exists and `responseRecordedAt` is recorded first.

### Group-attention transitions

A group round has no `target`, `selectedAt`, or `revealedAt`. It begins with an editable observation and becomes `finalized` when the participant explicitly finishes the entry; it may instead become `abandoned`.

## ParticipantRoles

| Field | Type | Required | Notes |
|---|---|---:|---|
| `emitter` | string or null | yes | Role label only |
| `receiver` | string or null | yes | Role label only |
| `mode` | `pair\|group\|solo` | yes | Context, not authenticated identity |

No personal identity/account data is required.

## ObservationRecord

| Field | Type | Required | Notes |
|---|---|---:|---|
| `text` | string | yes | Unicode preserved verbatim |
| `kind` | `receiver-pre-reveal\|group-note` | yes | Separates subjective record type |
| `recordedAt` | ISO-8601 string | yes | Ordering evidence |

## TargetRecord

| Field | Type | Required | Notes |
|---|---|---:|---|
| `value` | string | yes | Symbol/color/number |
| `poolId` | string | yes | Canonical target pool |
| `selectionMethod` | `uniform-random-pool` | yes | Current V0.1 method |

The persisted target may exist before reveal so an interrupted round can resume, but application selectors/history must redact `value` until reveal.

## ExportedSessionRecord

The exported object mirrors a single `SessionRecord` plus:

- `schemaVersion`
- `exportedAt`
- fixed disclaimer distinguishing experimental record from evidence of paranormal mechanisms

See [contracts/session-export.schema.json](./contracts/session-export.schema.json).
