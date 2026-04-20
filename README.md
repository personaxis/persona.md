# PERSONA.md

PERSONA.md is a declarative specification — YAML frontmatter and Markdown — that defines who an AI agent is across nine dimensions: identity, character, personality, cognition, affect, drives, constraints, memory, and persona.

The nine dimensions are borrowed from the frameworks that psychology, philosophy, and ethics have developed to describe what makes a human being coherent and consistent over time — not to claim that AI agents have personhood, but because those frameworks are the best available map of what holds an entity together. PERSONA.md applies that structure to AI agents.

It is the source of truth for an agent's behavioral identity. Portable across every model and tool. Versionable like any other piece of infrastructure. Auditable when it matters.

## Why it exists

Every AI agent in production runs on a behavioral specification. Until now, that specification lived inside system prompts — unversioned, locked to one platform, invisible to compliance teams, and thin enough that agents drift under pressure.

PERSONA.md is the artifact that was missing. A single file that captures who an agent is completely enough to hold.

## Using the spec today

1. Copy the structure from any persona in [`examples/`](./examples/)
2. Validate your file against [`schema/persona.schema.json`](./schema/persona.schema.json) using any JSON Schema validator (e.g. [ajv-cli](https://github.com/ajv-validator/ajv-cli))
3. Drop the result into your agent's system prompt or configuration file

## Package structure

A persona is a directory, not a single file.

```
marketing-specialist/
├── PERSONA.md       # The spec — nine dimensions of identity
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
    ├── marketing-specialist/
    │   ├── PERSONA.md              ← full spec for this agent
    │   └── ...
    ├── legal-reviewer/
    │   ├── PERSONA.md
    │   └── ...
    └── onboarding-guide/
        ├── PERSONA.md
        └── ...
```


## The nine layers

| Layer | What it captures |
|---|---|
| `identity` | Who the agent is: name, role, purpose, self-concept |
| `character` | Values, principles, and the moral commitments it holds |
| `personality` | Observable style and temperament |
| `cognition` | How it reasons and handles uncertainty |
| `affect` | Emotional tendencies and conflict response |
| `drives` | Mission, goals, and underlying motivations |
| `constraints` | Hard limits and what it will not do under any pressure |
| `memory` | What persists across sessions and how |
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

## Live example

This repository uses its own spec. [PERSONA.md](./PERSONA.md) at the root defines the shared behavioral baseline for any agent working on this project — the character, values, and constraints that should guide decisions about the spec itself.

## Examples

See [examples/](./examples/) for complete, production-ready personas.

## Registry

Discover and share personas at [personaxis.com](https://personaxis.com).

## License

MIT. The specification belongs to the community. Personaxis builds the tooling and platform around it.
