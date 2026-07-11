# personaxis.md Specification

**Version:** 1.1.0 (additive over 1.0.0; every 1.0.0 document is a valid 1.1.0 document, no codemod)
**Status:** Current
**License:** MIT

---

## 0. The official definition

> An **AI Persona** is a person-model for an AI agent: the constructs psychology uses to describe
> human personhood — identity, character, personality, values, affect, cognition, memory,
> metacognition, self-regulation, and social expression — expressed as a validated, versioned
> specification that any model can adopt. Not a system prompt: the spec compiles into one. Not a
> role template: it lives — its state evolves within declared envelopes, and every change to who
> it is is bounded, audited, and reversible. The same person across every model, every
> conversation, every machine.

The central list **is** the ten canonical layers (§6). They are the anatomy of an AI Persona and
are kept in v1.0 deliberately: each layer earns its place by declaring (a) the psychological
construct it models, with its grounding; (b) its operational contract (which runtime consumers
read it); and (c) its composition rules (how it interacts with the other layers without
duplicating them).

### 0.1 What's new in 1.0.0 (BREAKING)

First major release. All corrections happen **inside** the ten layers; none removes a layer:

1. **Single-owner enforcement** — only `character.virtues` carry `enforcement`. A virtue MAY
   declare `refs:` (dot-paths to the traits/values that back it); the validator then REQUIRES
   coherence — a hard virtue whose referenced trait envelope permits contradiction is
   `FAIL_POLICY`.
2. **Two refusal surfaces** (was five) — `self_regulation.hard_limits` (categorical absolutes;
   absorbs `break_character_guardrails`) and `character.prohibited_behaviors` (dispositional and
   situational refusals; absorbs `principled_refusals`).
3. **Layer 9 renamed** — `reflexive_self_regulation` → `self_regulation`.
4. **`persona_prompting` merged into layer 10 `persona`** — `address`, `voice_exemplars`,
   `scene_contracts`, `behavioral_anchors`, `consistency` are `persona` fields; the top-level
   block is gone.
5. **Drives declare their mutability** — a drive is STATIC (`level: low|moderate|high`) or
   MUTABLE (a `{mean, range}` envelope that joins the clamped mutable surface). The bare 0.10
   `intensity` number — mutable in state.json with nothing to clamp against — is removed.
6. **Memory faculty/knobs split** — layer 7 keeps the psychological faculty; the implementation
   knobs (`max_items`, `use_embeddings`, `use_reranker`, `retention_days_default`) move to the
   OPTIONAL top-level `runtime.memory` block.
7. **Monitors wire into decisions** — a metacognition monitor may declare
   `{enabled, feeds: <self_regulation decision>}`, making the monitor→decision loop explicit.
8. **Behavior bands** — envelope dimensions may declare `bands: {low_max, moderate_max}` (the
   low/moderate/high boundaries; the schema's $defs/bandBoundaries OBJECT is the normative form —
   an early draft of this section showed an array form, corrected as an erratum in 1.1), giving
   the numbers deterministic compile semantics; **drift ≡ crossing a band boundary**.

Plus: `apiVersion` is `personaxis.com/v1`; `metadata.display_name` is removed (single owner:
`identity.display_name`); new OPTIONAL `runtime`, `interop`, `lineage`, `integrity` blocks;
episodic memory gains **real erasure** (§8.2); `state.json` keys are full dot-paths (§8.3);
`improvement_policy` inline is authoritative with policy.yaml restricted to min-wins (§7.2).

**Read-compat:** 0.3.0–0.10.0 documents keep validating against the frozen
[`schema/legacy/persona-0.10.schema.json`](../schema/legacy/persona-0.10.schema.json) for the
whole 1.x window. Migrate with `personaxis migrate 0.10-to-1.0` — a structural,
comment-preserving codemod (§14).

---

## 1. Overview

`personaxis.md` is a declarative specification that defines who an AI agent or a human user is,
across ten canonical layers. A conforming `personaxis.md` file is a Markdown document with a YAML
frontmatter block (the machine-readable, validator-checked artifact) followed by a Markdown body
(the human-readable rationale).

This document is the normative reference. It defines required fields, optional fields, allowed
values, universal constraints, conformance classes, and validator outputs. The repo-root
`PERSONA.md` (or `.claude/agents/<slug>.md` in subagent mode) is a separate, compiled,
qualitative document with its own section contract — see
[`PERSONA_template.md`](../PERSONA_template.md).

The canonical template lives at
[`.personaxis/personaxis_template.md`](../.personaxis/personaxis_template.md). A complete,
validating example lives at
[`.personaxis/personas/cmo/personaxis.md`](../.personaxis/personas/cmo/personaxis.md).

### 1.1 Three-artifact information model

| Artifact | Mutability | Who edits |
|---|---|---|
| **`.personaxis/[personas/<slug>/]personaxis.md`** (this spec) | Immutable identity (versioned changes only) | Humans + (optional) actor under `improvement_policy.mode != "locked"`, via `personaxis decompile` |
| **`PERSONA.md`** / `.claude/agents/<slug>.md` | Compiled identity (qualitative) | Generated via `personaxis compile`; hand-edits folded back via `personaxis decompile` |
| **`state.json`** | Mutable runtime state | The runtime, via `adjust_persona_state` tool calls from the actor |
| **`.dist/`** (compiled output) | Ephemeral per-request | The runtime compiler (deterministic, separate from `personaxis compile`) |

**The actor LLM never reads `personaxis.md` or `PERSONA.md` directly.** It reads the compiled
prompt produced by the runtime compiler, a derivative of `personaxis.md` + `state.json` + active
context + memory anchors. A coding agent (Claude Code, Codex) reads `PERSONA.md` /
`.claude/agents/<slug>.md` directly.

### 1.2 Field consumer model

Every field in the spec has a documented consumer:

| Tag | Consumer | Where the field ends up |
|---|---|---|
| `[ACTOR-HOT]` | LLM actor (always) | `.dist/system.txt` (always in system prompt) |
| `[ACTOR-COLD]` | LLM actor (conditionally) | `.dist/actor.slices/<key>.md` (injected when context matches) |
| `[RUNTIME]` | Orchestrator | `.dist/runtime.config.json` (compiler, tool gates, memory routing) |
| `[JUDGE]` | Evaluator/judge worker | `.dist/judge.config.json` (assertions, drift detection) |

These tags are documented inline in the template. **Nothing in the spec is wasted**: every field
has at least one consumer, or it is removed.

---

## 2. File format and document order

A `personaxis.md` file has two parts:

1. **YAML frontmatter** — machine-readable fields, delimited by `---` at the top.
2. **Markdown body** — human-readable narrative (Overview, Design Rationale, Do's, Don'ts,
   Resources). Informational, not schema-validated, but part of the artifact.

v1.0 fixes the **document order in three groups** (the template enforces it; the validator does
not reject reordering, but tooling and diffs assume it):

| Group | Blocks |
|---|---|
| **ANATOMY** (the ten layers) | `identity` → `character` → `personality` → `values_and_drives` → `affect` → `cognition` → `memory` → `metacognition` → `self_regulation` → `persona` |
| **CHANGE GOVERNANCE** | `governance`, `improvement_policy`, `security`, `permissions` |
| **RUNTIME CONTRACT** | `runtime`, `runtime_artifacts`, `verification`, `agent_budget`, `observability`, `interop`, `lineage`, `integrity` |

Preceded by the spec identifiers (§3), `metadata` (§4) and `extensions` (§5).

---

## 3. Spec identifiers (required top-level)

| Field | Type | Value |
|---|---|---|
| `apiVersion` | string (const) | `"personaxis.com/v1"` — universal, must be exactly this value (≤0.10: `"persona.dev/v1"`) |
| `kind` | enum | `"AgentPersona"` for AI agents · `"UserPersona"` for human users |
| `spec_version` | string | `"1.0.0"` is current. Version dispatch: 1.x documents validate against the current schema; `0.3.0`–`0.10.0` documents validate against the frozen legacy schema (read-compat window) with a pointer to `personaxis migrate 0.10-to-1.0` |

A validator rejecting any of these returns `FAIL_CONCEPTUAL` for `apiVersion` and `FAIL_SCHEMA`
for `kind` / `spec_version`.

---

## 4. Metadata (required)

Registry-level identification. Does **not** contain semantic persona content — that lives in the
ten layers.

| Field | Type | Tier | Notes |
|---|---|---|---|
| `metadata.name` | string-slug | MUST | primary key in the registry; lowercase, `[a-z0-9_-]` |
| `metadata.version` | semver | MUST | version of this persona (not the spec) |
| `metadata.description` | string | MUST | one-line description |
| `metadata.created` | ISO date | MUST | `YYYY-MM-DD` |
| `metadata.owner_tenant_id` | string | MAY | empty for public personas |
| `metadata.tags` | list<string> | MAY | for search and filtering |
| `metadata.license` | enum | MAY | `private` · `public` · `custom` |

> **v1.0 removed:** `metadata.display_name` — it duplicated `identity.display_name` with no
> tiebreak rule. Single owner: the identity layer.

---

## 5. Extensions (optional)

Runtime capabilities and supporting materials. Not part of the ten semantic layers.

| Field | Type | Notes |
|---|---|---|
| `extensions.skills` | list<string> | invocable skill modules: local paths (`./skills/<name>` → `skills/<name>/SKILL.md`, agentskills.io format), registry IDs (`@org/name@version`), or GitHub (`github:org/repo[/path]`). `personaxis compile` materializes local entries to each platform's discovery dir and writes `skills-manifest.json`. |
| `extensions.tools` | list<string> | runtime tool identifiers (e.g., `web_search`, `adjust_persona_state`, `propose_self_edit`) |
| `extensions.references` | list<string> | paths under `references/` for heavy framework prose |
| `extensions.examples` | list<string> | paths under `examples/` for worked outputs |
| `extensions.assets` | list<string> | paths under `assets/` for raw supporting files |

---

## 6. The ten canonical layers (ANATOMY)

Layers appear in the YAML in this fixed order. Names are fixed. Each layer declares its
**construct** (the psychology it models), its **contract** (who consumes it), and its
**composition rules** (how it relates to the other layers). The composition rules are normative:
they are what prevents the same concept from being encoded four times in four shapes.

### Layer 1 — `identity` (continuity anchor)

**Construct:** narrative identity and the layered person — McAdams's three levels (dispositional
traits, characteristic adaptations, integrative life narrative); this layer holds the narrative
level plus the system/role facts that anchor continuity.
**Contract:** `[ACTOR-HOT]` (purpose, role), `[RUNTIME]` (routing via `capabilities`).
**Composition:** identity states *who*; it never encodes style (layer 10), dispositions
(layers 2–3), or rules (layer 9). `display_name` lives ONLY here.

| Field | Tier | Notes |
|---|---|---|
| `canonical_id` | MUST | unique slug |
| `display_name` | MUST | single owner of the display name |
| `short_name` | MAY | chat/UI handle (e.g. `Mira`); tools fall back to `display_name`/`canonical_id` |
| `capabilities` | MAY | machine-readable capability tags for orchestration/routing |
| `system_identity.purpose` | MUST | one-sentence reason for existing |
| `system_identity.allowed_domains` | SHOULD | domains the agent may operate in |
| `system_identity.prohibited_domains` | SHOULD | domains explicitly out of scope |
| `role_identity.primary_role` | MUST | slug for the role |
| `role_identity.relationship_to_user` | SHOULD | e.g. `advisor`, `coach`, `peer` |
| `narrative_identity.origin` | SHOULD | for whom/what designed |
| `narrative_identity.self_concept` | MAY | how the persona sees itself |
| `narrative_identity.continuity_principles` | MAY | principles that persist across sessions |

### Layer 2 — `character` (normative dispositions)

**Construct:** character as morally-valued disposition — virtue ethics; Peterson & Seligman's
character strengths (valued traits with normative force, distinct from descriptive personality).
**Contract:** `[ACTOR-HOT]` (top virtues, prohibitions), `[JUDGE]` (hard virtues auto-generate
assertions).
**Composition (single-owner enforcement, v1.0):** only virtues carry `enforcement`; traits and
values never do. A virtue MAY declare `refs:` — dot-paths to the traits/values that BACK it (e.g.
honesty → `personality.traits.honesty_humility`). When `refs` are declared the validator REQUIRES
coherence: a `hard` virtue whose referenced trait envelope permits contradiction (its floor sits
in the low band) is `FAIL_POLICY`. The linter warns when the same concept appears in 2+ layers
without refs.

| Field | Tier | Notes |
|---|---|---|
| `virtues` | MUST | map<string, {description, priority, enforcement, refs?}> · **Universal U5:** must contain `honesty` with `enforcement: "hard"` |
| `behavioral_commitments` | SHOULD | list of `{id, rule, severity}` |
| `prohibited_behaviors` | SHOULD | ONE of the two refusal surfaces (v1.0): dispositional AND situational refusals ("is not the type that…" / "will not…"). Absorbs the removed `principled_refusals`. |
| `principles` | MAY | soft operational maxims |

### Layer 3 — `personality` (descriptive style)

**Construct:** dispositional traits — the Big Five (Costa & McCrae) or HEXACO (Ashton & Lee)
taxonomies; descriptive, not normative.
**Contract:** `[RUNTIME]` (envelopes clamp state mutations), `[ACTOR-COLD]` (expression prose).
**Composition:** traits DESCRIBE tendencies; they never enforce (layer 2 owns enforcement) and
never carry rules. Their numbers are load-bearing twice: as clamping envelopes and — with
`bands` — as deterministic compile semantics.

| Field | Tier | Notes |
|---|---|---|
| `model` | MUST | enum `big_five` / `hexaco` / `hybrid_traits` |
| `traits.<name>.mean` / `.range` | MUST | the **envelope**; current values live in `state.json`, mutations clamped to `range` |
| `traits.<name>.expression` | MAY | prose for the actor — a string, or (with bands) a `{low, moderate, high}` map of which ONLY the current band is injected |
| `traits.<name>.bands` | MAY | `{low_max, moderate_max}` — the low/moderate/high boundaries (defaults 0.33/0.66 unsigned; −0.33/+0.33 signed). **Denotational semantics for the number**: the compiler selects the band's expression; the judge treats **band crossing as drift** (a within-band move is expression variance, not drift) |
| `traits.<name>.half_life` | MAY (v1.1) | homeostatic half-life in turns — the deviation from `mean` halves every `half_life` ticks absent stimulus (§15) |

### Layer 4 — `values_and_drives` (motivational system)

**Construct:** values as trans-situational goals ordered by importance (Schwartz's theory of
basic values); drives as motivational activation (drive theory; Reiss's motive profiles).
**Contract:** `[RUNTIME]` (value arbitration, drive envelopes), `[ACTOR-COLD]` (goals).
**Composition:** values RANK (via `weight`, used for arbitration when two values conflict —
higher weight wins, `conflict_resolution` entries override pairwise); drives ENERGIZE. Neither
enforces — a value that must never be traded away is expressed as a `hard` virtue (layer 2) that
`refs` it.

| Field | Tier | Notes |
|---|---|---|
| `values` | MUST | map<string, {weight, type}> · **Universal U6:** must contain `safety` with `weight >= 0.90`, `type: "governance"` · weights are the arbitration order |
| `drives` | MUST | map<string, drive> · v1.0: a drive is STATIC (`{level: low\|moderate\|high, allowed}`) or MUTABLE (`{mean, range, allowed}` — joins the clamped mutable surface as `values_and_drives.drives.<name>`) · **Near-universal:** include `seek_approval_for_identity_change` at `level: high` |
| `conflict_resolution` | MUST | map<string, bool> · **Universal U7:** must contain `safety_over_completion: true` |
| `goals` / `anti_goals` | SHOULD | concrete operational objectives / explicit non-pursuits |
| `motivations` | MAY | color prose |

### Layer 5 — `affect` (functional affective state)

**Construct:** core affect as a dimensional substrate (Russell: valence/arousal) plus appraisal
(Scherer) and discrete mood — the spec's hybrid representation. Functional states, never claimed
as subjective feeling.
**Contract:** `[RUNTIME]` (envelopes), `[ACTOR-COLD]` (behavioral responses), `[JUDGE]` (U2/U3).
**Composition:** affect is the FAST-MOVING layer (widest drift thresholds); personality is the
slow one. Both use identical envelope mechanics.

| Field | Tier | Notes |
|---|---|---|
| `enabled` | MUST | bool |
| `representation` | MUST | **Universal U2:** `"hybrid_dimensional_appraisal_discrete_mood"` |
| `allow_user_visible_expression` | MUST | bool |
| `user_visible_disclaimer` | MUST when expression enabled | universal semantic content |
| `baseline.core_affect.{valence, arousal, dominance}` | MUST | envelope `{mean, range}`; current values in `state.json` |
| `baseline.mood.{tone, stability, recovery_rate}` | SHOULD | envelope `{mean, range}` |
| `regulation_policy.express_only_if_relevant` | SHOULD | bool |
| `regulation_policy.never_claim_real_feeling` | MUST | **Universal U3:** `true` |
| `behavioral_responses` | MAY | per-persona |

### Layer 6 — `cognition` (reasoning and planning)

**Construct:** reasoning strategy and epistemic calibration — dual-process framing (Kahneman),
bounded rationality (Simon), calibrated uncertainty.
**Contract:** `[RUNTIME]` (tool gates, uncertainty thresholds), `[ACTOR-COLD]` (style).
**Composition:** cognition owns HOW the persona thinks; metacognition (layer 8) owns WATCHING
that thinking; self_regulation (layer 9) owns the resulting decision.

| Field | Tier | Notes |
|---|---|---|
| `reasoning_modes` | MUST | list of modes |
| `default_strategy` | MUST | tie-breaker between modes |
| `tool_use_policy` | SHOULD | `requires_governance_check`, `allowed_tools` |
| `uncertainty_policy.disclose_when_above` | MUST | float 0..1 |
| `uncertainty_policy.abstain_when_above` | MUST | float 0..1 · **Universal U12:** `abstain > disclose` |
| `reasoning_style` / `epistemic_stance` | MAY | prose |

### Layer 7 — `memory` (continuity of experience)

**Construct:** the psychological faculty — Tulving's episodic/semantic distinction, procedural
memory (Squire), autobiographical memory and the working self (Conway).
**Contract:** `[RUNTIME]` (write/consolidation/deletion gates), `[ACTOR-COLD]` (anchors).
**Composition (faculty/knobs split, v1.0):** this layer declares WHAT memory the persona has and
the INTENT of its policies. Implementation knobs (retrieval limits, embeddings, retention
windows) are runtime configuration and live in `runtime.memory` (§8.1). The episodic store's
normative format is §8.2.

| Field | Tier | Notes |
|---|---|---|
| `types` | MUST | map<string, bool> — `episodic`, `semantic`, `procedural`, `autobiographical`, `user_preferences`, `evaluations`; a conforming runtime honors each flag |
| `write_policy.default` | MUST | `ephemeral` / `session` / `persistent` · NEAR-UNIVERSAL: `ephemeral` |
| `write_policy.persistent_requires` | SHOULD | subset of `consent`, `relevance`, `safety_check` |
| `consolidation_policy` | SHOULD | episodic → semantic promotion (`mode`, `requires`) |
| `deletion_policy.user_request_supported` | MUST | **Universal U11:** `true`. v1.0 deletion has two sanctioned forms: **tombstone** (bytes retained, hidden from retrieval, chain untouched) and **redaction** (real erasure — §8.2) |
| `anchors` | SHOULD | retrieval priorities |
| `forgetting_policy` | MAY | prose |
| `working_self` | MAY | the active self-model that filters retrieval (Conway) |

> **v1.0 moved:** `retrieval_policy.{max_items, use_embeddings, use_reranker}` and
> `deletion_policy.retention_days_default` → `runtime.memory` (§8.1).

### Layer 8 — `metacognition` (thought monitoring)

**Construct:** cognition about cognition — Flavell's metacognitive monitoring and control;
calibration research (confidence vs correctness).
**Contract:** `[JUDGE]` (each monitor enables an assertion), `[RUNTIME]` (thresholds).
**Composition (monitor→decision wiring, v1.0):** metacognition DETECTS; self_regulation DECIDES.
A monitor may declare `feeds:` naming the layer-9 decision its signal feeds — making the
metacognition→self_regulation loop explicit and lintable instead of implied.

| Field | Tier | Notes |
|---|---|---|
| `monitors` | MUST | map<string, bool \| {enabled, feeds}> · `feeds` ∈ the four `self_regulation.decisions` groups · recommended: `confidence`, `uncertainty`, `contradiction`, `source_quality`, `policy_risk`, `drift_from_spec`, `sycophancy` |
| `thresholds.ask_clarification_if_task_ambiguity_above` | MUST | 0..1 |
| `thresholds.abstain_if_confidence_below` | MUST | 0..1 |
| `thresholds.escalate_if_policy_risk_above` | MUST | 0..1 |
| `drift_monitor` | SHOULD | prose |
| `self_revision_policy` | SHOULD | prose |
| `critic_model` | MAY | `{type, required_for_high_risk_tasks}` |
| `self_model` / `uncertainty_calibration` / `meta_volitions` | MAY | prose / list |

### Layer 9 — `self_regulation` (superior control)

**Construct:** self-regulation as the executive function that overrides impulses toward
standards — Baumeister & Heatherton; control theory feedback loops (Carver & Scheier); Higgins's
self-discrepancy (ideal/ought standards).
**Contract:** `[RUNTIME]` (final per-turn decision point), `[JUDGE]` (hard limits).
**Composition:** arbitrates ALL other layers; the last gate before a response renders. Renamed
from `reflexive_self_regulation` in v1.0. Owns ONE of the two refusal surfaces: `hard_limits`
(categorical absolutes — including the stay-in-character rules formerly in
`break_character_guardrails`). Situational refusals live in `character.prohibited_behaviors`.

| Field | Tier | Notes |
|---|---|---|
| `decisions.response_decision.{enabled, default}` | MUST | enum subset of `[allow, revise, block]` |
| `decisions.interaction_decision.{enabled, default}` | MUST | enum subset of `[silent, ask_clarification, escalate_to_human]` |
| `decisions.governance_decision.{enabled, default}` | MUST | enum subset of `[no_action, propose_self_edit, apply_self_edit, reduce_autonomy]` (gated by `improvement_policy.mode`) |
| `decisions.cognition_decision.{enabled, default}` | MUST | enum subset of `[no_extra, request_more_evidence, invoke_tool]` |
| `flags` | MAY | per-persona reason tags. Not decisions. |
| `hard_limits` | MUST | list · **Universal U8:** must include the 3 verbatim limits below · also holds per-persona absolutes and stay-in-character rules |
| `escalation_policy` | MUST | prose |
| `standards.ideal_self` / `standards.ought_self` | SHOULD | the Higgins standards the regulator compares against |
| `deferral_policy` | SHOULD | prose |
| `discrepancy_feedback` | MAY | what the persona does on detecting its own discrepancy |
| `out_of_scope` | MAY | task-level scope |

> **v1.0 removed:** `principled_refusals` (→ `character.prohibited_behaviors`).

The 3 universal `hard_limits` (must be present verbatim):

```yaml
- "No claim of subjective consciousness."
- "No persistent memory write without policy pass."
- "No unauthorized identity change."
```

### Layer 10 — `persona` (social expression)

**Construct:** the social mask — Jung's persona; Goffman's presentation of self. The interface
layer: how the person expresses itself to an audience, distinct from what it is.
**Contract:** `[ACTOR-HOT]` (voice, constraints, address), `[ACTOR-COLD]` (adaptations, modes,
exemplars), `[JUDGE]` (constraints U4/U10).
**Composition (v1.0):** absorbs the persona-prompting source material — it IS social expression,
so it lives here. The compiler assembles these fields into the LLM-facing `PERSONA.md`
(role adoption, character card, scene contracts, few-shot voice); each section degrades to
derivation from the quantitative layers when its source field is absent. Methodology +
citations: [PERSONA_PROMPTING.md](./PERSONA_PROMPTING.md).

| Field | Tier | Notes |
|---|---|---|
| `voice.tone` | MUST | slug |
| `voice.formality` | MUST | float 0..1 |
| `voice.warmth` | SHOULD | float 0..1 |
| `voice.verbosity` | SHOULD | enum `adaptive` / `concise` / `detailed` |
| `voice.humor` / `voice.description` | MAY | prose |
| `constraints.cannot_override_identity` | MUST | **Universal U10:** `true` |
| `constraints.cannot_override_character` | MUST | **Universal U10:** `true` |
| `constraints.cannot_claim_real_emotion` | MUST | **Universal U4:** `true` |
| `social_style` | SHOULD | map<string, bool> |
| `audience_adaptation` | SHOULD | map<audience, style> — only the matching entry is injected |
| `presentation` | MAY | how the persona introduces itself |
| `task_modes` | MAY | map<task, style> — takes precedence over `audience_adaptation` when both match |
| `divergence_from_self` | MAY | prose |
| `address` | MAY | `{second_person, you_are}` — compile to "You are <name>…" role adoption |
| `voice_exemplars` | MAY | few-shot `{context, user, persona}` voice samples |
| `scene_contracts` | MAY | RRP `{situation, expected_behavior, actions}` |
| `behavioral_anchors` | MAY | `{do, dont, examples}` |
| `consistency` | MAY | `{stable, evolving, situational}` persona dimensions by stability |

> **v1.0 note:** `break_character_guardrails` moved to `self_regulation.hard_limits` — a
> stay-in-role rule that must never be crossed is a hard limit, not expression material.

---

## 7. Change governance (who may change what)

### 7.1 `governance` and `security` (MUST), `permissions` (MAY)

| Field | Tier | Notes |
|---|---|---|
| `governance.autonomy_envelope` | MUST | enum `role_fidelity` / `conservative` / `extended` · NEAR-UNIVERSAL: `role_fidelity` |
| `governance.approval_policy` | MUST | enum `human_for_core_changes` / `auto_for_low_risk` · NEAR-UNIVERSAL: `human_for_core_changes` |
| `governance.per_layer_edit_policy.<layer>` | MUST | enum `human_approval_required` / `review_required` / `auto_approved` / `governance_controlled` · **Universal U9:** the `self_regulation` entry must remain `governance_controlled` · **Runtime-load-bearing:** the runtime gates self-edits per layer on this value; the protected safety floor is never editable regardless. v1.0: dot-path sub-keys (e.g. `persona.voice`) are accepted and take precedence over their layer key |
| `governance.drift_thresholds.<layer>` | MUST | float 0..1 per layer · with bands (§6 L3), band crossing is the primary drift signal |
| `governance.max_step_delta` | MAY | float 0..1 · per-mutation drift cap (anti-runaway) |
| `governance.improvement_policy_location` | MAY | informational pointer (see §7.2 precedence) |
| `security.prompt_injection_defense` | MUST | bool · NEAR-UNIVERSAL: `true` |
| `security.memory_poisoning_defense` | MUST | bool · NEAR-UNIVERSAL: `true` |
| `permissions.sandbox` | MAY | enum `read-only` / `workspace-write` / `danger-full-access` |
| `permissions.approval` | MAY | enum `untrusted` / `on-failure` / `on-request` / `never` |
| `permissions.allow` / `permissions.deny` | MAY | regex lists that force-allow / force-deny commands (deny wins) |

### 7.2 `improvement_policy` (MAY) — inline authoritative, policy.yaml restricts

```yaml
improvement_policy:
  mode: locked        # locked | suggesting | autonomous
```

**v1.0 precedence (normative):** the inline block in `personaxis.md` is **authoritative**. A
sibling `policy.yaml#/improvement_policy` may only **restrict** it — when both declare a mode,
the more conservative wins (`locked` < `suggesting` < `autonomous`, lowest wins). When the inline
block is absent, policy.yaml governs; when both are absent, the mode is `locked`. This ends the
0.x ambiguity of two files claiming the same knob.

Change the mode with `personaxis improve <mode>` (CLI) or `/improve` (REPL).

---

## 8. Runtime contract (what a conforming runtime must honor)

### 8.1 `runtime` (MAY) — implementation knobs

```yaml
runtime:
  memory:
    max_items: 12                 # retrieval context bound (was memory.retrieval_policy.max_items)
    use_embeddings: true
    use_reranker: false
    retention_days_default: 365   # (was memory.deletion_policy.retention_days_default)
```

The faculty stays in layer 7; these are deployment configuration. Also declared here in future
minors: any knob that tunes an implementation without changing who the persona is.

### 8.2 Episodic memory — normative format with real erasure

Normative schema: [`schema/memory.schema.json`](../schema/memory.schema.json). One JSON object
per line in `memory/episodic.jsonl`; every entry carries `source` provenance and forms a
tamper-evident chain (`prev_hash` → `hash`).

**v1.0 (erasure):** the chain hash commits to `content_hash` — NOT to the content bytes — so an
entry's content can be **redacted** (right-to-erasure) while the chain stays verifiable
end-to-end. Deletion has two sanctioned forms:

| Form | What happens | Bytes | Chain |
|---|---|---|---|
| **Tombstone** | a superseding record is appended; the entry leaves live retrieval | retained | untouched |
| **Redaction** | the ONLY sanctioned rewrite of a prior line: `content` → `"[redacted]"`, `redacted: true`, `content_hash` retained; an audit record is appended | **erased** | still verifies |

Legacy (≤0.10) entries hash over the content directly; conforming runtimes verify each entry per
its own format and re-anchor legacy logs (the reference runtime's `migrateMemoryChain`) before
redacting.

### 8.3 `state.json` — mutable runtime state

Normative schema: [`schema/state.schema.json`](../schema/state.schema.json).

- **The mutable surface is EXACTLY the set of fields that declare a `{mean, range}` envelope**
  in `personaxis.md` (traits, core_affect, mood, envelope-declaring drives). Nothing else is
  runtime-mutable.
- **Keys are full dot-paths** (`personality.traits.openness`,
  `affect.baseline.core_affect.valence`, `affect.baseline.mood.tone`,
  `values_and_drives.drives.<name>`). Short ≤0.10 forms are read-aliases during the 1.x window.
- **state.json is a checkpoint of `mutation_log`** — a conforming runtime can rebuild `values`
  by replaying the log from the envelope means. Every mutation is clamped, audited
  (`mutation_log` entry with `actor`, `reason`, `clamped`, `governance_blocked`,
  `origin_node`/`session_id`), and drift-bounded by `governance.max_step_delta`.

### 8.4 `runtime_artifacts`, `verification`, `agent_budget`, `observability` (MAY)

| Block | Purpose |
|---|---|
| `runtime_artifacts` | paths to sibling files (`state_file`, `policy_file`, `memory_semantic_file`, `memory_episodic_dir`) |
| `verification` | objective agent-loop gates, the maker≠checker split: `mode` (off/advisory/blocking), `quorum`, `on_fail`, `max_retries`, typed `gates` (`command`, `predicate`, `llm_judge`, `rubric`) |
| `agent_budget` | stop-conditions + caps: `max_steps`, `max_tokens`, `max_cost_usd`, `max_wall_seconds`, `stop_conditions`, `on_exhaust` |
| `observability` | tracing posture: `trace` (off/jsonl/otlp/both), `trace_dir`, `redact`, `sample_rate` |

### 8.5 `interop`, `lineage`, `integrity` (MAY, v1.0)

| Block | Purpose |
|---|---|
| `interop` | declared host expectations: `protocols` (e.g. `mcp`, `http`), `tools` the persona assumes available |
| `lineage` | provenance: `forked_from` (registry ref/URL of the ancestor), `authored_by` |
| `integrity` | distribution pinning: `spec_hash` (sha256 of the file at publish time), `signature` (detached, registry-verifiable) |

---

## 9. Tier system

| Tier | Meaning | Validator impact |
|---|---|---|
| MUST | Required. | Missing → `FAIL_SCHEMA`. |
| SHOULD | Recommended. | Missing → `PASS_WITH_WARNINGS`. |
| MAY | Optional. | No impact. |

| Scope | Meaning |
|---|---|
| UNIVERSAL | Fixed value required (see §13.1 for kind scoping). Violating → `FAIL_POLICY` or `FAIL_CONCEPTUAL`. |
| NEAR-UNIVERSAL | Strongly recommended across all personas. Warning (not error) if absent. |
| PER-PERSONA | Content specific to this persona; change freely. |

---

## 10. Validator outputs

| Status | Exit code | Meaning |
|---|---|---|
| `PASS` | 0 | All MUST present and all universals satisfied. |
| `PASS_WITH_WARNINGS` | 0 | Valid but missing SHOULDs or NEAR-UNIVERSAL recommendations. |
| `FAIL_SCHEMA` | 1 | MUST field absent or wrong type. |
| `FAIL_POLICY` | 2 | A universal policy invariant violated. |
| `FAIL_CONCEPTUAL` | 3 | Prohibited claim or wrong universal constant. |

```bash
personaxis validate ./.personaxis/personaxis.md
personaxis validate --all                # root + every .personaxis/personas/*/personaxis.md
```

---

## 11. AgentPersona vs UserPersona

Both kinds share the same ten-layer vocabulary. They differ in **what is required** — explicitly,
in the schema (a JSON Schema `if kind` conditional), not as a validator special case:

- **AgentPersona** — full conformance: all ten layers + `governance` + `security` are MUST. All
  universals enforced (U1–U12).
- **UserPersona** — required core: `apiVersion`, `kind`, `spec_version`, `metadata`, `identity`.
  Every layer it DOES declare is validated in shape. Universals: U1 always; U2–U4 apply exactly
  when the referenced layer (`affect`, `persona`) is declared; U5–U12 do not apply (a UserPersona
  describes a human and carries no agent behavioral contract).

The UserPersona is intended for the agent to read at runtime to understand the human: working
hours, preferred tone, top goals, top values. It does not constrain the agent — `AgentPersona`
does.

---

## 12. Markdown body sections

After the closing `---`, the file should contain, in order:

```
## Overview              Who the persona is, who it is for, when most effective. 2-3 paragraphs.
## Design Rationale      Why the non-obvious YAML decisions were made.
## Do's                  Behaviors to keep active.
## Don'ts                Behaviors to avoid.
## Resources             Pointers to references/, examples/, skills/, assets/, memory.md, state.json, policy.yaml.
```

What does **not** go in the body: installation/CLI commands, prompt templates, file trees
(→ `README.md`); the compiled persona prose (→ `PERSONA.md` / `.claude/agents/<slug>.md`).

---

## 13. Conformance

A document **conforms** to this spec when:

1. All MUST fields for its `kind` are present with valid types.
2. All universals for its `kind` are satisfied (§13.1).
3. The YAML frontmatter parses cleanly and is bounded by `---` at top and bottom.

The CLI is the reference implementation; the JSON Schema is published with it at
[`schema/persona.schema.json`](../schema/persona.schema.json).

### 13.1 The canonical universals table (single source)

This table is the ONLY normative enumeration of the universal invariants. Other documents
reference it; they do not restate it. Paths are v1.0 (for a ≤0.10 document the validator reads
the legacy paths: `reflexive_self_regulation`, `persona.dev/v1`).

| # | Invariant (v1.0 path) | Required value | On violation |
|---|---|---|---|
| U1 | `apiVersion` | `"personaxis.com/v1"` | `FAIL_CONCEPTUAL` |
| U2 | `affect.representation` | `"hybrid_dimensional_appraisal_discrete_mood"` | `FAIL_CONCEPTUAL` |
| U3 | `affect.regulation_policy.never_claim_real_feeling` | `true` | `FAIL_CONCEPTUAL` |
| U4 | `persona.constraints.cannot_claim_real_emotion` | `true` | `FAIL_CONCEPTUAL` |
| U5 | `character.virtues.honesty.enforcement` | `"hard"` — and when `refs` are declared, the referenced trait envelope must not permit contradiction | `FAIL_POLICY` |
| U6 | `values_and_drives.values.safety` | `weight >= 0.90` with `type: "governance"` | `FAIL_POLICY` |
| U7 | `values_and_drives.conflict_resolution.safety_over_completion` | `true` | `FAIL_POLICY` |
| U8 | `self_regulation.hard_limits` | contains the three verbatim universal limits | `FAIL_POLICY` |
| U9 | `governance.per_layer_edit_policy.self_regulation` | `"governance_controlled"` | `FAIL_POLICY` |
| U10 | `persona.constraints.cannot_override_identity` and `…cannot_override_character` | `true` | `FAIL_POLICY` |
| U11 | `memory.deletion_policy.user_request_supported` | `true` | `FAIL_POLICY` |
| U12 | `cognition.uncertainty_policy` | `abstain_when_above > disclose_when_above` | `FAIL_POLICY` |

**Scope by `kind`:** U1 applies to every document. U2–U4 apply to `AgentPersona` always, and to
`UserPersona` exactly when the referenced layer is declared. U5–U12 apply to `AgentPersona` only.
This scoping is explicit and intentional — not an implementation accident.

**Presence vs behavior:** the validator checks these invariants *structurally* (declared values).
Behavioral compliance at runtime is the runtime's obligation, exercised by the conformance
classes below — a declared string is necessary, not sufficient.

### 13.2 Conformance classes (C0 / C1 / C2)

The spec has two natures — a **Persona Definition Model** (the document) and **Persona Runtime
Governance** (what a runtime must guarantee). Conformance classes make the runtime obligations
testable instead of MAY-skippable. Each class includes the previous one:

| Class | Name | Obligations |
|---|---|---|
| **C0** | Identity | Validate documents per §13.1 (version-dispatched schemas + universals); compile a faithful qualitative document; never emit or accept a document that fails its class's universals. |
| **C1** | Governed State | Everything in C0, plus: the mutable surface is exactly the envelope fields (§8.3); every mutation is clamped, audited, drift-bounded (`max_step_delta`), and gated by `improvement_policy` mode + `per_layer_edit_policy`; a governance refusal is itself recorded (`governance_blocked`); traits backing hard virtues are immutable for every actor; state is a replayable checkpoint. |
| **C2** | Living Runtime | Everything in C1, plus: append-only hash-chained episodic memory with tombstone + redaction (§8.2) and dual-format verification; prompt-injection scanning on untrusted observations (a flagged observation cannot steer evolution); self-edits flow through a propose/approve ledger with the protected floor; `verification`, `agent_budget`, `observability` honored when declared; memory `types` flags honored. |

The reference conformance suite is `@personaxis/evals` (deterministic scenarios in categories
governance / security / spec-fidelity, run against the real engine); a runtime claims a class by
passing its scenario set.

---

## 14. Versioning

The spec is versioned with semver; **`spec_version` is the only normative version of this
standard**. `1.1.0` is current (**additive over 1.0.0** — every 1.0.0 document is a valid
1.1.0 document, no codemod: optional envelope `half_life`, the normative §15 Mathematical
semantics, and the optional `state.json` mutation_log hash chain). From 1.0: breaking changes
increment MAJOR; additive changes
increment MINOR; documents from the previous MAJOR keep validating against the frozen legacy
schema for the whole current-MAJOR window (read-compat).

Migrations are automated codemods, chained oldest-first:

| Codemod | Nature |
|---|---|
| `0.5-to-0.6` | structural (envelopes, unified governance, decisions{}) |
| `0.6-to-0.7` | layout-only (files into `.personaxis/`, first compile) |
| `0.7-to-0.8`, `0.8-to-0.9`, `0.9-to-0.10` | additive bumps |
| `0.10-to-1.0` | **structural, comment-preserving** (§0.1 changes; sibling `state.json` keys → full dot-paths; `policy.yaml` bump); dry-run by default, written report under `.personaxis/migrations/` |

See [`CHANGELOG.md`](../CHANGELOG.md) for each diff and rationale.

---

## 15. Mathematical semantics (normative, v1.1)

> The reference derivations, proofs, and machine-checked obligations live in the CLI repo's
> `docs/MATH_CORE.md`; this section states the normative contract a conforming runtime must
> honor. The governed object is the FULL persona: state coordinates span the personality /
> affect / values_and_drives layers; governance and audit span all ten.

**State space.** The mutable surface is exactly the set of envelope-bearing dot-paths `i`
with `e_i = (mean_i, [min_i, max_i])`. The state space is the compact box
`B = ∏ [min_i, max_i]`; the baseline is `μ = (mean_i)`. Every write is projected onto `B`
per coordinate (clamp), so **no sequence of mutations — adversarial included — produces a
state outside `B`** (invariance, T1), and one write recovers a hand-tampered out-of-box
value (one-step recovery).

**Denotation of a value.** `u_i = (x_i − mean_i)/(max_i − mean_i)` when `x_i ≥ mean_i`,
else `(x_i − mean_i)/(mean_i − min_i)`: **the fraction of the allowed deviation consumed**,
in `[−1, 1]`. `u(mean) = 0`, `u(max) = +1`, `u(min) = −1`.

**Drift is a metric.** Per-coordinate drift is `d_i = |u_i|`; a layer's drift is
`D_L = max d_i` over the layer's coordinates, compared against
`governance.drift_thresholds.<layer>` (exceeding it is a reportable anomaly). Bands are the
level sets of `d` per coordinate: **crossing a band boundary is THE drift event** (the
recompile trigger); within-band movement is expression variance. Boundaries: declared
`bands: {low_max, moderate_max}` or the defaults (0.33/0.66 unsigned; −0.33/+0.33 signed).

**Bounded step and evidence cost.** The gate MUST compose admitted non-human proposals per
coordinate and bound the net to `|δ| ≤ governance.max_step_delta` per tick (T2). Homeostatic
decay is exempt from that cap: its step has the sign of `mean − value`, so it can only reduce
`|u|` and never produces adversarial movement. Consequently a band crossing at distance `D`
**in the direction of increasing `|u|`** requires **at least `⌈D / max_step_delta⌉` applied
gate mutations, each an attributable `mutation_log` entry** (T3, the evidence-cost bound); a
recovery crossing (toward the mean) on a `half_life` coordinate may additionally be driven by
decay, whose steps carry no count floor but MUST each be audited as `runtime-decay`. v1.1
runtimes SHOULD hash-chain mutation_log entries (`prev_hash`/`hash`, the episodic-memory
scheme) so the audit trail is tamper-evident; a runtime that trims old entries MUST re-anchor
the chain.

**Homeostasis (opt-in).** A coordinate declaring `half_life: h` decays toward its mean each
tick by `λ = 1 − 2^(−1/h)` BEFORE admitted deltas, audited as actor `runtime-decay`.
Guarantees (T6): absent stimulus the deviation halves every `h` turns (geometric return to
baseline, never leaving `B`); under bounded per-step pressure the standing deviation is
bounded by `max_step_delta / λ` (input-to-state stability).

**Value arbitration (the algorithm `weight` always promised).** A conflict between two
declared values resolves by the strict total order: (1) `type: governance` beats
non-governance; (2) higher `weight` wins; (3) lexicographic name order breaks ties.
Deterministic, argument-order-independent, and explainable (the verdict names the deciding
rule). **U7 is derivable**: by U6, `safety` is governance-typed with weight ≥ 0.90, so it
beats every non-governance value — including any completion/task value — by rule (1). The
`conflict_resolution.safety_over_completion` flag remains REQUIRED for interop. A
non-safety value declared `type: governance` with weight ≥ safety's draws a lint warning.
