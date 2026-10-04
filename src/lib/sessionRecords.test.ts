import { describe, expect, it } from 'vitest'
import {
  abandonRound,
  captureReceiverResponse,
  createSessionRecord,
  finalizeHiddenTargetRound,
  prepareHiddenTargetRound,
  projectRoundForHistory,
  type SessionRecord,
} from './sessionRecords'

const times = {
  start: '2026-10-04T12:00:00.000Z',
  selected1: '2026-10-04T12:01:00.000Z',
  selected2: '2026-10-04T12:02:00.000Z',
  captured: '2026-10-04T12:03:00.000Z',
  revealed: '2026-10-04T12:04:00.000Z',
  abandoned: '2026-10-04T12:05:00.000Z',
}

function session(): SessionRecord {
  return createSessionRecord({
    id: 'session-1',
    startedAt: times.start,
  })
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
})
