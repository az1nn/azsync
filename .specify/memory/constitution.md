# AZ-Sync Constitution

## Core Principles

### I. Spec Before Implementation

Every non-trivial product change MUST begin with a repository-backed Spec Kit specification. The specification defines user value, scenarios, requirements, acceptance criteria, non-goals, and measurable success before implementation details are committed.

Plans and tasks MUST trace back to an approved specification. SIGA may advance implementation only from repository-backed scope.

### II. Subjective Experience Is Not Evidence

AZ-Sync may support meditation, attention, symbol, color, number, imagery, group-intention, and thought-transmission experiments as subjective practices.

The product MUST NOT present telepathy, paranormal transmission, remote perception, or similar extraordinary mechanisms as established scientific fact. UI copy MUST distinguish participant experience, hypothesis, observation, and evidence.

### III. Blindness Before Reveal

Whenever a protocol evaluates a hidden target, the receiver's response MUST be persisted before target reveal.

The system MUST minimize cueing, retrospective matching, and accidental target disclosure. Any protocol that weakens blinding MUST state that limitation explicitly in its spec and interface.

### IV. Reproducible Experimental Records

Experiment flows MUST define the target selection method, participant role(s), timestamps or ordering, recorded response, reveal point, and result interpretation method when applicable.

Changes that affect experimental validity MUST be independently testable and documented in acceptance scenarios.

### V. Experience Without Suggestion

The Three.js/grimoire presentation may be symbolic, atmospheric, and immersive, but decorative visuals MUST NOT leak or imply hidden target answers.

Mobile and desktop flows MUST remain readable, keyboard/touch accessible where practical, and performant enough that presentation does not obstruct the protocol.

### VI. Small, Verifiable Increments

Features SHOULD be delivered as independently testable slices. Avoid speculative architecture and unrelated refactors.

At minimum, each implementation unit MUST pass the repository build gate. Additional tests MUST be added when the feature has deterministic behavior that can be validated automatically.

## Development Workflow

The canonical SDD path is:

1. `$speckit-specify`
2. `$speckit-clarify` when ambiguity affects acceptance
3. `$speckit-plan`
4. `$speckit-checklist` for quality-sensitive work
5. `$speckit-tasks`
6. `$speckit-analyze`
7. `$speckit-implement`
8. `$speckit-converge`

`SIGA` remains the repository-local continuation protocol and MUST reconcile real repository state before advancing any Spec Kit work.

## Governance

This constitution is authoritative for AZ-Sync product specifications and implementation plans.

Amendments require:
- an explicit rationale;
- review of affected specs/templates/workflows;
- a version bump;
- a recorded amendment date.

**Version**: 1.0.0  
**Ratified**: 2026-09-24  
**Last Amended**: 2026-09-24
