# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the source repository for the **PERSONA.md open specification** — not the CLI tooling (published separately as `@personaxis/persona.md`). The repo contains the spec document, JSON Schema, example personas, and documentation. There is no build system or test suite.

## Validation

```bash
# Validate a PERSONA.md against the schema
npx ajv-cli validate -s schema/persona.schema.json -d <path-to-PERSONA.md>

# Validate via the CLI (schema + semantic lint)
npx @personaxis/persona.md validate [file]
npx @personaxis/persona.md lint [file]
```

Run validation on any PERSONA.md you create or modify before committing.

## Architecture

The spec has two canonical sources of truth that must always stay in sync:

| File | Role |
|---|---|
| `docs/SPEC.md` | Normative specification — human-readable field reference |
| `schema/persona.schema.json` | Machine-readable JSON Schema for validation |

**Any field change requires updating all four files at once** (rule from AGENTS.md):
1. `docs/SPEC.md` — add to the relevant dimension table and update the complete example
2. `schema/persona.schema.json` — add with correct type, constraints, description
3. `examples/marketing-guru/PERSONA.md` — add a real, high-quality value
4. `CHANGELOG.md` — record under `[Unreleased]` or the current version

Failing to update all four is an incomplete change.

## PERSONA.md file structure

Every conforming PERSONA.md has:
- **YAML frontmatter** — authoritative, machine-validated. Must include `spec`, `version`, and all ten dimension blocks.
- **Markdown body** — informational only, not validated. For agent personas: Overview → Design rationale → Do's and Don'ts. For project baselines (root `PERSONA.md`): Overview and Design rationale only.

The ten required YAML layers: `identity`, `character`, `personality`, `cognition`, `affect`, `drives_values`, `normative_self_reg`, `memory`, `metacognition`, `persona`.

## Example persona package structure

A complete example persona under `examples/` requires:
- `PERSONA.md` — full spec, all required fields, passes schema validation
- `README.md` — what the persona does, when to use/not use it
- `samples/` — at least one real output this persona produces
- `refs/` — at least one reference framework it draws on

## Breaking changes

A breaking change (removing a required field, changing a field type, removing an allowed enum value) requires:
1. A version bump in `docs/SPEC.md` header
2. A migration note in `CHANGELOG.md`
3. An issue opened before the change is merged — do not merge unilaterally

Field names must use `snake_case`.

<!-- PERSONA:BASELINE:BEGIN -->
## Behavioral Baseline

Always read @PERSONA.md at project root before acting.
Apply everything defined there to every decision, regardless of role.
Read your own @PERSONA.md too if one was provided to you.
<!-- PERSONA:BASELINE:END -->
