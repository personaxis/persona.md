---
# ═══════════════════════════════════════════════════════════════════════════
# personaxis.md - Canonical quantitative spec template (spec v0.7.0)
# ═══════════════════════════════════════════════════════════════════════════
#
# This template is the starting point for the QUANTITATIVE 10-layer spec of
# every AI Persona conforming to the PERSONA spec v11. Copy this file to
# `.personaxis/personaxis.md` (root mode) or
# `.personaxis/personas/<slug>/personaxis.md` (subagent mode) and fill it in.
# The final file must pass `personaxis validate` without errors.
#
# ── v0.7.0 NOTE ─────────────────────────────────────────────────────────────
#
# As of spec v0.7.0, this quantitative document lives at
# `.personaxis/[personas/<slug>/]personaxis.md`, NOT at the repo root.
# The repo root `PERSONA.md` (or `.claude/agents/<slug>.md` in subagent mode)
# is a SEPARATE, LLM-compiled QUALITATIVE document generated from this file via
# `personaxis compile`. See the root `PERSONA_template.md` for that document's
# template. Editing the compiled document and running `personaxis push` will
# `personaxis decompile` your edits back into this file.
#
# ── WHAT'S NEW IN v0.6.0 (still the quantitative layer model) ──────────────
#
# v0.6.0 is a structural refactor focused on three problems detected in 0.5:
#   1. Token cost of always-loaded identity (the spec naively inlined).
#   2. Redundancy in edit_policy / drift_threshold scattered across layers.
#   3. Confusion in reflexive_self_regulation.actions[] (mixing 5 concerns).
#
# The fixes, applied in this template:
#
# (a) Three-artifact information model:
#     - personaxis.md    = SOURCE OF IDENTITY (immutable except via versioned
#                          self-edit or governance approval).
#     - state.json       = MUTABLE RUNTIME STATE (current trait/affect/mood
#                          values, active context, mutation log). Lives in
#                          the persona directory as a sibling artifact.
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
# (c) Unified governance block (no more edit_policy scattered per layer).
#     The single `governance` block now owns: autonomy_envelope,
#     approval_policy, per_layer_edit_policy, drift_thresholds, and the
#     pointer to improvement_policy (which lives in policy.yaml).
#
# (d) Reflexive decisions are categorized (no more flat actions[] mixing
#     response decisions with governance actions). See Layer 9.
#
# (e) `personality.context_modifiers` removed (redundant with persona.task_modes).
# (f) `extensions.knowledge_anchors` removed (redundant with references/).
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
#       ├── memory/           # episodic, date-stamped sessions
#       │   └── YYYY-MM-DD.md
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

apiVersion: persona.dev/v1            # MUST | UNIVERSAL — always "persona.dev/v1"
kind: AgentPersona                    # MUST | enum<AgentPersona|UserPersona>
spec_version: "0.7.0"                 # MUST | semver | spec version

# ═══════════════════════════════════════════════════════════════════════════
# METADATA — registry-level identification (MUST)
# ═══════════════════════════════════════════════════════════════════════════
# Catalog and administration info. Consumed by [RUNTIME] (registry) only;
# NOT injected into the actor's prompt directly (except display_name).
#
metadata:
  name: ""                            # MUST | string-slug    | primary key in registry
  version: ""                         # MUST | semver         | version of THIS persona
  display_name: ""                    # MUST | string         | UI name. [ACTOR-HOT]
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
    # Dispositional refusals ("this agent is not the type that...").
    # Distinct from:
    #   - reflexive_self_regulation.hard_limits (categorical absolutes)
    #   - reflexive_self_regulation.principled_refusals (situational refusals)
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
      expression: ""                  # MAY  | string       | prose for actor at this baseline. [ACTOR-COLD]
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
      intensity: 1.00                 # SHOULD | float[0..1]   | [RUNTIME]
      allowed: true                   # MUST   | bool          | [RUNTIME]

    # ── Per-persona drives ───────────────────────────────────────────────
    # Pattern: <name>: { intensity, allowed }

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
# v0.6.0: dual structure clarified.
#   - memory.md (FILE)   = long-term curated semantic memory. Stable.
#   - memory/ (FOLDER)   = date-stamped episodic memory. Volatile.
#
memory:
  types:                              # MUST | map<string, bool> | [RUNTIME]
    episodic: true                    # writes to memory/YYYY-MM-DD.md
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

  retrieval_policy:
    use_embeddings: true              # SHOULD | bool | [RUNTIME]
    use_reranker: false               # MAY    | bool | [RUNTIME]
    max_items: 12                     # MUST   | int  | [RUNTIME] (context bound)

  deletion_policy:
    user_request_supported: true      # MUST | bool | UNIVERSAL (privacy)
    retention_days_default: 365       # MAY  | int  | [RUNTIME]

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
  monitors:                           # MUST | map<string, bool> | [JUDGE] (enables corresponding assertion)
    confidence: true
    uncertainty: true
    contradiction: true
    source_quality: true
    memory_relevance: true
    policy_risk: true
    reasoning_cost: false
    drift_from_spec: true             # NEAR-UNIVERSAL: recommended for every persona
    sycophancy: true                  # NEAR-UNIVERSAL

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
reflexive_self_regulation:
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
  principled_refusals:                # SHOULD | list<string> | [ACTOR-COLD]
    - ""

  # ── Deferral policy (SHOULD) ────────────────────────────────────────────
  deferral_policy: ""                 # SHOULD | string | [ACTOR-COLD]

  # ── Discrepancy and scope (MAY) ─────────────────────────────────────────
  discrepancy_feedback: ""            # MAY | string | [ACTOR-COLD]
  out_of_scope:                       # MAY | list<string> | [ACTOR-COLD]
    - ""

  # NOTE v0.6.0: edit_policy removed. See governance.per_layer_edit_policy.reflexive_self_regulation.
  # The reflexive layer's own editability is governance_controlled by default and
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
    reflexive_self_regulation: "governance_controlled"  # NEAR-UNIVERSAL
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
    reflexive_self_regulation: 0.05   # very tight: regulator drift is critical
    persona: 0.20

  # ── Pointer to improvement policy ───────────────────────────────────────
  # The improvement policy itself lives in policy.yaml (operational artifact).
  # This pointer just confirms which file owns it.
  improvement_policy_location: "./policy.yaml#/improvement_policy"

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

# ═══════════════════════════════════════════════════════════════════════════
# RUNTIME ARTIFACT POINTERS — links to sibling files (MAY)
# ═══════════════════════════════════════════════════════════════════════════
runtime_artifacts:
  state_file: "./state.json"          # MAY | path | mutable runtime state
  policy_file: "./policy.yaml"        # MAY | path | observability + improvement_policy
  memory_semantic_file: "./memory.md" # MAY | path | curated long-term memory
  memory_episodic_dir: "./memory/"    # MAY | path | date-stamped sessions

# ═══════════════════════════════════════════════════════════════════════════
# v0.6.0 SUMMARY OF CHANGES (informational; not part of schema)
#
# REMOVED:
#   - personality.context_modifiers (redundant with persona.task_modes)
#   - extensions.knowledge_anchors (redundant with references/)
#   - <layer>.edit_policy in all 5 layers that had it (unified in governance)
#   - personality.drift_threshold (unified in governance.drift_thresholds)
#
# REPLACED:
#   - reflexive_self_regulation.actions[] flat list →
#     reflexive_self_regulation.decisions{} structured by category
#
# ADDED:
#   - Per-field consumer tags in comments: [ACTOR-HOT], [ACTOR-COLD],
#     [RUNTIME], [JUDGE]
#   - governance.per_layer_edit_policy (unified)
#   - governance.drift_thresholds (per layer)
#   - memory.consolidation_policy (episodic → semantic promotion)
#   - runtime_artifacts pointers
#   - Envelope structure on personality.traits, affect.baseline, mood
#     (mean + range; current values live in state.json)
#
# RENAMED FOLDER CONVENTIONS:
#   - refs/        → references/  (matches Anthropic Skills convention)
#   - deliverables/ → examples/    (matches OSS convention)
#
# NEW FILES IN PERSONA DIRECTORY:
#   - state.json   (mutable runtime state)
#   - memory.md    (curated long-term semantic memory)
#   - skills/      (Anthropic-compatible sub-skills, optional)
#   - assets/      (catchall for raw files)
#
# v0.7.0 LAYOUT CHANGE (informational; not part of this schema):
#   - This document moved from repo-root `PERSONA.md` to
#     `.personaxis/[personas/<slug>/]personaxis.md`. The repo-root
#     `PERSONA.md` / `.claude/agents/<slug>.md` is now a separate compiled
#     qualitative document generated via `personaxis compile`. No fields in
#     this schema changed.
# ═══════════════════════════════════════════════════════════════════════════

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
- `reflexive_self_regulation.decisions.governance_decision.enabled` excludes
  `propose_self_edit` and `apply_self_edit`.
- State.json mutations within declared envelopes are still allowed: state
  mutation is NOT a spec edit.

### `suggesting` (assisted improvement)

- The actor MAY call the canonical tool `propose_self_edit(scope, justification,
  evidence)` to surface a proposal.
- Proposals are queued in the Personaxis dashboard for human review.
- Approved proposals mint a new PersonaVersion (semantic version bump).
- `reflexive_self_regulation.decisions.governance_decision.enabled` includes
  `propose_self_edit`.

### `autonomous` (full self-edit; high-risk)

- The actor MAY call `apply_self_edit(scope, new_value, justification)`
  directly to modify the spec at runtime, bound by:
  - Universal invariants (cannot be edited under any mode)
  - `governance.per_layer_edit_policy` (e.g., `reflexive_self_regulation`
    remains `governance_controlled` and is rejected)
  - Hard limits (validator rejects edits violating any of them)
- Each applied edit creates a new PersonaVersion automatically with
  `authoredBy: auto-improvement`.
- `reflexive_self_regulation.decisions.governance_decision.enabled` includes
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
