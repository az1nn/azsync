import { describe, expect, it } from 'vitest'
import {
  abandonRound,
  buildSessionExport,
  canExportSession,
  captureReceiverResponse,
  createEmptySessionRecordStore,
  createSessionRecord,
  finalizeGroupRound,
  finalizeHiddenTargetRound,
  loadSessionRecordStore,
  prepareGroupRound,
  prepareHiddenTargetRound,
  projectRoundForHistory,
  saveSessionRecordStore,
  serializeSessionExport,
  upsertSessionRecord,
  type SessionRecord,
  type StorageLike,
} from './sessionRecords'

const times = {
  start: '2026-10-04T12:00:00.000Z',
  selected1: '2026-10-04T12:01:00.000Z',
  selected2: '2026-10-04T12:02:00.000Z',
  captured: '2026-10-04T12:03:00.000Z',
  revealed: '2026-10-04T12:04:00.000Z',
  abandoned: '2026-10-04T12:05:00.000Z',
  exported: '2026-10-04T12:06:00.000Z',
}

function session(): SessionRecord {
  return createSessionRecord({
    id: 'session-1',
    startedAt: times.start,
  })
}

function memoryStorage(): StorageLike {
  const values = new Map<string, string>()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}

describe('session record lifecycle', () => {
  it('preserves deterministic round ordering', () => {
    let current = session()

    current = prepareHiddenTargetRound(current, {
      id: 'round-1',
      protocolId: 'symbol',
      protocolTitle: 'Transmissão de Símbolo',
      targetValue: '△',
      at: times.selected1,
    })

    current = prepareHiddenTargetRound(current, {
      id: 'round-2',
      protocolId: 'number',
      protocolTitle: 'Número Cego',
      targetValue: '7',
      at: times.selected2,
    })

    expect(current.rounds.map((round) => round.sequence)).toEqual([1, 2])
    expect(current.rounds.map((round) => round.id)).toEqual(['round-1', 'round-2'])
  })

  it('captures the receiver response once and freezes the pre-reveal observation', () => {
    let current = prepareHiddenTargetRound(session(), {
      id: 'round-1',
      protocolId: 'symbol',
      protocolTitle: 'Transmissão de Símbolo',
      targetValue: '△',
      at: times.selected1,
    })

    current = captureReceiverResponse(current, 'round-1', 'forma triangular', times.captured)

    const captured = current.rounds[0]
    expect(captured.state).toBe('response-captured')
    expect(captured.observation).toBe('forma triangular')
    expect(captured.responseCapturedAt).toBe(times.captured)

    expect(() =>
      captureReceiverResponse(current, 'round-1', 'tentativa de editar', times.revealed),
    ).toThrow(/already captured/i)

    expect(current.rounds[0].observation).toBe('forma triangular')
  })

  it('blocks reveal before the receiver response is captured', () => {
    const current = prepareHiddenTargetRound(session(), {
      id: 'round-1',
      protocolId: 'number',
      protocolTitle: 'Número Cego',
      targetValue: '7',
      at: times.selected1,
    })

    expect(() =>
      finalizeHiddenTargetRound(current, 'round-1', times.revealed),
    ).toThrow(/response.*before reveal/i)
  })

  it('finalizes only after capture and preserves event ordering', () => {
    let current = prepareHiddenTargetRound(session(), {
      id: 'round-1',
      protocolId: 'chromatic',
      protocolTitle: 'Campo Cromático',
      targetValue: 'Azul',
      at: times.selected1,
    })

    current = captureReceiverResponse(current, 'round-1', 'frio e azul', times.captured)
    current = finalizeHiddenTargetRound(current, 'round-1', times.revealed)

    const round = current.rounds[0]
    expect(round.state).toBe('finalized')
    expect(round.targetSelectedAt).toBe(times.selected1)
    expect(round.responseCapturedAt).toBe(times.captured)
    expect(round.revealedAt).toBe(times.revealed)
    expect(round.completedAt).toBe(times.revealed)
    expect(round.observation).toBe('frio e azul')
    expect(round.target?.value).toBe('Azul')
  })

  it('never exposes the target in history before explicit reveal', () => {
    let current = prepareHiddenTargetRound(session(), {
      id: 'round-1',
      protocolId: 'symbol',
      protocolTitle: 'Transmissão de Símbolo',
      targetValue: '✦',
      at: times.selected1,
    })

    expect(projectRoundForHistory(current.rounds[0])).not.toHaveProperty('target')

    current = captureReceiverResponse(current, 'round-1', 'brilho pontudo', times.captured)
    expect(projectRoundForHistory(current.rounds[0])).not.toHaveProperty('target')

    current = finalizeHiddenTargetRound(current, 'round-1', times.revealed)
    expect(projectRoundForHistory(current.rounds[0]).target?.value).toBe('✦')
  })

  it('keeps abandonment in ordering but hides an unrevealed target', () => {
    let current = prepareHiddenTargetRound(session(), {
      id: 'round-1',
      protocolId: 'number',
      protocolTitle: 'Número Cego',
      targetValue: '9',
      at: times.selected1,
    })

    current = abandonRound(current, 'round-1', times.abandoned)

    const round = current.rounds[0]
    expect(round.state).toBe('abandoned')
    expect(round.abandonedAt).toBe(times.abandoned)
    expect(projectRoundForHistory(round)).not.toHaveProperty('target')
  })

  it('records group practice as a targetless finalized round', () => {
    let current = prepareGroupRound(session(), {
      id: 'group-1',
      protocolId: 'group',
      protocolTitle: 'Sincronização em Grupo',
      at: times.selected1,
    })

    expect(current.rounds[0].kind).toBe('group')
    expect(current.rounds[0]).not.toHaveProperty('target')
    expect(current.rounds[0]).not.toHaveProperty('targetSelectedAt')

    current = finalizeGroupRound(
      current,
      'group-1',
      'silêncio, calor e imagem de água',
      times.captured,
    )

    expect(current.rounds[0].state).toBe('finalized')
    expect(current.rounds[0].observation).toBe('silêncio, calor e imagem de água')
    expect(projectRoundForHistory(current.rounds[0])).not.toHaveProperty('target')
  })

  it('exports Unicode, ordering and only revealed target data', () => {
    let current = session()
    current = prepareHiddenTargetRound(current, {
      id: 'round-1',
      protocolId: 'symbol',
      protocolTitle: 'Transmissão de Símbolo',
      targetValue: '☾',
      at: times.selected1,
    })
    current = captureReceiverResponse(current, 'round-1', 'lua · água · atenção', times.captured)
    current = finalizeHiddenTargetRound(current, 'round-1', times.revealed)

    current = prepareHiddenTargetRound(current, {
      id: 'round-2',
      protocolId: 'number',
      protocolTitle: 'Número Cego',
      targetValue: '4',
      at: times.selected2,
    })
    current = abandonRound(current, 'round-2', times.abandoned)

    expect(canExportSession(current)).toBe(true)

    const payload = buildSessionExport(current, times.exported)
    expect(payload.schemaVersion).toBe(1)
    expect(payload.session.rounds.map((round) => round.sequence)).toEqual([1, 2])
    expect(payload.session.rounds[0].observation).toBe('lua · água · atenção')
    expect(payload.session.rounds[0].target?.value).toBe('☾')
    expect(payload.session.rounds[1]).not.toHaveProperty('target')
    expect(payload.disclaimer).toMatch(/experiência subjetiva/i)

    const serialized = serializeSessionExport(current, times.exported)
    expect(serialized).toContain('lua · água · atenção')
    expect(JSON.parse(serialized).session.rounds[1].target).toBeUndefined()
  })

  it('prevents misleading export when there is no finalized round', () => {
    let current = session()
    current = prepareHiddenTargetRound(current, {
      id: 'round-1',
      protocolId: 'number',
      protocolTitle: 'Número Cego',
      targetValue: '3',
      at: times.selected1,
    })
    current = abandonRound(current, 'round-1', times.abandoned)

    expect(canExportSession(current)).toBe(false)
    expect(() => buildSessionExport(current, times.exported)).toThrow(/finalized round/i)
  })

  it('round-trips the versioned store and reports storage failures', () => {
    const storage = memoryStorage()
    const firstSession = session()
    const store = upsertSessionRecord(createEmptySessionRecordStore(), firstSession)

    expect(saveSessionRecordStore(store, storage).ok).toBe(true)
    expect(loadSessionRecordStore(storage)).toEqual({ ok: true, value: store })

    const failingStorage: StorageLike = {
      getItem: () => {
        throw new Error('storage blocked')
      },
      setItem: () => {
        throw new Error('storage blocked')
      },
    }

    const loadResult = loadSessionRecordStore(failingStorage)
    expect(loadResult.ok).toBe(false)
    if (!loadResult.ok) expect(loadResult.error).toMatch(/storage blocked/i)

    const saveResult = saveSessionRecordStore(store, failingStorage)
    expect(saveResult.ok).toBe(false)
    if (!saveResult.ok) expect(saveResult.error).toMatch(/storage blocked/i)
  })
})
