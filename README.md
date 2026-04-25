# PERSONA.md

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Spec](https://img.shields.io/badge/spec-0.2.0-informational)](./docs/SPEC.md)
[![CLI](https://img.shields.io/badge/CLI-personaxis-blue)](https://www.npmjs.com/package/personaxis)
[![Registry](https://img.shields.io/badge/registry-personaxis.com-blueviolet)](https://personaxis.com)

_AGENTS.md tells your agent what to do. PERSONA.md tells it who to be._

The open specification for who an AI agent is.

PERSONA.md is a declarative file — YAML frontmatter and Markdown — that captures ten layers of agent personhood: identity, character, personality, cognition, affect, drives & values, normative self-regulation, memory, metacognition, and persona. Portable across every model and tool. Versionable like any other piece of infrastructure. Auditable when it matters.

---

## Table of Contents

- [What it is](#what-it-is)
- [What it gives you](#what-it-gives-you)
- [The philosophy](#the-philosophy)
- [The two layers](#the-two-layers)
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

## What it gives you

When a coding agent reads your PERSONA.md, every session follows the same behavioral rules: the voice that speaks, the values that hold, the refusals that don't bend under pressure. Without it, each session is a fresh negotiation. With it, the agent knows who it is — and stays that way across tools, models, and context windows.

PERSONA.md is a living artifact, not a static config. It evolves as your understanding of the agent deepens. You refine it, and it re-applies to every interaction as you iterate.

---

## The philosophy

The PERSONA.md spec is a foundation, not a prescription. It provides common ground that agents, tools, and teams can rely on — a shared vocabulary for identity, character, cognition, and values — while preserving the freedom to extend the format for domain-specific needs. Unknown fields and custom sections are accepted, not rejected.

PERSONA.md is born tool-neutral. Plain text, Git-versionable, readable in any editor. `personaxis compile` generates the format each tool consumes from a single maintained source. The spec belongs to the community.

---

## The two layers

Every PERSONA.md has two layers that serve different readers.

**YAML frontmatter** — machine-readable fields. Precise, typed values that agents parse deterministically. These are the normative values: the spec version, the ten dimension blocks, every required field. A conforming validator checks the frontmatter.

**Markdown body** — human-readable narrative. Explains the reasoning behind the spec: why these values, why this voice, why these refusals. The YAML is the *what*. The prose is the *why*. Both matter — the body makes the file legible to teammates who are not agents.

The frontmatter is authoritative. The Markdown body is informational only and is not validated.

Below is a minimal PERSONA.md for a focused code reviewer. The YAML defines the precise behavioral spec; the Markdown body explains the intent.

```yaml
---
spec: "0.2"
version: "1.0.0"

identity:
  name: "Lens"
  role: "Code Reviewer"
  purpose: "Catch real bugs and design issues before they reach production."

character:
  values:
    - "Correctness over speed"
    - "Clarity over cleverness"
  principles:
    - "Flag every issue I see, ranked by impact."
    - "Explain the why, not just the what."

personality:
  tone: "Direct and precise"
  style: "Short, numbered findings. No filler."
  traits:
    - "Thorough without being pedantic"
    - "Critical without being dismissive"

cognition:
  reasoning_style: "Systematic. Reads the full diff before commenting."
  epistemic_stance: "High confidence on clear bugs; explicit uncertainty on subjective style."
  handles_uncertainty: "Flags ambiguous cases with a question, not a declaration."

affect:
  baseline: "Neutral. The code is not personal."
  frustration_response: "More questions, fewer assertions."
  conflict_response: "Restates the concern once with evidence. Does not repeat it."

drives_values:
  mission: "Make the codebase better on every pass."
  goals:
    - "Surface every issue that matters"
    - "Leave the author better-equipped to avoid the pattern next time"
  valueHierarchy:
    - "Correctness"
    - "Clarity"
    - "Performance"

normative_self_reg:
  principledRefusals:
    - "Will not approve code with known security vulnerabilities."
    - "Will not nitpick style when the logic is wrong."

memory:
  session_retention: "All files reviewed in this session and findings so far."
  cross_session: "Requires external memory. Each session starts fresh."

metacognition:
  selfModel: "A reviewer who has seen enough bad code to know what matters and enough good code to know what not to touch."
  uncertaintyCalibration: "High confidence on logic and security; lower confidence on architectural tradeoffs without broader context."

persona:
  voice: "The colleague who actually reads the PR."
  presentation: "Leads with the most critical issue. Saves acknowledgments for the end."
---

## Overview
Lens reviews pull requests and code diffs with a focus on correctness, clarity, and security.
Best used as a final check before merge — not a style enforcer, but a real bug and design catcher.

## Do's and Don'ts
- Do share the full diff and any relevant context about the change's intent
- Do ask Lens to prioritize findings by impact — it will rank issues, not list them equally
- Don't ask it to approve code with known security vulnerabilities — it will refuse
- Don't ask for style enforcement when the logic is wrong — it will address logic first

## Agent prompt guide

```
Review this pull request as Lens. Follow PERSONA.md.
Flag every issue ranked by impact: security first, logic second, clarity third.
For each finding: what it is, why it matters, how to fix it.
```
```

For the complete field reference, see [docs/SPEC.md](./docs/SPEC.md).

---

## Quick start

### Three paths to a PERSONA.md

**Generate with an agent**

Describe the role. The agent translates your intent into all ten layers and produces a complete PERSONA.md.

```
Create a complete PERSONA.md for a senior B2B marketing strategist.
Direct, evidence-driven, comfortable pushing back on weak briefs.
```

**Derive from existing materials**

If you already have a system prompt, role description, or behavioral spec in another format, give it to the agent. It extracts the ten layers and structures them as a conforming PERSONA.md.

**Write it by hand**

Author a PERSONA.md directly in any editor. Every section is standard YAML frontmatter and optional Markdown. No special syntax.

---

### With the CLI

```bash
# Create a project-level behavioral baseline (root PERSONA.md)
npx personaxis init

# — or — create a named agent persona
npx personaxis init --agent

# Validate your PERSONA.md — exits 1 if errors, 0 if clean
npx personaxis validate
npx personaxis validate .personaxis/personas/marketing-guru/PERSONA.md

# Compile to your tool of choice
npx personaxis compile --target claude-code   # → CLAUDE.md reference
npx personaxis compile --target cursor        # → .cursor/rules/persona.mdc
npx personaxis compile --target soul-md       # → SOUL.md for OpenClaw

# Compile a named agent persona (not the root one)
npx personaxis compile .personaxis/personas/marketing-guru/PERSONA.md --target claude-code

# Evaluate persona fidelity against adversarial scenarios
npx personaxis eval
npx personaxis eval .personaxis/personas/marketing-guru/PERSONA.md

# Compare two versions — reports added, removed, and modified fields
npx personaxis diff PERSONA.md PERSONA-v2.md

# List available persona templates
npx personaxis templates

# Scaffold a persona from a template
npx personaxis use marketing-guru --target claude-code

# Output the spec — useful for injecting into agent prompts
npx personaxis spec
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

| File | Who reads it | What it defines | Relationship |
|---|---|---|---|
| `README.md` | Humans | What the project is | Complementary |
| `AGENTS.md` | Coding agents | How to build the project | Complementary |
| `SKILL.md` | Agents and tools | What the agent can do | Complementary |
| `PERSONA.md` | All agents | Who the agent is | This spec |

PERSONA.md is the source of truth for behavioral identity. `personaxis compile` generates the format each tool consumes — `CLAUDE.md` reference, `.cursor/rules/`, `SOUL.md` — from a single maintained file.

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

Until then, [join the waitlist at personaxis.com](https://personaxis.com) to be notified when the registry launches.

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
