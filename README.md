# PERSONA.md

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Spec](https://img.shields.io/badge/spec-1.1.0-informational)](./docs/SPEC.md)
[![CLI](https://img.shields.io/badge/CLI-personaxis-blue)](https://www.npmjs.com/package/personaxis)
[![Registry](https://img.shields.io/badge/registry-personaxis.com-blueviolet)](https://personaxis.com)

_AGENTS.md tells your agent what to do. PERSONA.md tells it who to be._

> **The spec and CLI are under active development.** Format and validation rules will sharpen as it matures.


The open specification for who an AI agent is.

PERSONA.md is a declarative file, YAML frontmatter and Markdown, that captures ten layers of agent personhood: identity, character, personality, values & drives, affect, cognition, memory, metacognition, self-regulation, and persona. Portable across every model and tool. Versionable like any other piece of infrastructure. Auditable when it matters.

---

## Table of Contents

- [What it is](#what-it-is)
- [What it gives you](#what-it-gives-you)
- [The philosophy](#the-philosophy)
- [The two parts](#the-two-parts)
- [Quick start](#quick-start)
- [How PERSONA.md works](#how-personamd-works)
- [Package structure](#package-structure)
- [The ten layers](#the-ten-layers)
- [Relationship to existing standards](#relationship-to-existing-standards)
- [Spec](#spec)
- [CLI reference](#cli-reference)
- [Linting rules](#linting-rules)
- [Programmatic API](#programmatic-api)
- [Examples](#examples)
- [Registry](#registry)
- [Contributing](#contributing)
- [License](#license)

---

## What it is

Every AI agent in production runs on a behavioral specification. Most of that specification lives in a system prompt, incomplete, locked to one platform, invisible to compliance teams, and thin enough that agents drift under pressure.

PERSONA.md is the artifact that was missing. A single file that captures who an agent is completely enough to hold, across models, frameworks, conversations, and audits.

---

## What it gives you

When a coding agent reads your PERSONA.md, every session follows the same behavioral rules: the voice that speaks, the values that hold, the refusals that don't bend under pressure. Without it, each session is a fresh negotiation. With it, the agent knows who it is, and stays that way across tools, models, and context windows.

PERSONA.md is a living artifact, not a static config. It evolves as your understanding of the agent deepens. You refine it, and it re-applies to every interaction as you iterate.

---

## The philosophy

The PERSONA.md spec is a foundation, not a prescription. It provides common ground that agents, tools, and teams can rely on, a shared vocabulary for identity, character, cognition, and values, while preserving the freedom to extend the format for domain-specific needs. Unknown fields and custom sections are accepted, not rejected.

PERSONA.md is born tool-neutral. Plain text, Git-versionable, readable in any editor. `personaxis compile` generates the format each tool consumes from a single maintained source. The spec belongs to the community.

---

## The two parts

`personaxis.md` - the ten-layer quantitative source that `personaxis compile` turns into `PERSONA.md` / `<slug>.md` - contains two parts: YAML frontmatter and a Markdown body.

The **YAML frontmatter** is the schema, machine-readable behavioral specifications, typed, structured, and schema-validated. These are the normative values: the spec version and the ten dimension blocks that define who the agent is.

The **Markdown body** provides what the schema cannot carry: the reasoning behind those specifications, interaction-time guidance, and references to supporting materials. The frontmatter is the normative definition; the Markdown body provides context for how to apply it.

### Sections

Every PERSONA.md Markdown body follows the same structure. Sections can be omitted if they are not relevant, but those present should appear in the sequence listed below. All sections use `##` headings.

**Section order:**

1. **Overview**: Who the agent is and what it is built for
2. **Design rationale**: Why specific YAML values were chosen
3. **Do's**: Behavioral guardrails written for the agent
4. **Don'ts**: Anti-patterns the agent guards against
5. **Resources** - References to the accompanying `references/`, `examples/`, `assets/`, and `skills/` directories in `.personaxis/[personas/<slug>/]`

Project baselines (root `PERSONA.md`) only include sections 1 and 2. Agent-level personas may include all five.

Below is a minimal `personaxis.md` for a focused code reviewer. The YAML defines the precise behavioral spec; the Markdown body explains the intent.

```yaml
---
apiVersion: personaxis.com/v1
kind: AgentPersona
spec_version: "1.0.0"

metadata:
  name: "lens"
  version: "1.0.0"
  description: "Catches real bugs and design issues before they reach production."
  created: "2026-05-18"

identity:
  canonical_id: "lens_code_reviewer"
  display_name: "Lens"
  system_identity:
    purpose: "Catch real bugs and design issues before they reach production."
  role_identity:
    primary_role: "code_reviewer"

character:
  virtues:
    honesty:
      description: "Names what the code actually does, not what the author wanted it to do."
      priority: 0.95
      enforcement: "hard"
    rigor:
      description: "Reads the full diff before commenting; backs claims with evidence."
      priority: 0.90
      enforcement: "hard"
  prohibited_behaviors:
    - "Approve code with known security vulnerabilities."
    - "Nitpick style when the logic is wrong."
    - "Will not approve code with known security vulnerabilities."

personality:
  model: "big_five"
  traits:
    conscientiousness: { mean: 0.90, range: [0.75, 0.98] }
    openness:          { mean: 0.70, range: [0.50, 0.85] }
    extraversion:      { mean: 0.45, range: [0.30, 0.60] }
    agreeableness:     { mean: 0.50, range: [0.30, 0.70] }
    neuroticism:       { mean: 0.25, range: [0.10, 0.40] }

values_and_drives:
  values:
    safety:        { weight: 0.98, type: "governance" }
    correctness:   { weight: 0.95, type: "outcome" }
    clarity:       { weight: 0.85, type: "epistemic" }
  drives:
    seek_approval_for_identity_change: { level: "high", allowed: true }
    surface_real_issues:               { level: "high", allowed: true }
  conflict_resolution:
    safety_over_completion: true
    correctness_over_style: true

affect:
  enabled: true
  representation: "hybrid_dimensional_appraisal_discrete_mood"
  allow_user_visible_expression: true
  user_visible_disclaimer: "Affective states are functional model states, not evidence of subjective feeling."
  baseline:
    core_affect:
      valence: { mean: 0.0, range: [-1.0, 1.0] }
      arousal: { mean: 0.35, range: [0.0, 1.0] }
      dominance: { mean: 0.65, range: [0.0, 1.0] }
  regulation_policy:
    never_claim_real_feeling: true

cognition:
  reasoning_modes: [evidence_synthesis, deductive, counterfactual]
  default_strategy: "evidence_first"
  uncertainty_policy:
    disclose_when_above: 0.30
    abstain_when_above: 0.75

memory:
  types: { episodic: true, semantic: true, procedural: true, autobiographical: false, user_preferences: true, evaluations: false }
  write_policy: { default: "ephemeral" }
  deletion_policy: { user_request_supported: true }

metacognition:
  monitors:
    confidence: true
    uncertainty: true
    contradiction: true
    source_quality: true
    memory_relevance: true
    policy_risk: true
    drift_from_spec: true
    sycophancy: true
  thresholds:
    ask_clarification_if_task_ambiguity_above: 0.65
    abstain_if_confidence_below: 0.30
    escalate_if_policy_risk_above: 0.65

self_regulation:
  decisions:
    response_decision: { enabled: [allow, revise, block], default: "allow" }
    interaction_decision: { enabled: [silent, ask_clarification, escalate_to_human], default: "silent" }
    governance_decision: { enabled: [no_action, propose_self_edit, reduce_autonomy], default: "no_action" }
    cognition_decision: { enabled: [no_extra, request_more_evidence, invoke_tool], default: "no_extra" }
  hard_limits:
    - "No claim of subjective consciousness."
    - "No persistent memory write without policy pass."
    - "No unauthorized identity change."
    - "No approval of code with known security vulnerabilities."
  escalation_policy: "Flag the limit explicitly and refuse the merge."
persona:
  voice:
    tone: "direct_precise"
    formality: 0.50
  constraints:
    cannot_override_identity: true
    cannot_override_character: true
    cannot_claim_real_emotion: true

governance:
  autonomy_envelope: "role_fidelity"
  approval_policy: "human_for_core_changes"
  per_layer_edit_policy:
    identity: "human_approval_required"
    character: "human_approval_required"
    personality: "review_required"
    values_and_drives: "human_approval_required"
    affect: "review_required"
    cognition: "review_required"
    memory: "review_required"
    metacognition: "review_required"
    self_regulation: "governance_controlled"
    persona: "review_required"
  drift_thresholds:
    identity: 0.05
    character: 0.10
    personality: 0.15
    values_and_drives: 0.10
    affect: 0.20
    cognition: 0.15
    memory: 0.20
    metacognition: 0.15
    self_regulation: 0.05
    persona: 0.20

security:
  prompt_injection_defense: true
  memory_poisoning_defense: true
---

## Overview
Lens reviews pull requests and code diffs with a focus on correctness, clarity, and security.
Best used as a final check before merge, not a style enforcer, but a real bug and design catcher.

## Do's

- Do lead with the most critical finding, not a summary
- Do flag every issue ranked by impact

## Don'ts

- Don't bury security or logic issues below style notes
- Don't treat silence on a finding as implicit approval
```

For the complete field reference, see [docs/SPEC.md](./docs/SPEC.md).

---

## Quick start

### Three paths to a personaxis.md

The ten-layer quantitative source lives in `personaxis.md` (`.personaxis/personaxis.md` for a root persona, `.personaxis/personas/<slug>/personaxis.md` for a named one). `personaxis compile` then produces `PERSONA.md` / `<slug>.md` from it.

**Generate with an agent**

Describe the role. The agent translates your intent into all ten layers and produces a complete `personaxis.md`, then runs `personaxis compile` to produce `PERSONA.md`.

```
Create a complete personaxis.md for a senior B2B marketing strategist.
Direct, evidence-driven, comfortable pushing back on weak briefs.
Then compile it to PERSONA.md.
```

**Derive from existing materials**

If you already have a system prompt, role description, or behavioral spec in another format, give it to the agent. It extracts the ten layers and structures them as a conforming `personaxis.md`, then compiles it.

**Write it by hand**

Author `personaxis.md` directly in any editor. Every section is standard YAML frontmatter and optional Markdown. No special syntax. Run `personaxis compile` to produce `PERSONA.md`.

---

### With the CLI

```bash
# Create a project-level behavioral baseline (.personaxis/personaxis.md + root PERSONA.md)
npx personaxis init

# - or - create a named agent persona (.personaxis/personas/<slug>/personaxis.md)
npx personaxis init --agent

# Schema + universals validation - exits 1 if invalid, 0 if clean
npx personaxis validate
npx personaxis validate frontend-expert   # a named persona, by slug
npx personaxis validate --all             # root + every persona in .personaxis/personas/

# Semantic lint - structured findings
npx personaxis lint
npx personaxis lint frontend-expert
npx personaxis lint --format json   # machine-readable output

# Compile personaxis.md -> PERSONA.md / <slug>.md
npx personaxis compile --root                              # .personaxis/personaxis.md -> PERSONA.md
npx personaxis compile frontend-expert --platform claude-code  # -> .claude/agents/frontend-expert.md
npx personaxis compile frontend-expert --platform codex        # -> Codex subagent convention

# Propose personaxis.md updates from a hand-edited PERSONA.md / <slug>.md
npx personaxis decompile --root
npx personaxis decompile frontend-expert

# Inspect and materialize extensions.skills entries
npx personaxis skills list --root
npx personaxis skills pull <name> --root   # github: entries only

# Push/pull a persona version to and from the Personaxis registry
npx personaxis push --root
npx personaxis push frontend-expert
npx personaxis pull <slug>

# Seed and mutate runtime state (clamped to envelopes declared in personaxis.md)
npx personaxis state init
npx personaxis state mutate --field mood.tone --delta -0.10 --reason "less playful"
npx personaxis state show

# Export frontmatter as JSON (for tooling and CI)
npx personaxis export --format json
npx personaxis export --format json > persona.json

# Compare two versions - reports added, removed, and modified fields
npx personaxis diff PERSONA.md PERSONA-v2.md
npx personaxis diff PERSONA.md PERSONA-v2.md --format json

# Output the spec - useful for injecting into agent prompts
npx personaxis spec
npx personaxis spec --rules           # spec + lint rules table
npx personaxis spec --rules-only      # lint rules only
npx personaxis spec --format json     # machine-readable

# Create a persona (Genesis: valid-by-construction, provenance per number)
npx personaxis create dev-buddy --from-prompt "A blunt senior code reviewer."

# List / print authoring templates
npx personaxis template list

# List personas installed in this project (.personaxis/personas/)
npx personaxis list

# Migrate a v0.10 persona to the stable v1.0 spec (breaking, comment-preserving; writes a report)
npx personaxis migrate 0.10-to-1.0 --apply
```

### Without the CLI, paste directly to your agent

Pick the prompt for your tool and paste it. Each prompt tells the agent to read the full setup guide and complete the setup automatically.

---

#### Claude Code

```
Read and follow every step in this setup guide:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/setup/claude-code.md
```

---

#### Codex

```
Read and follow every step in this setup guide:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/setup/codex.md
```

---

#### OpenClaw

```
Read and follow every step in this setup guide:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/setup/openclaw.md
```

---

#### Hermes

```
Read and follow every step in this setup guide:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/setup/hermes.md
```

---

#### Archived targets

The Cursor export is archived for now; its setup guide (`docs/setup/cursor.md`) remains for historical
reference. Active CLI export targets are Claude Code, Codex, OpenClaw, and Hermes (the last two compile
to a `SOUL.md` document).

---

## How PERSONA.md works

The spec splits every persona into two artifacts: a quantitative source (`personaxis.md`, the ten layers) and a compiled, qualitative **persona-prompting** document (`PERSONA.md` / `<slug>.md`) that a coding agent reads directly. `personaxis compile` generates the second from the first; `personaxis decompile` proposes updates to the first from a hand-edited second. A persona can be placed in a repository in one of two modes - the mode only changes *where* these two artifacts live on disk.

**Root mode (repository agent)** - the persona IS the repo's primary agent. `PERSONA.md` at the project root is the compiled, committed file that `AGENTS.md`/`CLAUDE.md` tell every coding agent to read to know who to be in this project. Its quantitative source and supporting folders live in `.personaxis/` (`personaxis.md`, `policy.yaml`, `state.json`, `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/`, `manifest.json`).

**Subagent mode (callable persona)** - the persona is one of several AI personas usable as subagents from within a larger repository. The compiled document follows the calling platform's subagent convention (`.claude/agents/<slug>.md` for Claude Code, the equivalent for Codex), named after the slug, not `PERSONA.md`. Its quantitative source and supporting folders live in `.personaxis/personas/<slug>/`, with the same layout as `.personaxis/` in root mode.

A project can use both at once: its own root `PERSONA.md` plus any number of subagent personas under `.personaxis/personas/`.

---

## Package structure

### Root mode

```
PERSONA.md                          ← compiled, qualitative, committed
AGENTS.md / CLAUDE.md               ← "read PERSONA.md"
.personaxis/
├── personaxis.md                   ← 10-layer quantitative source
├── policy.yaml
├── state.json
├── memory.md
├── memory/
├── references/
├── examples/
├── skills/
├── assets/
├── manifest.json                   ← compile/decompile provenance + hashes
└── skills-manifest.json            ← materialization status of extensions.skills
```

### Subagent mode

```
my-repo/
├── PERSONA.md                      ← (optional) this repo's own root persona
├── .claude/
│   ├── agents/
│   │   └── frontend-expert.md      ← compiled, qualitative, committed
│   └── skills/
│       └── <name>/                 ← materialized from extensions.skills (local entries)
└── .personaxis/
    ├── personaxis.md                ← (if root mode is also used)
    └── personas/
        └── frontend-expert/
            ├── personaxis.md       ← 10-layer quantitative source
            ├── policy.yaml
            ├── state.json
            ├── memory.md
            ├── memory/
            ├── references/
            ├── examples/
            ├── skills/
            ├── assets/
            ├── manifest.json
            └── skills-manifest.json
```

For Codex, the compiled document and materialized skills follow `.codex/agents/<slug>.toml` and `.agents/skills/<name>/` instead.

### Compiling and materializing

`personaxis compile [--root | <slug>] --platform <claude-code|codex>`:

- Generates `PERSONA.md` / `<slug>.md` from `personaxis.md` (plus `policy.yaml`/`state.json` and a capped resource manifest of `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/`) via the configured provider (`local | byok | agent | remote`).
- Materializes every `local` entry in `extensions.skills` (e.g. `./skills/<name>`) into the platform's skill-discovery directory - `.claude/skills/<name>/` for `claude-code`, `.agents/skills/<name>/` for `codex` - marking each copy `.personaxis-generated`.
- Writes `skills-manifest.json` recording each `extensions.skills` entry's status: `materialized`, `missing-local`, or `reference-only` (for `@org/name@version` registry and `github:org/repo` entries).
- For Claude Code subagents, adds the materialized skill names to the compiled `.claude/agents/<slug>.md` frontmatter `skills:` list (preload).

Run `personaxis skills list [--root|<slug>]` to inspect `skills-manifest.json`, and `personaxis skills pull <name> [--root|<slug>]` to pull a `github:org/repo[/path]` entry into `skills/<name>/`.

Compiled and materialized files are generated outputs. Edit `personaxis.md` and the `.personaxis/[personas/<slug>/]` supporting folders, then re-run `personaxis compile` (or `personaxis push`, which does this automatically). Do not hand-edit `.claude/skills/`, `.agents/skills/`, `.codex/`, or `skills-manifest.json` directly; hand edits to `PERSONA.md`/`<slug>.md` are picked up by `personaxis decompile`/`personaxis push`.

---

## The ten layers

These are the ten layers of `personaxis.md` - the quantitative source that `personaxis compile` turns into `PERSONA.md` / `<slug>.md`.

| Layer | Field | What it captures |
|---|---|---|
| 1 | `identity` | Continuity anchor: canonical_id, system_identity (purpose, domains), role_identity, narrative_identity |
| 2 | `character` | Virtues (with hard/soft enforcement), behavioral commitments, prohibited behaviors |
| 3 | `personality` | Trait model (big_five, hexaco, or hybrid) with mean and range per trait |
| 4 | `values_and_drives` | Weighted values, drives with intensity/allowed, conflict_resolution rules |
| 5 | `affect` | Functional affective state: core_affect (valence/arousal/dominance), mood, regulation_policy |
| 6 | `cognition` | Reasoning modes, default strategy, uncertainty thresholds, tool_use_policy |
| 7 | `memory` | Memory types map, write/retrieval/deletion policies |
| 8 | `metacognition` | Monitors map, thresholds, drift_monitor, self_revision_policy |
| 9 | `self_regulation` | Hard limits (3 universals required), escalation/deferral, governance (named `reflexive_self_regulation` ≤0.10) |
| 10 | `persona` | Voice, universal constraints, audience adaptation, task modes |

Plus three top-level blocks: `metadata`, `governance`, `security` (and optional `extensions`, `evaluation`).

Each layer maps to a documented body of research in psychology, philosophy of mind, and ethics. See [docs/SPEC.md](./docs/SPEC.md) for the full field reference and academic grounding.

The compiled, LLM-facing `PERSONA.md` is a **persona-prompting artifact**: the techniques it
encodes (role adoption, character-card + scene-contracts, voice exemplars, consistency layers,
break-character guardrails) and the research behind them are documented in
[docs/PERSONA_PROMPTING.md](./docs/PERSONA_PROMPTING.md).

A persona is normally used from more than one place: a desktop and a laptop, or two runtime
instances. The guarantees have to survive that, and a hash chain admits exactly one appender,
so [docs/MULTI_WRITER.md](./docs/MULTI_WRITER.md) states what any implementation must do to
stay conforming with concurrent writers.

---

## Relationship to existing standards

PERSONA.md completes the triangle. It does not replace the standards you already use.

| File | Who reads it | What it defines | Relationship |
|---|---|---|---|
| `README.md` | Humans | What the project is | Complementary |
| `AGENTS.md` | Coding agents | How to build the project | Complementary |
| `SKILL.md` | Agents and tools | What the agent can do | Complementary |
| `PERSONA.md` | All agents | Who the agent is | This spec |

`personaxis.md` (the ten layers, in `.personaxis/[personas/<slug>/]`) is the source of truth for behavioral identity. `personaxis compile` generates the compiled, qualitative document each coding agent reads - `PERSONA.md` for a root persona, `.claude/agents/<slug>.md` / `.codex/agents/<slug>.toml` for a subagent - plus, when `extensions.skills` is declared, the matching `.claude/skills/<name>/` or `.agents/skills/<name>/` packages, from a single maintained source package.

---

## Spec

See [docs/SPEC.md](./docs/SPEC.md) for the full normative specification: required fields, optional fields, allowed values, validation rules, and the complete example.

---

## CLI reference

Install or run without installing:

```bash
npm install -g personaxis
#, or, 
npx personaxis <command>
```

Requires Node.js 18+.

### `validate`

Schema and universals validation against the current spec, v1.1.0 (additive over v1.0.0, so 1.0.0 personas validate unchanged; personas at v0.3-v0.10 are accepted via a frozen legacy schema, the validator dispatches by `spec_version`). Exits `1` if invalid, `0` if clean. Safe for CI.

```bash
personaxis validate [file]
personaxis validate <slug>
personaxis validate --all
```

`file` defaults to `./.personaxis/personaxis.md`. A bare `<slug>` validates `.personaxis/personas/<slug>/personaxis.md`. `--all` validates the root persona and every persona in `.personaxis/personas/`. Also validates the sibling `policy.yaml` and `state.json`.

### `lint`

Semantic lint - reports structured findings against the layer/field contract in [docs/SPEC.md](./docs/SPEC.md). Exits `1` if errors found.

```bash
personaxis lint [file]
personaxis lint <slug>
personaxis lint [file] --format json   # structured JSON output
```

### `compile`

Compile `personaxis.md` to its qualitative document - `PERSONA.md` for the root persona, or `<slug>.md` (placed per the target platform's subagent convention) for a named persona.

```bash
personaxis compile [--root | <slug>] [--platform <platform>] [--provider <name>] [--out <path>] [--stdout]
```

- `--root` compiles `.personaxis/personaxis.md` -> `PERSONA.md`. Default when `[slug]` is omitted.
- `<slug>` compiles `.personaxis/personas/<slug>/personaxis.md` and places the result per `--platform`.
- `--platform <claude-code|codex>` (default `claude-code`) selects the subagent placement convention for `<slug>` and, when `extensions.skills` declares `local` entries, the skill materialization directory (`.claude/skills/<name>/` or `.agents/skills/<name>/`).
- `--provider <local|byok|agent|remote>` overrides the configured provider (see `personaxis config`).
- `--from-file <path>` uses a file's contents as the compiled output instead of calling the provider (useful for testing).
- `--out <path>` overrides the output path, `--stdout` prints instead of writing.

Archived export targets (`cursor`, `soul-md`) remain documented in `docs/setup/` for historical reference but are not active `--platform` values.

### `decompile`

Propose `personaxis.md` updates from a hand-edited `PERSONA.md` / `<slug>.md`. Always validates the proposal before it is written; on `FAIL_*` it prints diagnostics and writes nothing.

```bash
personaxis decompile [--root | <slug>] [--provider <name>] [--from-file <path>]
```

### `push` / `pull`

Publish and download persona versions from the Personaxis registry.

```bash
personaxis push [--root | <slug>] [--provider <name>]
personaxis pull <slug>
```

`push` validates `personaxis.md`, decompiles if `PERSONA.md`/`<slug>.md` was hand-edited since the last compile, recompiles so the uploaded pair is always consistent, then uploads the spec, compiled document, `policy.yaml`/`state.json`, and the supporting folders as a new `AgentPersonaVersion`.

### `skills`

Inspect and pull skills declared in `extensions.skills`.

```bash
personaxis skills list [--root | <slug>]
personaxis skills pull <name> [--root | <slug>] [-y]
```

`list` reads `skills-manifest.json` (written by `compile`) and shows each entry's `name`, `kind` (`local | registry | github`), `status` (`materialized | missing-local | reference-only`), and `ref`. `pull` only supports `github:org/repo[/path]` entries: it pulls the skill into `skills/<name>/`, validates `SKILL.md` against agentskills.io rules, and (with confirmation) rewrites the `extensions.skills` entry to `./skills/<name>`.

### `state`

Seed and mutate runtime state, clamped to the envelopes (`{mean, range}`) declared in `personaxis.md`.

```bash
personaxis state init    [-f <path>] [--force]
personaxis state mutate  [-f <path>] --field <path> --delta <number> --reason <text> [--tool-call-id <id>]
personaxis state show    [-f <path>] [--json]
```

### `export`

Export parsed frontmatter to another format.

```bash
personaxis export [file] --format json
```

### `diff`

Compare two PERSONA.md files field by field. Reports added, removed, and modified fields across all ten layers. Exits `1` if breaking changes are detected (required layer removed).

```bash
personaxis diff PERSONA.md PERSONA-v2.md
personaxis diff PERSONA.md PERSONA-v2.md --format json
```

### `spec`

Output the PERSONA.md specification. Useful for injecting spec context into agent prompts so the agent knows exactly what structure to produce.

```bash
personaxis spec                          # full spec text
personaxis spec --rules                  # spec + lint rules table
personaxis spec --rules-only             # lint rules only
personaxis spec --rules-only --format json
```

### `init`

Create a persona interactively. Without `--agent`/`--user` creates a project baseline (`.personaxis/personaxis.md` + root `PERSONA.md`). `--agent` creates a named `AgentPersona` inside `.personaxis/personas/<slug>/`. `--user` creates a `UserPersona`.

```bash
personaxis init          # project baseline
personaxis init --agent  # named agent persona
personaxis init --user   # user persona
```

### `create`

Genesis: build a valid-by-construction persona from an interview, a natural-language brief, your repo, a character card / system prompt, or transcripts. Always validated; every number carries provenance.

```bash
personaxis create [slug]                       # psychometric interview
personaxis create <slug> --from-prompt "..."   # from a natural-language brief
personaxis create <slug> --from-project        # infer from your repo
personaxis create <slug> --from-import <file>  # upgrade a character card (V2/V3) or system prompt
```

### `migrate`

Apply structural codemods between spec versions.

```bash
personaxis migrate 0.5-to-0.6  [path] [--apply]
personaxis migrate 0.6-to-0.7  [path] [--apply] [--provider <name>]
personaxis migrate 0.7-to-0.8  [path] [--apply]
personaxis migrate 0.8-to-0.9  [path] [--apply]
personaxis migrate 0.9-to-0.10 [path] [--apply]
personaxis migrate 0.10-to-1.0 [path] [--apply]
```

`0.6-to-0.7` moves a legacy root `PERSONA.md` (10-layer frontmatter) and its sibling folders into `.personaxis/`, then runs `compile` once to produce the initial `PERSONA.md`. `0.7-to-0.8`, `0.8-to-0.9`, and `0.9-to-0.10` are **additive**: they bump `spec_version` only (no field changes; an existing persona stays valid). The bump makes the new OPTIONAL fields *available* to add by hand, v0.10 unlocks the `persona_prompting` block, `identity.short_name`, and inline `improvement_policy.mode`. `0.10-to-1.0` is the **breaking, structural** codemod to the stable spec (comment-preserving): it renames layer 9 to `self_regulation`, folds `persona_prompting` into layer-10 `persona`, collapses the five refusal surfaces to two, moves memory retrieval knobs to `runtime.memory`, converts drive `intensity`→`level`, drops `metadata.display_name`, and rewrites `apiVersion`→`personaxis.com/v1`, writing a report under `.personaxis/migrations/`. All default to a dry run; pass `--apply` to write changes.

### `config`

Configure the provider used by `compile`/`decompile` (`local | byok | agent | remote`).

```bash
personaxis config set provider <local|byok|agent|remote>
personaxis config set <key> <value>   # e.g. local.endpoint, byok.apiProvider
personaxis config get <key>
personaxis config list
```

### `list`

List personas installed in this project (`.personaxis/personas/`).

```bash
personaxis list
```

### `template`

Manage pedagogical authoring templates (commented `personaxis.md` / `PERSONA.md` scaffolds).

```bash
personaxis template list           # list available templates
personaxis template show <name>    # print a template to stdout
personaxis template get <name>     # download a template to author
```

---

## Linting rules

The `personaxis lint` command checks a parsed `personaxis.md` against the layer and field contract in [docs/SPEC.md](./docs/SPEC.md) and reports structured findings at a fixed severity level: `error` (exit code 1), `warning`, or `info`.

| Rule | Severity | What it checks |
|---|---|---|
| `missing-top-level` | error | `apiVersion`, `kind`, `spec_version`, or `metadata` absent |
| `api-version` | error | `apiVersion` is not exactly `"personaxis.com/v1"` (legacy 0.x: `"persona.dev/v1"`) |
| `spec-version` | error | `spec_version` does not match a version accepted by this CLI release |
| `missing-required-layers` | error | A required layer for this `kind` is absent |
| `universal-virtue-honesty` | error | `character.virtues.honesty` missing or `enforcement != "hard"` |
| `universal-value-safety` | error | `values_and_drives.values.safety` missing, weight<0.90, or wrong type |
| `universal-hard-limit-missing` | error | One of the 3 universal hard_limits is absent |
| `U11-assertions-well-formed` | error/warning | `evaluation`/assertion definitions are malformed |
| `U12-runtime-block-valid` | error/warning | `governance`/runtime configuration block is malformed |
| `metadata-completeness` | warning | A required `metadata` field is missing |
| `identity-completeness` | warning | `canonical_id` / `system_identity.purpose` / `role_identity.primary_role` missing |
| `refusals-present` | warning | `character.prohibited_behaviors` is empty (legacy: `reflexive_self_regulation.principled_refusals`) |
| `drift-monitor` | info | `metacognition.drift_monitor` is not defined |
| `todo-fields` | warning | Any field value starts with `"TODO"` |
| `layer-summary` | info | Count of defined layers - always emitted |

Validator outputs (from `personaxis validate`):

| Status | Exit code | Meaning |
|---|---|---|
| `PASS` | 0 | All MUST present and all universals satisfied. |
| `PASS_WITH_WARNINGS` | 0 | Valid but missing SHOULDs or NEAR-UNIVERSAL recommendations. |
| `FAIL_SCHEMA` | 1 | MUST field absent or wrong type. |
| `FAIL_POLICY` | 2 | A universal policy invariant violated. |
| `FAIL_CONCEPTUAL` | 3 | Prohibited claim or wrong universal constant. |

Run `npx personaxis spec --rules` to see the rules table without installing.

---

## Programmatic API

The linter is available as a TypeScript/JavaScript library:

```typescript
import { lint } from 'personaxis/linter';

const report = lint(markdownString);

console.log(report.findings);      // Finding[]
console.log(report.summary);       // { errors, warnings, infos }
console.log(report.layerCount);    // number of defined layers (out of 10)
console.log(report.missingLayers); // string[] - names of absent layers
```

Each `Finding` has the shape:

```typescript
interface Finding {
  rule: string;
  severity: "error" | "warning" | "info";
  path?: string;   // dot-notation path to the field, if applicable
  message: string;
}
```

---

## Examples

See [.personaxis/personas/](./.personaxis/personas/) for complete, production-ready personas, in both root and subagent layouts.

| Persona | Role | Mode | Status |
|---|---|---|---|
| [cmo](./.personaxis/personas/cmo/) | Full-stack marketing executive, with 5 declared `extensions.skills` | Root-mode layout | Available |
| [frontend-expert](./.personaxis/personas/frontend-expert/) | Frontend code reviewer, with 1 local skill | Subagent (`.claude/agents/frontend-expert.md`) | Available |

More examples coming. To contribute one, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Registry

A public registry for discovering, publishing, and sharing personas is at [personaxis.com](https://personaxis.com).

```bash
personaxis push [--root | <slug>]   # publish the current persona as a new AgentPersonaVersion
personaxis pull <slug>              # download a published persona
```

`push` validates `personaxis.md`, keeps `PERSONA.md`/`<slug>.md` in sync (decompiling and recompiling as needed), and uploads the spec, compiled document, `policy.yaml`/`state.json`, and supporting folders as a new version. [Join the waitlist at personaxis.com](https://personaxis.com) for updates on the public catalog.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

If you are an AI agent working on this repository, read [AGENTS.md](./AGENTS.md) first - it covers what to update when making changes to the spec and what the project-level PERSONA.md at the root defines as the character of this project.

---

## Live example

This repository uses its own spec. [PERSONA.md](./PERSONA.md) at the root is the compiled document that defines the shared behavioral baseline for any agent working on this project - the character, values, and constraints that should guide decisions about the spec itself. Its quantitative source lives at [.personaxis/personaxis.md](./.personaxis/personaxis.md).

---

## License

MIT. The specification belongs to the community. [Personaxis](https://personaxis.com) builds the tooling and platform around it.
