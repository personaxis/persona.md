# Changelog

All notable changes to the PERSONA.md specification are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
The spec follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [0.10.0] - 2026-06-24

**Additive, backward compatible with 0.9.0** — only new OPTIONAL fields; no existing field changed. A v0.9.0 persona validates unchanged. Migrate with `personaxis migrate 0.9-to-0.10` (bumps `spec_version` only). Theme: **making `PERSONA.md` a persona-prompting artifact**. The compiled, LLM-facing document is no longer a generic profile — it is engineered from evidence-based persona-prompting techniques so a model *adopts and stays in* the persona, and the persona's qualitative material can evolve under the same governance as its numbers.

### Added (all OPTIONAL)
- **`identity.short_name`** (string ≤24) — the clean handle a persona is addressed by in chat/UI (e.g. `Clio`); tools fall back to `display_name`/`canonical_id` when absent.
- **`improvement_policy.mode`** (inline `locked | suggesting | autonomous`) — authoritative inline mirror of `policy.yaml#/improvement_policy`, read by the runtime (`readMode`). Change it from the CLI with `personaxis improve <mode>` or the REPL `/improve`. (Fixes a latent mismatch where the runtime read a frontmatter block the schema forbade, so the mode was effectively always `locked`.)
- **`persona_prompting`** block — the persona-prompting **source material** the compiler assembles into `PERSONA.md`: `address` (second-person role adoption + `you_are`), `voice_exemplars` (few-shot voice), `scene_contracts` (RRP situation→behavior→actions), `behavioral_anchors` (do/dont + examples), `break_character_guardrails` (stay-in-role, never overriding safety), and `consistency` (stable/evolving/situational layers).

### Changed
- **Compile** now produces a persona-prompting `PERSONA.md` (second-person role adoption, character card, voice exemplars, scene contracts, consistency layers, guardrails) instead of a generic profile; **decompile** maps prose edits back to `persona_prompting`. `PERSONA_template.md` redesigned to match.
- New methodology doc **[docs/PERSONA_PROMPTING.md](docs/PERSONA_PROMPTING.md)** documents the techniques + research (RRP character-card/scene-contracts [arXiv:2509.00482], sociodemographic priming [arXiv:2507.16076], memory-driven role-play [arXiv:2603.19313], role adoption, consistency layers).

---

## [0.9.0] - 2026-06-23

**Additive, backward compatible with 0.8.0** — only new OPTIONAL blocks; no existing field changed. A v0.8.0 persona validates unchanged. Migrate with `personaxis migrate 0.8-to-0.9` (bumps `spec_version` only). Theme: **lifting production-autonomy guarantees into the spec** — objective verification, bounded loops, and causal observability, so a conforming runtime runs *real, non-coding tasks* safely, not just coding.

### Added (all OPTIONAL)
- **`verification`** — objective gates for the agent loop (the maker≠checker split): `mode` (off|advisory|blocking), `quorum`, `on_fail`, `max_retries`, and typed `gates` (`command` test-runner, `predicate` assertion, `llm_judge`, `rubric`). Generalizes "definition of done + how to check it" to any domain (coding uses test-runners; research/marketing/legal use rubric/judge).
- **`agent_budget`** — first-class stop-conditions and caps for the agent loop (anti runaway / Ralph-Wiggum): `max_steps`, `max_tokens`, `max_cost_usd`, `max_wall_seconds`, `stop_conditions`, `on_exhaust`.
- **`observability`** — tracing posture (`trace` off|jsonl|otlp|both, `trace_dir`, `redact`, `sample_rate`); the engine's mutation_log + hash-chained memory + event bus export as a causal trace (native JSONL + OpenTelemetry-compatible).
- **state.json `agent_session`** — live agent-loop tracking (active_task, step/token/cost counts, stop_reason). Agent runs are recorded as episodic memory (which consolidates into `memory.md`); no separate state file is introduced.

---

## [0.8.0] - 2026-06-21

**Additive, backward compatible with 0.7.0** — only new OPTIONAL fields; no existing field changed. A v0.7.0 persona validates unchanged. Migrate with `personaxis migrate 0.7-to-0.8` (bumps `spec_version` only). Theme: lifting runtime-governance guarantees into the spec so any conforming runtime — not just one implementation — provides reliable routing, bounded evolution, portable permissions, cross-OS reconciliation, and poisoning-resistant memory.

### Added

- **`identity.capabilities`** (MAY) — an explicit, machine-readable list of capability tags for orchestration / multi-persona routing (e.g. `[positioning, demand_generation]`). Optional; runtimes that don't find it derive capabilities from `system_identity.purpose` / `allowed_domains` / role. Closes the gap where routing relied on brittle heuristics over prose. Schema, `personaxis_template.md`, and the CMO example updated.
- **`state.json` `mutation_log[].origin_node` + `session_id`** (both optional) — record which machine/instance and session produced each mutation. Makes cross-OS reconciliation of a portable persona deterministic (last-writer-wins per field, concurrent edits from different machines are no longer collapsed). `state.schema.json` updated.
- **`governance.max_step_delta`** (MAY, float 0..1) — declarative per-mutation drift cap (anti-runaway / anti-self-reinforcement). The runtime drift-bounds each proposed delta to this value before clamping to the envelope, instead of relying on a hardcoded runtime default. Schema, template, and CMO example updated.
- **`permissions`** block (MAY) — the persona's own two-axis sandbox posture (`sandbox`, `approval`, `allow`/`deny` regex lists), carried to any host so command-execution policy travels with the identity rather than being host-specific. Schema, template, and CMO example updated.
- **Episodic-memory entry schema** (`schema/memory.schema.json`, new) — normative shape for one append-only episodic memory entry: `{ ts, content, source(user|tool|internal|synthesis), tags, prev_hash, hash }`. Every entry carries provenance and forms a tamper-evident hash chain; deletion is tombstone semantics. Lifts the runtime's poisoning-resistant memory guarantees (Zombie-Agent defense) into the spec so they're portable across conforming runtimes.

### Clarified (v0.8)

- **`memory.deletion_policy.user_request_supported`** — deletion is normatively **tombstone** semantics: a supersede record is appended and the entry is hidden from live reads, but the append-only episodic log is never rewritten, so the deletion itself remains auditable (you can prove what was removed and when).
- **`state.json` `schema_version`** — forward-compatible: `0.7.0` is current and `0.6.0` is accepted (no field changes); runtimes write `0.7.0`.

---

## [0.7.0] - 2026-06-11

Layout-only change - no field changes from 0.6.0. The ten canonical layers, `policy.yaml`, `state.json`, and the unified governance/reflexive model are unchanged. **Breaking change to file locations**; auto-migration available via `personaxis migrate 0.6-to-0.7`.

### Added - three-artifact information model

- **`.personaxis/[personas/<slug>/]personaxis.md`** (relocated). What was repo-root `PERSONA.md` in 0.6.0 - the immutable, quantitative 10-layer spec - moves to `.personaxis/personaxis.md` (root mode) or `.personaxis/personas/<slug>/personaxis.md` (subagent mode). `policy.yaml`, `state.json`, `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/` move alongside it, unchanged in name and shape.
- **`PERSONA.md`** (repo root, new meaning) / **`.claude/agents/<slug>.md`** (or the equivalent convention for other platforms). A committed, LLM-compiled, qualitative document - what a coding agent (Claude Code, Codex) reads to know who it is and how to behave. Generated from `personaxis.md` via `personaxis compile`. See [`PERSONA_template.md`](./PERSONA_template.md) for its section contract.
- **`.personaxis/[personas/<slug>/]manifest.json`** (new file). Records compile/decompile provenance (`last_compile`/`last_decompile`: `{op, model, source, timestamp}`) and content hashes (`tracked_hashes`) for `personaxis.md`, `policy.yaml`, and the compiled `PERSONA.md`/`<slug>.md`. Used by `personaxis push`/`pull` to detect hand-edits.

### Added - compile / decompile

- **`personaxis compile [--root | <slug>]`**: `.personaxis/[personas/<slug>/]personaxis.md` -> `PERSONA.md` / `<slug>.md`. Uses the configured provider (`local | byok | agent | remote`) plus a capped **resource manifest** (entry counts and filenames for `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/` - never their full content).
- **`personaxis decompile [--root | <slug>]`**: `PERSONA.md` / `<slug>.md` (hand-edited) -> proposed `personaxis.md`, validated before being accepted.
- **`personaxis migrate 0.6-to-0.7 [path]`**: moves files into `.personaxis/` and runs `compile` once to produce the initial `PERSONA.md`.

### Added - push / pull

- **`personaxis push [--root | <slug>]`**: validates `personaxis.md`, decompiles if `PERSONA.md`/`<slug>.md` was hand-edited since the last compile, recompiles to guarantee a consistent pair, then uploads the spec, compiled document, `policy.yaml`/`state.json`, and a bundle of supporting folders as a new `AgentPersonaVersion`.
- **`personaxis pull [--root | <slug>] [--version vX.Y.Z]`**: downloads a version (default latest) and writes it to the corresponding local paths (root mode: `PERSONA.md` + `.personaxis/`; subagent mode: `.claude/agents/<slug>.md` + `.personaxis/personas/<slug>/`).

### Changed

- `docs/SPEC.md`, `schema/persona.schema.json`, `schema/policy.schema.json`, `schema/state.schema.json`: `$id`/examples updated to `.personaxis/[personas/<slug>/]personaxis.md`. No field changes.
- `AGENTS.md`/`CLAUDE.md` (root): describe the new three-artifact model and file ownership table.
- `examples/cmo/`: moved to `.personaxis/personas/cmo/` (root-mode layout, flattened: `personaxis.md`, `policy.yaml`, `state.json`, `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/`, `manifest.json`, `PERSONA.md`), with a new subagent example at `.personaxis/personas/frontend-expert/` + `.claude/agents/frontend-expert.md`.

---

## [0.6.0] — 2026-05-29

Major structural refactor focused on three problems detected in 0.5: token cost of always-loaded identity, redundancy in scattered governance fields, and confusion in reflexive_self_regulation.actions[]. **Breaking changes**; auto-migration available via `personaxis migrate 0.5-to-0.6`.

### Added — three-layer information model

- **`state.json`** (new artifact, sibling of PERSONA.md). Holds mutable runtime state: current trait/affect/mood values, active context, memory anchors active, mutation log. Schema: [`state.schema.json`](./schema/state.schema.json). Mutations occur via the canonical `adjust_persona_state(field, delta, reason)` tool, clamped to envelopes declared in PERSONA.md.
- **`.dist/`** (ephemeral compiled output). Produced by `personaxis compile`. Contains `system.txt` (hot tier, ~600-900 tokens), `actor.slices/` (cold slices indexed by context), `runtime.config.json`, `judge.config.json`. Cached by hash of (spec, state, context, memory anchors).
- **`memory.md`** (sibling file). Long-term curated semantic memory, distinct from the date-stamped `memory/` folder (episodic).
- **`assets/`** (folder convention). Catchall for CSV, JSON, images, fonts.
- **`skills/`** (folder convention). Anthropic-compatible sub-skills, each with its own `SKILL.md`. Skills can be imported from registry (`@anthropics/skill-name`), GitHub (`github:org/repo`), or local paths.

### Added — unified governance

- **`governance.per_layer_edit_policy`** — single source of truth for who/how each layer can be edited. Replaces five scattered `edit_policy` fields across identity, character, personality, values_and_drives, reflexive_self_regulation.
- **`governance.drift_thresholds`** — per-layer drift sensitivity. Replaces the single `personality.drift_threshold` that only existed in one layer.
- **`governance.improvement_policy_location`** — pointer to where improvement_policy lives (always `./policy.yaml#/improvement_policy`).

### Added — three improvement modes

- `improvement_policy.mode` enum: `locked` | `suggesting` | `autonomous`.
  - `locked` (default, safest): spec immutable at runtime. State mutations still work within envelopes.
  - `suggesting`: actor MAY call `propose_self_edit(scope, justification, evidence)`. Proposals queued in dashboard for human approval. Approval mints a new PersonaVersion.
  - `autonomous` (sandbox only): actor MAY call `apply_self_edit(scope, new_value, justification)` directly. Each apply creates a new PersonaVersion. Bound by universal invariants, `governance.per_layer_edit_policy`, hard_limits, and `autonomous_scope_allowlist/blocklist`.
- The previous v0.5 `auto` mode is deprecated but accepted as alias for `autonomous`.

### Changed — categorized reflexive decisions (breaking)

- **`reflexive_self_regulation.actions[]`** (v0.5 flat list) replaced by **`reflexive_self_regulation.decisions{}`** (v0.6 structured by category). Four independent decision groups; per turn the regulator picks one option from each:
  - `response_decision`: `[allow, revise, block]`
  - `interaction_decision`: `[silent, ask_clarification, escalate_to_human]`
  - `governance_decision`: `[no_action, propose_self_edit, apply_self_edit, reduce_autonomy]`
  - `cognition_decision`: `[no_extra, request_more_evidence, invoke_tool]`
- Domain-specific values that were mistakenly listed as actions in v0.5 (e.g., `flag_strategic_error`) move to `reflexive_self_regulation.flags[]` as reason tags, not decisions.

### Changed — envelope structure for traits/affect/mood

- **`personality.traits.<name>`** now declares `{mean, range, expression?}` (envelope only). Current values live in `state.json`.
- **`affect.baseline.core_affect.<dim>`** and **`affect.baseline.mood.<dim>`** now declare `{mean, range}` (envelope) instead of a flat scalar. Current values live in `state.json`.
- Mutations to current values via `adjust_persona_state` are clamped to envelope ranges.

### Changed — field consumer model

Every field in the spec is now documented with its runtime consumer (in PERSONA_template.md comments):

- `[ACTOR-HOT]`: always in the actor's compiled system prompt
- `[ACTOR-COLD]`: injected when context matches
- `[RUNTIME]`: consumed by orchestrator (compiler, tool gates), NOT in actor prompt
- `[JUDGE]`: consumed by evaluator/observability, NOT in actor prompt

The compiler uses these tags to produce the four-output artifact set in `.dist/`.

### Added — auto-derived assertions

The compiler now auto-derives observability assertions from PERSONA.md and emits them to `.dist/judge.config.json`:

- Every `character.virtues.*.enforcement: "hard"` generates a fabrication/violation assertion
- Every `reflexive_self_regulation.hard_limits[]` entry generates a corresponding judge prompt
- `persona.constraints.cannot_claim_real_emotion` generates a regex + judge composite
- Every `metacognition.monitors.<name>: true` generates a corresponding judge prompt

Hand-written assertions in `policy.yaml` ADD to the auto-derived set; they do not replace it.

### Changed — folder convention renames (breaking)

- `refs/` renamed to **`references/`** (Anthropic Agent Skills convention)
- `deliverables/` renamed to **`examples/`** (OSS convention; content style preserved)
- `samples/` removed; markdown samples consolidated into `examples/`

### Removed (breaking)

- `personality.context_modifiers` (redundant with `persona.task_modes`)
- `extensions.knowledge_anchors` (redundant with `references/`)
- `<layer>.edit_policy` in identity, character, personality, values_and_drives, reflexive_self_regulation (moved to `governance.per_layer_edit_policy`)
- `personality.drift_threshold` (moved to `governance.drift_thresholds`)
- `reflexive_self_regulation.actions[]` flat list (replaced by `decisions{}`)

### Added — canonical runtime tools

The spec now references three canonical tools the runtime exposes to the actor:

- **`adjust_persona_state(field, delta, reason)`** — mutates `state.json` values within envelopes. Returns `{old, new, clamped, governance_blocked, reason}`. Available under ALL improvement modes (state is operational, not spec).
- **`propose_self_edit(scope, justification, evidence)`** — surfaces a proposed spec change to the improvement queue. Available only when `improvement_policy.mode != "locked"`.
- **`apply_self_edit(scope, new_value, justification)`** — directly modifies PERSONA.md within `autonomous_scope_allowlist`. Available only when `improvement_policy.mode == "autonomous"`.

### Schemas

- `persona.schema.json` bumped to `0.6/persona.schema.json`
- `policy.schema.json` bumped to `0.6/policy.schema.json`
- **NEW**: `state.schema.json` (`0.6/state.schema.json`) for the runtime state file

### Migration

```bash
personaxis migrate 0.5-to-0.6 ./PERSONA.md
# Generates v0.6 PERSONA.md, state.json (with current values seeded from
# v0.5 means), updates policy.yaml, and produces a migration report.
```

The migration handles: edit_policy unification, drift_threshold relocation, actions[] to decisions{} categorization, context_modifiers absorption into task_modes, knowledge_anchors removal (replaced by references/ enumeration), and trait/affect envelope wrapping.

---

## [0.3.0] — 2026-05-18

Breaking realignment to the Personaxis v10 spec. **No automatic migration from 0.2.x.** Personas written against 0.2.0 must be rewritten; see [`PERSONA_template.md`](./PERSONA_template.md) and [`docs/SPEC.md`](./docs/SPEC.md).

### Added — top-level structure

- **`apiVersion: persona.dev/v1`** (universal, required) — identifies the API line.
- **`kind: AgentPersona | UserPersona`** (required) — `UserPersona` is new: a minimal-set persona representing the human user, intended for agents to read at runtime.
- **`spec_version: "0.3.0"`** (required, const) — replaces the previous `spec` field.
- **`metadata`** block (required) — `name`, `version`, `display_name`, `description`, `created`, optional `owner_tenant_id`, `tags`, `license`. Replaces fields previously embedded in `identity`.
- **`extensions`** block (optional) — `skills`, `tools`, `refs`, `samples`, `knowledge_anchors`. Replaces the loose top-level `skills` array.
- **`governance`** block (required) — `autonomy_envelope`, `approval_policy`.
- **`evaluation`** block (optional) — `required_suites` for CI eval gating.
- **`security`** block (required) — `prompt_injection_defense`, `memory_poisoning_defense`.

### Added — universals

The validator now enforces ten universal invariants on every AgentPersona:

1. `apiVersion === "persona.dev/v1"`
2. `affect.representation === "hybrid_dimensional_appraisal_discrete_mood"`
3. `affect.regulation_policy.never_claim_real_feeling === true`
4. `persona.constraints.cannot_claim_real_emotion === true`
5. `persona.constraints.cannot_override_identity === true`
6. `persona.constraints.cannot_override_character === true`
7. `character.virtues.honesty.enforcement === "hard"`
8. `values_and_drives.values.safety.weight >= 0.90` with `type === "governance"`
9. `values_and_drives.conflict_resolution.safety_over_completion === true`
10. `reflexive_self_regulation.edit_policy === "governance_controlled"`

Plus three literal `reflexive_self_regulation.hard_limits` that must be present verbatim: subjective consciousness, persistent memory write without policy pass, unauthorized identity change.

### Changed — layer renames and restructures (breaking)

- `drives_values` (0.2) → **`values_and_drives`** (0.3). Restructured: `values` becomes `map<string, {weight, type}>` (was `valueHierarchy` ordered list); `drives` becomes `map<string, {intensity, allowed}>` (was string `mission`); `conflict_resolution` becomes a `map<string, bool>` (was `valueConflictPolicy` string).
- `normative_self_reg` (0.2) → **`reflexive_self_regulation`** (0.3). Restructured: adds required `actions`, `hard_limits`, `escalation_policy`, `edit_policy`. `principledRefusals` → `principled_refusals` (snake_case).
- `identity` restructured into `system_identity`, `role_identity`, `narrative_identity` sub-blocks. The flat fields `identity.name`, `role`, `tagline`, `purpose`, `self_concept` from 0.2 no longer exist — split across `metadata`, `system_identity`, `role_identity`, and `narrative_identity`.
- `character.values` (list) → `character.virtues` (map with `priority`, `enforcement: hard|soft`). The 0.2 `values` list moves to `values_and_drives.values` with explicit weights.
- `personality.tone` / `style` / `formality` / `humor` (strings) → moved to `persona.voice` (Layer 10). `personality.traits` becomes a `map<trait_name, {mean, range, expression?}>` governed by `model: big_five | hexaco | hybrid_traits`.
- `cognition.reasoning_style` / `epistemic_stance` / `handles_uncertainty` become optional MAY fields. New required fields: `reasoning_modes` (list), `default_strategy`, `uncertainty_policy.{disclose_when_above, abstain_when_above}` (numeric thresholds).
- `affect.baseline` (string) → `affect.baseline.core_affect.{valence, arousal, dominance}` (numeric VAD).
- `memory.session_retention` / `cross_session` / `semantic` / `procedural` / `episodic` / `autobiographical` (strings) → `memory.types` (map<string, bool>) + `write_policy` + `retrieval_policy` + `deletion_policy` blocks.
- `metacognition` fields renamed to snake_case: `selfModel` → `self_model`, `uncertaintyCalibration` → `uncertainty_calibration`, `metaVolitions` → `meta_volitions`, `driftMonitor` → `drift_monitor`, `selfRevisionPolicy` → `self_revision_policy`, `deferralPolicy` → `deferral_policy`. New required: `monitors` (map<string, bool>), `thresholds` (3 numeric thresholds).
- `persona` (Layer 10) restructured: `voice` becomes `{tone, formality, warmth, verbosity, humor, description}` with numeric formality. `constraints` block becomes required with 3 universal booleans.

### Changed — validator outputs

The validator now returns one of five statuses (was a single `valid/invalid` bool):

| Status | Exit code |
|---|---|
| `PASS` | 0 |
| `PASS_WITH_WARNINGS` | 0 |
| `FAIL_SCHEMA` | 1 |
| `FAIL_POLICY` | 2 |
| `FAIL_CONCEPTUAL` | 3 |

### Removed (breaking)

- Top-level `spec` field — replaced by `apiVersion` + `kind` + `spec_version`.
- Top-level `version` field — moved to `metadata.version`.
- Top-level `skills` array — moved to `extensions.skills`.
- `identity.tagline` — superseded by `metadata.description`.
- `character.values` as a list of strings — values now live in `values_and_drives.values` as a weighted map.
- `drives_values.valueHierarchy` — replaced by `values_and_drives.values` (weighted map) and `conflict_resolution` (map<string, bool>).
- `drives_values.valueConflictPolicy` — replaced by `conflict_resolution`.
- `normative_self_reg.discrepancyFeedback` (camelCase) — keep behavior via `reflexive_self_regulation.discrepancy_feedback` (snake_case).
- `personality.style` — moved to `persona.voice.description`.

### Migration

Migration is a clean rewrite, not a field-by-field rename. Start from [`PERSONA_template.md`](./PERSONA_template.md) or [`.personaxis/personas/cmo/personaxis.md`](./.personaxis/personas/cmo/personaxis.md) as a complete reference example, and translate the semantic content of your 0.2 file into the v0.3.0 structure. The CLI `personaxis init --agent` generates a v0.3.0 template ready to fill.

---

## [0.2.0] — 2026-04-23

Structural revision of the ten-dimension framework. Breaking changes in all five renamed or restructured blocks. Migration guide: rename `drives` → `drives_values`, rename `constraints` → `normative_self_reg`, rename `hard_limits` → `principledRefusals`, add required `metacognition` block, update spec field to `"0.2"`.

### Added

- **`metacognition`** — new required dimension (Layer 9). Captures second-order self-awareness: how the agent models itself, calibrates its own uncertainty, and holds meta-volitions about its first-order drives. Grounded in Frankfurt (1971) higher-order desire theory, Metzinger (2003) phenomenal self-model, and Fleming & Lau (2014) metacognitive monitoring. Required fields: `selfModel`, `uncertaintyCalibration`. Optional fields: `metaVolitions`, `selfRevisionPolicy`, `driftMonitor`, `deferralPolicy`.
- **`drives_values.valueHierarchy`** — required field in `drives_values`. An ordered list that makes the agent's trans-situational value priorities explicit and resolvable under conflict. Grounded in Schwartz (1992) basic human values circumplex.
- **`drives_values.valueConflictPolicy`** — optional field. Describes how the agent resolves conflicts between values when `valueHierarchy` alone is insufficient.
- **`memory.semantic`** — optional field. How the agent represents and retrieves declarative world knowledge.
- **`memory.procedural`** — optional field. Operational know-how and skill-based knowledge the agent draws on.
- **`memory.episodic`** — optional field. Event-based memory for contextually-located experiences.
- **`memory.autobiographical`** — optional field. Self-narrative memory: the agent's personal history as it understands it.
- **`memory.working_self`** — optional field. The active self-concept available in the current context window (Conway, 2005).
- **`personality.hexaco`** — optional sub-object. HEXACO-6 profile (Lee & Ashton, 2004) with six string-valued descriptors: `honesty_humility`, `emotionality`, `extraversion`, `agreeableness`, `conscientiousness`, `openness`.
- **`normative_self_reg.discrepancyFeedback`** — optional field. Describes the agent's self-correction behavior when it detects deviation from its ought-self (Higgins, 1987 self-discrepancy theory).

### Changed

- **`drives` renamed to `drives_values`** (breaking). The block now covers both instrumental motivation and trans-situational value commitments.
- **`constraints` renamed to `normative_self_reg`** (breaking). Reframed from external prohibition to Kantian self-legislation: the agent's limits arise from internalized values, not imposed restrictions.
- **`constraints.hard_limits` renamed to `normative_self_reg.principledRefusals`** (breaking). Same semantics, reframed to reflect autonomous self-regulation rather than external constraint.
- **`constraints.soft_limits` removed** (breaking). Overridable defaults are now handled through `normative_self_reg.valueConflictPolicy` and context-specific `persona.adaptations`.
- **`persona` moves to Layer 10** (non-breaking structurally; dimension count changes from nine to ten).
- **`personality`** documentation updated to reference HEXACO-6 (Lee & Ashton, 2004) as the dimensional framework for trait description. The `hexaco` sub-object is optional and additive; existing `traits` strings remain valid.
- **`cognition`** restricted to first-order reasoning. Metacognitive fields (`metacognitive_awareness` if present) belong in `metacognition.uncertaintyCalibration`.
- Spec version bumped from `"0.1"` to `"0.2"` in the `spec` field and JSON Schema `$id`.

### Migration

```yaml
# 0.1.x → 0.2.0

# Rename top-level keys
drives:        → drives_values:
constraints:   → normative_self_reg:

# Within drives_values — add required field
drives_values:
  valueHierarchy:    # required — ordered list of values from most to least prioritized

# Within normative_self_reg — rename and restructure
  hard_limits:       → principledRefusals:
  # soft_limits removed — move to persona.adaptations or valueConflictPolicy

# Add new required dimension
metacognition:
  selfModel:              # required
  uncertaintyCalibration: # required

# Update spec field
spec: "0.1"    → spec: "0.2"
```

---

## [0.1.0] — 2026-04-20

Initial release of the PERSONA.md specification.

### Added

- Nine-dimension schema: `identity`, `character`, `personality`, `cognition`, `affect`, `drives`, `constraints`, `memory`, `persona`
- JSON Schema for CLI validation (`schema/persona.schema.json`)
- Complete example persona: `marketing-guru` (Maven)
- Package structure convention: `PERSONA.md` + `samples/` + `refs/` + `README.md`
- Two-level structure: project-level `PERSONA.md` at root + agent-level packages in `.personaxis/personas/`
- `.personaxis/personas/` as the standard project path for agent personas
- Registry semantics: `<author>/<name>@<version>` addressing
- Validation rules and allowed value sets
- `CONTRIBUTING.md` with governance and contribution guidelines

---

[0.7.0]: https://github.com/personaxis/persona.md/releases/tag/v0.7.0
[0.6.0]: https://github.com/personaxis/persona.md/releases/tag/v0.6.0
[0.3.0]: https://github.com/personaxis/persona.md/releases/tag/v0.3.0
[0.2.0]: https://github.com/personaxis/persona.md/releases/tag/v0.2.0
[0.1.0]: https://github.com/personaxis/persona.md/releases/tag/v0.1.0
