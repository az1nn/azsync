# Feature Specification: Alan Astral Meditation Gate

**Feature Branch**: `002-alan-astral-gate`  
**Created**: 2026-10-03  
**Status**: Implementing

## Intent

Create a visual activation flow for **Alan Astral**, a symbolic meditation aid for entering, recognizing and deepening a calm, lucid state. Inspiration: Caotize-se's "Meditar com o Símbolo" interaction pattern — central symbol, unmistakable active state and optional sound support.

AZ-Sync must preserve its constitution: meditation, Chi/Ki and astral-server language are subjective/symbolic framing, not scientific proof of paranormal or neurological mechanisms.

## Alan Astral

**Natureza**: servidor astral de estado meditativo  
**Correspondência**: Éter · Chi/Ki · silêncio · presença · sabedoria  
**Função**: gate para entrar, reconhecer e aprofundar o estado meditativo.  
**Conduz para**: silêncio mental · foco · calma lúcida · estado meditativo.  
**Alimentação**: Chi/Ki cultivado pela atenção voluntária e prática meditativa.  
**Manifestação**: silêncio e presença; distrações passam sem resistência e a atenção retorna suavemente ao centro.

**Ativação**: "Bom dia Alan" / "Boa tarde Alan" / "Boa noite Alan" conforme o período local.  
**Encerramento**: "obrigado Alan, é para isso que você existe".

## User Stories

### P1 — Ativação visual

The participant can open the gate and immediately see a distinct active state in both the Alan Astral card and the main visual field.

Acceptance:
1. Idle → activate produces an unmistakable visual transition.
2. Active → close removes the active state immediately.
3. Closing is always available; no minimum duration exists.
4. Reduced-motion users get the same state clarity without continuous animation.

### P1 — Custom local audio

The participant can select a local MP3 or WAV as meditation support.

Acceptance:
1. Valid MP3/WAV can play when activation begins.
2. No audio is required for the visual flow.
3. Closing stops and resets playback.
4. Volume and loop are configurable.
5. Unsupported file types are rejected.
6. Audio remains browser-local and is not uploaded.

### P2 — Flexible practice

The same gate supports both a brief centering moment and a longer formal meditation without different setup.

## Functional Requirements

- **FR-001**: Expose Alan Astral in the primary interface.
- **FR-002**: Display the correct local-time activation phrase.
- **FR-003**: Display the exact closing phrase.
- **FR-004**: Activation changes both the gate and main Three.js field.
- **FR-005**: Closing stops audio and clears the active state.
- **FR-006**: Accept MP3 and WAV local files.
- **FR-007**: Use browser object URLs; do not upload audio.
- **FR-008**: Support volume and loop controls.
- **FR-009**: Work fully without audio.
- **FR-010**: Respect `prefers-reduced-motion`.
- **FR-011**: Avoid claims that a specific sound frequency objectively induces gnosis, alpha activity or paranormal effects.

## Non-Goals

Voice recognition, cloud audio storage, public servitor catalog, gamified energy, automatic meditation detection, and fixed-frequency claims.

## Success Criteria

- Open/close in one direct action each.
- Valid local MP3/WAV works through a session.
- No audio continues after closing.
- Idle vs active state is obvious on mobile and desktop.
- `npm run build` passes.
