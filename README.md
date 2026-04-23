# PERSONA.md

PERSONA.md is a declarative specification — YAML frontmatter and Markdown — that defines who an AI agent is across ten dimensions: identity, character, personality, cognition, affect, drives_values, normative_self_reg, memory, metacognition, and persona.

The ten dimensions are borrowed from the frameworks that psychology, philosophy, and ethics have developed to describe what makes a human being coherent and consistent over time — not to claim that AI agents have personhood, but because those frameworks are the best available map of what holds an entity together. PERSONA.md applies that structure to AI agents.

It is the source of truth for an agent's behavioral identity. Portable across every model and tool. Versionable like any other piece of infrastructure. Auditable when it matters.

## Why it exists

Every AI agent in production runs on a behavioral specification. Until now, that specification lived inside system prompts — unversioned, locked to one platform, invisible to compliance teams, and thin enough that agents drift under pressure.

PERSONA.md is the artifact that was missing. A single file that captures who an agent is completely enough to hold.

## Quick start

### With the CLI

```bash
# 1. Create a project-level behavioral baseline (root PERSONA.md)
npx personaxis init

# 2. Edit PERSONA.md — fill in the TODO fields to match your project
#    Or paste the prompt below into Claude Code / Cursor to have it fill it in automatically

# 3. Add the baseline reference to CLAUDE.md (or let the CLI do it)
npx personaxis compile --target claude-code

# 4. Add a named agent persona for a specific role
npx personaxis init --agent
```

### Without the CLI — paste to your agent

Drop this into Claude Code, Cursor, or any agent to bootstrap the full setup:

```
Read the PERSONA.md spec at https://raw.githubusercontent.com/personaxis/persona.md/main/docs/SPEC.md.

Do the following:

1. Create PERSONA.md at the project root. This is the project-level behavioral baseline —
   not a role, but the shared character, values, and limits for every agent working here.
   Fill it based on what you know about this project. Use the ten-layer structure from the spec.
   Reference: https://raw.githubusercontent.com/personaxis/persona.md/main/PERSONA.md

2. Add this section to CLAUDE.md (create it if it does not exist):

<!-- PERSONAXIS:BASELINE:BEGIN -->
## Behavioral Baseline

This project has a shared behavioral baseline defined in @PERSONA.md.
Read it before acting. The character, values, and limits defined there
apply to every agent working in this project, regardless of role.
<!-- PERSONAXIS:BASELINE:END -->

3. If a named agent persona is needed, create .personaxis/personas/<name>/PERSONA.md
   using https://raw.githubusercontent.com/personaxis/persona.md/main/examples/marketing-guru/PERSONA.md
   as a reference for depth and format.

Validate all PERSONA.md files against:
https://raw.githubusercontent.com/personaxis/persona.md/main/schema/persona.schema.json
```

**For Cursor** — add this to `.cursor/rules/persona.mdc`:

```
---
description: Project behavioral baseline
alwaysApply: true
---

This project has a shared behavioral baseline in PERSONA.md at the project root.
Read it before acting. Apply the character, values, and limits defined there
to every response in this project.
```

**For OpenClaw** — run `npx personaxis compile --target soul-md` to generate `SOUL.md` from your root PERSONA.md.

## Package structure

A persona is a directory, not a single file.

```
marketing-guru/
├── PERSONA.md       # The spec — ten dimensions of identity
├── samples/         # Real outputs this persona produces
├── refs/            # Frameworks and reference materials it draws on
└── README.md        # Human-readable description and use cases
```

PERSONA.md works at two levels.

**Project level** — a `PERSONA.md` at the project root gives every agent working in the project a shared behavioral baseline: the limits none of them cross, the character the project embodies, and the set of traits any agent here holds regardless of its specific role. This is for agents what `AGENTS.md` is for operations — a predictable place to find context about who to be in this project.

**Agent level** — individual personas live inside `.personaxis/personas/` and define the complete specification for a specific agent. They inherit the project baseline and extend it with everything specific to that role.

```
PERSONA.md                          ← project-wide behavioral baseline
.personaxis/
└── personas/
    ├── marketing-guru/
    │   ├── PERSONA.md              ← full spec for this agent
    │   └── ...
    ├── legal-reviewer/
    │   ├── PERSONA.md
    │   └── ...
    └── onboarding-guide/
        ├── PERSONA.md
        └── ...
```


## The ten layers

| Layer | What it captures |
|---|---|
| `identity` | Who the agent is: name, role, purpose, self-concept |
| `character` | Values, principles, and the moral commitments it holds |
| `personality` | Observable style and temperament (HEXACO-6) |
| `cognition` | First-order reasoning style and epistemic stance |
| `affect` | Emotional tendencies and conflict response |
| `drives_values` | Mission, goals, and the value hierarchy that resolves conflicts |
| `normative_self_reg` | Internalized principled refusals and self-monitoring for drift |
| `memory` | What persists across sessions: semantic, episodic, autobiographical |
| `metacognition` | Second-order self-model and meta-volitions |
| `persona` | How it presents itself to the world |

## Relationship to existing standards

PERSONA.md completes the triangle. It does not replace the standards you already use.

| File | What it covers |
|---|---|
| `AGENTS.md` | What your agent does in the repo |
| `SKILL.md` | What your agent can do |
| `PERSONA.md` | Who your agent is |

## Spec

See [docs/SPEC.md](./docs/SPEC.md) for the full normative specification and field reference.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines. If you are an AI agent working on this repository, read [AGENTS.md](./AGENTS.md) first — it covers what to update when making changes to the spec.

## Live example

This repository uses its own spec. [PERSONA.md](./PERSONA.md) at the root defines the shared behavioral baseline for any agent working on this project — the character, values, and constraints that should guide decisions about the spec itself.

## Examples

See [examples/](./examples/) for complete, production-ready personas.

## Registry

A public registry for discovering, publishing, and sharing personas is in development at [personaxis.com](https://personaxis.com). Until then, share personas by publishing them to a public GitHub repository.

## License

MIT. The specification belongs to the community. Personaxis builds the tooling and platform around it.
