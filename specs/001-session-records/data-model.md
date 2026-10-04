# Data Model: Reproducible Session Records

## Root document

```ts
type SessionRecordStore = {
  schemaVersion: 1
  activeSessionId: string | null
  sessions: SessionRecord[]
}
```

Storage key: `azsync.session-records.v1`.

## SessionRecord

```ts
type SessionRecord = {
  id: string
  startedAt: string
  endedAt: string | null
  status: 'active' | 'completed'
  rounds: RoundRecord[]
  notes?: string
}
```

### Invariants

- `id` is stable for the session lifetime.
- Round order is array order plus explicit `sequence`.
- Starting a new session never deletes earlier sessions.
- A completed session is immutable except deliberate deletion of the whole session.

## RoundRecord

```ts
type RoundRecord = {
  id: string
  sequence: number
  protocolId: string
  protocolTitle: string
  kind: 'hidden-target' | 'group'
  state: 'prepared' | 'response-captured' | 'finalized' | 'abandoned'
  roles: string[]
  createdAt: string
  targetSelectedAt?: string
  responseCapturedAt?: string
  revealedAt?: string
  completedAt?: string
  abandonedAt?: string
  observation?: string
  target?: {
    value: string
    selectionMethod: 'client-random-pool'
  }
  interpretation?: string
}
```

### Hidden-target invariants

- A target exists from `prepared`, but UI/history selectors must hide it until `finalized`.
- `observation` becomes immutable when entering `response-captured`.
- `revealedAt` cannot precede `responseCapturedAt`.
- `finalized` requires observation + revealed target.
- An abandoned unrevealed round is not counted as finalized and its public/history/export projection omits `target`.

### Group invariants

- `kind = 'group'`.
- No `target`, `targetSelectedAt`, or `revealedAt`.
- Participant notes become the observation.
- Completion directly finalizes the record.

## History projection

History must derive a safe view model rather than rendering persisted records directly.

Before reveal:
- show protocol, sequence, state, timestamps;
- never show target or target-derived hints.

Finalized:
- show observation and revealed target as separate fields.

Abandoned:
- show that the attempt occurred;
- do not present it as a result;
- do not expose an unrevealed target.

## ExportedSessionRecord

```ts
type ExportedSessionRecord = {
  schemaVersion: 1
  exportedAt: string
  session: SessionRecord
  disclaimer: string
}
```

Export sanitization applies the same target-visibility rules as history.

## Identifier strategy

Use `crypto.randomUUID()` where available, with a deterministic-safe fallback based on timestamp + random suffix only for environments that lack it. IDs provide uniqueness, not security.
