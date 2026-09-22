import { useMemo, useState } from 'react'
import { GrimoireScene } from './components/GrimoireScene'
import { practices, targets } from './content/practices'

function randomFrom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function App() {
  const [activeId, setActiveId] = useState(practices[0].id)
  const [target, setTarget] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [round, setRound] = useState(0)
  const [receiverLog, setReceiverLog] = useState('')

  const active = useMemo(
    () => practices.find((practice) => practice.id === activeId) ?? practices[0],
    [activeId],
  )

  const pool =
    active.id === 'chromatic'
      ? targets.colors
      : active.id === 'number'
        ? targets.numbers
        : targets.symbols

  function prepareTarget() {
    setTarget(randomFrom(pool))
    setRevealed(false)
    setReceiverLog('')
    setRound((value) => value + 1)
  }

  function selectPractice(id: string) {
    setActiveId(id)
    setTarget(null)
    setRevealed(false)
    setReceiverLog('')
    setRound(0)
  }

  return (
    <main className="shell">
      <section className="scene" aria-label="Visualização tridimensional do AZ-Sync">
        <GrimoireScene
          palette={active.palette}
          intensity={revealed ? 1 : 0.42}
        />
        <div className="scene-vignette" />
        <div className="scene-label">
          <span>AZ-SYNC / FIELD</span>
          <span>ROUND {String(Math.max(round, 1)).padStart(2, '0')}</span>
        </div>
      </section>

      <section className="interface">
        <header className="masthead">
          <div>
            <p className="eyebrow">EXPERIMENTAL GRIMOIRE / V0.1</p>
            <h1>AZ-Sync</h1>
            <p className="lede">
              Um laboratório visual para atenção, meditação e experimentos
              estruturados de transmissão simbólica.
            </p>
          </div>
          <div className="status">
            <span className="status-dot" />
            SESSION READY
          </div>
        </header>

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
                REGISTRO DO RECEPTOR
                <span>salve a impressão antes da revelação</span>
              </label>
              <textarea
                id="receiver-log"
                value={receiverLog}
                onChange={(event) => setReceiverLog(event.target.value)}
                placeholder="Ex.: forma circular, brilho azul, número 7..."
                rows={4}
                disabled={!target || revealed}
              />
            </section>

            <section className="target-console" aria-live="polite">
              <div>
                <span className="console-label">ALVO DA RODADA</span>
                <strong className={revealed ? 'target revealed' : 'target'}>
                  {revealed && target ? target : '••••'}
                </strong>
              </div>
              <div className="console-actions">
                <button className="ghost" onClick={prepareTarget}>
                  {target ? 'nova rodada' : 'sortear alvo'}
                </button>
                <button
                  className="primary"
                  onClick={() => setRevealed(true)}
                  disabled={!target || receiverLog.trim().length === 0}
                >
                  revelar
                </button>
              </div>
            </section>
          </div>

          <aside className="method-note">
            <span>MÉTODO</span>
            <p>{active.note}</p>
          </aside>
        </article>

        <footer>
          <span>Observe → registre → revele → compare.</span>
          <span>Sem alegação de fenômeno paranormal.</span>
        </footer>
      </section>
    </main>
  )
}

export default App
