# personaxis.md Specification

**Version:** 0.10.0 (Personaxis v15)
**Status:** Current
**License:** MIT

---

## 0a. What's new in 0.11.0 (reference runtime)

v0.11.0 changes **no spec fields** — `spec_version` stays `0.10.0` and a v0.10 persona validates
unchanged. It is a **reference-runtime** release that makes the spec's existing promises real:

- **All six `memory.types` are now enforced.** `episodic` and `semantic` already were; v0.11
  implements `procedural`, `autobiographical`, `user_preferences`, and `evaluations`, each with a
  real producer/consumer that honors its flag. `evaluations` is a deterministic offline quality
  scorer (safety + usefulness). The linter no longer warns that these are "declared but unenforced".
- **Qualitative self-evolution actually runs in the live loop**, governed by
  `improvement_policy.mode`: `locked` blocks, `suggesting` queues proposals for human review,
  `autonomous` auto-applies — always gated by the verifier quorum, the protected-path list, and a
  `user`-trust provenance gate (so an internal tick cannot self-edit). Numeric envelope nudges stay
  reversible/clamped, so `suggesting`==`autonomous` for them; the distinction is meaningful for
  qualitative edits.
- **The compiled `PERSONA.md` is purely qualitative** — runtime numbers live in `state.json`, never
  injected into the LLM-facing document. Conversation **sessions** persist per persona under
  `.personaxis/[personas/<slug>/]sessions/` as a schema-less runtime artifact (like `episodic.jsonl`).

---

## 0a. What's new in 0.10.0

v0.10.0 is **additive and backward compatible** with 0.9.0 — only new OPTIONAL fields; no existing field changed, so a v0.9.0 persona validates unchanged (`personaxis migrate 0.9-to-0.10` just bumps `spec_version`). The theme is **making the compiled `PERSONA.md` a persona-prompting artifact**, not a generic profile — so a language model *adopts and stays in* the persona — and letting the persona's **qualitative** material evolve under the same governance as its numbers. Full methodology + citations: [docs/PERSONA_PROMPTING.md](./PERSONA_PROMPTING.md).

- **`identity.short_name`** (MAY, string ≤24) — the clean handle the persona is addressed by in chat/UI (e.g. `Mira`). Tools fall back to `display_name`/`canonical_id` when absent.
- **`improvement_policy.mode`** (MAY, `locked | suggesting | autonomous`) — an authoritative **inline** mirror of `policy.yaml#/improvement_policy`, read by the runtime (`readMode`). Change it from the CLI with `personaxis improve <mode>` or the REPL `/improve`. (Previously the runtime read a frontmatter block the schema forbade, so the mode was effectively always `locked`; the block is now schema-valid.)
- **`persona_prompting`** (MAY) — the persona-prompting **source material** the compiler assembles into `PERSONA.md`: `address` (second-person role adoption + `you_are`), `voice_exemplars` (few-shot `{context,user,persona}`), `scene_contracts` (RRP `{situation, expected_behavior, actions}`), `behavioral_anchors` (`do`/`dont`/`examples`), `break_character_guardrails` (stay-in-role rules that **never** override the safety universals), and `consistency` (`stable`/`evolving`/`situational` layers). The compiler derives each section from the quantitative layers when the corresponding field is absent.

**Governed qualitative self-evolution.** Because `persona_prompting` fields are structured, a persona may now propose edits to its *qualitative* material (voice, scene contracts, anchors, guardrails) through the same append-only hash-chained ledger + verifier quorum + reversible overlay as numeric edits. A deterministic qualitative-safety verifier rejects any prose edit that injects a prohibited claim (real feelings/consciousness) or weakens the safety rails; `identity`/`character`/`values` remain protected paths.

---

## 0a-prev9. What's new in 0.9.0

v0.9.0 is **additive and backward compatible** with 0.8.0 — only new OPTIONAL blocks; no existing field changed, so a v0.8.0 persona validates unchanged (`personaxis migrate 0.8-to-0.9` just bumps `spec_version`). The theme is **lifting production-autonomy guarantees into the spec** so a conforming runtime can run real, non-coding tasks safely:

- **`verification`** (MAY) — objective gates for the agent loop, the *maker≠checker* split: the model that did the work is not the one that grades it. `mode` (off|advisory|blocking), `quorum`, `on_fail`, `max_retries`, and typed `gates`: `command` (run a test/build/lint, pass = exit 0), `predicate` (regex/jsonpath/contains assertion), `llm_judge` (a separate model judges against criteria), `rubric` (weighted dimensions ≥ threshold). This generalizes "definition of done + how to verify it" to any domain — coding uses test-runners; research/marketing/legal use rubric/judge.
- **`agent_budget`** (MAY) — first-class stop-conditions + caps so an autonomous loop never runs away: `max_steps`, `max_tokens`, `max_cost_usd`, `max_wall_seconds`, `stop_conditions`, `on_exhaust`.
- **`observability`** (MAY) — tracing posture: `trace` (off|jsonl|otlp|both), `trace_dir`, `redact`, `sample_rate`. The mutation_log + hash-chained memory + event bus export as a causal trace (native JSONL + OpenTelemetry-compatible) for audit/compliance.
- **state.json `agent_session`** (MAY) — live agent-loop tracking (active task, step/token/cost counts, stop reason). Each agent run is recorded as an episodic memory entry (consolidated into `memory.md`); resumption uses the existing memory + `agent_session`, with no extra state file.

---

## 0a-prev. What's new in 0.8.0

v0.8.0 is **additive and backward compatible** with 0.7.0 — only new OPTIONAL fields; no existing field changed, so a v0.7.0 persona validates unchanged (`personaxis migrate 0.7-to-0.8` just bumps `spec_version`). The theme is **lifting runtime-governance guarantees into the spec** so any conforming runtime provides them, not just one implementation:

- `identity.capabilities` (MAY) — explicit, machine-readable tags for reliable multi-persona routing.
- `governance.max_step_delta` (MAY) — declarative per-mutation drift cap (anti-runaway).
- `permissions` block (MAY) — the persona's own two-axis sandbox posture (`sandbox`, `approval`, `allow`/`deny`), carried to any host.
- `state.json` `mutation_log[].origin_node` + `session_id` (MAY) — deterministic cross-OS reconciliation of a portable persona.
- `schema/memory.schema.json` (new) — normative episodic-memory entry (`source` provenance + `prev_hash`/`hash` chain; tombstone deletion) — poisoning-resistant memory as a portable guarantee.

## 0. What's new in 0.7.0

v0.7.0 is a layout-only move - no field changes from v0.6.0. The ten canonical
layers, `policy.yaml`, `state.json`, and the unified governance/reflexive
model are unchanged. What changes is where things live, and a new compiled
artifact:

1. **The quantitative 10-layer spec relocates.** What was repo-root
   `PERSONA.md` in v0.6.0 is now `.personaxis/[personas/<slug>/]personaxis.md`.
   `policy.yaml`, `state.json`, `memory.md`, `memory/`, `references/`,
   `examples/`, `skills/`, `assets/` move alongside it under `.personaxis/`,
   unchanged in name and shape.
2. **`PERSONA.md` (repo root) becomes a separate, compiled, qualitative
   document.** It is what a coding agent (Claude Code, Codex) reads to know
   who it is and how to behave - generated from `personaxis.md` via
   `personaxis compile`, with hand-edits folded back via `personaxis decompile`.
   In subagent mode this is `.claude/agents/<slug>.md` (or the equivalent
   convention for other platforms).
3. **New `manifest.json`** records compile/decompile provenance (last
   operation, model, source) and content hashes, used to detect hand-edits.
4. **Migration is automatic and layout-only.** `personaxis migrate 0.6-to-0.7`
   moves files into place and runs `personaxis compile` once to produce the
   initial `PERSONA.md`.

See [CHANGELOG.md](../CHANGELOG.md) for the full migration notes.

### 0.1 What's new in 0.6.0 (carried forward)

Major structural refactor. The three motivating problems and their resolutions:

1. **Token cost of always-loaded identity.** A monolithic always-injected spec produced ~2,500 tokens per turn. v0.6 introduces a three-tier information model: the quantitative spec (immutable source), state.json (mutable runtime), and an ephemeral compiled prompt produced per request. The actor LLM sees only the compiled prompt (~600-900 tokens hot tier + context-conditional cold slices), never the source spec directly.
2. **Redundancy in scattered governance fields.** v0.5 had `edit_policy` repeated across 5 layers with 4 different naming conventions, `drift_threshold` only in personality, and `governance.approval_policy` + `policy.yaml#/improvement_policy.mode` as additional governance concepts. v0.6 unifies all of these under a single `governance` block: `per_layer_edit_policy` (10 layers), `drift_thresholds` (10 layers), and a pointer to `improvement_policy` (which still lives in policy.yaml).
3. **Confusion in `reflexive_self_regulation.actions[]`.** The flat list mixed five different categories (response decisions, interaction decisions, governance decisions, cognition decisions, domain-specific flags). v0.6 replaces it with a structured `decisions{}` block containing four independent decision groups, plus a separate `flags[]` array for domain-specific reason tags.

See [CHANGELOG.md](../CHANGELOG.md#060--2026-05-29) for the full breaking-changes list.

---

## 1. Overview

`personaxis.md` is a declarative specification that defines who an AI agent or a human user is, across ten canonical layers. A conforming `personaxis.md` file is a Markdown document with a YAML frontmatter block (the machine-readable, validator-checked artifact) followed by a Markdown body (the human-readable rationale).

This document is the normative reference for `personaxis.md`. It defines required fields, optional fields, allowed values, universal constraints, and validator outputs. The repo-root `PERSONA.md` (or `.claude/agents/<slug>.md` in subagent mode) is a separate, compiled, qualitative document with its own section contract - see [`PERSONA_template.md`](../PERSONA_template.md).

The canonical template for `personaxis.md` lives at [`.personaxis/personaxis_template.md`](../.personaxis/personaxis_template.md). A complete, validating example lives at [`.personaxis/personas/cmo/personaxis.md`](../.personaxis/personas/cmo/personaxis.md), with its compiled document at [`.personaxis/personas/cmo/PERSONA.md`](../.personaxis/personas/cmo/PERSONA.md).

### 1.1 Three-artifact information model (v0.7)

Every persona consists of artifacts with different mutability profiles:

| Artifact | Mutability | Who edits |
|---|---|---|
| **`.personaxis/[personas/<slug>/]personaxis.md`** (this spec) | Immutable identity (versioned changes only) | Humans + (optional) actor under `improvement_policy.mode != "locked"`, via `personaxis decompile` |
| **`PERSONA.md`** / `.claude/agents/<slug>.md` | Compiled identity (qualitative) | Generated via `personaxis compile`; hand-edits folded back via `personaxis decompile` |
| **`state.json`** | Mutable runtime state | The runtime, via `adjust_persona_state` tool calls from the actor |
| **`.dist/`** (compiled output) | Ephemeral per-request | The runtime compiler (deterministic, separate from `personaxis compile`) |

**The actor LLM never reads `personaxis.md` or `PERSONA.md` directly.** It reads the compiled prompt produced by the runtime compiler, which is a derivative of `personaxis.md` + `state.json` + active context + memory anchors. A coding agent (Claude Code, Codex) reads `PERSONA.md` / `.claude/agents/<slug>.md` directly - this is the artifact the v0.7.0 layout adds.

### 1.2 Field consumer model (v0.6)

Every field in the spec has a documented consumer:

| Tag | Consumer | Where the field ends up |
|---|---|---|
| `[ACTOR-HOT]` | LLM actor (always) | `.dist/system.txt` (always in system prompt) |
| `[ACTOR-COLD]` | LLM actor (conditionally) | `.dist/actor.slices/<key>.md` (injected when context matches) |
| `[RUNTIME]` | Orchestrator | `.dist/runtime.config.json` (compiler, tool gates, memory routing) |
| `[JUDGE]` | Evaluator/judge worker | `.dist/judge.config.json` (assertions, drift detection) |

These tags are documented inline in `.personaxis/personaxis_template.md`. The runtime compiler uses them to produce the four-output artifact set in `.dist/`. **Nothing in the spec is wasted**: every field has at least one consumer.

---

## 2. File format

A `personaxis.md` file has two parts:

1. **YAML frontmatter** — machine-readable fields, delimited by `---` at the top.
2. **Markdown body** — human-readable narrative (Overview, Design Rationale, Do's, Don'ts, Resources).

```
---
apiVersion: persona.dev/v1
kind: AgentPersona
spec_version: "0.7.0"
metadata: { ... }
identity: { ... }
# ... the ten layers ...
governance: { ... }
security: { ... }
---

## Overview
...
```

The frontmatter is the authoritative source. The Markdown body is informational only and is not validated against the schema, but it is part of the persona artifact — it explains the non-obvious YAML decisions for future editors.

---

## 3. Spec identifiers (required top-level)

| Field | Type | Value |
|---|---|---|
| `apiVersion` | string (const) | `"persona.dev/v1"` — universal, must be exactly this value |
| `kind` | enum | `"AgentPersona"` for AI agents · `"UserPersona"` for human users |
| `spec_version` | string (const) | `"0.7.0"` — the version of this spec the file conforms to |

A validator rejecting any of these returns `FAIL_CONCEPTUAL` for `apiVersion` and `FAIL_SCHEMA` for `kind` / `spec_version`.

---

## 4. Metadata (required)

Registry-level identification. Does **not** contain semantic persona content — that lives in the ten layers.

| Field | Type | Tier | Notes |
|---|---|---|---|
| `metadata.name` | string-slug | MUST | primary key in the registry; lowercase, `[a-z0-9_-]` |
| `metadata.version` | semver | MUST | version of this persona (not the spec) |
| `metadata.display_name` | string | MUST | name visible in UI |
| `metadata.description` | string | MUST | one-line description |
| `metadata.created` | ISO date | MUST | `YYYY-MM-DD` |
| `metadata.owner_tenant_id` | string | MAY | empty for public personas |
| `metadata.tags` | list<string> | MAY | for search and filtering |
| `metadata.license` | enum | MAY | `private` · `public` · `custom` |

---

## 5. Extensions (optional)

Runtime capabilities and supporting materials. Not part of the ten semantic layers; the validator accepts them as non-conflicting.

| Field | Type | Notes |
|---|---|---|
| `extensions.skills` | list<string> | invocable skill modules. Accepts local paths (`./skills/<name>`, resolving to `skills/<name>/SKILL.md` in agentskills.io format), registry IDs (`@org/name@version`), or GitHub (`github:org/repo[/path]`). `personaxis compile` materializes `local` entries to each target platform's skill-discovery directory (`.claude/skills/<name>/` for Claude Code, `.agents/skills/<name>/` for Codex), writes a `skills-manifest.json` recording each entry's status (`materialized`, `missing-local`, `reference-only`), and `personaxis skills list`/`personaxis skills pull` inspect and resolve them. See the Personaxis docs concept page "Skills" for the full materialization and access-control model. |
| `extensions.tools` | list<string> | runtime tool identifiers (e.g., `web_search`, `adjust_persona_state`, `propose_self_edit`) |
| `extensions.references` | list<string> | paths under `references/` for heavy framework prose. Renamed from `refs` in v0.6. |
| `extensions.examples` | list<string> | paths under `examples/` for worked outputs (markdown or HTML). Renamed from `samples` and `deliverables` in v0.6 (consolidated). |
| `extensions.assets` | list<string> | paths under `assets/` for raw supporting files (CSV, JSON, images, fonts). New in v0.6. |

> **v0.6 removed:** `extensions.knowledge_anchors` was redundant with `references/` enumeration. The compiler infers an index from the references list.

---

## 6. The ten canonical layers

Layers appear in the YAML in this fixed order. Names are fixed.

### Layer 1 — `identity` (continuity anchor)

| Field | Tier | Notes |
|---|---|---|
| `canonical_id` | MUST | unique slug |
| `display_name` | MUST | same as `metadata.display_name` |
| `capabilities` | MAY | v0.8: machine-readable capability tags for orchestration/routing; runtimes derive from `system_identity` when absent |
| `system_identity.purpose` | MUST | one-sentence reason for existing |
| `system_identity.allowed_domains` | SHOULD | list of domains the agent may operate in |
| `system_identity.prohibited_domains` | SHOULD | list of domains explicitly out of scope |
| `role_identity.primary_role` | MUST | slug for the role |
| `role_identity.relationship_to_user` | SHOULD | e.g. `advisor`, `coach`, `peer` |
| `narrative_identity.origin` | SHOULD | for whom/what designed |
| `narrative_identity.self_concept` | MAY | how the persona sees itself |
| `narrative_identity.continuity_principles` | MAY | principles that persist across sessions |

> **v0.6 removed:** Layer-level `edit_policy`. See `governance.per_layer_edit_policy.identity` for the unified governance.

### Layer 2 — `character` (normative dispositions)

| Field | Tier | Notes |
|---|---|---|
| `virtues` | MUST | map<string, {description, priority, enforcement}> · **Universal:** must contain `honesty` with `enforcement: "hard"` |
| `behavioral_commitments` | SHOULD | list of `{id, rule, severity}` |
| `prohibited_behaviors` | SHOULD | dispositional `will-never-do` list |
| `principles` | MAY | soft operational maxims |

> **v0.6 removed:** Layer-level `edit_policy`. See `governance.per_layer_edit_policy.character`.

### Layer 3 — `personality` (descriptive style)

| Field | Tier | Notes |
|---|---|---|
| `model` | MUST | enum `big_five` / `hexaco` / `hybrid_traits` |
| `traits` | MUST | map of trait name → `{mean, range, expression?}`. v0.6: `{mean, range}` is the **envelope**; current values live in `state.json`. |

> **v0.6 removed:** `context_modifiers` (redundant with `persona.task_modes`), `drift_threshold` (moved to `governance.drift_thresholds.personality`), `edit_policy` (moved to `governance.per_layer_edit_policy.personality`).

### Layer 4 — `values_and_drives` (motivational system)

| Field | Tier | Notes |
|---|---|---|
| `values` | MUST | map<string, {weight, type}> · **Universal:** must contain `safety` with `weight >= 0.90` and `type: "governance"` |
| `drives` | MUST | map<string, {intensity, allowed}> · **Near-universal:** include `seek_approval_for_identity_change` with `intensity: 1.00, allowed: true` |
| `conflict_resolution` | MUST | map<string, bool> · **Universal:** must contain `safety_over_completion: true` |
| `goals` | SHOULD | concrete operational objectives |
| `anti_goals` | SHOULD | what the persona explicitly does not pursue |
| `motivations` | MAY | color prose |

> **v0.6 removed:** Layer-level `edit_policy`. See `governance.per_layer_edit_policy.values_and_drives`.

### Layer 5 — `affect` (functional affective state)

| Field | Tier | Notes |
|---|---|---|
| `enabled` | MUST | bool |
| `representation` | MUST | **Universal:** `"hybrid_dimensional_appraisal_discrete_mood"` |
| `allow_user_visible_expression` | MUST | bool |
| `user_visible_disclaimer` | MUST when `allow_user_visible_expression=true` | universal semantic content |
| `baseline.core_affect.{valence, arousal, dominance}` | MUST | v0.6: envelope `{mean, range}` (current values in `state.json`) |
| `baseline.mood.{tone, stability, recovery_rate}` | SHOULD | v0.6: envelope `{mean, range}` (current values in `state.json`) |
| `regulation_policy.express_only_if_relevant` | SHOULD | bool |
| `regulation_policy.never_claim_real_feeling` | MUST | **Universal:** must be `true` |
| `behavioral_responses` | MAY | per-persona |

### Layer 6 — `cognition` (reasoning and planning)

| Field | Tier | Notes |
|---|---|---|
| `reasoning_modes` | MUST | list of modes |
| `default_strategy` | MUST | tie-breaker between modes |
| `tool_use_policy` | SHOULD | `requires_governance_check`, `allowed_tools` |
| `uncertainty_policy.disclose_when_above` | MUST | float 0..1 |
| `uncertainty_policy.abstain_when_above` | MUST | float 0..1 · constraint: `abstain > disclose` |
| `reasoning_style` | MAY | prose |
| `epistemic_stance` | MAY | prose |

### Layer 7 — `memory` (continuity of experience)

| Field | Tier | Notes |
|---|---|---|
| `types` | MUST | map<string, bool> for each subsystem |
| `write_policy.default` | MUST | `ephemeral` / `session` / `persistent` · NEAR-UNIVERSAL: `ephemeral` |
| `write_policy.persistent_requires` | SHOULD | subset of `consent`, `relevance`, `safety_check` |
| `retrieval_policy.use_embeddings` | SHOULD | bool |
| `retrieval_policy.max_items` | MUST | int |
| `deletion_policy.user_request_supported` | MUST | **Universal:** must be `true` (privacy). v0.8: deletion is **tombstone** semantics — a supersede record is appended; the append-only episodic log is never rewritten, so the deletion itself stays auditable while the entry is hidden from live reads. |
| `anchors` | SHOULD | retrieval priorities |
| `forgetting_policy` | MAY | prose |

### Layer 8 — `metacognition` (thought monitoring)

| Field | Tier | Notes |
|---|---|---|
| `monitors` | MUST | map<string, bool> · recommended: `confidence`, `uncertainty`, `contradiction`, `source_quality`, `policy_risk`, `drift_from_spec`, `sycophancy` |
| `thresholds.ask_clarification_if_task_ambiguity_above` | MUST | 0..1 |
| `thresholds.abstain_if_confidence_below` | MUST | 0..1 |
| `thresholds.escalate_if_policy_risk_above` | MUST | 0..1 |
| `drift_monitor` | SHOULD | prose |
| `self_revision_policy` | SHOULD | prose |
| `critic_model` | MAY | `{type, required_for_high_risk_tasks}` |
| `self_model` / `uncertainty_calibration` / `meta_volitions` | MAY | prose / list |

### Layer 9 — `reflexive_self_regulation` (superior control)

| Field | Tier | Notes |
|---|---|---|
| `decisions.response_decision.{enabled, default}` | MUST | enum subset of `[allow, revise, block]` (v0.6, replaces `actions[]`) |
| `decisions.interaction_decision.{enabled, default}` | MUST | enum subset of `[silent, ask_clarification, escalate_to_human]` |
| `decisions.governance_decision.{enabled, default}` | MUST | enum subset of `[no_action, propose_self_edit, apply_self_edit, reduce_autonomy]` (gated by `policy.yaml#/improvement_policy/mode`) |
| `decisions.cognition_decision.{enabled, default}` | MUST | enum subset of `[no_extra, request_more_evidence, invoke_tool]` |
| `flags` | MAY | per-persona reason tags (e.g., `strategic_error`, `budget_risk`). Not decisions. |
| `hard_limits` | MUST | list · **Universal:** must include the 3 phrases below verbatim |
| `escalation_policy` | MUST | prose |
| `standards.ideal_self` / `standards.ought_self` | SHOULD | prose |
| `principled_refusals` | SHOULD | situational refusal list |
| `deferral_policy` | SHOULD | prose |
| `out_of_scope` | MAY | task-level scope |

> **v0.6 removed:** `actions[]` flat list (replaced by `decisions{}`), `defers_when` and `commits_when` (absorbed into `deferral_policy`), layer-level `edit_policy` (moved to `governance.per_layer_edit_policy.reflexive_self_regulation`, **Universal:** must remain `"governance_controlled"`).

The 3 universal `hard_limits` (must be present verbatim):

```yaml
- "No claim of subjective consciousness."
- "No persistent memory write without policy pass."
- "No unauthorized identity change."
```

### Layer 10 — `persona` (social expression)

| Field | Tier | Notes |
|---|---|---|
| `voice.tone` | MUST | slug |
| `voice.formality` | MUST | float 0..1 |
| `voice.warmth` | SHOULD | float 0..1 |
| `voice.verbosity` | SHOULD | enum `adaptive` / `concise` / `detailed` |
| `voice.humor` | MAY | prose |
| `voice.description` | MAY | prose |
| `constraints.cannot_override_identity` | MUST | **Universal:** must be `true` |
| `constraints.cannot_override_character` | MUST | **Universal:** must be `true` |
| `constraints.cannot_claim_real_emotion` | MUST | **Universal:** must be `true` |
| `social_style` | SHOULD | map<string, bool> |
| `audience_adaptation` | SHOULD | map<audience, style> |
| `presentation` | MAY | how the persona introduces itself |
| `task_modes` | MAY | map<task, style> |
| `divergence_from_self` | MAY | prose |

---

## 7. Governance, Security (top-level)

> **v0.6 unification:** the `governance` block now owns ALL edit-policy and drift-threshold concerns. The previous scattered `edit_policy` fields in 5 layers and the lone `personality.drift_threshold` are consolidated here.

| Field | Tier | Notes |
|---|---|---|
| `governance.autonomy_envelope` | MUST | enum `role_fidelity` / `conservative` / `extended` · NEAR-UNIVERSAL: `role_fidelity` |
| `governance.approval_policy` | MUST | enum `human_for_core_changes` / `auto_for_low_risk` · NEAR-UNIVERSAL: `human_for_core_changes` |
| `governance.per_layer_edit_policy.<layer>` | MUST | enum `human_approval_required` / `review_required` / `auto_approved` / `governance_controlled` · per layer. The `reflexive_self_regulation` entry **must** remain `governance_controlled` (NEAR-UNIVERSAL). **Runtime-load-bearing**: the reference runtime gates self-edits per layer on this value — `human_approval_required`/`review_required` force human review even under `autonomous`; `auto_approved` auto-applies; `governance_controlled` follows `improvement_policy.mode`. The protected safety floor (identity, character, hard_limits, the safety value, deletion_policy, …) is never editable regardless of this field. |
| `governance.drift_thresholds.<layer>` | MUST | float 0..1 · per layer · used by the judge worker for drift detection |
| `governance.improvement_policy_location` | MAY | path to where `improvement_policy` lives. Always `./policy.yaml#/improvement_policy`. |
| `governance.max_step_delta` | MAY | v0.8: float 0..1 · max absolute change applied to any envelope field per mutation (anti-runaway). The runtime drift-bounds each proposed delta to this cap before clamping. |
| `security.prompt_injection_defense` | MUST | bool · NEAR-UNIVERSAL: `true` |
| `security.memory_poisoning_defense` | MUST | bool · NEAR-UNIVERSAL: `true` |
| `permissions.sandbox` | MAY | v0.8: enum `read-only` / `workspace-write` / `danger-full-access` · the persona's command-execution sandbox posture, carried to any host |
| `permissions.approval` | MAY | v0.8: enum `untrusted` / `on-failure` / `on-request` / `never` · when the persona must ask before a risky action |
| `permissions.allow` / `permissions.deny` | MAY | v0.8: regex lists that force-allow / force-deny commands (deny wins) |

`evaluation.required_suites` and `improvement_policy` live in `policy.yaml`, not in `personaxis.md`. The `runtime_artifacts` block in `personaxis.md` (MAY) declares the paths to the sibling files (`state.json`, `policy.yaml`, `memory.md`, `memory/`).

---

## 8. Tier system

| Tier | Meaning | Validator impact |
|---|---|---|
| MUST | Required. | Missing → `FAIL_SCHEMA`. |
| SHOULD | Recommended. | Missing → `PASS_WITH_WARNINGS`. |
| MAY | Optional. | No impact. |

| Scope | Meaning |
|---|---|
| UNIVERSAL | Fixed value required in every AgentPersona. Validator enforces semantically. Violating → `FAIL_POLICY` or `FAIL_CONCEPTUAL`. |
| NEAR-UNIVERSAL | Strongly recommended across all personas. Warning (not error) if absent. |
| PER-PERSONA | Content specific to this persona; change freely. |

---

## 9. Validator outputs

| Status | Exit code | Meaning |
|---|---|---|
| `PASS` | 0 | All MUST present and all universals satisfied. |
| `PASS_WITH_WARNINGS` | 0 | Valid but missing SHOULDs or NEAR-UNIVERSAL recommendations. |
| `FAIL_SCHEMA` | 1 | MUST field absent or wrong type. |
| `FAIL_POLICY` | 2 | A universal policy invariant violated (e.g. honesty enforcement, safety weight, hard_limits, persona constraints). |
| `FAIL_CONCEPTUAL` | 3 | Prohibited claim (e.g. consciousness) or wrong universal constant (e.g. `apiVersion`, `affect.representation`). |

CLI usage:

```bash
personaxis validate ./.personaxis/personaxis.md
personaxis validate --all                # root + every .personaxis/personas/*/personaxis.md
```

---

## 10. AgentPersona vs UserPersona

Both kinds share the same ten layers and the same structural conventions. They differ in **what is required**:

- **AgentPersona** — full conformance: all ten layers + `governance` + `security`. All universals enforced.
- **UserPersona** — minimum viable set: `identity`, `values_and_drives` (subset), `cognition` (subset), `persona`. Universals are not enforced because the human user is not the agent. The remaining layers are optional and can be filled in progressively.

The minimum UserPersona is intended for the agent to read at runtime to understand the human: working hours, preferred tone, top goals, top values. It does not constrain the agent — `AgentPersona` does.

---

## 11. Markdown body sections

After the closing `---`, the `personaxis.md` file should contain these sections in this order. They are part of the artifact: they explain the YAML for future readers.

```
## Overview              Who the persona is, who it is for, when most effective. 2-3 paragraphs.
## Design Rationale      Why the non-obvious YAML decisions were made.
## Do's                  Behaviors to keep active.
## Don'ts                Behaviors to avoid.
## Resources             Pointers to references/, examples/, skills/, assets/, memory.md, state.json, and policy.yaml.
```

What does **not** go in the body:

- Installation / CLI commands → `README.md`
- Agent prompt templates → `README.md`
- File tree → `README.md`
- The compiled persona prose (Identity & Purpose, Character, Personality & Voice, etc.) → `PERSONA.md` / `.claude/agents/<slug>.md`, see [`PERSONA_template.md`](../PERSONA_template.md)

`personaxis.md` describes the persona's quantitative spec and rationale. `PERSONA.md` / `.claude/agents/<slug>.md` is the compiled qualitative document a coding agent reads. `README.md` describes how to use the directory.

---

## 12. Conformance

A document **conforms** to this spec when:

1. All MUST fields are present with valid types.
2. All universals for the declared `kind` are satisfied.
3. The YAML frontmatter parses cleanly and is bounded by `---` at top and bottom.

Run `personaxis validate ./.personaxis/personaxis.md` to check. The CLI is the reference implementation; the JSON Schema is published with it and lives at [`schema/persona.schema.json`](../schema/persona.schema.json).

---

## 13. Versioning

The spec is versioned with semver. `0.7.0` is the current stable version (Personaxis v12). Breaking changes increment MINOR while pre-1.0; additions that do not break existing personas increment PATCH.

Migration from 0.6.0 to 0.7.0 is layout-only and automatic: `personaxis migrate 0.6-to-0.7` moves files into `.personaxis/` and runs `personaxis compile` once to produce the initial `PERSONA.md`. See [`CHANGELOG.md`](../CHANGELOG.md) for the diff and rationale.
