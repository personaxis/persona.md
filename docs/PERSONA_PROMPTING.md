# Persona Prompting — the methodology behind `PERSONA.md`

> Why the spec is shaped the way it is, and the research it draws on.

The personaxis spec exists to make one thing reliable: getting a language model to **adopt
and stay in** a precisely defined persona, and to let that persona **evolve under
governance** instead of drifting at random. The quantitative spec
(`.personaxis/personaxis.md`) is the *source of truth*; the compiled **`PERSONA.md`** is
the *LLM-facing artifact* — the document a host agent reads ahead of every turn. `PERSONA.md`
is therefore not a profile or a data dump. It is a **persona-prompting artifact**, engineered
from the techniques below.

This document is the normative reference for `personaxis compile` (forward) and for the
`persona_prompting` source block in the spec. When you wonder "why is the compiled document
written in the second person?" or "why scene contracts?", the answer is here.

---

## 1. The core idea: role adoption beats description

Telling a model *"You are a senior security reviewer"* and addressing it in the **second
person** consistently shifts tone, reasoning, and output structure more than describing a
persona in the third person ("This persona is…"). This is **role prompting / role adoption**,
the most load-bearing device we use, and the reason every section of `PERSONA.md` is written
as **"You are…", "You always…", "You think…"**.

- Role prompting overview and guidance: [Learn Prompting — Role Prompting](https://learnprompting.org/docs/advanced/zero_shot/role_prompting), [WaterCrawl — Role Prompting](https://watercrawl.dev/blog/Role-Prompting).
- A 47-paper review identifies two primary dimensions of persona prompts — **role adoption**
  and **demographic priming** — and shows wide variation in how prompts are constructed, which
  is exactly the variation a *spec* removes. See *The Prompt Makes the Person(a)* ([arXiv:2507.16076](https://arxiv.org/abs/2507.16076)).

**In the spec:** `persona_prompting.address.second_person` + `address.you_are`, and
`identity.short_name` (the handle the model is addressed by).

## 2. Character cards + scene contracts (RRP)

The strongest recent result for *agentic* role-play is **Rule-based Role Prompting (RRP)**:
a **character card** (a tight, declarative statement of who the persona is) combined with
**scene contracts** that explicitly connect a *situation* to the persona's *expected behavior*
and the *concrete actions* it should take. RRP + strict function-calling discipline gave the
best role-adherence and tool-use reliability.

- *Talk Less, Call Right: Enhancing Role-Play LLM Agents with Automatic Prompt Optimization
  and Role Prompting* ([arXiv:2509.00482](https://arxiv.org/abs/2509.00482)).

A character card alone makes a persona *describe* itself; scene contracts make it *act*. This
is why `PERSONA.md` has both a "Who you are" character card and an "In specific situations"
section.

**In the spec:** `persona_prompting.scene_contracts` (`situation` → `expected_behavior` →
`actions`) and `behavioral_anchors` (`do` / `dont` / `examples`).

## 3. Few-shot voice exemplars + memory for consistency

Persona consistency degrades over long, multi-turn interactions. Two devices counter this:

1. **Few-shot voice exemplars** — a handful of `user → persona` exchanges that pin the register
   far more concretely than adjectives like "terse" or "warm".
2. **Memory-driven role-play** — retrieving persona-relevant memory each turn keeps the
   character coherent. **CharacterChat** combines behavior presets, a persona bank, and dynamic
   per-turn memory retrieval; *Memory-Driven Role-Playing* studies persona-knowledge
   utilization directly ([arXiv:2603.19313](https://arxiv.org/abs/2603.19313)).

`PERSONA.md` carries voice exemplars inline and points to the persona's memory/resources so the
host can retrieve them.

**In the spec:** `persona_prompting.voice_exemplars`; the compiled "Memory & resources" section;
the runtime's append-only hash-chained episodic memory + `memory.md` semantic consolidation.

## 4. Stable / evolving / situational layers

Persona attributes are not all equally mutable. The literature distinguishes **stable**
characteristics (e.g. core values), **slowly evolving** ones (e.g. emphasis, tone), and
**transient/situational** ones (e.g. emotional state). Separating these tells the model what is
fixed and what may shift — and tells the *runtime* what it is allowed to change.

**In the spec:** `persona_prompting.consistency` (`stable` / `evolving` / `situational`),
backed quantitatively by the affect/personality **envelopes** (mean ± range) the runtime
clamps to.

## 5. Staying in character — without overriding safety

Anti-break-character guardrails keep the persona in role under off-topic bait or attempts to
make it drop the persona. **Critically, in this spec they never override the safety
universals.** The compiled "Staying in character" section must explicitly defer to the "Hard
limits" section (which reproduces `self_regulation.hard_limits` +
`persona.constraints`). Persona-prompting makes the model *more* itself; it must never make the
model *less* safe.

**In the spec:** `persona_prompting.break_character_guardrails`, subordinate to the universal
invariants enforced by the validator (`src/schema.ts`).

## 6. General prompt structure & evaluation

A robust role-prompt is *system instructions + situational context + response instructions +
conversation history*. `PERSONA.md` is the persistent **system-instructions** layer; the host
supplies context and history each turn.

To judge whether a persona artifact actually works, recent work proposes evaluation across
**believability, morality, memory, persona, knowledge, and emotion**. The repo's governance
eval suite (`@personaxis/evals`) is the operational counterpart for the *governance* dimensions
(safety, drift, reversibility). Broader background: *Personalization of Large Language Models: A
Survey* ([arXiv:2411.00027](https://arxiv.org/abs/2411.00027)); *persona-aware contrastive
learning* for role-play consistency.

---

## What makes it "living"

Static persona prompts rot: the world changes, the persona doesn't. The personaxis difference is
that the persona-prompting material is **governed and self-improvable**:

- `improvement_policy.mode` = `locked` | `suggesting` | `autonomous` decides whether the spec may
  evolve itself (change it from the CLI with `personaxis improve <mode>` or `/improve`).
- Proposed self-edits — **quantitative** (envelope/number dot-paths) and **qualitative** (voice,
  scene contracts, anchors) — go through an **append-only hash-chained ledger**, a **quorum of
  independent verifiers (consensus)**, and **protected paths** (identity, character, values,
  reflexive self-regulation can never be self-edited). Every applied edit is **reversible** and
  triggers a **recompile** of `PERSONA.md`.

So the persona adopts a role (sections 1–2), stays consistent (3–4), stays safe (5), is
measurable (6) — and improves itself within hard governance, which is the whole thesis of the
spec.

---

## Mapping: technique → spec field → `PERSONA.md` section

| Technique | `persona_prompting` field | Compiled section |
|---|---|---|
| Role adoption (2nd person) | `address.second_person`, `address.you_are`, `identity.short_name` | "You are <name>" opener |
| Character card | (derived from identity/character) | "Who you are" |
| Voice few-shot | `voice_exemplars` | "How you speak" |
| Behavioral anchoring | `behavioral_anchors` | "What you always / never do" |
| Scene contracts (RRP) | `scene_contracts` | "In specific situations" |
| Consistency layers | `consistency` | "What is fixed, what can change" |
| Safety universals | (validator-enforced) | "Hard limits (never overridden)" |
| Break-character guardrails | `break_character_guardrails` | "Staying in character" |
| Memory retrieval | (resources/manifest) | "Memory & resources" |
| Governed evolution | `improvement_policy.mode` | "Self-improvement" |

## References

- *Talk Less, Call Right: Enhancing Role-Play LLM Agents with Automatic Prompt Optimization and Role Prompting* — [arXiv:2509.00482](https://arxiv.org/abs/2509.00482)
- *The Prompt Makes the Person(a): A Systematic Evaluation of Sociodemographic Persona Prompting for LLMs* — [arXiv:2507.16076](https://arxiv.org/abs/2507.16076)
- *Memory-Driven Role-Playing: Evaluation and Enhancement of Persona Knowledge Utilization in LLMs* — [arXiv:2603.19313](https://arxiv.org/abs/2603.19313)
- *Personalization of Large Language Models: A Survey* — [arXiv:2411.00027](https://arxiv.org/abs/2411.00027)
- *Beyond Single-Turn: A Survey on Multi-Turn Interactions with Large Language Models* — [arXiv:2504.04717](https://arxiv.org/abs/2504.04717)
- Learn Prompting — Role Prompting: <https://learnprompting.org/docs/advanced/zero_shot/role_prompting>
- WaterCrawl — Role Prompting: <https://watercrawl.dev/blog/Role-Prompting>
- CharacterChat (behavior presets + dynamic memory + persona bank) — role-play consistency over long conversations.
