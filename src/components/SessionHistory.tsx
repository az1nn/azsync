import {
  canExportSession,
  projectSessionForHistory,
  serializeSessionExport,
  type SessionRecord,
  type SessionRecordStore,
} from '../lib/sessionRecords'

type SessionHistoryProps = {
  store: SessionRecordStore
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
}

const stateLabel = {
  prepared: 'ativa',
  'response-captured': 'resposta registrada',
  finalized: 'finalizada',
  abandoned: 'abandonada',
} as const

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function downloadSession(session: SessionRecord) {
  const content = serializeSessionExport(session)
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `azsync-${session.id}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function SessionHistory({
  store,
  onNewSession,
  onDeleteSession,
}: SessionHistoryProps) {
  const sessions = [...store.sessions].reverse()

  return (
    <section className="history-panel" aria-labelledby="history-title">
      <div className="history-head">
        <div>
          <p className="protocol-kicker">REGISTROS / LOCAL</p>
          <h2 id="history-title">Histórico experimental</h2>
        </div>
        <button className="ghost history-new" onClick={onNewSession}>
          nova sessão
        </button>
      </div>

      <p className="history-disclaimer">
        Registros de experiência subjetiva. Comparações não constituem evidência
        de telepatia ou transmissão paranormal.
      </p>

      {sessions.length === 0 ? (
        <div className="history-empty">
          Nenhuma rodada registrada neste navegador.
        </div>
      ) : (
        <div className="history-list">
          {sessions.map((session) => {
            const visible = projectSessionForHistory(session)
            const finalizedCount = visible.rounds.filter(
              (round) => round.state === 'finalized',
            ).length

            return (
              <details className="history-session" key={session.id}>
                <summary>
                  <span>
                    <strong>{formatDate(session.startedAt)}</strong>
                    <small>
                      {visible.rounds.length} tentativa
                      {visible.rounds.length === 1 ? '' : 's'} · {finalizedCount}{' '}
                      finalizada{finalizedCount === 1 ? '' : 's'}
                    </small>
                  </span>
                  <span className="history-session-status">
                    {store.activeSessionId === session.id ? 'ATIVA' : 'ARQUIVADA'}
                  </span>
                </summary>

                <div className="history-rounds">
                  {visible.rounds.length === 0 ? (
                    <p className="history-empty-inline">Sessão ainda sem rodadas.</p>
                  ) : (
                    visible.rounds.map((round) => (
                      <article className="history-round" key={round.id}>
                        <div className="history-round-head">
                          <span>
                            #{String(round.sequence).padStart(2, '0')} ·{' '}
                            {round.protocolTitle}
                          </span>
                          <strong data-state={round.state}>
                            {stateLabel[round.state]}
                          </strong>
                        </div>

                        {round.observation ? (
                          <p>
                            <span>OBSERVAÇÃO</span>
                            {round.observation}
                          </p>
                        ) : null}

                        {round.target ? (
                          <p>
                            <span>ALVO REVELADO</span>
                            {round.target.value}
                          </p>
                        ) : null}

                        {round.state === 'abandoned' ? (
                          <p className="history-muted">
                            Tentativa preservada na ordem da sessão, sem ser contada
                            como resultado finalizado.
                          </p>
                        ) : null}
                      </article>
                    ))
                  )}
                </div>

                <div className="history-actions">
                  <button
                    className="ghost"
                    disabled={!canExportSession(session)}
                    onClick={() => downloadSession(session)}
                  >
                    exportar JSON
                  </button>
                  <button
                    className="ghost danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Excluir esta sessão deste navegador? Esta ação não pode ser desfeita.',
                        )
                      ) {
                        onDeleteSession(session.id)
                      }
                    }}
                  >
                    excluir
                  </button>
                </div>
              </details>
            )
          })}
        </div>
      )}
    </section>
  )
}
