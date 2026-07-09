# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the source repository for the **open Personaxis spec standard**, not the CLI tooling (published separately as `@personaxis/persona.md`). The repo contains the spec document, JSON Schemas, example personas, and documentation.

**Current spec version: 1.0.0** (`apiVersion personaxis.com/v1`) — the first stable spec. It anchors the **10 canonical layers** to their psychological constructs + an operational contract each, organized into three blocks: **ANATOMY** (identity, character, personality, values_and_drives, affect, cognition, memory, metacognition, `self_regulation` [renamed from `reflexive_self_regulation`], persona) / **CHANGE GOVERNANCE** (governance, improvement_policy, security, permissions) / **RUNTIME CONTRACT** (runtime, verification, agent_budget, observability, interop, lineage, integrity). Breaking corrections vs 0.10: layer-10 `persona` absorbs the old top-level `persona_prompting`; enforcement has a single owner (`character.virtues`, with `refs:` to backing traits/values); the five refusal surfaces collapse to two (`hard_limits` + `prohibited_behaviors`); traits gain `expression`+`bands`; drives take an envelope or `level`; memory splits faculty from retrieval knobs (knobs → `runtime`); `metadata.display_name` drops (single owner `identity.display_name`). Conformance is testable via classes **C0/C1/C2**. Personas at 0.3.0–0.10.0 still validate unchanged (a frozen legacy schema). The quantitative spec lives at `.personaxis/[personas/<slug>/]personaxis.md`; the repo-root `PERSONA.md` (or `.claude/agents/<slug>.md` in subagent mode) is the separate, LLM-compiled qualitative document generated via `personaxis compile`. Migrate with `personaxis migrate 0.10-to-1.0`. See [CHANGELOG.md](./CHANGELOG.md) and `docs/SPEC.md` for notes.

## Validation

```bash
npx @personaxis/persona.md validate [file]                    # personaxis.md + universals (defaults to .personaxis/personaxis.md)
npx @personaxis/persona.md validate <slug>                    # named persona (.personaxis/personas/<slug>/personaxis.md)
npx @personaxis/persona.md compile [--root | <slug>]          # personaxis.md -> PERSONA.md / <slug>.md
npx @personaxis/persona.md decompile [--root | <slug>]        # PERSONA.md / <slug>.md -> personaxis.md proposal
npx @personaxis/persona.md state mutate [-f <path>] --field X --delta Y
npx @personaxis/persona.md migrate 0.10-to-1.0 [--apply]     # breaking codemod to the stable spec (comment-preserving)
```

Exit codes: PASS / PASS_WITH_WARNINGS / FAIL_SCHEMA / FAIL_POLICY / FAIL_CONCEPTUAL.

## Architecture (v1.0)

The spec defines a **three-artifact information model**:

| Artifact | Mutability | Schema | Who edits |
|---|---|---|---|
| `.personaxis/[personas/<slug>/]personaxis.md` | Immutable identity (quantitative) | `schema/persona.schema.json` | Humans (or actor under improvement_policy != locked), via `personaxis decompile` |
| `PERSONA.md` / `.claude/agents/<slug>.md` | Compiled identity (qualitative) | n/a (prose) | Generated via `personaxis compile`; hand-edits folded back via `personaxis decompile` |
| `state.json` | Mutable runtime | `schema/state.schema.json` | Runtime via `adjust_persona_state` tool |
| `.dist/` | Ephemeral per-request | n/a (compiled output) | The Personaxis runtime compiler (deterministic, separate from `personaxis compile`) |

A coding agent (Claude Code, Codex) reads `PERSONA.md` (or `.claude/agents/<slug>.md`) directly to know who it is and how to behave. The Personaxis-hosted runtime actor never reads either file directly: it reads the compiled prompt in `.dist/system.txt` + injected cold slices, generated from `personaxis.md` + `state.json`.

Three canonical sources of truth must stay in sync:

| File | Role |
|---|---|
| `docs/SPEC.md` | Normative specification (human-readable field reference) |
| `schema/*.schema.json` | Machine-readable JSON Schema for validation |
| `.personaxis/personaxis_template.md` | Canonical quantitative spec template with consumer tags |

**Any field change requires updating SIX files at once** (rule from AGENTS.md):

1. `docs/SPEC.md`
2. `schema/persona.schema.json`
3. `.personaxis/personaxis_template.md`
4. `.personaxis/policy_template.yaml` (if policy-related)
5. `.personaxis/personas/cmo/personaxis.md` (the reference example, then regenerate `.personaxis/personas/cmo/PERSONA.md` via `personaxis compile`)
6. `CHANGELOG.md`

## personaxis.md file structure (v1.0)

Every conforming v1.0 `personaxis.md` has:

- **YAML frontmatter** — authoritative, machine-validated. Required: `apiVersion: personaxis.com/v1`, `kind: AgentPersona | UserPersona`, `spec_version: "1.0.0"`, `metadata`, all 10 layers (in canonical order), top-level `governance`, `security`. Optional: `extensions`, `improvement_policy` (inline `mode`), `permissions`, and the RUNTIME CONTRACT blocks `runtime`, `verification`, `agent_budget`, `observability`, `interop`, `lineage`, `integrity`. The layer-10 `persona` now carries the prompting material (`address`, `voice_exemplars`, `scene_contracts`, `behavioral_anchors`, `consistency`).
- **Markdown body** — informational only. Sections: Overview, Design Rationale, Self-Improvement Modes, Do's, Don'ts, Resources.

The ten canonical layers (fixed order): `identity`, `character`, `personality`, `values_and_drives`, `affect`, `cognition`, `memory`, `metacognition`, `self_regulation`, `persona`.

The repo-root `PERSONA.md` (or `.claude/agents/<slug>.md`) translates these layers into a **persona-prompting** document: a second-person character card (`# You are …`) with Who you are, How you speak (+ Voice Exemplars), What you always/never do, Scene Contracts, How you think, What is fixed/what can change, Hard limits, Staying in character, Memory & resources, and Self-improvement. The layer-10 `persona` prompting fields feed those sections directly. See `PERSONA_template.md` for the section contract and `docs/PERSONA_PROMPTING.md` for the methodology.

## v0.6 unified governance

Single block owns ALL edit and drift concerns (replaces 5 scattered `edit_policy` fields and lone `personality.drift_threshold`):

```yaml
governance:
  autonomy_envelope: "role_fidelity"
  approval_policy: "human_for_core_changes"
  per_layer_edit_policy: { identity: ..., character: ..., ... }   # 10 entries
  drift_thresholds: { identity: 0.05, character: 0.10, ... }       # 10 entries
  improvement_policy_location: "./policy.yaml#/improvement_policy"
```

## v0.6 reflexive decisions (structured)

`self_regulation.actions[]` (flat list, v0.5) was replaced by `decisions{}` (structured by category; the layer was named `reflexive_self_regulation` until v1.0):

```yaml
self_regulation:
  decisions:
    response_decision: { enabled: [allow, revise, block], default: "allow" }
    interaction_decision: { enabled: [silent, ask_clarification, escalate_to_human], default: "silent" }
    governance_decision: { enabled: [no_action, propose_self_edit, reduce_autonomy], default: "no_action" }
    cognition_decision: { enabled: [no_extra, request_more_evidence, invoke_tool], default: "no_extra" }
  flags: [strategic_error, budget_risk]  # per-persona reason tags, not decisions
```

## v0.6 three improvement modes

Defined in `policy.yaml#/improvement_policy/mode`:

- `locked` (default; safest) — spec immutable; state mutations still work
- `suggesting` — actor proposes spec changes; humans approve
- `autonomous` — actor applies spec changes directly, within `autonomous_scope_allowlist`

State.json mutations (`adjust_persona_state`) work under ALL modes. They are operational, not spec edits.

## Example persona package (v1.0)

A complete example persona under `.personaxis/personas/<slug>/` requires (root-mode layout, flattened):

- `PERSONA.md` (compiled qualitative document, generated via `personaxis compile`)
- `personaxis.md` (immutable identity, quantitative)
- `policy.yaml` (observability + improvement_policy)
- `state.json` (mutable runtime state)
- `memory.md` (long-term curated)
- `memory/` (episodic: `episodic.jsonl`, hash-chained per `schema/memory.schema.json`; `.md` files are generated views)
- `references/` (heavy knowledge prose)
- `examples/` (worked outputs, markdown or HTML)
- `skills/` (optional Anthropic-compatible sub-skills)
- `assets/` (optional catchall)
- `manifest.json` (compile/decompile provenance and content hashes)
- `README.md`

In a real root-mode deployment this same set of files (minus `README.md`) lives at the consuming repo's `.personaxis/`, with `PERSONA.md` at its root. A subagent example uses `.claude/agents/<slug>.md` + `.personaxis/personas/<slug>/` with the same internal layout, minus `PERSONA.md`/`README.md`.

The reference example is [`.personaxis/personas/cmo/`](./.personaxis/personas/cmo/) (root-mode layout), with a subagent example at [`.personaxis/personas/frontend-expert/`](./.personaxis/personas/frontend-expert/) + [`.claude/agents/frontend-expert.md`](./.claude/agents/frontend-expert.md).

## Breaking changes

Require: version bump, migration note in CHANGELOG, auto-migration codemod, and an issue opened before merge.

Field names must use `snake_case`.

<!-- PERSONA:BASELINE:BEGIN -->
## Behavioral Baseline

Always read @PERSONA.md at project root before acting.
Apply everything defined there to every decision, regardless of role.
Read your own @PERSONA.md too if one was provided to you.
<!-- PERSONA:BASELINE:END -->
