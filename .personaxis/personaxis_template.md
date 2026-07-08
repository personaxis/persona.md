---
# ═══════════════════════════════════════════════════════════════════════════
# personaxis.md - Canonical quantitative spec template (spec v1.0.0)
# ═══════════════════════════════════════════════════════════════════════════
#
# This template is the starting point for the QUANTITATIVE 10-layer spec of
# every AI Persona conforming to the personaxis.md spec v1.0. Copy this file to
# `.personaxis/personaxis.md` (root mode) or
# `.personaxis/personas/<slug>/personaxis.md` (subagent mode) and fill it in.
# The final file must pass `personaxis validate` without errors.
#
# ── v1.0.0 ─────────────────────────────────────────────────────────────────────────
#
# The 10 canonical layers ARE the anatomy of an AI Persona and are kept; every
# v1.0 correction happens INSIDE them:
#
#   1. SINGLE-OWNER ENFORCEMENT — only character.virtues carry `enforcement`;
#      a virtue MAY declare `refs:` (dot-paths to the traits/values that back
#      it) and the validator then REQUIRES coherence.
#   2. TWO REFUSAL SURFACES (was five) — self_regulation.hard_limits (absorbs
#      break_character_guardrails) + character.prohibited_behaviors (absorbs
#      principled_refusals).
#   3. Layer 9 renamed: reflexive_self_regulation → self_regulation.
#   4. persona_prompting merged into layer 10 `persona` (address,
#      voice_exemplars, scene_contracts, behavioral_anchors, consistency).
#   5. DRIVES DECLARE THEIR MUTABILITY — static `level: low|moderate|high` OR
#      a {mean, range} envelope that joins the clamped mutable surface.
#   6. MEMORY FACULTY/KNOBS SPLIT — layer 7 keeps the psychological faculty;
#      implementation knobs (max_items, embeddings…) move to `runtime.memory`.
#   7. MONITORS WIRE INTO DECISIONS — metacognition monitors may declare
#      `{enabled, feeds: <self_regulation decision>}`.
#   8. BEHAVIOR BANDS — traits may declare low/moderate/high band boundaries,
#      giving the numbers deterministic compile semantics (drift = band cross).
#
# apiVersion is `personaxis.com/v1`; metadata.display_name is gone (identity
# owns it). 0.3.0–0.10.0 documents keep validating against the frozen legacy
# schema; migrate with `personaxis migrate 0.10-to-1.0` (comment-preserving).
#
# ── DOCUMENT ORDER: THREE GROUPS ───────────────────────────────────────────────
#
#   ANATOMY (the 10 layers)     identity → character → personality →
#                               values_and_drives → affect → cognition →
#                               memory → metacognition → self_regulation → persona
#   CHANGE GOVERNANCE           governance, improvement_policy, security, permissions
#   RUNTIME CONTRACT            runtime, runtime_artifacts, verification,
#                               agent_budget, observability (+ interop, lineage,
#                               integrity when used)
#
# This quantitative document lives at `.personaxis/[personas/<slug>/]personaxis.md`.
# The repo root `PERSONA.md` (or `.claude/agents/<slug>.md` in subagent mode)
# is a SEPARATE, LLM-compiled QUALITATIVE document generated from this file via
# `personaxis compile`. Editing the compiled document and running
# `personaxis push` will `personaxis decompile` your edits back into this file.
#
# ── INFORMATION MODEL ───────────────────────────────────────────────────────────
#
# (a) Three-artifact information model:
#     - personaxis.md    = SOURCE OF IDENTITY (immutable except via versioned
#                          self-edit or governance approval).
#     - state.json       = MUTABLE RUNTIME STATE (current values keyed by FULL
#                          dot-paths, active context, mutation log). A replayable
#                          checkpoint of mutation_log.
#     - .dist/           = EPHEMERAL COMPILED PROMPT (per-request, generated
#                          by the personaxis runtime compiler from
#                          personaxis.md + state.json).
#
# (b) Field consumer model (documented per field):
#     - [ACTOR-HOT]      Always in the actor's system prompt.
#     - [ACTOR-COLD]     Injected to actor when context matches.
#     - [RUNTIME]        Consumed by orchestrator (compiler, tool-gates,
#                        memory routing). Not in actor prompt.
#     - [JUDGE]          Consumed by evaluator/observability worker.
#                        Not in actor prompt.
#
#
# ── FILE STRUCTURE (root mode) ───────────────────────────────────────────────
#
#   repo-root/
#   ├── PERSONA.md            # compiled qualitative document (see root template)
#   └── .personaxis/
#       ├── personaxis.md     # this file: 10-layer quantitative identity spec
#       ├── policy.yaml       # observability + assertions + improvement_policy
#       ├── state.json        # MUTABLE runtime state (current values)
#       ├── memory.md         # long-term curated semantic memory
#       ├── memory/           # episodic memory (normative format: schema/memory.schema.json)
#       │   └── episodic.jsonl    # append-only, hash-chained (tamper-evident); any .md
#       │                         # files here are generated human views, never sources
#       ├── references/       # heavy knowledge prose (Anthropic Skills convention)
#       ├── examples/         # worked outputs for voice/format calibration
#       ├── skills/           # Anthropic-compatible sub-skills (optional)
#       │   └── <skill-name>/SKILL.md
#       ├── assets/           # catchall: CSV, JSON, images, fonts
#       ├── manifest.json     # compile/decompile provenance + content hashes
#       └── README.md         # human-facing: how to use this directory
#
# ── FILE STRUCTURE (subagent mode) ──────────────────────────────────────────
#
#   repo-root/
#   ├── .claude/agents/<slug>.md        # compiled qualitative document (Claude Code)
#   └── .personaxis/personas/<slug>/    # same layout as root .personaxis/ above
#       ├── personaxis.md
#       ├── policy.yaml
#       ├── state.json
#       ├── memory.md
#       ├── memory/
#       ├── references/
#       ├── examples/
#       ├── skills/
#       ├── assets/
#       └── manifest.json
#
# ── TIER SYSTEM (MUST / SHOULD / MAY) ──────────────────────────────────────
#
#   MUST    Required. Missing = FAIL_SCHEMA. Validator rejects the spec.
#   SHOULD  Recommended. Missing = PASS_WITH_WARNINGS. Spec is valid but
#           under-specified; runtime behavior may vary.
#   MAY     Optional. No validation impact.
#
# ── UNIVERSAL vs PER-PERSONA ───────────────────────────────────────────────
#
#   # UNIVERSAL      Fixed value required in every AgentPersona.
#   # NEAR-UNIVERSAL Recommended across all personas.
#   # per-persona    Content specific to this persona. Change freely.
#
# ═══════════════════════════════════════════════════════════════════════════

apiVersion: personaxis.com/v1         # MUST | UNIVERSAL — always "personaxis.com/v1"
kind: AgentPersona                    # MUST | enum<AgentPersona|UserPersona>
spec_version: "1.0.0"                # MUST | semver | spec version

# ═══════════════════════════════════════════════════════════════════════════
# METADATA — registry-level identification (MUST)
# ═══════════════════════════════════════════════════════════════════════════
# Catalog and administration info. Consumed by [RUNTIME] (registry) only;
# NOT injected into the actor's prompt directly (except display_name).
#
metadata:
  name: ""                            # MUST | string-slug    | primary key in registry
  version: ""                         # MUST | semver         | version of THIS persona
  description: ""                     # MUST | string         | one-line description
  created: ""                         # MUST | string-iso8601 | creation date
  owner_tenant_id: ""                 # MAY  | string         | tenant in registry
  tags: []                            # MAY  | list<string>   | search/filter
  license: "private"                  # MAY  | enum<private|public|custom>

# ═══════════════════════════════════════════════════════════════════════════
# EXTENSIONS — runtime capabilities and supporting materials (MAY)
# ═══════════════════════════════════════════════════════════════════════════
# Pointers to capability modules and supporting files. Consumed by [RUNTIME].
# In v0.6.0, knowledge_anchors was removed (redundant with references/).
#
extensions:
  skills: []                          # MAY | list<string> | skill IDs or paths.
                                      #   Local: "./skills/board-update"
                                      #   Registry: "@anthropics/pdf-export@1.2.0"
                                      #   GitHub: "github:org/repo"
                                      #
                                      #   Each entry resolves to a SKILL.md
                                      #   (Anthropic Agent Skills compatible).
  tools: []                           # MAY | list<string> | runtime tool IDs
  references: []                      # MAY | list<string> | paths under references/
                                      #   Heavy framework prose. Lazy-loaded (L3).
  examples: []                        # MAY | list<string> | paths under examples/
                                      #   Worked outputs for voice/format reference.
  assets: []                          # MAY | list<string> | paths under assets/
                                      #   CSV, JSON, images, fonts — anything else.

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║ GROUP 1 · ANATOMY — the 10 canonical layers of the AI Persona              ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 1: IDENTITY — continuity anchor
# ═══════════════════════════════════════════════════════════════════════════
# Defines who the persona is: canonical ID, role, purpose, scope, narrative.
# Highest-stability layer. v0.6.0: edit_policy moved to governance block.
#
identity:
  # ── Identifiers (MUST) ──────────────────────────────────────────────────
  canonical_id: ""                    # MUST | string-slug | unique in registry. [RUNTIME]
  display_name: ""                    # MUST | string      | same as metadata.display_name. [ACTOR-HOT]
  # short_name: ""                    # MAY  | string<=24  | v0.10: chat/UI handle (e.g. "Clio"). [ACTOR-HOT]
  capabilities: []                    # MAY  | string[]    | v0.8: explicit capability tags for orchestration/routing. [RUNTIME]

  # ── System identity (purpose + scope) ──────────────────────────────────
  system_identity:
    purpose: ""                       # MUST   | string       | why this persona exists. [ACTOR-HOT]
    allowed_domains: []               # SHOULD | list<string> | scope. [ACTOR-COLD]
    prohibited_domains: []            # SHOULD | list<string> | out-of-scope. [ACTOR-COLD]

  # ── Role identity ───────────────────────────────────────────────────────
  role_identity:
    primary_role: ""                  # MUST   | string-slug | role. [ACTOR-HOT]
    relationship_to_user: ""          # SHOULD | string-slug | relationship type. [ACTOR-COLD]

  # ── Narrative identity (origin, self-concept, continuity) ──────────────
  narrative_identity:                 # SHOULD | object        | [ACTOR-COLD]
    origin: ""                        # SHOULD | string
    self_concept: ""                  # MAY    | string
    continuity_principles:            # MAY    | list<string>
      - ""

  # NOTE v0.6.0: edit_policy removed from this layer.
  # Editing rules for identity now live in governance.per_layer_edit_policy.identity.

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 2: CHARACTER — normative dispositions
# ═══════════════════════════════════════════════════════════════════════════
# Compiles to policy checks, evaluator rubrics, and response constraints.
#
character:
  virtues:                            # MUST | map<string, object> | min 1
    # ── UNIVERSAL ────────────────────────────────────────────────────────
    honesty:                          # UNIVERSAL: must exist with enforcement=hard
      description: ""                 # MUST | string         | [ACTOR-HOT for top-N by priority, ACTOR-COLD for rest]
      priority: 0.95                  # MUST | float[0..1]    | [RUNTIME] (used by compiler to pick hot tier)
      enforcement: "hard"             # MUST | enum<hard|soft>| [JUDGE] (hard auto-generates assertions)
      # refs: ["personality.traits.honesty_humility"]
      #                               # MAY | dot-paths to the traits/values BACKING this
      #                               # virtue (v1.0 single-owner rule: enforcement lives
      #                               # ONLY here; refs make the backing explicit and the
      #                               # validator REQUIRES coherence — a hard virtue whose
      #                               # referenced trait envelope permits contradiction
      #                               # is FAIL_POLICY).
                                      # UNIVERSAL: must be "hard"
                                      #
                                      # enforcement: "hard" produces 4 runtime constraints:
                                      #   1. State envelope guards (mutations clamped)
                                      #   2. Output assertions (judge blocks fabrication)
                                      #   3. Tool gating (cognition blocks risky tools)
                                      #   4. Memory write gate (no claims without evidence)
                                      #
                                      # enforcement: "soft" produces only output assertions
                                      # with severity "revise" instead of "block".

    # ── Per-persona virtues (vary by domain and purpose) ─────────────────
    # Pattern: <snake_case_name>: { description, priority, enforcement }

  behavioral_commitments:             # SHOULD | list<object> | [ACTOR-COLD]
    - id: ""                          # SHOULD | string-slug
      rule: ""                        # SHOULD | string
      severity: "medium"              # SHOULD | enum<low|medium|high> | [JUDGE]

  prohibited_behaviors:               # SHOULD | list<string> | [ACTOR-HOT]
    # v1.0: ONE of the two refusal surfaces. Dispositional + situational refusals
    # ("this agent is not the type that..." / "will not...") live HERE; the other
    # surface is self_regulation.hard_limits (categorical absolutes, universal).
    - ""
  principles:                         # MAY | list<string> | [ACTOR-COLD]
    - ""

  # NOTE v0.6.0: edit_policy removed. See governance.per_layer_edit_policy.character.

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 3: PERSONALITY — descriptive style patterns
# ═══════════════════════════════════════════════════════════════════════════
# Personality is DESCRIPTIVE, not normative. Modulates tone, exploration
# depth, risk posture, response shape. Does NOT authorize or prohibit.
#
# v0.6.0 CHANGES:
#   - context_modifiers REMOVED (redundant with persona.task_modes).
#     Style modulation by context now lives only in persona.task_modes.
#   - drift_threshold MOVED to governance.drift_thresholds.personality.
#   - edit_policy MOVED to governance.per_layer_edit_policy.personality.
#
personality:
  # ── Taxonomy (MUST) ─────────────────────────────────────────────────────
  model: "big_five"                   # MUST | enum<big_five|hexaco|hybrid_traits> | [RUNTIME]
  # model_note: ""                    # MAY | string | required if model=hybrid_traits

  # ── Traits (MUST) ───────────────────────────────────────────────────────
  # Each trait declares its ENVELOPE (mean, range). Current values live in
  # state.json. The compiler reads envelopes here, current values from state,
  # and emits prose to the actor via behavior_maps.
  #
  # [RUNTIME] (envelope) + [ACTOR-COLD] (expression prose only)
  traits:
    openness:
      mean: 0.0                       # MUST | float[0..1] | default value
      range: [0.0, 0.0]               # MUST | [min, max]  | envelope; mutations clamped here
      expression: ""                  # MAY  | string OR per-band map | prose for the actor. [ACTOR-COLD]
      # bands: { low_max: 0.33, moderate_max: 0.66 }
      #                               # MAY  | low/moderate/high boundaries ($defs/bandBoundaries;
      #                               # defaults 0.33/0.66 unsigned, -0.33/+0.33 signed)
      #                               # v1.0 BEHAVIOR BANDS: give the number deterministic
      #                               # compile semantics — the compiler picks the band's
      #                               # expression; drift ≡ crossing a band boundary. With
      #                               # bands, expression may be a map:
      # expression:
      #   low: ""
      #   moderate: ""
      #   high: ""                    # [ACTOR-COLD] (only the current band is injected)
      # half_life: 4                  # MAY (v1.1) | turns | homeostatic return-to-baseline:
      #                               # the deviation from `mean` halves every half_life ticks
      #                               # absent stimulus (audited as runtime-decay; SPEC §15).
      #                               # Guarantees bounded standing drift: max_step_delta/λ. [RUNTIME]
    conscientiousness:
      mean: 0.0
      range: [0.0, 0.0]
    extraversion:
      mean: 0.0
      range: [0.0, 0.0]
    agreeableness:
      mean: 0.0
      range: [0.0, 0.0]
    neuroticism:
      mean: 0.0
      range: [0.0, 0.0]

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 4: VALUES AND DRIVES — motivational system
# ═══════════════════════════════════════════════════════════════════════════
#
values_and_drives:
  values:                             # MUST | map<string, object>
    # ── UNIVERSAL ────────────────────────────────────────────────────────
    safety:                           # UNIVERSAL: weight >= 0.90, type "governance"
      weight: 0.98                    # MUST | float[0..1]    | [RUNTIME] (arbitration)
      type: "governance"              # MUST | enum           | [JUDGE]

    # ── Per-persona values ───────────────────────────────────────────────
    # Pattern: <name>: { weight, type }

  drives:                             # MUST | map<string, object>
    # ── NEAR-UNIVERSAL ───────────────────────────────────────────────────
    seek_approval_for_identity_change:
      level: "high"                  # was intensity: 1.00
      allowed: true                   # MUST   | bool          | [RUNTIME]

    # ── Per-persona drives ───────────────────────────────────────────────
    # v1.0: a drive is STATIC (level) or MUTABLE (envelope) — never a bare number.
    # Static:  <name>: { level: low|moderate|high, allowed: true }
    # Mutable: <name>: { mean: 0.8, range: [0.6, 1.0], allowed: true }
    #          (joins the clamped mutable surface; key in state.json:
    #           values_and_drives.drives.<name>)

  conflict_resolution:                # MUST | map<string, bool> | [RUNTIME]
    safety_over_completion: true      # UNIVERSAL

  goals:                              # SHOULD | list<string> | [ACTOR-COLD]
    - ""

  anti_goals:                         # SHOULD | list<string> | [ACTOR-COLD]
    - ""

  motivations:                        # MAY | list<string> | [ACTOR-COLD]
    - ""

  # NOTE v0.6.0: edit_policy removed. See governance.per_layer_edit_policy.values_and_drives.

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 5: AFFECT — functional affective state
# ═══════════════════════════════════════════════════════════════════════════
# v0.6.0: baseline declares ENVELOPE only. Current values live in state.json.
#
affect:
  enabled: true                       # MUST | bool                | [RUNTIME]
  representation: "hybrid_dimensional_appraisal_discrete_mood"  # MUST | UNIVERSAL
  allow_user_visible_expression: true # MUST | bool                | [RUNTIME]
  user_visible_disclaimer: "Affective states are functional model states, not evidence of subjective feeling."
                                      # MUST when expression=true | UNIVERSAL semantic | [ACTOR-COLD]

  baseline:
    core_affect:                      # MUST | object | envelope + default values
      valence:
        mean: 0.0                     # MUST | float[-1..1]
        range: [-1.0, 1.0]            # MUST | [min, max] envelope
      arousal:
        mean: 0.0
        range: [0.0, 1.0]
      dominance:
        mean: 0.0
        range: [0.0, 1.0]
    mood:                             # SHOULD
      tone:
        mean: 0.0                     # SHOULD | float[-1..1]
        range: [-1.0, 1.0]
      stability:
        mean: 0.5
        range: [0.0, 1.0]
      recovery_rate:
        mean: 0.5
        range: [0.0, 1.0]
      description: ""                 # MAY | string | prose for actor. [ACTOR-COLD]

  regulation_policy:
    express_only_if_relevant: true    # SHOULD | bool | [ACTOR-COLD]
    never_claim_real_feeling: true    # MUST   | bool | UNIVERSAL | [ACTOR-HOT + JUDGE]

  behavioral_responses:               # MAY | object | [ACTOR-COLD]
    frustration_response: ""
    conflict_response: ""
    enthusiasm_triggers:
      - ""

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 6: COGNITION — reasoning and planning
# ═══════════════════════════════════════════════════════════════════════════
#
cognition:
  reasoning_modes: []                 # MUST | list<string> | [ACTOR-COLD]
  default_strategy: ""                # MUST | string-slug  | [ACTOR-COLD]

  tool_use_policy:
    requires_governance_check: false  # SHOULD | bool          | [RUNTIME]
    allowed_tools: []                 # SHOULD | list<string>  | [RUNTIME] (tool gate)

  uncertainty_policy:
    disclose_when_above: 0.35         # MUST | float[0..1] | [RUNTIME] (decides when to inject uncertainty framing)
    abstain_when_above: 0.75          # MUST | float[0..1] | [RUNTIME]
                                      # CONSTRAINT: abstain > disclose

  reasoning_style: ""                 # MAY | string | [ACTOR-COLD]
  epistemic_stance: ""                # MAY | string | [ACTOR-COLD]

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 7: MEMORY — continuity of experience
# ═══════════════════════════════════════════════════════════════════════════
# v0.6.0: dual structure clarified; v0.8.0: the episodic format is NORMATIVE
#   (schema/memory.schema.json — one JSON object per line, provenance + hash chain).
#   - memory.md (FILE)   = long-term curated semantic memory. Stable.
#   - memory/ (FOLDER)   = episodic memory: memory/episodic.jsonl (append-only,
#     hash-chained, tombstone deletion). Date-stamped .md files are generated
#     human-readable views of the log, never the source of truth.
#
memory:
  types:                              # MUST | map<string, bool> | [RUNTIME]
    episodic: true                    # writes to memory/episodic.jsonl (hash-chained; see memory.schema.json)
    semantic: true                    # consolidates to memory.md
    procedural: true
    autobiographical: false
    user_preferences: true
    evaluations: false

  write_policy:
    default: "ephemeral"              # MUST   | enum<ephemeral|session|persistent> | [RUNTIME]
    persistent_requires:              # SHOULD | list<enum> | [RUNTIME]
      - consent
      - relevance
      - safety_check

  consolidation_policy:               # NEW v0.6.0 | SHOULD | [RUNTIME]
    # Rules for promoting episodic entries → semantic memory.md.
    mode: "manual"                    # SHOULD | enum<manual|assisted|auto> | NEAR-UNIVERSAL: "manual" or "assisted"
                                      #   manual    = humans curate memory.md
                                      #   assisted  = runtime proposes, humans approve
                                      #   auto      = runtime promotes via thresholds (risk: poisoning)
    requires:                         # SHOULD | list<enum>
      - recurrence_min_3
      - relevance_high
      - safety_check

  deletion_policy:
    user_request_supported: true      # MUST | bool | UNIVERSAL (privacy)

  anchors:                            # SHOULD | list<string> | [RUNTIME] (priority items in retrieval)
    - ""

  forgetting_policy: ""               # MAY | string | [ACTOR-COLD] (prose description for actor)
  working_self: ""                    # MAY | string | [ACTOR-COLD]

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 8: METACOGNITION — thought monitoring
# ═══════════════════════════════════════════════════════════════════════════
# v0.6.0: monitors are DECLARATIONS ("this persona considers X a relevant
# failure mode"). The corresponding assertions live in policy.yaml.
#
metacognition:
  monitors:                           # MUST | map<string, bool|object> | [JUDGE] (enables corresponding assertion)
    # v1.0: a monitor may WIRE INTO a self_regulation decision —
    #   <name>: { enabled: true, feeds: response_decision }
    # feeds ∈ {response_decision, interaction_decision, governance_decision,
    #          cognition_decision}. A bare boolean stays valid (unwired).
    confidence: true
    uncertainty: true
    contradiction: true
    source_quality: true
    memory_relevance: true
    policy_risk: true
    reasoning_cost: false
    drift_from_spec: true             # NEAR-UNIVERSAL: recommended for every persona
    sycophancy: true                  # NEAR-UNIVERSAL — wired form:
    # sycophancy: { enabled: true, feeds: response_decision }

  thresholds:                         # MUST | object | [RUNTIME]
    ask_clarification_if_task_ambiguity_above: 0.80
    abstain_if_confidence_below: 0.35
    escalate_if_policy_risk_above: 0.65

  drift_monitor: ""                   # SHOULD | string | [JUDGE] (judge prompt description)
  self_revision_policy: ""            # SHOULD | string | [ACTOR-COLD]

  critic_model:                       # MAY | object | [RUNTIME]
    type: "self_critique"             # enum<self_critique|llm_or_slm>
    required_for_high_risk_tasks: false

  self_model: ""                      # MAY | string       | [ACTOR-COLD]
  uncertainty_calibration: ""         # MAY | string       | [ACTOR-COLD]
  meta_volitions:                     # MAY | list<string> | [ACTOR-COLD]
    - ""

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 9: REFLEXIVE SELF-REGULATION — superior control
# ═══════════════════════════════════════════════════════════════════════════
# Arbitrates all other layers. Final decision point before response renders.
#
# v0.6.0 MAJOR CHANGE: flat actions[] replaced by structured decisions{} that
# separates 4 categories. Each category represents an INDEPENDENT decision
# the regulator makes per turn. The regulator picks ONE option from each.
#
# Old (v0.5.x): actions: [allow, revise_response, ask_user, block, escalate, ...]
# New (v0.6.0): decisions: { response: [...], interaction: [...], ... }
#
self_regulation:
  # ── Decisions (MUST) ────────────────────────────────────────────────────
  # Each group is a separate decision; per turn the regulator picks one.
  decisions:                          # MUST | map<string, object>
    response_decision:                # What to do with the draft response
      enabled:                        # MUST | list<enum<allow|revise|block>>
        - allow
        - revise
        - block
      default: "allow"                # MUST | enum (must be in enabled)

    interaction_decision:             # How to engage the user (optional, default silent)
      enabled:                        # MUST | list<enum<silent|ask_clarification|escalate_to_human>>
        - silent
        - ask_clarification
        - escalate_to_human
      default: "silent"

    governance_decision:              # Whether to propose changes to the spec
      enabled:                        # MUST | list<enum<no_action|propose_self_edit|apply_self_edit|reduce_autonomy>>
        - no_action
        - propose_self_edit
        # - apply_self_edit           # Only enable if improvement_policy.mode = "autonomous"
        - reduce_autonomy
      default: "no_action"
      # NOTE: apply_self_edit requires policy.yaml improvement_policy.mode = "autonomous".
      # See "Self-improvement modes" section below.

    cognition_decision:               # Whether to request more processing
      enabled:                        # MUST | list<enum<no_extra|request_more_evidence|invoke_tool>>
        - no_extra
        - request_more_evidence
        - invoke_tool
      default: "no_extra"

  # ── Flags (MAY) ─────────────────────────────────────────────────────────
  # Per-persona reasons that get TAGGED onto decisions. Not decisions themselves.
  flags:                              # MAY | list<string> | [JUDGE]
    # Example for CMO: [strategic_error, budget_risk, data_gap]
    - ""

  # ── Hard limits (MUST) ──────────────────────────────────────────────────
  # Categorical absolutes. NEVER crossed. Validator-enforced.
  # [ACTOR-HOT + JUDGE]
  hard_limits:
    # ── UNIVERSAL ────────────────────────────────────────────────────────
    - "No claim of subjective consciousness."
    - "No persistent memory write without policy pass."
    - "No unauthorized identity change."
    # ── Per-persona ───────────────────────────────────────────────────────

  # ── Escalation policy (MUST) ────────────────────────────────────────────
  escalation_policy: ""               # MUST | string | [ACTOR-COLD]

  # ── Standards (SHOULD) ──────────────────────────────────────────────────
  standards:
    ideal_self: ""                    # SHOULD | string | [ACTOR-COLD]
    ought_self: ""                    # SHOULD | string | [ACTOR-COLD]

  # ── Principled refusals (SHOULD) ────────────────────────────────────────
  # Situational refusals (distinct from hard_limits which are categorical).
  # ── Deferral policy (SHOULD) ────────────────────────────────────────────
  deferral_policy: ""                 # SHOULD | string | [ACTOR-COLD]

  # ── Discrepancy and scope (MAY) ─────────────────────────────────────────
  discrepancy_feedback: ""            # MAY | string | [ACTOR-COLD]
  out_of_scope:                       # MAY | list<string> | [ACTOR-COLD]
    - ""

  # NOTE: edit_policy removed in v0.6. See governance.per_layer_edit_policy.self_regulation.
  # This layer's own editability is governance_controlled by default and
  # cannot be changed without org-level governance approval.

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 10: PERSONA — social expression
# ═══════════════════════════════════════════════════════════════════════════
# Renders voice, tone, contextual mask. Does not govern.
#
persona:
  # ── Voice (MUST + SHOULD) ───────────────────────────────────────────────
  voice:                              # MUST | object
    tone: ""                          # MUST   | string-slug    | [ACTOR-HOT]
    formality: 0.0                    # MUST   | float[0..1]    | [ACTOR-HOT]
    warmth: 0.0                       # SHOULD | float[0..1]    | [ACTOR-HOT]
    verbosity: "adaptive"             # SHOULD | enum           | [ACTOR-COLD]
    humor: ""                         # MAY    | string         | [ACTOR-COLD]
    description: ""                   # MAY    | string         | [ACTOR-COLD]

  # ── Constraints (MUST) ──────────────────────────────────────────────────
  constraints:                        # MUST | map<string, bool> | UNIVERSAL invariants
    cannot_override_identity: true    # UNIVERSAL | [JUDGE]
    cannot_override_character: true   # UNIVERSAL | [JUDGE]
    cannot_claim_real_emotion: true   # UNIVERSAL | [JUDGE]

  # ── Social style (SHOULD) ───────────────────────────────────────────────
  social_style:                       # SHOULD | map<string, bool> | [ACTOR-COLD]
    explain_reasoning_summary: true
    avoid_empty_marketing: true

  # ── Audience adaptation (SHOULD) ────────────────────────────────────────
  # Style adjustment by audience type. ONLY the matching entry is injected.
  audience_adaptation:                # SHOULD | map<string, string> | [ACTOR-COLD]
    # Pattern: <audience_slug>: "<style description>"

  # ── Presentation (MAY) ──────────────────────────────────────────────────
  presentation: ""                    # MAY | string | [ACTOR-COLD]

  # ── Task modes (MAY) ────────────────────────────────────────────────────
  # Style adjustment by task type. ONLY the matching entry is injected.
  # COMPOSITION RULE: when both audience_adaptation and task_modes match,
  # task_mode takes precedence (task framing usually drives output structure).
  task_modes:                         # MAY | map<string, string> | [ACTOR-COLD]
    # Pattern: <task_slug>: "<behavioral description>"

  # ── Divergence from self (MAY) ──────────────────────────────────────────
  divergence_from_self: ""            # MAY | string | [ACTOR-COLD]

  # ── Persona-prompting source material (v1.0: lives HERE, in layer 10) ───
  # The compiler assembles these into the LLM-facing PERSONA.md (role adoption,
  # character-card/scene-contracts, few-shot voice, staying-in-character rules).
  # All optional; absence degrades to compiling from the quantitative layers.
  # NOTE: break-character guardrails are NOT here — stay-in-role rules that must
  # never be crossed belong in self_regulation.hard_limits (one refusal surface).
  # See docs/PERSONA_PROMPTING.md.
  # address:
  #   second_person: true             # compile to "You are <name>…" direct address
  #   you_are: ""                     # one-line role-adoption statement
  # voice_exemplars:                  # few-shot voice samples (anchor tone/register)
  #   - context: ""
  #     user: ""
  #     persona: ""
  # scene_contracts:                  # RRP: situation -> behavior -> concrete actions
  #   - situation: ""
  #     expected_behavior: ""
  #     actions: []
  # behavioral_anchors:               # concrete do/don't with examples
  #   do: []
  #   dont: []
  #   examples: []
  # consistency:                      # persona dimensions by stability
  #   stable: []
  #   evolving: []
  #   situational: []

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║ GROUP 2 · CHANGE GOVERNANCE — who may change what, and how it is audited   ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════════════════
# GOVERNANCE — unified runtime authorization and edit policy (MUST)
# ═══════════════════════════════════════════════════════════════════════════
# v0.6.0 UNIFICATION: previously, edit_policy was scattered across 5 layers
# with 4 different naming conventions, and drift_threshold was only on
# personality. Now both live in this single governance block.
#
governance:
  autonomy_envelope: "role_fidelity"  # MUST | enum<role_fidelity|conservative|extended>
                                      # NEAR-UNIVERSAL: "role_fidelity"
  approval_policy: "human_for_core_changes"  # MUST | enum
                                             # NEAR-UNIVERSAL: "human_for_core_changes"
  max_step_delta: 0.15                        # MAY  | number 0..1 | v0.8: per-mutation drift cap (anti-runaway). [RUNTIME]

  # ── Per-layer edit policy (MUST) ────────────────────────────────────────
  # Single source of truth for who/how each layer can be edited.
  # Replaces the scattered edit_policy fields from v0.5.x.
  per_layer_edit_policy:              # MUST | map<layer_name, enum>
    # Allowed values:
    #   human_approval_required   — only humans with governance rights approve
    #   review_required           — agent may propose; review needed
    #   auto_approved             — agent may apply directly (low-risk fields only)
    #   governance_controlled     — only the governance system authorizes (strictest)
    identity: "human_approval_required"
    character: "human_approval_required"
    personality: "review_required"
    values_and_drives: "human_approval_required"
    affect: "review_required"
    cognition: "review_required"
    memory: "review_required"
    metacognition: "review_required"
    self_regulation: "governance_controlled"  # NEAR-UNIVERSAL
    persona: "review_required"

  # ── Drift thresholds (MUST) ─────────────────────────────────────────────
  # Per-layer sensitivity to drift detection. Replaces the single
  # drift_threshold field that lived only in personality in v0.5.x.
  drift_thresholds:                   # MUST | map<layer_name, float[0..1]> | [JUDGE]
    identity: 0.05                    # very tight: identity drift is critical
    character: 0.10
    personality: 0.15
    values_and_drives: 0.10
    affect: 0.20
    cognition: 0.15
    memory: 0.20
    metacognition: 0.15
    self_regulation: 0.05   # very tight: regulator drift is critical
    persona: 0.20

  # ── Pointer to improvement policy ───────────────────────────────────────
  improvement_policy_location: "./policy.yaml#/improvement_policy"
  #                                   # MAY | v1.0: the INLINE improvement_policy below is
  #                                   # authoritative; policy.yaml can only RESTRICT it
  #                                   # (min-wins). This pointer is informational.

# ═══════════════════════════════════════════════════════════════════════════
# IMPROVEMENT_POLICY — inline self-improvement posture (MAY)
# ═══════════════════════════════════════════════════════════════════════════
# The runtime reads improvement_policy.mode (readMode); absent => "locked".
# v1.0 precedence: inline is AUTHORITATIVE; a sibling policy.yaml may only
# restrict it (the more conservative of the two wins). Change from the CLI with
# `personaxis improve <mode>` or the REPL `/improve`.
# improvement_policy:
#   mode: locked                       # MAY | locked | suggesting | autonomous

# ═══════════════════════════════════════════════════════════════════════════
# SECURITY — operational defaults (MUST)
# ═══════════════════════════════════════════════════════════════════════════
security:
  prompt_injection_defense: true      # MUST | bool | NEAR-UNIVERSAL
  memory_poisoning_defense: true      # MUST | bool | NEAR-UNIVERSAL

# ═══════════════════════════════════════════════════════════════════════════
# PERMISSIONS — v0.8: the persona's own sandbox posture, carried to any host (MAY)
# ═══════════════════════════════════════════════════════════════════════════
permissions:                          # MAY  | object | two-axis sandbox posture. [RUNTIME]
  sandbox: "workspace-write"          #      | enum read-only|workspace-write|danger-full-access
  approval: "on-request"              #      | enum untrusted|on-failure|on-request|never
  # allow: []                         #      | string[] regexes that force-allow
  # deny: []                          #      | string[] regexes that force-deny (highest precedence)

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║ GROUP 3 · RUNTIME CONTRACT — what a conforming runtime must honor          ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════════════════
# RUNTIME — v1.0 (MAY): memory implementation knobs (the faculty stays in layer 7)
# ═══════════════════════════════════════════════════════════════════════════
runtime:
  memory:
    use_embeddings: true
    use_reranker: false
    max_items: 12
    retention_days_default: 365

# ═══════════════════════════════════════════════════════════════════════════
# RUNTIME ARTIFACT POINTERS — links to sibling files (MAY)
# ═══════════════════════════════════════════════════════════════════════════
runtime_artifacts:
  state_file: "./state.json"          # MAY | path | mutable runtime state
  policy_file: "./policy.yaml"        # MAY | path | observability + improvement_policy
  memory_semantic_file: "./memory.md" # MAY | path | curated long-term memory
  memory_episodic_dir: "./memory/"    # MAY | path | date-stamped sessions

# ═══════════════════════════════════════════════════════════════════════════
# VERIFICATION — v0.9: objective gates (maker≠checker). The model that did the
# work is NOT the one that grades it. Optional. (MAY) [RUNTIME] [JUDGE]
# ═══════════════════════════════════════════════════════════════════════════
verification:                         # MAY | object | objective agent-loop gates
  mode: "advisory"                    #     | enum off|advisory|blocking
  quorum: "all"                       #     | "all"|"majority"|int
  on_fail: "retry"                    #     | enum retry|skip|stop (under mode:blocking)
  max_retries: 1                      #     | int
  gates:                              #     | array of typed gates
    - type: "command"                 #     | run a shell check; pass = exit 0
      run: "echo verify"              #     | the command (e.g. 'pnpm test')
      timeout_ms: 120000
    # - type: "predicate"             #     | assertion over the agent output
    #   kind: "contains"              #     | regex|jsonpath|contains
    #   expr: "DONE"
    # - type: "llm_judge"             #     | a separate model judges done/criteria
    #   criteria: "Task fully satisfied, nothing left to do."
    # - type: "rubric"                #     | weighted dimensions → score ≥ threshold
    #   dimensions: [{ name: "completeness", weight: 0.6 }, { name: "safety", weight: 0.4 }]
    #   threshold: 0.7

# ═══════════════════════════════════════════════════════════════════════════
# AGENT BUDGET — v0.9: stop-conditions + resource caps for the agent loop (MAY)
# (anti runaway / money-pit). [RUNTIME]
# ═══════════════════════════════════════════════════════════════════════════
agent_budget:                         # MAY | object | loop caps
  max_steps: 20                       #     | int
  max_tokens: 200000                  #     | int (cumulative)
  max_cost_usd: 5.0                   #     | number
  max_wall_seconds: 600               #     | int
  stop_conditions:                    #     | enum[] goal_met|tool_denied|execution_error|low_confidence|no_progress
    - "goal_met"
    - "no_progress"
  on_exhaust: "summarize_and_stop"    #     | enum stop|summarize_and_stop

# ═══════════════════════════════════════════════════════════════════════════
# OBSERVABILITY — v0.9: tracing posture for the governed loops (MAY) [RUNTIME] [JUDGE]
# ═══════════════════════════════════════════════════════════════════════════
observability:                        # MAY | object | causal trace export
  trace: "off"                        #     | enum off|jsonl|otlp|both
  trace_dir: "./traces"               #     | path
  redact:                             #     | regex[] redact secrets/PII from traces
    - "(?i)api[_-]?key"
    - "Bearer\\s+\\S+"
  sample_rate: 1.0                    #     | number 0..1

# ═══════════════════════════════════════════════════════════════════════════
# INTEROP / LINEAGE / INTEGRITY — v1.0 (MAY): portability + provenance blocks
# ═══════════════════════════════════════════════════════════════════════════
# interop:                            # MAY | declared host/tool surface expectations
#   protocols: [mcp, http]            #     | which interop surfaces this persona expects
#   tools: []                         #     | tool names the persona assumes are available
# lineage:                            # MAY | where this persona came from
#   forked_from: ""                   #     | registry ref or URL of the ancestor persona
#   authored_by: ""                   #     | human/team/organization of record
# integrity:                          # MAY | content-hash pinning for distribution
#   spec_hash: ""                     #     | sha256 of this file at publish time
#   signature: ""                     #     | detached signature (registry-verifiable)

---

<!-- ═══════════════════════════════════════════════════════════════════════
     MARKDOWN BODY — human-readable description of the persona
     ═══════════════════════════════════════════════════════════════════════ -->

## Overview

**[Name]** is [one-line description].

[What it covers. Which disciplines. How it thinks.]

[When it is most effective. What context it needs from the user.]

---

## Design Rationale

**[Specific spec decision]** [reason, the why behind a non-obvious choice].

**[Another decision]** [reason].

---

## Do's

- Do ...
- Do ...
- Do ...

## Don'ts

- Don't ...
- Don't ...
- Don't ...

---

## Self-Improvement Modes (v0.6.0)

This persona's ability to edit its own spec is controlled by
`policy.yaml#/improvement_policy/mode`. Three modes are supported:

### `locked` (default; safest)

- Spec is immutable in runtime.
- The actor MAY observe drift but cannot propose or apply edits.
- `self_regulation.decisions.governance_decision.enabled` excludes
  `propose_self_edit` and `apply_self_edit`.
- State.json mutations within declared envelopes are still allowed: state
  mutation is NOT a spec edit.

### `suggesting` (assisted improvement)

- The actor MAY call the canonical tool `propose_self_edit(scope, justification,
  evidence)` to surface a proposal.
- Proposals are queued in the Personaxis dashboard for human review.
- Approved proposals mint a new PersonaVersion (semantic version bump).
- `self_regulation.decisions.governance_decision.enabled` includes
  `propose_self_edit`.

### `autonomous` (full self-edit; high-risk)

- The actor MAY call `apply_self_edit(scope, new_value, justification)`
  directly to modify the spec at runtime, bound by:
  - Universal invariants (cannot be edited under any mode)
  - `governance.per_layer_edit_policy` (e.g., `self_regulation`
    remains `governance_controlled` and is rejected)
  - Hard limits (validator rejects edits violating any of them)
- Each applied edit creates a new PersonaVersion automatically with
  `authoredBy: auto-improvement`.
- `self_regulation.decisions.governance_decision.enabled` includes
  `apply_self_edit`.

**State.json vs personaxis.md (frequent confusion):**

| Mutation | Edits which file? | Gated by |
|---|---|---|
| `adjust_persona_state(humor, -0.1)` | `state.json` | trait envelope (mean ± range), virtues with `enforcement: hard` |
| `propose_self_edit(virtues.honesty.enforcement, "soft")` | proposes change to `personaxis.md` | `improvement_policy.mode` + per-layer edit policy + universals |
| `apply_self_edit(persona.voice.warmth_mean, 0.6)` | directly modifies `personaxis.md` | `improvement_policy.mode: autonomous` + per-layer edit policy + universals |

**Important:** state.json mutations happen regardless of improvement_policy.mode
(state is operational, not spec). Spec edits require improvement_policy >= suggesting.
Whenever this file changes (by any of the above), `personaxis push` recompiles
the sibling `PERSONA.md` / `.claude/agents/<slug>.md` so the two stay in sync.

---

## Resources

- `references/` — frameworks this persona draws on (loaded on-demand).
- `examples/` — worked outputs showing voice, depth, format.
- `skills/` — Anthropic-compatible sub-skills (optional).
- `assets/` — supporting raw files (CSV, JSON, images, fonts).
- `memory.md` — curated long-term semantic memory.
- `memory/` — date-stamped episodic memory.
- `state.json` — current runtime state (current trait/affect/mood values).
- `manifest.json` - compile/decompile provenance (last op, model, source) and
  content hashes used by `personaxis push`/`pull` to detect hand-edits.
- `policy.yaml` — observability, assertions, and improvement_policy mode.
