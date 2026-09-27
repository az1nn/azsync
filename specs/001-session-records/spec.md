# Feature Specification: Reproducible Session Records

**Feature Branch**: `001-session-records`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "Create the first repository-backed AZ-Sync product specification after Spec Kit bootstrap. Close the gap between the existing blind-target practice flow and the constitution requirement for reproducible experimental records by preserving session and round records without presenting subjective results as evidence of paranormal transmission."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preserve a completed blind-target round (Priority: P1)

As a participant running a symbol, color, or number protocol, I want the receiver response and target reveal to become a durable round record so I can later verify what was recorded before the target was shown.

**Why this priority**: The project constitution requires receiver input before reveal and reproducible records. A durable, ordered round record is the minimum product slice that turns the current ephemeral flow into auditable experiment history.

**Independent Test**: Start one blind-target round, record the receiver impression, reveal the target, complete the round, reload the experience, and confirm the finalized round still contains the original response, target, protocol, role information, and event ordering.

**Acceptance Scenarios**:

1. **Given** a hidden target has been selected, **When** the receiver submits a non-empty response, **Then** the response is captured before the target can be revealed.
2. **Given** a captured receiver response, **When** the target is revealed, **Then** the finalized round records the receiver response, revealed target, protocol, target-selection context, participant roles, and reveal ordering.
3. **Given** a finalized round, **When** the participant reloads the experience and opens the session history, **Then** the same round is available without alteration.
4. **Given** a hidden target has not yet been revealed, **When** the participant views any history or metadata available during the active round, **Then** no target value or target-derived hint is exposed.

---

### User Story 2 - Review an experimental session chronologically (Priority: P2)

As a participant, I want to review all finalized rounds from a session in their original order so I can compare attempts after the fact without reconstructing the session from memory.

**Why this priority**: Reproducibility depends on preserving sequence and context, not only individual answers.

**Independent Test**: Complete at least three rounds across one or more supported protocols, open the session history, and verify that each round appears once, in completion order, with its protocol, recorded response, revealed target when applicable, and timestamps or equivalent ordering markers.

**Acceptance Scenarios**:

1. **Given** multiple finalized rounds, **When** the participant opens the session history, **Then** every finalized round appears once in chronological order.
2. **Given** a history entry, **When** the participant inspects it, **Then** the interface distinguishes observation, target, and any post-reveal interpretation.
3. **Given** an unfinished round, **When** the participant opens history, **Then** the unfinished round is clearly marked as incomplete or excluded from finalized results and cannot be mistaken for a completed trial.

---

### User Story 3 - Export a reproducible session record (Priority: P3)

As a participant, I want to export a completed session in a portable record so I can archive it, compare sessions externally, or share the raw experimental record without relying on screenshots.

**Why this priority**: A portable record improves reproducibility and preserves the distinction between raw observations and later interpretation.

**Independent Test**: Complete a session with at least two finalized rounds, export it, and confirm that the exported record contains the session metadata and all finalized round fields in the same order shown in the history.

**Acceptance Scenarios**:

1. **Given** a session with finalized rounds, **When** the participant exports the session, **Then** the output contains a stable session identifier, session start time, protocol/round ordering, role information, receiver responses, target values after reveal, and completion timestamps or equivalent ordering markers.
2. **Given** a session containing participant notes or interpretations, **When** it is exported, **Then** subjective notes are labeled separately from target data and objective event ordering.
3. **Given** a session with no finalized rounds, **When** the participant attempts to export it, **Then** the product prevents a misleading empty experimental record or clearly identifies it as empty.

### Edge Cases

- A participant refreshes or closes the page after recording a receiver response but before reveal.
- A participant starts a new round before completing the current round.
- A participant changes protocol while a round is active.
- A target is selected but the receiver never records a response.
- A round is abandoned after the response is recorded but before reveal.
- A session contains both hidden-target practices and the group-attention practice, which has no randomized hidden target.
- Device storage is unavailable, full, or cleared by the participant.
- Existing V0.1 users have no prior durable session records when the feature first appears.
- Repeated targets occur across different randomized rounds and must remain separate records.
- Participant-entered text includes line breaks, symbols, emoji, or non-ASCII characters.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST create a session record when a participant begins an experimental session.
- **FR-002**: Each session record MUST have a stable identifier and preserve the session start time or an equivalent unambiguous ordering reference.
- **FR-003**: For every hidden-target round, the system MUST preserve the protocol, target-selection event, participant role assignment, receiver response, reveal event, revealed target, and round completion ordering.
- **FR-004**: The receiver response for a hidden-target round MUST be captured before target reveal and MUST NOT be editable as the pre-reveal response after reveal.
- **FR-005**: The system MUST NOT expose a hidden target, target-derived metadata, or a visual cue that reveals the target before the receiver response has been captured.
- **FR-006**: A finalized round MUST remain available after a normal page reload on the same participant device unless the participant deliberately clears saved records or the environment cannot provide durable storage.
- **FR-007**: The system MUST present finalized rounds in their original session order and distinguish finalized, active, and abandoned/incomplete rounds.
- **FR-008**: The system MUST keep participant observations and post-reveal interpretations semantically separate from randomized target data and event-order metadata.
- **FR-009**: The system MUST support session records for the current symbol, color, and number hidden-target practices.
- **FR-010**: When the group-attention practice is recorded, the system MUST omit hidden-target fields and preserve only applicable session metadata, participant notes, ordering, and protocol context.
- **FR-011**: Participants MUST be able to start a new session without deleting previously saved sessions.
- **FR-012**: Participants MUST be able to review previously saved sessions and identify each by date/order and protocol composition without exposing data from an active hidden round.
- **FR-013**: Participants MUST be able to deliberately delete a saved session, with a confirmation step that identifies the destructive action.
- **FR-014**: Participants MUST be able to export a completed session as a portable machine-readable record containing the data necessary to reconstruct session and round ordering.
- **FR-015**: Exported records MUST label subjective observations/interpretations separately from target values and system-recorded event ordering.
- **FR-016**: The product MUST clearly state that stored comparisons are experimental records of participant experience and do not constitute evidence of paranormal or telepathic mechanisms.
- **FR-017**: If durable saving fails, the participant MUST receive a visible warning before continuing to rely on the session as a reproducible record.
- **FR-018**: Changing protocol or requesting a new round while a round is active MUST require the current round to be completed or explicitly abandoned so its state is not silently lost.
- **FR-019**: An abandoned round MUST preserve enough ordering information to show that it occurred, while preventing it from being counted or presented as a finalized result.
- **FR-020**: Existing V0.1 operation MUST remain usable for a first-time visitor without requiring account creation, sign-in, or cloud synchronization.

### Key Entities

- **Session Record**: One experimental session, including a stable identifier, start/end ordering, constituent rounds, protocol usage, and session-level notes when present.
- **Round Record**: One attempt within a session, including protocol, lifecycle state, target-selection ordering, receiver response, reveal ordering, revealed target when applicable, completion ordering, and optional post-reveal interpretation.
- **Participant Role Assignment**: The role context for a round or session, such as emitter and receiver, without requiring personal identity information.
- **Exported Session Record**: A portable representation of a session whose fields preserve the same semantic separation and ordering as the in-product history.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation runs, 100% of finalized hidden-target rounds contain a receiver response recorded before the reveal event and retain both values after a normal page reload.
- **SC-002**: In validation runs of 20 consecutive rounds, session history preserves the exact round order with no duplicated or missing finalized rounds.
- **SC-003**: A participant can find and review any finalized round from the current or a previous saved session within 30 seconds from the main experience.
- **SC-004**: A participant can export a completed session in no more than three deliberate actions from the session-history surface.
- **SC-005**: For all supported hidden-target practices, pre-reveal screens expose zero target values or target-derived hints in visible history, labels, or metadata.
- **SC-006**: When saving is unavailable or fails, 100% of tested failure cases display a warning before the participant can reasonably assume the round is durably recorded.
- **SC-007**: Export validation can reconstruct the session's finalized round count, order, protocol, pre-reveal response, and revealed target for 100% of exported hidden-target rounds.
- **SC-008**: Usability validation confirms that a first-time participant can run and complete a blind-target round without creating an account or configuring synchronization.

## Assumptions

- The first increment is single-device and single-browser in scope; account-based synchronization, shared cloud sessions, and cross-device history are excluded.
- The existing four practice types remain the canonical protocol set for this increment.
- Participant roles are labels used for experimental context, not authenticated user identities.
- Statistical scoring, significance testing, leaderboards, and claims of anomalous cognition are excluded from this feature.
- Export is intended for archival and external analysis; import/replay of exported sessions is outside this increment.
- The existing immersive visual layer may continue to react to protocol state, but it must not encode or suggest an unrevealed target.
- Migration of nonexistent historical records is not required; the feature begins recording from first use after implementation.
