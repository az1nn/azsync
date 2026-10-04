import { useEffect, useMemo, useRef, useState } from 'react'

type Props = { onActiveChange?: (active: boolean) => void }

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia Alan'
  if (hour < 18) return 'Boa tarde Alan'
  return 'Boa noite Alan'
}

function supported(file: File) {
  const name = file.name.toLowerCase()
  return file.type === 'audio/mpeg' || file.type === 'audio/wav' ||
    file.type === 'audio/x-wav' || name.endsWith('.mp3') || name.endsWith('.wav')
}

export function MeditationGate({ onActiveChange }: Props) {
  const [active, setActive] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioName, setAudioName] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.55)
  const [loopAudio, setLoopAudio] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const activationPhrase = useMemo(greeting, [])

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
  }, [audioUrl])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  function chooseAudio(file?: File) {
    setError(null)
    if (!file) return
    if (!supported(file)) {
      setError('Use um arquivo MP3 ou WAV.')
      return
    }
    setAudioUrl(URL.createObjectURL(file))
    setAudioName(file.name)
  }

  async function activate() {
    setActive(true)
    setError(null)
    onActiveChange?.(true)
    if (!audioRef.current || !audioUrl) return
    audioRef.current.currentTime = 0
    try {
      await audioRef.current.play()
    } catch {
      setError('Use o controle de reprodução para iniciar o áudio.')
    }
  }

  function closeGate() {
    setActive(false)
    onActiveChange?.(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <section className={active ? 'meditation-gate active' : 'meditation-gate'}>
      <div className="gate-copy">
        <p className="protocol-kicker">ALAN ASTRAL / MEDITATION GATE</p>
        <h2>Calma lúcida.</h2>
        <p>Silêncio mental · foco · presença.</p>
        <div className="gate-phrase">
          <span>{active ? 'ENCERRAMENTO' : 'ATIVAÇÃO'}</span>
          <strong>“{active ? 'obrigado Alan, é para isso que você existe' : activationPhrase}”</strong>
        </div>
        <div className="gate-actions">
          <button className="primary gate-primary" onClick={active ? closeGate : activate}>
            {active ? 'encerrar' : 'abrir gate'}
          </button>
          <span className="gate-state">{active ? 'PRESENÇA ATIVA' : 'EM SILÊNCIO'}</span>
        </div>
      </div>

      <div className="gate-visual" aria-hidden="true">
        <div className="astral-ring ring-outer" />
        <div className="astral-ring ring-middle" />
        <div className="astral-ring ring-inner" />
        <div className="astral-mark"><span>△</span><strong>A</strong><small>ASTRAL</small></div>
      </div>

      <div className="audio-panel">
        <div className="audio-head">
          <div><span>ÁUDIO LOCAL</span><strong>{audioName ?? 'nenhum arquivo selecionado'}</strong></div>
          <label className="file-button">
            escolher MP3/WAV
            <input type="file" accept="audio/mpeg,audio/wav,.mp3,.wav"
              onChange={(event) => chooseAudio(event.target.files?.[0])} />
          </label>
        </div>

        <audio ref={audioRef} src={audioUrl ?? undefined} loop={loopAudio} controls={Boolean(audioUrl)} />

        <div className="audio-settings">
          <label><span>volume</span><input type="range" min="0" max="1" step="0.05"
            value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
          <label className="loop-toggle"><input type="checkbox" checked={loopAudio}
            onChange={(event) => setLoopAudio(event.target.checked)} /> repetir</label>
        </div>
        {error ? <p className="audio-error">{error}</p> : null}
        <p className="audio-note">O arquivo permanece local nesta sessão. O áudio apoia a atenção; não mede objetivamente o estado meditativo.</p>
      </div>
    </section>
  )
}
