# PERSONA.md

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Spec](https://img.shields.io/badge/spec-0.2.0-informational)](./docs/SPEC.md)
[![CLI](https://img.shields.io/badge/CLI-personaxis-blue)](https://www.npmjs.com/package/personaxis)
[![Registry](https://img.shields.io/badge/registry-personaxis.com-blueviolet)](https://personaxis.com)

The open specification for who an AI agent is.

PERSONA.md is a declarative file — YAML frontmatter and Markdown — that captures ten layers of agent personhood: identity, character, personality, cognition, affect, drives & values, normative self-regulation, memory, metacognition, and persona. Portable across every model and tool. Versionable like any other piece of infrastructure. Auditable when it matters.

---

## Table of Contents

- [What it is](#what-it-is)
- [Quick start](#quick-start)
- [How PERSONA.md works](#how-personamd-works)
- [Package structure](#package-structure)
- [The ten layers](#the-ten-layers)
- [Relationship to existing standards](#relationship-to-existing-standards)
- [Spec](#spec)
- [Examples](#examples)
- [Registry](#registry)
- [Contributing](#contributing)
- [License](#license)

---

## What it is

Every AI agent in production runs on a behavioral specification. Most of that specification lives in a system prompt — incomplete, locked to one platform, invisible to compliance teams, and thin enough that agents drift under pressure.

PERSONA.md is the artifact that was missing. A single file that captures who an agent is completely enough to hold — across models, frameworks, conversations, and audits.

---

## Quick start

### With the CLI

```bash
# Create a project-level behavioral baseline (root PERSONA.md)
npx personaxis init

# — or — create a named agent persona
npx personaxis init --agent

# Validate your PERSONA.md
npx personaxis validate

# Compile to your tool of choice
npx personaxis compile --target claude-code   # → CLAUDE.md reference
npx personaxis compile --target cursor        # → .cursor/rules/persona.mdc
npx personaxis compile --target soul-md       # → SOUL.md for OpenClaw

# Compile a named agent persona (not the root one)
npx personaxis compile .personaxis/personas/marketing-guru/PERSONA.md --target claude-code
```

### Without the CLI — paste directly to your agent

Pick the prompt for your tool and paste it. Each prompt tells the agent to read the full setup guide and complete the setup automatically.

---

#### Claude Code

```
Read and follow every step in this setup guide:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/setup/claude-code.md
```

---

#### Cursor

```
Read and follow every step in this setup guide:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/setup/cursor.md
```

---

#### OpenClaw

```
Read and follow every step in this setup guide:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/setup/openclaw.md
```

---

## How PERSONA.md works

PERSONA.md operates at two levels within a project.

**Project level** — a `PERSONA.md` at the project root establishes a shared behavioral baseline for every agent in the project. The character the project embodies, the values none of its agents compromise, and the limits any agent here holds regardless of its specific role. This is to agents what `AGENTS.md` is to operations — a predictable place to find context about who to be in this project.

**Agent level** — individual personas live inside `.personaxis/personas/` and define the complete specification for a specific agent. They inherit the project baseline and extend it with everything specific to that role: the voice, the domain expertise, the goal structure, the principled refusals of someone doing that particular job.

---

## Package structure

A named agent persona is a directory, not a single file.

```
marketing-guru/
├── PERSONA.md       # The spec — ten dimensions of agent personhood
├── samples/         # Real outputs this persona produces
├── refs/            # Frameworks and reference materials it draws on
└── README.md        # Human-readable description and use cases
```

The full project structure looks like this:

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

---

## The ten layers

| Layer | Field | What it captures |
|---|---|---|
| 1 | `identity` | Name, role, purpose, self-concept |
| 2 | `character` | Values, principles, and moral commitments |
| 3 | `personality` | Observable style and temperament (HEXACO-6) |
| 4 | `cognition` | First-order reasoning style and epistemic stance |
| 5 | `affect` | Emotional tendencies and conflict response |
| 6 | `drives_values` | Mission, goals, and value hierarchy |
| 7 | `normative_self_reg` | Principled refusals and self-monitoring for drift |
| 8 | `memory` | Semantic, episodic, autobiographical — what persists |
| 9 | `metacognition` | Second-order self-model and meta-volitions |
| 10 | `persona` | How it presents itself to the world |

Each layer maps to a documented body of research in psychology, philosophy of mind, and ethics. See [docs/SPEC.md](./docs/SPEC.md) for the full field reference and academic grounding.

---

## Relationship to existing standards

PERSONA.md completes the triangle. It does not replace the standards you already use.

| File | What it covers | Relationship |
|---|---|---|
| `AGENTS.md` | What your agent does in the repo | Complementary |
| `SKILL.md` | What your agent can do | Complementary |
| `PERSONA.md` | Who your agent is | This spec |

PERSONA.md is the source of truth. `personaxis compile` generates the format each tool consumes — `CLAUDE.md` reference, `.cursor/rules/`, `SOUL.md` — from a single maintained file.

---

## Spec

See [docs/SPEC.md](./docs/SPEC.md) for the full normative specification: required fields, optional fields, allowed values, validation rules, and the complete example.

---

## Examples

See [examples/](./examples/) for complete, production-ready personas.

| Persona | Role | Status |
|---|---|---|
| [marketing-guru](./examples/marketing-guru/) | Full-stack marketing professional | Available |

More examples coming. To contribute one, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Registry

A public registry for discovering, publishing, and sharing personas is in development at [personaxis.com](https://personaxis.com).

When available:

```bash
personaxis pull personaxis/marketing-guru@1.0.0   # download a persona
personaxis push                                     # publish yours
```

Until then, share personas by publishing them to a public GitHub repository.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

If you are an AI agent working on this repository, read [AGENTS.md](./AGENTS.md) first — it covers what to update when making changes to the spec and what the project-level PERSONA.md at the root defines as the character of this project.

---

## Live example

This repository uses its own spec. [PERSONA.md](./PERSONA.md) at the root defines the shared behavioral baseline for any agent working on this project — the character, values, and constraints that should guide decisions about the spec itself.

---

## License

MIT. The specification belongs to the community. [Personaxis](https://personaxis.com) builds the tooling and platform around it.
