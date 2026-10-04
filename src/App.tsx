import { useMemo, useState } from 'react'
import { GrimoireScene } from './components/GrimoireScene'
import { MeditationGate } from './components/MeditationGate'
import { SessionHistory } from './components/SessionHistory'
import { practices, targets } from './content/practices'
import {
  abandonRound,
  captureReceiverResponse,
  completeActiveSession,
  createSessionRecord,
  deleteSessionRecord,
  finalizeGroupRound,
  finalizeHiddenTargetRound,
  getActiveSession,
  getOpenRound,
  loadSessionRecordStore,
  prepareGroupRound,
  prepareHiddenTargetRound,
  saveSessionRecordStore,
  upsertSessionRecord,
  type SessionRecordStore,
} from './lib/sessionRecords'

function randomFrom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function loadInitialRecords() {
  const result = loadSessionRecordStore()
  const store = result.value
  const activeSession = getActiveSession(store)
  const openRound = getOpenRound(activeSession)

  return {
    store,
    openRound,
    warning: result.ok ? null : result.error,
  }
}

function App() {
  const [initialRecords] = useState(loadInitialRecords)
  const restoredRound = initialRecords.openRound

  const [recordStore, setRecordStore] = useState<SessionRecordStore>(
    initialRecords.store,
  )
  const [storageWarning, setStorageWarning] = useState<string | null>(
    initialRecords.warning,
  )
  const [activeRoundId, setActiveRoundId] = useState<string | null>(
    restoredRound?.id ?? null,
  )
  const [activeId, setActiveId] = useState(
    restoredRound?.protocolId ?? practices[0].id,
  )
  const [target, setTarget] = useState<string | null>(
    restoredRound?.kind === 'hidden-target'
      ? restoredRound.target?.value ?? null
      : null,
  )
  const [revealed, setRevealed] = useState(false)
  const [round, setRound] = useState(restoredRound?.sequence ?? 0)
  const [receiverLog, setReceiverLog] = useState(
    restoredRound?.observation ?? '',
  )
  const [meditationActive, setMeditationActive] = useState(false)

  const active = useMemo(
    () => practices.find((practice) => practice.id === activeId) ?? practices[0],
    [activeId],
  )

  const activeSession = useMemo(
    () => getActiveSession(recordStore),
    [recordStore],
  )

  const activeRound = useMemo(
    () =>
      activeSession?.rounds.find((item) => item.id === activeRoundId) ?? null,
    [activeRoundId, activeSession],
  )

  const scenePalette: [string, string, string] = meditationActive
    ? ['#e8ddff', '#8ef0d0', '#8f7cff']
    : active.palette

  const isGroup = active.id === 'group'

  const pool =
    active.id === 'chromatic'
      ? targets.colors
      : active.id === 'number'
        ? targets.numbers
        : targets.symbols

  function persist(nextStore: SessionRecordStore) {
    const result = saveSessionRecordStore(nextStore)
    setRecordStore(nextStore)
    setStorageWarning(result.ok ? null : result.error)
  }

  function sessionForWrite(baseStore = recordStore) {
    const existing = getActiveSession(baseStore)
    if (existing) return { store: baseStore, session: existing }

    const session = createSessionRecord()
    const store = upsertSessionRecord(baseStore, session)
    return { store, session }
  }

  function resetRoundUi() {
    setActiveRoundId(null)
    setTarget(null)
    setRevealed(false)
    setReceiverLog('')
  }

  function abandonCurrentRound(requireConfirmation = true) {
    if (!activeSession || !activeRound) return true

    if (
      requireConfirmation &&
      !window.confirm(
        'Esta rodada ainda está ativa. Abandoná-la e preservar a tentativa no histórico?',
      )
    ) {
      return false
    }

    const nextSession = abandonRound(activeSession, activeRound.id)
    persist(upsertSessionRecord(recordStore, nextSession))
    resetRoundUi()
    return true
  }

  function prepareTarget() {
    if (activeRound) return

    const selectedTarget = randomFrom(pool)
    const base = sessionForWrite()
    const nextSession = prepareHiddenTargetRound(base.session, {
      protocolId: active.id,
      protocolTitle: active.title,
      targetValue: selectedTarget,
    })
    const nextRound = nextSession.rounds[nextSession.rounds.length - 1]

    persist(upsertSessionRecord(base.store, nextSession))
    setTarget(selectedTarget)
    setRevealed(false)
    setReceiverLog('')
    setRound(nextRound.sequence)
    setActiveRoundId(nextRound.id)
  }

  function captureResponse() {
    if (!activeSession || !activeRound || activeRound.kind !== 'hidden-target') {
      return
    }

    try {
      const nextSession = captureReceiverResponse(
        activeSession,
        activeRound.id,
        receiverLog,
      )
      persist(upsertSessionRecord(recordStore, nextSession))
    } catch (error) {
      setStorageWarning(
        error instanceof Error ? error.message : 'Não foi possível registrar a resposta.',
      )
    }
  }

  function revealTarget() {
    if (!activeSession || !activeRound || activeRound.kind !== 'hidden-target') {
      return
    }

    try {
      const nextSession = finalizeHiddenTargetRound(activeSession, activeRound.id)
      const finalized = nextSession.rounds.find(
        (item) => item.id === activeRound.id,
      )
      persist(upsertSessionRecord(recordStore, nextSession))
      setTarget(finalized?.target?.value ?? target)
      setRevealed(true)
      setActiveRoundId(null)
    } catch (error) {
      setStorageWarning(
        error instanceof Error ? error.message : 'Não foi possível revelar o alvo.',
      )
    }
  }

  function startGroupPractice() {
    if (activeRound) return

    const base = sessionForWrite()
    const nextSession = prepareGroupRound(base.session, {
      protocolId: active.id,
      protocolTitle: active.title,
    })
    const nextRound = nextSession.rounds[nextSession.rounds.length - 1]

    persist(upsertSessionRecord(base.store, nextSession))
    setTarget(null)
    setRevealed(false)
    setReceiverLog('')
    setRound(nextRound.sequence)
    setActiveRoundId(nextRound.id)
  }

  function completeGroupPractice() {
    if (!activeSession || !activeRound || activeRound.kind !== 'group') return

    try {
      const nextSession = finalizeGroupRound(
        activeSession,
        activeRound.id,
        receiverLog,
      )
      persist(upsertSessionRecord(recordStore, nextSession))
      setActiveRoundId(null)
      setReceiverLog('')
    } catch (error) {
      setStorageWarning(
        error instanceof Error ? error.message : 'Não foi possível concluir a prática.',
      )
    }
  }

  function selectPractice(id: string) {
    if (id === activeId) return

    if (activeRound && !abandonCurrentRound(true)) {
      return
    }

    setActiveId(id)
    setTarget(null)
    setRevealed(false)
    setReceiverLog('')
    setRound(0)
  }

  function startNewSession() {
    let nextStore = recordStore
    const currentSession = getActiveSession(nextStore)
    const openRound = getOpenRound(currentSession)

    if (currentSession && openRound) {
      if (
        !window.confirm(
          'A rodada atual será abandonada antes de encerrar esta sessão. Continuar?',
        )
      ) {
        return
      }

      const abandoned = abandonRound(currentSession, openRound.id)
      nextStore = upsertSessionRecord(nextStore, abandoned)
    }

    nextStore = completeActiveSession(nextStore)
    persist(nextStore)
    resetRoundUi()
    setRound(0)
  }

  function deleteSession(sessionId: string) {
    persist(deleteSessionRecord(recordStore, sessionId))

    if (recordStore.activeSessionId === sessionId) {
      resetRoundUi()
      setRound(0)
    }
  }

  const responseCaptured =
    activeRound?.kind === 'hidden-target' &&
    activeRound.state === 'response-captured'

  return (
    <main className="shell">
      <section className="scene" aria-label="Visualização tridimensional do AZ-Sync">
        <GrimoireScene
          palette={scenePalette}
          intensity={meditationActive ? 1 : revealed ? 1 : 0.42}
        />
        <div className="scene-vignette" />
        <div className="scene-label">
          <span>AZ-SYNC / FIELD</span>
          <span>
            {meditationActive
              ? 'ALAN ASTRAL / ACTIVE'
              : `ROUND ${String(Math.max(round, 1)).padStart(2, '0')}`}
          </span>
        </div>
      </section>

      <section className="interface">
        <header className="masthead">
          <div>
            <p className="eyebrow">EXPERIMENTAL GRIMOIRE / V0.3</p>
            <h1>AZ-Sync</h1>
            <p className="lede">
              Um laboratório visual para atenção, meditação e experimentos
              estruturados de transmissão simbólica.
            </p>
          </div>
          <div className="status">
            <span className="status-dot" />
            {meditationActive ? 'MEDITATION ACTIVE' : 'SESSION READY'}
          </div>
        </header>

        {storageWarning ? (
          <aside className="storage-warning" role="alert">
            <strong>REGISTRO LOCAL INDISPONÍVEL</strong>
            <span>
              {storageWarning} Não considere esta sessão duravelmente registrada
              até o aviso desaparecer.
            </span>
          </aside>
        ) : null}

        <MeditationGate onActiveChange={setMeditationActive} />

        <nav className="practice-nav" aria-label="Protocolos">
          {practices.map((practice) => (
            <button
              key={practice.id}
              className={practice.id === active.id ? 'nav-item active' : 'nav-item'}
              onClick={() => selectPractice(practice.id)}
            >
              <span>{practice.index}</span>
              {practice.title}
            </button>
          ))}
        </nav>

        <article className="protocol-card">
          <div className="protocol-head">
            <div>
              <p className="protocol-kicker">{active.subtitle}</p>
              <h2>{active.title}</h2>
            </div>
            <span className="duration">{active.duration}</span>
          </div>

          <p className="intent">{active.intent}</p>

          <ol className="steps">
            {active.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="session-grid">
            <section className="receiver-panel">
              <label htmlFor="receiver-log">
                {isGroup ? 'NOTAS DO PARTICIPANTE' : 'REGISTRO DO RECEPTOR'}
                <span>
                  {isGroup
                    ? 'registro independente da prática'
                    : responseCaptured
                      ? 'resposta congelada antes da revelação'
                      : 'registre antes de revelar'}
                </span>
              </label>
              <textarea
                id="receiver-log"
                value={receiverLog}
                onChange={(event) => setReceiverLog(event.target.value)}
                placeholder={
                  isGroup
                    ? 'Ex.: imagens, palavras, sensações e estado de atenção...'
                    : 'Ex.: forma circular, brilho azul, número 7...'
                }
                rows={4}
                disabled={
                  !activeRound ||
                  (isGroup
                    ? activeRound.kind !== 'group'
                    : activeRound.kind !== 'hidden-target' ||
                      activeRound.state !== 'prepared')
                }
              />
            </section>

            {isGroup ? (
              <section className="target-console group-console" aria-live="polite">
                <div>
                  <span className="console-label">PRÁTICA DE GRUPO</span>
                  <strong className="target">
                    {activeRound?.kind === 'group' ? 'ATIVA' : 'SEM ALVO'}
                  </strong>
                  <small>
                    Este protocolo registra notas e ordem da sessão. Nenhum alvo
                    aleatório é criado.
                  </small>
                </div>
                <div className="console-actions">
                  {activeRound?.kind === 'group' ? (
                    <>
                      <button
                        className="ghost"
                        onClick={() => abandonCurrentRound(true)}
                      >
                        abandonar
                      </button>
                      <button
                        className="primary"
                        onClick={completeGroupPractice}
                        disabled={receiverLog.trim().length === 0}
                      >
                        concluir registro
                      </button>
                    </>
                  ) : (
                    <button className="primary" onClick={startGroupPractice}>
                      iniciar prática
                    </button>
                  )}
                </div>
              </section>
            ) : (
              <section className="target-console" aria-live="polite">
                <div>
                  <span className="console-label">ALVO DA RODADA</span>
                  <strong className={revealed ? 'target revealed' : 'target'}>
                    {revealed && target ? target : '••••'}
                  </strong>
                </div>
                <div className="console-actions">
                  {!activeRound ? (
                    <button className="primary" onClick={prepareTarget}>
                      {revealed ? 'nova rodada' : 'sortear alvo'}
                    </button>
                  ) : (
                    <>
                      <button
                        className="ghost"
                        onClick={() => abandonCurrentRound(true)}
                      >
                        abandonar
                      </button>
                      {responseCaptured ? (
                        <button className="primary" onClick={revealTarget}>
                          revelar
                        </button>
                      ) : (
                        <button
                          className="primary"
                          onClick={captureResponse}
                          disabled={receiverLog.trim().length === 0}
                        >
                          registrar resposta
                        </button>
                      )}
                    </>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="method-note">
            <span>MÉTODO</span>
            <p>{active.note}</p>
          </aside>
        </article>

        <SessionHistory
          store={recordStore}
          onNewSession={startNewSession}
          onDeleteSession={deleteSession}
        />

        <footer>
          <span>Observe → registre → revele → compare.</span>
          <span>Sem alegação de fenômeno paranormal.</span>
        </footer>
      </section>
    </main>
  )
}

export default App
