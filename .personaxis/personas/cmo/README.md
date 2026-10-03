# cmo

**CMO**, Chief Marketing Officer (spec v1.1.0, persona version 2.0.0)

A complete persona example for a Chief Marketing Officer agent built to own the marketing function end to end: positioning, brand, demand generation, product marketing, lifecycle, growth loops, analytics, and the marketing P&L.

It is the reference example for the spec's three artifacts: `personaxis.md` (the quantitative ten-layer spec), `PERSONA.md` (the compiled document a model reads) and `state.json` (the mutable runtime state).

This persona lives at `.personaxis/personas/cmo/`, as part of the example collection. Deployed as a repository's own agent ("root mode"), `personaxis.md` and its siblings would live at `.personaxis/` and `PERSONA.md` at the repository root: the contents are identical, only the placement differs.

A **subagent example**, `frontend-expert`, lives alongside it at `.personaxis/personas/frontend-expert/`, compiled to `.claude/agents/frontend-expert.md`.

## Who this is for

- Founders and CEOs who need a senior marketing executive's judgment before the company can support the seat
- Operators running marketing in startups from seed through Series B
- Heads of marketing who want a peer to pressure-test strategy, narrative, and budget allocation

## Structure

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

## Quick start

From the root of this repository:

```bash
# Validate the spec and its policy.yaml
npx personaxis validate cmo

# Compile it for Claude Code (writes .claude/agents/cmo.md)
npx personaxis compile cmo --platform claude-code

# Read and move its runtime state (clamped to the envelopes declared in personaxis.md)
npx personaxis state show -f cmo
npx personaxis state mutate -f cmo --field mood.tone --delta -0.10 --reason "user asked for less energy"

# Talk to it
npx personaxis --persona .personaxis/personas/cmo/personaxis.md
```

## Working with this persona

Share upfront:

1. **Who the buyer is**: role, company size, industry, pain, what they currently do instead, willingness to pay
2. **What the product does for that buyer**: only the features connected to specific pain
3. **What success looks like**: revenue target, retention milestone, pipeline number, brand-equity claim
4. **What is locked vs. open**: positioning, brand voice, banned phrases, board commitments
5. **What evidence exists**: customer quotes, conversion data, sales call patterns, cohort behavior

Without these, the first deliverable is the question set that produces them.

## Self-improvement

The improvement posture is the inline `improvement_policy.mode` in `personaxis.md` (authoritative; `policy.yaml` may only restrict it). This persona ships in `suggesting`: numeric state moves inside its envelopes, and an edit to the spec itself is proposed with `propose_self_edit`, queued for a person (`personaxis review`), and recompiles `PERSONA.md` once approved. Under `locked`, nothing the persona lives through moves it. Change the posture with `personaxis improve <mode>`.

`autonomous` (sandbox only) applies changes directly within an `autonomous_scope_allowlist` and needs a recorded sign-off (`approved_by`, `last_approval_at`). The self-regulation layer stays `governance_controlled` in every mode. The full rules are in [docs/SPEC.md](../../../docs/SPEC.md).

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

- Spec version: `1.1.0` (migrated from 0.10 with `personaxis migrate 0.10-to-1.0`; the report is in `.personaxis/migrations/`)
- Persona version: `2.0.0`
- `personaxis validate cmo` emits `PASS`
- `policy.yaml` declares 19 hand-written behavioral assertions
