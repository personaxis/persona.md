# PERSONA.md

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Spec](https://img.shields.io/badge/spec-1.1.0-informational)](./docs/SPEC.md)
[![CLI](https://img.shields.io/badge/CLI-personaxis-blue)](https://www.npmjs.com/package/personaxis)

An open file format for a complete way of working.

A persona describes how a professional does a job: the procedures it follows, the criteria it judges its own work by, the tools it uses, the knowledge it relies on with the source of each piece, and what it has learned from doing the work. Any agent that loads the file does the job the same way, on any model.

A persona is a directory. `personaxis.md` is YAML frontmatter and Markdown, checked against a JSON Schema. `skills/` holds the procedures, `references/` the sourced knowledge, `examples/` worked outputs, and `memory.md` and `memory/` what it learned. The compiled document your agent reads is `PERSONA.md`, `.claude/agents/<slug>.md`, `.codex/agents/<slug>.toml` or `SOUL.md`. `personaxis validate` checks the source and `personaxis compile` produces the document.

How much a persona improves a given model is a measurement, not a property of the file. This repository defines the format and states no measured gain.

The behavioral layers (identity, character, personality, values and drives, affect, cognition, memory, metacognition, self-regulation and persona) stay in the schema as the part that structures and bounds how the persona behaves. See [docs/SPEC.md](./docs/SPEC.md).

The spec and CLI are under active development.

---

## Table of Contents

- [What it is](#what-it-is)
- [What an agent gets](#what-an-agent-gets)
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
- [Contributing](#contributing)
- [License](#license)

---

## What it is

Most of what an agent knows about how to do a job lives in a system prompt: incomplete, tied to one platform, and impossible to check. A persona puts the same material in versioned files with a schema, so it can be validated, diffed in Git, compiled for each host and reviewed like code.

---

## What an agent gets

When a coding agent loads a persona, it follows the same procedures, applies the same criteria and cites the same sources in every session. Without one, each session starts from the model defaults.

Unknown fields and custom sections are accepted, not rejected, so the format can be extended for a domain. It is plain text and versioned in Git. `personaxis compile` generates the format each host reads from one maintained source.

---

## The two parts

`personaxis.md` is the source that `personaxis compile` turns into `PERSONA.md` or `<slug>.md`. It has two parts: YAML frontmatter and a Markdown body.

The YAML frontmatter is the schema: typed, structured, validated values. It holds the spec version and the blocks that define the persona's procedures, limits and behavior.

The Markdown body carries what the schema cannot: the reasoning behind those values, interaction-time guidance, and references to supporting material. The frontmatter is the normative definition; the body gives context for applying it.

### Sections

Every PERSONA.md Markdown body follows the same structure. Sections can be omitted if they are not relevant, but those present appear in the sequence below. All sections use `##` headings.

1. Overview: what the persona does and what it is built for
2. Design rationale: why specific YAML values were chosen
3. Do's: behavioral guardrails written for the agent
4. Don'ts: anti-patterns the agent avoids
5. Resources: references to the accompanying `references/`, `examples/`, `assets/` and `skills/` directories in `.personaxis/[personas/<slug>/]`

Project baselines (root `PERSONA.md`) include only sections 1 and 2. Agent-level personas may include all five.

### A persona, excerpted

Below is an excerpt of a `personaxis.md` for a code reviewer. It shows the fields that carry the way of working; the other layers are omitted here and are required in a real file (`personaxis create` or `personaxis init` writes them all).

```yaml
---
apiVersion: personaxis.com/v1
kind: AgentPersona
spec_version: "1.1.0"

metadata:
  name: "lens"
  version: "1.0.0"
  description: "Reviews pull requests for correctness first and style second."

character:
  behavioral_commitments:             # the criteria it judges its own work by
    - { id: evidence-for-every-finding, rule: "Every finding names the file, the line and what the code actually does.", severity: high }
    - { id: no-silent-approval, rule: "Silence on an area is not approval; say what was not reviewed.", severity: high }
  prohibited_behaviors:
    - "Approve code with known security vulnerabilities."
    - "Comment on style while the logic is wrong."

extensions:
  skills:                             # the procedures
    - "./skills/review-diff"          # skills/review-diff/SKILL.md: when to use it, numbered steps, output format
  references:                         # sourced knowledge
    - "references/review-checklist.md"   # ends with a Sources section: author, title, year
  tools: [read_file, run_command]

verification:
  gates:                              # objective checks before a review is delivered
    - { type: command, name: tests-pass, run: "pnpm test" }
# ... the remaining layers (identity, personality, values_and_drives, affect, cognition, memory,
# metacognition, self_regulation, persona) are omitted from this excerpt
---

## Overview
Lens reviews pull requests and code diffs for correctness, clarity and security, and is meant as the
final check before merge.

## Do's

- Lead with the most critical finding, then rank the rest by impact

## Don'ts

- Bury security or logic issues below style notes
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

CLI export targets are Claude Code, Codex, OpenClaw and Hermes (the last two compile to a `SOUL.md`
document). Other hosts that read `AGENTS.md`, such as Cursor, pick up the Codex baseline.

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

- Generates `PERSONA.md` / `<slug>.md` from `personaxis.md` (plus `policy.yaml`/`state.json` and a capped resource manifest of `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/`) via the configured provider (`local | byok | agent`).
- Materializes every `local` entry in `extensions.skills` (e.g. `./skills/<name>`) into the platform's skill-discovery directory - `.claude/skills/<name>/` for `claude-code`, `.agents/skills/<name>/` for `codex` - marking each copy `.personaxis-generated`.
- Writes `skills-manifest.json` recording each `extensions.skills` entry's status: `materialized`, `missing-local`, or `reference-only` (for `@org/name@version` registry and `github:org/repo` entries).
- For Claude Code subagents, adds the materialized skill names to the compiled `.claude/agents/<slug>.md` frontmatter `skills:` list (preload).

Run `personaxis skills list [--root|<slug>]` to inspect `skills-manifest.json`, and `personaxis skills pull <name> [--root|<slug>]` to pull a `github:org/repo[/path]` entry into `skills/<name>/`.

Compiled and materialized files are generated outputs. Edit `personaxis.md` and the `.personaxis/[personas/<slug>/]` supporting folders, then re-run `personaxis compile`. Do not hand-edit `.claude/skills/`, `.agents/skills/`, `.codex/`, or `skills-manifest.json` directly; hand edits to `PERSONA.md`/`<slug>.md` are picked up by `personaxis decompile`.

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

`personaxis.md` (the ten layers, in `.personaxis/[personas/<slug>/]`) is the source of truth for the persona. `personaxis compile` generates the compiled, qualitative document each coding agent reads - `PERSONA.md` for a root persona, `.claude/agents/<slug>.md` / `.codex/agents/<slug>.toml` for a subagent - plus, when `extensions.skills` is declared, the matching `.claude/skills/<name>/` or `.agents/skills/<name>/` packages, from a single maintained source package.

---

## Spec

See [docs/SPEC.md](./docs/SPEC.md) for the full normative specification: required fields, optional fields, allowed values, validation rules, and the complete example.

---

## CLI reference

Install or run without installing:

```bash
npm install -g personaxis
# or, without installing:
npx personaxis <command>
```

Requires Node.js 20.18.1 or newer. Every command, flag and exit code is documented in the [CLI reference](https://github.com/personaxis/personaxis/blob/main/docs/commands/README.md); what follows is the part that concerns this spec.

### `validate`

Schema and universals validation against the current spec, v1.1.0 (additive over v1.0.0, so 1.0.0 personas validate unchanged; personas at v0.3-v0.10 are accepted via a frozen legacy schema, the validator dispatches by `spec_version`). Exits `0` when valid and `1`, `2` or `3` by the kind of failure (see [Validator outputs](#linting-rules)). Safe for CI.

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
- `--platform <claude-code|codex|openclaw|hermes>` (default `claude-code`) selects the subagent placement convention for `<slug>` and, when `extensions.skills` declares `local` entries, the skill materialization directory (`.claude/skills/<name>/` or `.agents/skills/<name>/`).
- `--provider <local|byok|agent>` overrides the configured provider (see `personaxis config`).
- `--from-file <path>` uses a file's contents as the compiled output instead of calling the provider (useful for testing).
- `--out <path>` overrides the output path, `--stdout` prints instead of writing.

The `--platform` values are `claude-code`, `codex`, `openclaw` and `hermes`.

### `decompile`

Propose `personaxis.md` updates from a hand-edited `PERSONA.md` / `<slug>.md`. Always validates the proposal before it is written; on `FAIL_*` it prints diagnostics and writes nothing.

```bash
personaxis decompile [--root | <slug>] [--provider <name>] [--from-file <path>]
```

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
personaxis state init    [-f <path|slug>] [--force]
personaxis state mutate  [-f <path|slug>] --field <path> --delta <number> --reason <text> [--tool-call-id <id>]
personaxis state show    [-f <path|slug>] [--json]
personaxis state rewind  <n> [-f <path|slug>] [--dry-run]
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

`0.6-to-0.7` moves a legacy root `PERSONA.md` (10-layer frontmatter) and its sibling folders into `.personaxis/`, then runs `compile` once to produce the initial `PERSONA.md`. `0.7-to-0.8`, `0.8-to-0.9`, and `0.9-to-0.10` are additive: they bump `spec_version` only (no field changes; an existing persona stays valid). The bump makes the new OPTIONAL fields *available* to add by hand, v0.10 unlocks the `persona_prompting` block, `identity.short_name`, and inline `improvement_policy.mode`. `0.10-to-1.0` is the **breaking, structural** codemod to the stable spec (comment-preserving): it renames layer 9 to `self_regulation`, folds `persona_prompting` into layer-10 `persona`, collapses the five refusal surfaces to two, moves memory retrieval knobs to `runtime.memory`, converts drive `intensity`→`level`, drops `metadata.display_name`, and rewrites `apiVersion`→`personaxis.com/v1`, writing a report under `.personaxis/migrations/`. All default to a dry run; pass `--apply` to write changes.

### `config`

Configure the provider used by `compile`/`decompile` (`local | byok | agent`).

```bash
personaxis config set provider <local|byok|agent>
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

The `personaxis lint` command checks a parsed `personaxis.md` against the layer and field contract in [docs/SPEC.md](./docs/SPEC.md) and reports structured findings at a fixed severity level: `error` (exit code 1), `warning`, or `info`. The main rules (`personaxis spec --rules-only` lists all of them):

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
  message: string; // what is wrong
  fix: string;     // the edit that resolves it
}
```

---

## Examples

See [.personaxis/personas/](./.personaxis/personas/) for complete personas that validate against the current spec, in both root and subagent layouts. `personaxis lint` flags numbers in some of them that no band expression uses yet.

| Persona | Role | Mode | Status |
|---|---|---|---|
| [cmo](./.personaxis/personas/cmo/) | Full-stack marketing executive, with 5 declared `extensions.skills` | Root-mode layout | Available |
| [frontend-expert](./.personaxis/personas/frontend-expert/) | Frontend code reviewer, with 1 local skill | Subagent (`.claude/agents/frontend-expert.md`) | Available |

More examples coming. To contribute one, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.


---

## Live example

This repository uses its own spec. [PERSONA.md](./PERSONA.md) at the root is the compiled document that defines the shared behavioral baseline for any agent working on this project - the procedures, criteria and limits that guide decisions about the spec itself. Its quantitative source lives at [.personaxis/personaxis.md](./.personaxis/personaxis.md).

---

## License

MIT. The reference CLI lives in a separate repository, [personaxis/personaxis](https://github.com/personaxis/personaxis).
