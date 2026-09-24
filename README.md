# AZ-Sync Grimoire

Interactive Three.js grimoire for structured attention, meditation, and symbol-transmission experiments.

## V0.1

- React + TypeScript + Vite
- Three.js scene through React Three Fiber
- Four guided experimental protocols
- Blind/randomized target console
- Receiver log required before target reveal
- Responsive desktop/mobile layout
- Pull-request CI and GitHub Pages deployment

The interface deliberately separates subjective experience from evidential claims. Targets stay hidden until a participant records a response, reducing cueing and retrospective matching.

## Local development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
```

## Deployment

Pushes to `master` run the GitHub Pages workflow. Repository Pages settings must use **GitHub Actions** as the source.

## Spec-Driven Development

AZ-Sync uses GitHub Spec Kit v1.0.11 with the Codex skills integration. Project governance lives in `.specify/memory/constitution.md`; workflow details are documented in `docs/SPEC-KIT.md`.

Start a new product increment with `$speckit-specify`. Use `SIGA` to reconcile real repository state before resuming or advancing work.
