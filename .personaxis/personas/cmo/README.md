# cmo

**CMO** - Chief Marketing Officer (spec v0.7.0)

A complete persona example for a Chief Marketing Officer agent built to own the marketing function end-to-end: positioning, brand, demand generation, product marketing, lifecycle, growth loops, analytics, and the marketing P&L.

This is the first persona in the planned **C-suite series** and the reference example for **spec v0.7.0** (three-artifact information model: `personaxis.md` for the quantitative spec, `PERSONA.md` for the compiled qualitative document, `state.json` for mutable runtime state). v0.7.0 is a layout-only change from v0.6.0 - unified governance and categorized reflexive decisions are unchanged.

This persona lives at `.personaxis/personas/cmo/` in this repository, as part of the example collection under `.personaxis/personas/`. In a real deployment of `cmo` as a repository agent ("root mode"), `personaxis.md` and its siblings below would live at `.personaxis/` and `PERSONA.md` at the repo root - the directory contents are identical, only the placement differs.

A **subagent example**, `frontend-expert`, lives alongside this persona at `.personaxis/personas/frontend-expert/` + `.claude/agents/frontend-expert.md` (repo root), demonstrating the subagent-mode layout for a narrowly-scoped Claude Code subagent.

## Who this is for

- Founders and CEOs who need a senior marketing executive's judgment before the company can support the seat
- Operators running marketing in startups from seed through Series B
- Heads of marketing who want a peer to pressure-test strategy, narrative, and budget allocation
- Teams using Personaxis to compose multi-agent C-suites

## v0.7.0 structure (root mode, flattened for this example collection)

```
.personaxis/personas/
├── cmo/                            # This persona.
│   ├── PERSONA.md                  # Compiled qualitative document. What a coding agent reads.
│   ├── README.md                   # This file.
│   ├── personaxis.md               # Identity spec (10 layers). Immutable quantitative source of truth.
│   ├── policy.yaml                 # Observability + improvement_policy. Never inlined.
│   ├── state.json                  # Mutable runtime state (current trait/affect/mood values).
│   ├── manifest.json               # compile/decompile provenance and content hashes.
│   ├── memory.md                   # Long-term curated semantic memory.
│   ├── memory/                     # Date-stamped episodic memory.
│   │   ├── 2026-05-12.md
│   │   ├── 2026-05-18.md
│   │   └── 2026-05-25.md
│   ├── references/                 # Heavy framework prose (loaded on-demand).
│   │   ├── positioning-and-category-design.md
│   │   ├── jobs-to-be-done.md
│   │   ├── growth-loops-and-aarrr.md
│   │   ├── brand-strategy.md
│   │   ├── pricing-and-packaging.md
│   │   ├── demand-generation-playbook.md
│   │   ├── product-marketing-playbook.md
│   │   ├── content-and-seo-strategy.md
│   │   ├── marketing-analytics-and-attribution.md
│   │   └── cmo-operating-system.md
│   ├── examples/                   # Worked outputs, ordered by deliverable (markdown + HTML).
│   │   ├── 01-positioning/
│   │   │   ├── icp-and-positioning-brief.md
│   │   │   └── positioning-canvas.html
│   │   ├── 02-brand-voice/
│   │   │   └── brand-voice-guidelines.md
│   │   ├── 03-growth-audit/
│   │   │   ├── growth-audit.md
│   │   │   └── growth-loop-diagram.html
│   │   ├── 04-quarterly-planning/
│   │   │   ├── quarterly-marketing-okrs.md
│   │   │   └── quarterly-marketing-plan.html
│   │   ├── 05-product-launch/
│   │   │   ├── product-launch-narrative.md
│   │   │   └── product-launch-narrative.html
│   │   └── 06-board-update/
│   │       └── cmo-board-update.html
│   ├── skills/                     # Anthropic-compatible sub-skills: quarterly-planning, positioning-sprint,
│   │                               # product-launch, growth-audit, board-update.
│   └── assets/                     # Catchall (empty for this persona).
└── frontend-expert/                 # Subagent example (sibling persona, see below).
    └── ... (personaxis.md, policy.yaml, state.json, manifest.json, memory.md, references/, examples/)

.claude/agents/frontend-expert.md    # Compiled qualitative document for the frontend-expert subagent (repo root).
```

In a real "root mode" deployment of `cmo`, this same set of files (everything except `README.md`) lives at the consuming repo's `.personaxis/` and `PERSONA.md` at its root - identical contents, just `.personaxis/personas/cmo/` -> `.` / `.personaxis/`.

## What changed in v0.7.0

v0.7.0 is a layout-only move from v0.6.0 - no field changes. Notable changes:

1. **Three artifacts instead of two.** `PERSONA.md` (compiled qualitative document, what a coding agent reads), `personaxis.md` (immutable quantitative spec), and `state.json` (mutable runtime). The Personaxis-hosted runtime actor never reads either Markdown file directly; it reads the per-request `.dist/` prompt produced by the runtime compiler from `personaxis.md` + `state.json`.

2. **Quantitative spec relocated under `.personaxis/`.** What was repo-root `PERSONA.md` in v0.6.0 is now `.personaxis/personaxis.md` (root mode). `policy.yaml`, `state.json`, `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/` all moved alongside it, unchanged in name and shape.

3. **New `manifest.json`.** Records compile/decompile provenance (last op, model, source) and content hashes, used by `personaxis push`/`pull` to detect hand-edits.

4. **New subagent example.** `.personaxis/personas/frontend-expert/` + `.claude/agents/frontend-expert.md` demonstrate the subagent-mode layout alongside this persona's root-mode layout.

Carried over from v0.6.0 (unchanged):

- **Unified governance.** `governance.per_layer_edit_policy` and `governance.drift_thresholds` replace the scattered `edit_policy` and `drift_threshold` fields from v0.5.
- **Reflexive decisions categorized.** `reflexive_self_regulation.decisions{}` replaces the flat `actions[]` array. Four independent decision groups (response, interaction, governance, cognition).
- **Trait/affect envelopes.** Personality traits and affect baselines declare envelopes (mean + range). Current values live in `state.json` and are mutated via the canonical `adjust_persona_state` tool, clamped to the envelope.
- **Three improvement modes.** `improvement_policy.mode` accepts `locked` | `suggesting` | `autonomous`. This persona ships in `locked` mode.

## Quick start

```bash
# Validate the spec
personaxis validate ./personaxis.md

# Compile the quantitative spec to PERSONA.md (compiled qualitative document)
personaxis compile --root

# Compile to a runtime prompt (produces .dist/)
personaxis compile ./personaxis.md --context task_mode=quarterly_planning,audience=ceo

# Adjust mutable state (clamped to envelopes declared in personaxis.md)
personaxis state mutate ./state.json --field "mood.tone" --delta -0.10 --reason "user requested less energy"

# Export the subagent example to Claude Code
personaxis compile frontend-expert --platform claude-code
```

## Working with this persona

Share upfront:

1. **Who the buyer is** — role, company size, industry, pain, what they currently do instead, willingness to pay
2. **What the product does for that buyer** — only the features connected to specific pain
3. **What success looks like** — revenue target, retention milestone, pipeline number, brand-equity claim
4. **What is locked vs. open** — positioning, brand voice, banned phrases, board commitments
5. **What evidence exists** — customer quotes, conversion data, sales call patterns, cohort behavior

Without these, the first deliverable is the question set that produces them.

## Self-improvement

This persona ships in `improvement_policy.mode: locked`. `personaxis.md` is immutable at runtime; the actor cannot edit its own identity. State mutations (mood, affect, trait current values) still work within declared envelopes.

To enable propose_self_edit: change `policy.yaml#/improvement_policy/mode` to `suggesting`. Proposals are queued in the Personaxis dashboard for human approval. Approval mints a new PersonaVersion and recompiles `PERSONA.md`.

For full autonomous self-edit (sandbox only): set mode to `autonomous` and define `autonomous_scope_allowlist`. The reflexive layer remains `governance_controlled` and cannot be auto-edited even in this mode.

See the Personaxis documentation on self-improvement for the full state machine.

## Agent prompt guide

**Quarterly planning sprint**
```
You are CMO. Active state: task_mode=quarterly_planning, audience=ceo.
Company: [name], stage: [Series A/B], ARR: [X], target by EOY: [Y].
ICP, locked positioning, last-quarter result. Produce: OKRs, budget,
owners, kill criteria, weekly cadence.
```

**Positioning sprint**
```
You are CMO. Active state: task_mode=positioning_sprint.
Product: [paste]. Current hypothesis: [paste]. Competitive alternatives.
Walk me through the Dunford diagnostic.
```

**Board update**
```
You are CMO. Active state: task_mode=board_update, audience=board.
Quarter: [Q3 2026]. Plan vs. actual. Material misses (honestly). Wins. Risks.
Write the marketing section. Material misses first.
```

## Spec compliance

- Spec version: `0.7.0`
- Persona version: `2.0.0`
- Validator: `personaxis validate ./personaxis.md` should emit `PASS`
- Policy: `policy.yaml` ships ~17 hand-written assertions. The judge auto-derives ~30 more from `personaxis.md` (every hard virtue, every hard_limit, every monitor flag).

## C-suite roadmap

| Persona | Status | Owns |
|---|---|---|
| **CMO** | This release | Positioning, brand, demand, lifecycle, marketing P&L |
| CRO | Planned | Pipeline, sales motion, revenue forecasting |
| CPO | Planned | Product strategy, roadmap, discovery, PMF |
| CFO | Planned | Financial planning, capital allocation, board reporting |
| COO | Planned | Operations, hiring, process |
| CEO | Planned | Vision, governance, board, capital |

Each follows the same v0.7.0 structural template.
