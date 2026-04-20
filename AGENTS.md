# AGENTS.md

Instructions for AI agents working on the PERSONA.md specification repository.

## What this repo is

This is the source repository for the PERSONA.md open specification — a declarative format that defines who an AI agent is. It is not a product codebase. There are no builds, no tests to run, and no deployments. Work here is documentation, schema, and examples.

## File ownership

| File / folder | What it is | When to touch it |
|---|---|---|
| `docs/SPEC.md` | Normative specification | Every field change |
| `schema/persona.schema.json` | JSON Schema for validation | Every field change |
| `PERSONA.md` (root) | Project-level behavioral baseline | Rarely — only if project values change |
| `examples/` | Complete example personas | When adding or updating examples |
| `CHANGELOG.md` | Version history | Every change |
| `CONTRIBUTING.md` | Contribution guidelines | When governance changes |
| `README.md` | Entry point for humans | When structure or workflow changes |

## Rules for adding or changing a field

When adding a new field or modifying an existing one, always update all four of these — never just one:

1. **`docs/SPEC.md`** — add the field to the relevant dimension table (type, required/optional, description) and update the complete example at the bottom
2. **`schema/persona.schema.json`** — add the field with correct type, constraints, and description
3. **`examples/marketing-specialist/PERSONA.md`** — add a real, high-quality value for the field
4. **`CHANGELOG.md`** — record the change under `[Unreleased]` or the current version

If any of the four is missing, the change is incomplete.

## Rules for adding a new example persona

A new example persona is a directory under `examples/`. It must contain:
- `PERSONA.md` — complete, validated against the schema, every required field filled with real content
- `README.md` — what the persona does, when to use it, when not to
- At least one file in `samples/` — a real output this persona would produce
- At least one file in `refs/` — a framework or reference material it draws on

Validate the PERSONA.md against `schema/persona.schema.json` before considering the example done.

## Rules for breaking changes

A breaking change is: removing a required field, changing a field's type, removing an allowed enum value.

Breaking changes require:
1. A version bump in `docs/SPEC.md` header
2. A migration note in `CHANGELOG.md`
3. An issue opened before the change is merged (do not merge breaking changes unilaterally)

## Validation

To validate a PERSONA.md file against the schema:

```bash
npx ajv-cli validate -s schema/persona.schema.json -d <path-to-PERSONA.md>
```

Run this on any PERSONA.md you create or modify before committing.

## What not to do

- Do not add fields to the spec without a concrete use case
- Do not make required fields optional or optional fields required without a version bump
- Do not modify `schema/persona.schema.json` without also updating `docs/SPEC.md`, and vice versa
- Do not commit example personas that do not pass schema validation
