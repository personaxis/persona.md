# Changelog

All notable changes to the PERSONA.md specification are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
The spec follows [Semantic Versioning](https://semver.org/).

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

[0.1.0]: https://github.com/personaxis/persona.md/releases/tag/v0.1.0
