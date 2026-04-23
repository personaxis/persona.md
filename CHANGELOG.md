# Changelog

All notable changes to the PERSONA.md specification are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
The spec follows [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-04-23

Structural revision of the ten-dimension framework. Breaking changes in all five renamed or restructured blocks. Migration guide: rename `drives` → `drives_values`, rename `constraints` → `normative_self_reg`, rename `hard_limits` → `principledRefusals`, add required `metacognition` block, update spec field to `"0.2"`.

### Added

- **`metacognition`** — new required dimension (Layer 9). Captures second-order self-awareness: how the agent models itself, calibrates its own uncertainty, and holds meta-volitions about its first-order drives. Grounded in Frankfurt (1971) higher-order desire theory, Metzinger (2003) phenomenal self-model, and Fleming & Lau (2014) metacognitive monitoring. Required fields: `selfModel`, `uncertaintyCalibration`. Optional fields: `metaVolitions`, `selfRevisionPolicy`, `driftMonitor`, `deferralPolicy`.
- **`drives_values.valueHierarchy`** — required field in `drives_values`. An ordered list that makes the agent's trans-situational value priorities explicit and resolvable under conflict. Grounded in Schwartz (1992) basic human values circumplex.
- **`drives_values.valueConflictPolicy`** — optional field. Describes how the agent resolves conflicts between values when `valueHierarchy` alone is insufficient.
- **`memory.semantic`** — optional field. How the agent represents and retrieves declarative world knowledge.
- **`memory.procedural`** — optional field. Operational know-how and skill-based knowledge the agent draws on.
- **`memory.episodic`** — optional field. Event-based memory for contextually-located experiences.
- **`memory.autobiographical`** — optional field. Self-narrative memory: the agent's personal history as it understands it.
- **`memory.working_self`** — optional field. The active self-concept available in the current context window (Conway, 2005).
- **`personality.hexaco`** — optional sub-object. HEXACO-6 profile (Lee & Ashton, 2004) with six string-valued descriptors: `honesty_humility`, `emotionality`, `extraversion`, `agreeableness`, `conscientiousness`, `openness`.
- **`normative_self_reg.discrepancyFeedback`** — optional field. Describes the agent's self-correction behavior when it detects deviation from its ought-self (Higgins, 1987 self-discrepancy theory).

### Changed

- **`drives` renamed to `drives_values`** (breaking). The block now covers both instrumental motivation and trans-situational value commitments.
- **`constraints` renamed to `normative_self_reg`** (breaking). Reframed from external prohibition to Kantian self-legislation: the agent's limits arise from internalized values, not imposed restrictions.
- **`constraints.hard_limits` renamed to `normative_self_reg.principledRefusals`** (breaking). Same semantics, reframed to reflect autonomous self-regulation rather than external constraint.
- **`constraints.soft_limits` removed** (breaking). Overridable defaults are now handled through `normative_self_reg.valueConflictPolicy` and context-specific `persona.adaptations`.
- **`persona` moves to Layer 10** (non-breaking structurally; dimension count changes from nine to ten).
- **`personality`** documentation updated to reference HEXACO-6 (Lee & Ashton, 2004) as the dimensional framework for trait description. The `hexaco` sub-object is optional and additive; existing `traits` strings remain valid.
- **`cognition`** restricted to first-order reasoning. Metacognitive fields (`metacognitive_awareness` if present) belong in `metacognition.uncertaintyCalibration`.
- Spec version bumped from `"0.1"` to `"0.2"` in the `spec` field and JSON Schema `$id`.

### Migration

```yaml
# 0.1.x → 0.2.0

# Rename top-level keys
drives:        → drives_values:
constraints:   → normative_self_reg:

# Within drives_values — add required field
drives_values:
  valueHierarchy:    # required — ordered list of values from most to least prioritized

# Within normative_self_reg — rename and restructure
  hard_limits:       → principledRefusals:
  # soft_limits removed — move to persona.adaptations or valueConflictPolicy

# Add new required dimension
metacognition:
  selfModel:              # required
  uncertaintyCalibration: # required

# Update spec field
spec: "0.1"    → spec: "0.2"
```

---

## [0.1.0] — 2026-04-20

Initial release of the PERSONA.md specification.

### Added

- Nine-dimension schema: `identity`, `character`, `personality`, `cognition`, `affect`, `drives`, `constraints`, `memory`, `persona`
- JSON Schema for CLI validation (`schema/persona.schema.json`)
- Complete example persona: `marketing-specialist` (Aria)
- Package structure convention: `PERSONA.md` + `samples/` + `refs/` + `README.md`
- Two-level structure: project-level `PERSONA.md` at root + agent-level packages in `.personaxis/personas/`
- `.personaxis/personas/` as the standard project path for agent personas
- Registry semantics: `<author>/<name>@<version>` addressing
- Validation rules and allowed value sets
- `CONTRIBUTING.md` with governance and contribution guidelines

---

[0.2.0]: https://github.com/personaxis/persona.md/releases/tag/v0.2.0
[0.1.0]: https://github.com/personaxis/persona.md/releases/tag/v0.1.0
