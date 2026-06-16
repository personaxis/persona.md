<!-- ═══════════════════════════════════════════════════════════════════════
     PERSONA.md - Canonical compiled-document template (spec v0.7.0)
     ═══════════════════════════════════════════════════════════════════════

     This is the template for the repo-root `PERSONA.md` (repository agent /
     "root mode") or `.claude/agents/<slug>.md` (Claude Code subagent mode;
     Codex and other platforms have their own placement convention, see
     `docs/setup/`).

     WHAT THIS FILE IS
       A committed, LLM-compiled, QUALITATIVE document. It is what a coding
       agent (Claude Code, Codex, Cursor, etc.) reads to know who it is and
       how to behave in this repository. It is generated from
       `.personaxis/[personas/<slug>/]personaxis.md` (the quantitative
       10-layer spec) via `personaxis compile`, and hand-edits to this file
       are folded back into that spec via `personaxis decompile` the next
       time `personaxis push` runs.

     WHAT THIS FILE IS NOT
       - It is NOT the quantitative spec. Numeric traits, envelopes,
         governance thresholds, and machine-readable assertions live in
         `.personaxis/[personas/<slug>/]personaxis.md` and `policy.yaml`.
       - It does NOT replace `.dist/` - the ephemeral, per-request compiled
         prompt used by the Personaxis-hosted runtime. `.dist/` is gitignored
         and regenerated deterministically from `personaxis.md` + `state.json`.

     HOW TO FILL THIS IN
       - Prefer running `personaxis compile` against a completed
         `.personaxis/personaxis.md` rather than writing this by hand.
       - If you do hand-edit, keep every section's CONTENT consistent with
         the quantitative spec - `personaxis push` will otherwise propose a
         `personaxis decompile` diff that may surprise you.
       - Write in plain, second-person-addressed-to-the-agent prose. No YAML.
         No field names from the quantitative schema - describe what they
         MEAN, not their machine representation.

     SECTIONS
       Replace every [bracketed] placeholder. Delete sections that genuinely
       do not apply (e.g., a narrowly-scoped subagent may not need "Memory &
       context pointers"), but do not invent new top-level sections - extend
       an existing one instead.
     ═══════════════════════════════════════════════════════════════════════ -->

# [Persona display name]

[One or two sentences: who this agent is and what it is for. This is the
"Overview" - the first thing another contributor or agent reads to decide
whether this persona applies to the task at hand.]

## Identity & Purpose

- **Role:** [primary_role - e.g. "spec maintainer", "frontend reviewer"]
- **Purpose:** [system_identity.purpose, in plain language]
- **Works on:** [allowed_domains, described as a short list of topics/areas]
- **Does not work on:** [prohibited_domains, described in plain language]
- **Self-concept:** [narrative_identity.self_concept - how this persona thinks
  of its own role, in one or two sentences]

## Character

[How this persona behaves under pressure or ambiguity, derived from
`character.virtues`, `behavioral_commitments`, and `principles`. Group related
virtues into prose paragraphs rather than listing raw trait names.]

**Always:**
- [behavioral_commitments / principles phrased as positive commitments]

**Never:**
- [prohibited_behaviors phrased as hard "don't"s]

## Personality & Voice

[2-4 sentences translating `personality.traits` (HEXACO or Big Five envelopes)
into a description of how this persona communicates - tone, formality,
verbosity, when it uses humor, how it disagrees.]

- **Tone:** [persona.voice.tone]
- **Formality:** [persona.voice.formality, described qualitatively: low/medium/high]
- **Verbosity:** [persona.voice.verbosity]
- **When it pushes back:** [conflict_response / principled_refusals, summarized]

## Values

[`values_and_drives.values` and `.goals`/`.anti_goals`, written as a short
ordered list of what this persona optimizes for, and what it deliberately
avoids optimizing for.]

**Optimizes for:**
- [value 1 - weight-ordered, highest first]
- [value 2]

**Deliberately avoids:**
- [anti_goal 1]

## How You Think

[`cognition.reasoning_style` and `epistemic_stance`, plus
`metacognition.self_revision_policy`, as guidance for HOW to approach a task:
what evidence this persona looks for before acting, how it handles
uncertainty, when it asks vs. proceeds.]

- **Default approach:** [cognition.default_strategy, in plain language]
- **Before proposing something big:** [what this persona checks first -
  derived from `cognition.reasoning_style` + `metacognition.drift_monitor`]
- **When uncertain:** [uncertainty_policy.disclose_when_above /
  abstain_when_above, translated to "say so when..." / "stop and ask when..."]

## Limits

[`reflexive_self_regulation.hard_limits` and `principled_refusals`, plus
`persona.constraints`, as a flat list of things this persona will refuse or
escalate rather than do. These map to `policy.yaml` assertions with
`severity: block` - treat changes here as changes to enforcement, not style.]

- [hard limit 1]
- [hard limit 2]
- [principled refusal 1]

## Self-Improvement

[One short paragraph stating this persona's current
`improvement_policy.mode` (`locked` | `suggesting` | `autonomous`) from
`.personaxis/[personas/<slug>/]policy.yaml`, and what that means in practice
- e.g. "this persona may propose spec changes via `propose_self_edit`, but
cannot apply them without review."]

## Resources

<!-- ═══════════════════════════════════════════════════════════════════════
     RESOURCE MANIFEST FORMAT - this section is generated by
     `personaxis compile` from `buildResourceManifest()`. It is a capped,
     human/LLM-readable index into `.personaxis/[personas/<slug>/]`'s
     supporting folders - never the full content of those folders. Below is
     the expected format; replace with real entries (or delete a bullet
     entirely if that folder is empty/absent).
     ═══════════════════════════════════════════════════════════════════════ -->

- **`./memory.md`** - curated long-term semantic memory (read on demand).
- **`./memory/`** - date-stamped episodic sessions, newest first: `2026-06-01.md`,
  `2026-05-25.md`, `2026-05-18.md` (3 files).
- **`./references/`** - background material this persona draws on, e.g.
  `pricing-frameworks.md`, `tone-guide.md` (2 files).
- **`./examples/`** - worked outputs for voice/format calibration, e.g.
  `worked-example-01/`, `worked-example-02/` (2 entries).
- **`./skills/`** - Anthropic-compatible sub-skills, e.g. `competitor-research/`
  (1 skill).
- **`./assets/`** - supporting raw files (none).
- **`./state.json`** - current runtime state (trait/affect/mood current values).
- **`./policy.yaml`** - improvement policy (`mode: locked`), behavioral
  assertions, evaluation suites.
- **`./manifest.json`** - compile/decompile provenance and content hashes.

<!-- ═══════════════════════════════════════════════════════════════════════
     SUBAGENT EXAMPLE - if this document is `.claude/agents/<slug>.md`
     instead of repo-root `PERSONA.md`, the Resources section above points
     into `.personaxis/personas/<slug>/` instead of `.personaxis/`, e.g.:

       - **`./.personaxis/personas/frontend-expert/memory.md`** - ...
       - **`./.personaxis/personas/frontend-expert/references/`** - ...

     A Claude Code subagent file also needs YAML frontmatter ABOVE the H1
     with `name` (the slug) and `description` (one line, used by Claude Code
     to decide when to invoke this subagent) - see
     `.claude/agents/frontend-expert.md` for a complete example.
     ═══════════════════════════════════════════════════════════════════════ -->
