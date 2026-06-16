# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the source repository for the **open Personaxis spec standard**, not the CLI tooling (published separately as `@personaxis/persona.md`). The repo contains the spec document, JSON Schemas, example personas, and documentation.

**Current spec version: 0.7.0** (Personaxis v12). v0.7.0 is a layout-only move (no field changes from v0.6.0): the quantitative 10-layer spec moved from repo-root `PERSONA.md` to `.personaxis/[personas/<slug>/]personaxis.md`, and the repo-root `PERSONA.md` (or `.claude/agents/<slug>.md` in subagent mode) is now a separate, LLM-compiled qualitative document generated via `personaxis compile`. See [CHANGELOG.md](./CHANGELOG.md) for migration notes.

## Validation

```bash
npx @personaxis/persona.md validate [file]                    # personaxis.md + universals (defaults to .personaxis/personaxis.md)
npx @personaxis/persona.md validate <slug>                    # named persona (.personaxis/personas/<slug>/personaxis.md)
npx @personaxis/persona.md compile [--root | <slug>]          # personaxis.md -> PERSONA.md / <slug>.md
npx @personaxis/persona.md decompile [--root | <slug>]        # PERSONA.md / <slug>.md -> personaxis.md proposal
npx @personaxis/persona.md state mutate [-f <path>] --field X --delta Y
npx @personaxis/persona.md migrate 0.6-to-0.7 [--apply]      # auto-migrate layout (layout-only)
```

Exit codes: PASS / PASS_WITH_WARNINGS / FAIL_SCHEMA / FAIL_POLICY / FAIL_CONCEPTUAL.

## Architecture (v0.7)

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

## personaxis.md file structure (v0.7)

Every conforming v0.7 `personaxis.md` has:

- **YAML frontmatter** — authoritative, machine-validated. Required: `apiVersion: persona.dev/v1`, `kind: AgentPersona | UserPersona`, `spec_version: "0.7.0"`, `metadata`, all 10 layers (in canonical order), top-level `governance`, `security`. Optional: `extensions`, `runtime_artifacts`.
- **Markdown body** — informational only. Sections: Overview, Design Rationale, Self-Improvement Modes, Do's, Don'ts, Resources.

The ten canonical layers (fixed order): `identity`, `character`, `personality`, `values_and_drives`, `affect`, `cognition`, `memory`, `metacognition`, `reflexive_self_regulation`, `persona`.

The repo-root `PERSONA.md` (or `.claude/agents/<slug>.md`) translates these layers into prose: see `PERSONA_template.md` for its section contract (Identity & Purpose, Character, Personality & Voice, Values, How You Think, Limits, Self-Improvement, Resources).

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

`reflexive_self_regulation.actions[]` (flat list, v0.5) was replaced by `decisions{}` (structured by category):

```yaml
reflexive_self_regulation:
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

## Example persona package (v0.7)

A complete example persona under `.personaxis/personas/<slug>/` requires (root-mode layout, flattened):

- `PERSONA.md` (compiled qualitative document, generated via `personaxis compile`)
- `personaxis.md` (immutable identity, quantitative)
- `policy.yaml` (observability + improvement_policy)
- `state.json` (mutable runtime state)
- `memory.md` (long-term curated)
- `memory/` (episodic, date-stamped)
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
