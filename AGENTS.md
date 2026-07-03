# AGENTS.md

Instructions for AI agents working on the PERSONA.md / personaxis.md specification repository.

## What this repo is

This is the source repository for the open Personaxis spec standard - a declarative format that defines who an AI agent is.

**AI Persona vs the spec files:** An AI Persona is the concept - the application of human personhood frameworks (identity, character, cognition, etc.) to an AI agent. The spec is the implementation, split across two artifacts (see `.personaxis/personaxis_template.md` and `PERSONA_template.md`):

- **`.personaxis/[personas/<slug>/]personaxis.md`** - the committed, quantitative 10-layer spec (the source of identity).
- **`PERSONA.md`** (repo root, root mode) or **`.claude/agents/<slug>.md`** (subagent mode) - the committed, LLM-compiled qualitative document a coding agent reads to know who it is and how to behave. Generated from `personaxis.md` via `personaxis compile`; hand-edits flow back via `personaxis decompile`.

**Current spec version: 0.10.0** (Personaxis v15). v0.10.0 is additive on v0.9.0 (v0.9 personas validate unchanged): new OPTIONAL fields make the compiled `PERSONA.md` a persona-prompting artifact — `identity.short_name`, inline `improvement_policy.mode`, and a `persona_prompting` block (`address`, `voice_exemplars`, `scene_contracts`, `behavioral_anchors`, `break_character_guardrails`, `consistency`). The quantitative spec lives at `.personaxis/personaxis.md`; the repo-root `PERSONA.md` is the compiled qualitative document. Migrate with `personaxis migrate 0.9-to-0.10`. See [CHANGELOG.md](./CHANGELOG.md) for migration notes.

## File ownership

| File / folder | What it is | When to touch it |
|---|---|---|
| `docs/SPEC.md` | Normative specification for `personaxis.md` | Every field change |
| `schema/persona.schema.json` | JSON Schema for `personaxis.md` | Every field change |
| `schema/policy.schema.json` | JSON Schema for `policy.yaml` | Every policy field change |
| `schema/state.schema.json` | JSON Schema for `state.json` (v0.6+) | Every state shape change |
| `.personaxis/personaxis_template.md` | Canonical quantitative spec template for authors | Every field change |
| `.personaxis/policy_template.yaml` | Canonical policy template | Every policy field change |
| `PERSONA_template.md` (root) | Canonical compiled-document template | When the compiled-document section contract changes |
| `.personaxis/personaxis.md` | This repo's own quantitative spec (persona-md-maintainer) | Rarely - only if project values change |
| `PERSONA.md` (root) | This repo's own compiled behavioral baseline | Rarely - regenerate via `personaxis compile` after `.personaxis/personaxis.md` changes |
| `.personaxis/personas/` | Complete example personas (root mode + subagent mode) | When adding or updating examples |
| `CHANGELOG.md` | Version history | Every change |
| `CONTRIBUTING.md` | Contribution guidelines | When governance changes |
| `README.md` | Entry point for humans | When structure or workflow changes |

## Rules for adding or changing a field

When adding a new field or modifying an existing one, always update ALL six of these - never just one:

1. **`docs/SPEC.md`** - add the field to the relevant layer table (type, MUST/SHOULD/MAY, universal status, notes)
2. **`schema/persona.schema.json`** - add the field with correct type, constraints, and description
3. **`.personaxis/personaxis_template.md`** - add the field with its tier comment (`MUST` / `SHOULD` / `MAY`) AND its consumer tag (`[ACTOR-HOT]` / `[ACTOR-COLD]` / `[RUNTIME]` / `[JUDGE]`)
4. **`.personaxis/policy_template.yaml`** (if policy-related)
5. **`.personaxis/personas/cmo/personaxis.md`** - add a real, high-quality value for the field, then regenerate `.personaxis/personas/cmo/PERSONA.md` via `personaxis compile`
6. **`CHANGELOG.md`** - record the change under `[Unreleased]` or the current version

If any of the six is missing, the change is incomplete.

The current spec version is **0.10.0** (Personaxis v15). Because v0.8–v0.10 are additive, the schema
`$id`s are only bumped when a schema actually changes, so they trail `spec_version`. Current `$id`s
under `schema/`:

- `persona.schema.json` with `$id: https://personaxis.com/schemas/persona/0.9/persona.schema.json`
- `policy.schema.json` with `$id: https://personaxis.com/schemas/persona/0.8/policy.schema.json`
- `state.schema.json` with `$id: https://personaxis.com/schemas/state/0.9/state.schema.json`

## Rules for adding a new example persona (v0.10+)

A new example persona is a directory under `.personaxis/personas/<slug>/`. In root mode (a persona meant to be deployed as a repository agent), it must contain:

- `PERSONA.md` - compiled qualitative document, generated via `personaxis compile`
- `personaxis.md` - complete, validated against the schema, every required field filled with real content
- `policy.yaml` - observability + improvement_policy mode
- `state.json` - initial mutable state (current values seeded from `personaxis.md` envelope means)
- `memory.md` - long-term curated memory (can be skeleton with stable principles)
- `memory/` - episodic memory directory: `episodic.jsonl` (append-only, hash-chained — normative format in `schema/memory.schema.json`; can be empty initially). Date-stamped `.md` files are generated views, not sources.
- `references/` - heavy framework prose (at least one file)
- `examples/` - worked outputs (markdown samples or HTML deliverables)
- `skills/` - Anthropic-compatible sub-skills (optional)
- `assets/` - catchall (optional, can be empty)
- `manifest.json` - compile/decompile provenance and content hashes
- `README.md` - what the persona does, when to use it, when not to

A subagent example provides the same layout minus `PERSONA.md`/`README.md`, plus a compiled document at `.claude/agents/<slug>.md` (Claude Code) or the equivalent platform convention.

In a real root-mode deployment, this same set of files (minus `README.md`) lives at the consuming repo's `.personaxis/`, with `PERSONA.md` at its root.

Validate `personaxis.md` against `schema/persona.schema.json` and `state.json` against `schema/state.schema.json` before considering the example done.

## v0.6 field consumer tags

Every field MUST be tagged with its runtime consumer in `PERSONA_template.md` comments:

| Tag | Consumer | Compiled into |
|---|---|---|
| `[ACTOR-HOT]` | LLM actor (always) | `.dist/system.txt` |
| `[ACTOR-COLD]` | LLM actor (conditional) | `.dist/actor.slices/<key>.md` |
| `[RUNTIME]` | Orchestrator | `.dist/runtime.config.json` |
| `[JUDGE]` | Evaluator/judge worker | `.dist/judge.config.json` |

A field without a consumer tag is incomplete.

## Rules for breaking changes

A breaking change is: removing a required field, changing a field's type, removing an allowed enum value, or removing a sibling artifact (e.g., removing `state.json`).

Breaking changes require:

1. A version bump in `docs/SPEC.md` header AND `.personaxis/personaxis_template.md` `spec_version`
2. A migration note in `CHANGELOG.md` with the `personaxis migrate X-to-Y` command
3. An auto-migration codemod in the CLI (if structural change)
4. An issue opened before the change is merged (do not merge breaking changes unilaterally)

## Validation

Use the official CLI:

```bash
npx @personaxis/persona.md validate <path-to-personaxis.md>
npx @personaxis/persona.md compile <path-to-personaxis.md>      # personaxis.md -> PERSONA.md / <slug>.md
npx @personaxis/persona.md decompile <path-to-PERSONA.md>       # PERSONA.md / <slug>.md -> personaxis.md proposal
npx @personaxis/persona.md state mutate <path-to-state.json> --field X --delta Y
```

Exit codes:

| Status | Exit code | Meaning |
|---|---|---|
| `PASS` | 0 | All MUST present and all universals satisfied. |
| `PASS_WITH_WARNINGS` | 0 | Missing SHOULDs or NEAR-UNIVERSAL recommendations. |
| `FAIL_SCHEMA` | 1 | MUST field absent or wrong type. |
| `FAIL_POLICY` | 2 | A universal policy invariant violated. |
| `FAIL_CONCEPTUAL` | 3 | Prohibited claim or wrong universal constant. |

## What not to do

- Do not add fields to the spec without a concrete use case
- Do not make required fields optional or optional fields required without a version bump
- Do not modify `schema/*.schema.json` without also updating `docs/SPEC.md`, and vice versa
- Do not commit example personas that do not pass schema validation
- Do not introduce per-layer governance fields (use `governance.per_layer_edit_policy` and `governance.drift_thresholds` — v0.6 unification)
- Do not add flat enum action lists (use structured `decisions{}` like `reflexive_self_regulation.decisions` in v0.6)
- Do not require numerical scalars to be in the actor's prompt; the compiler translates them to prose via behavior maps


<!-- PERSONA:BASELINE:BEGIN -->
## Behavioral Baseline

Always read @PERSONA.md at project root before acting.
Apply everything defined there to every decision, regardless of role.
Read your own @PERSONA.md too if one was provided to you.
<!-- PERSONA:BASELINE:END -->s