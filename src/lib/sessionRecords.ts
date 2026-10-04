export const SESSION_RECORDS_STORAGE_KEY = 'azsync.session-records.v1'
export const SESSION_RECORDS_DISCLAIMER =
  'Registro experimental de experiência subjetiva; não constitui evidência de telepatia, transmissão paranormal ou mecanismo equivalente.'

export type RoundKind = 'hidden-target' | 'group'
export type RoundState = 'prepared' | 'response-captured' | 'finalized' | 'abandoned'
export type SessionStatus = 'active' | 'completed'

export type TargetRecord = {
  value: string
  selectionMethod: 'client-random-pool'
}

export type RoundRecord = {
  id: string
  sequence: number
  protocolId: string
  protocolTitle: string
  kind: RoundKind
  state: RoundState
  roles: string[]
  createdAt: string
  targetSelectedAt?: string
  responseCapturedAt?: string
  revealedAt?: string
  completedAt?: string
  abandonedAt?: string
  observation?: string
  target?: TargetRecord
  interpretation?: string
}

export type SessionRecord = {
  id: string
  startedAt: string
  endedAt: string | null
  status: SessionStatus
  rounds: RoundRecord[]
  notes?: string
}

export type SessionRecordStore = {
  schemaVersion: 1
  activeSessionId: string | null
  sessions: SessionRecord[]
}

export type VisibleRoundRecord = Omit<RoundRecord, 'target'> & {
  target?: TargetRecord
}

export type VisibleSessionRecord = Omit<SessionRecord, 'rounds'> & {
  rounds: VisibleRoundRecord[]
}

export type ExportedSessionRecord = {
  schemaVersion: 1
  exportedAt: string
  session: VisibleSessionRecord
  disclaimer: string
}

export type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem?(key: string): void
}

export type StorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; value: T; error: string }

type SessionOptions = {
  id?: string
  startedAt?: string
}

type PrepareHiddenTargetInput = {
  id?: string
  protocolId: string
  protocolTitle: string
  targetValue: string
  roles?: string[]
  at?: string
}

type PrepareGroupInput = {
  id?: string
  protocolId: string
  protocolTitle: string
  at?: string
}

function nowIso() {
  return new Date().toISOString()
}

export function createRecordId(prefix = 'record') {
  const randomUuid = globalThis.crypto?.randomUUID?.bind(globalThis.crypto)
  if (randomUuid) return `${prefix}-${randomUuid()}`

  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now().toString(36)}-${random}`
}

export function createEmptySessionRecordStore(): SessionRecordStore {
  return {
    schemaVersion: 1,
    activeSessionId: null,
    sessions: [],
  }
}

export function createSessionRecord(options: SessionOptions = {}): SessionRecord {
  return {
    id: options.id ?? createRecordId('session'),
    startedAt: options.startedAt ?? nowIso(),
    endedAt: null,
    status: 'active',
    rounds: [],
  }
}

export function getActiveSession(store: SessionRecordStore) {
  if (!store.activeSessionId) return null
  return store.sessions.find((session) => session.id === store.activeSessionId) ?? null
}

export function getOpenRound(session: SessionRecord | null | undefined) {
  if (!session) return null
  return (
    [...session.rounds]
      .reverse()
      .find((round) => round.state === 'prepared' || round.state === 'response-captured') ?? null
  )
}

export function upsertSessionRecord(
  store: SessionRecordStore,
  session: SessionRecord,
  makeActive = true,
): SessionRecordStore {
  const existingIndex = store.sessions.findIndex((item) => item.id === session.id)
  const sessions =
    existingIndex === -1
      ? [...store.sessions, session]
      : store.sessions.map((item) => (item.id === session.id ? session : item))

  return {
    ...store,
    activeSessionId: makeActive ? session.id : store.activeSessionId,
    sessions,
  }
}

export function completeActiveSession(
  store: SessionRecordStore,
  at = nowIso(),
): SessionRecordStore {
  const active = getActiveSession(store)
  if (!active) {
    return { ...store, activeSessionId: null }
  }

  const completed: SessionRecord = {
    ...active,
    status: 'completed',
    endedAt: at,
  }

  return {
    ...upsertSessionRecord(store, completed, false),
    activeSessionId: null,
  }
}

export function deleteSessionRecord(
  store: SessionRecordStore,
  sessionId: string,
): SessionRecordStore {
  return {
    ...store,
    activeSessionId: store.activeSessionId === sessionId ? null : store.activeSessionId,
    sessions: store.sessions.filter((session) => session.id !== sessionId),
  }
}

export function prepareHiddenTargetRound(
  session: SessionRecord,
  input: PrepareHiddenTargetInput,
): SessionRecord {
  const at = input.at ?? nowIso()
  const round: RoundRecord = {
    id: input.id ?? createRecordId('round'),
    sequence: session.rounds.length + 1,
    protocolId: input.protocolId,
    protocolTitle: input.protocolTitle,
    kind: 'hidden-target',
    state: 'prepared',
    roles: input.roles ?? ['emitter', 'receiver'],
    createdAt: at,
    targetSelectedAt: at,
    target: {
      value: input.targetValue,
      selectionMethod: 'client-random-pool',
    },
  }

  return {
    ...session,
    rounds: [...session.rounds, round],
  }
}

export function prepareGroupRound(
  session: SessionRecord,
  input: PrepareGroupInput,
): SessionRecord {
  const at = input.at ?? nowIso()
  const round: RoundRecord = {
    id: input.id ?? createRecordId('round'),
    sequence: session.rounds.length + 1,
    protocolId: input.protocolId,
    protocolTitle: input.protocolTitle,
    kind: 'group',
    state: 'prepared',
    roles: ['participant'],
    createdAt: at,
  }

  return {
    ...session,
    rounds: [...session.rounds, round],
  }
}

function replaceRound(
  session: SessionRecord,
  roundId: string,
  transform: (round: RoundRecord) => RoundRecord,
): SessionRecord {
  let found = false

  const rounds = session.rounds.map((round) => {
    if (round.id !== roundId) return round
    found = true
    return transform(round)
  })

  if (!found) {
    throw new Error(`Round not found: ${roundId}`)
  }

  return {
    ...session,
    rounds,
  }
}

export function captureReceiverResponse(
  session: SessionRecord,
  roundId: string,
  observation: string,
  at = nowIso(),
): SessionRecord {
  const normalized = observation.trim()
  if (!normalized) {
    throw new Error('Receiver response cannot be empty.')
  }

  return replaceRound(session, roundId, (round) => {
    if (round.kind !== 'hidden-target') {
      throw new Error('Receiver response capture is only valid for hidden-target rounds.')
    }

    if (round.state !== 'prepared') {
      if (round.responseCapturedAt || round.observation) {
        throw new Error('Receiver response is already captured and cannot be edited.')
      }
      throw new Error(`Cannot capture receiver response from round state: ${round.state}`)
    }

    return {
      ...round,
      state: 'response-captured',
      observation: normalized,
      responseCapturedAt: at,
    }
  })
}

export function finalizeHiddenTargetRound(
  session: SessionRecord,
  roundId: string,
  at = nowIso(),
): SessionRecord {
  return replaceRound(session, roundId, (round) => {
    if (round.kind !== 'hidden-target') {
      throw new Error('Only hidden-target rounds use target reveal finalization.')
    }

    if (round.state !== 'response-captured' || !round.observation || !round.responseCapturedAt) {
      throw new Error('Receiver response must be captured before reveal.')
    }

    if (!round.target) {
      throw new Error('Hidden-target round is missing its selected target.')
    }

    return {
      ...round,
      state: 'finalized',
      revealedAt: at,
      completedAt: at,
    }
  })
}

export function finalizeGroupRound(
  session: SessionRecord,
  roundId: string,
  observation: string,
  at = nowIso(),
): SessionRecord {
  const normalized = observation.trim()
  if (!normalized) {
    throw new Error('Group practice notes cannot be empty.')
  }

  return replaceRound(session, roundId, (round) => {
    if (round.kind !== 'group') {
      throw new Error('Only group rounds use group finalization.')
    }

    if (round.state !== 'prepared') {
      throw new Error(`Cannot finalize group round from state: ${round.state}`)
    }

    if (round.target) {
      throw new Error('Group rounds cannot contain hidden target data.')
    }

    return {
      ...round,
      state: 'finalized',
      observation: normalized,
      responseCapturedAt: at,
      completedAt: at,
    }
  })
}

export function abandonRound(
  session: SessionRecord,
  roundId: string,
  at = nowIso(),
): SessionRecord {
  return replaceRound(session, roundId, (round) => {
    if (round.state === 'finalized') {
      throw new Error('A finalized round cannot be abandoned.')
    }

    if (round.state === 'abandoned') {
      return round
    }

    return {
      ...round,
      state: 'abandoned',
      abandonedAt: at,
      completedAt: at,
    }
  })
}

export function projectRoundForHistory(round: RoundRecord): VisibleRoundRecord {
  if (round.state === 'finalized' && round.kind === 'hidden-target') {
    return {
      ...round,
      target: round.target ? { ...round.target } : undefined,
    }
  }

  const { target: _hiddenTarget, ...safeRound } = round
  return safeRound
}

export function projectSessionForHistory(session: SessionRecord): VisibleSessionRecord {
  return {
    ...session,
    rounds: session.rounds.map(projectRoundForHistory),
  }
}

export function projectSessionForExport(session: SessionRecord): VisibleSessionRecord {
  return projectSessionForHistory(session)
}

export function canExportSession(session: SessionRecord) {
  return session.rounds.some((round) => round.state === 'finalized')
}

export function buildSessionExport(
  session: SessionRecord,
  exportedAt = nowIso(),
): ExportedSessionRecord {
  if (!canExportSession(session)) {
    throw new Error('A session needs at least one finalized round before export.')
  }

  return {
    schemaVersion: 1,
    exportedAt,
    session: projectSessionForExport(session),
    disclaimer: SESSION_RECORDS_DISCLAIMER,
  }
}

export function serializeSessionExport(
  session: SessionRecord,
  exportedAt = nowIso(),
) {
  return JSON.stringify(buildSessionExport(session, exportedAt), null, 2)
}

function getDefaultStorage(): StorageLike {
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('Browser local storage is unavailable.')
  }
  return window.localStorage
}

function isSessionRecordStore(value: unknown): value is SessionRecordStore {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<SessionRecordStore>
  return (
    candidate.schemaVersion === 1 &&
    (candidate.activeSessionId === null || typeof candidate.activeSessionId === 'string') &&
    Array.isArray(candidate.sessions)
  )
}

export function loadSessionRecordStore(storage?: StorageLike): StorageResult<SessionRecordStore> {
  const fallback = createEmptySessionRecordStore()

  try {
    const target = storage ?? getDefaultStorage()
    const raw = target.getItem(SESSION_RECORDS_STORAGE_KEY)

    if (!raw) {
      return { ok: true, value: fallback }
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isSessionRecordStore(parsed)) {
      return {
        ok: false,
        value: fallback,
        error: 'Stored session records use an unsupported or malformed schema.',
      }
    }

    return { ok: true, value: parsed }
  } catch (error) {
    return {
      ok: false,
      value: fallback,
      error: error instanceof Error ? error.message : 'Unable to read session records.',
    }
  }
}

export function saveSessionRecordStore(
  store: SessionRecordStore,
  storage?: StorageLike,
): StorageResult<SessionRecordStore> {
  try {
    const target = storage ?? getDefaultStorage()
    target.setItem(SESSION_RECORDS_STORAGE_KEY, JSON.stringify(store))
    return { ok: true, value: store }
  } catch (error) {
    return {
      ok: false,
      value: store,
      error: error instanceof Error ? error.message : 'Unable to save session records.',
    }
  }
}
