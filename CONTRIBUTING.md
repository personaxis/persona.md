# Contributing to PERSONA.md

PERSONA.md is an open specification. Contributions are welcome — from typo fixes to new field proposals.

## Types of contributions

**Bug fixes:** Typos, broken links, incorrect field descriptions. Open a PR directly.

**Clarifications:** Ambiguous language in the spec. Open a PR with your proposed wording and a brief rationale.

**New fields or changes to existing fields:** Open an issue first. Describe the use case, why existing fields do not cover it, and any backward-compatibility implications. Breaking changes require a spec version bump.

**New example personas:** Open a PR with a complete persona package (PERSONA.md + README.md minimum). The persona must be clearly useful for a real role and must pass schema validation.

## Before you open a PR

1. Run schema validation against your changes if they touch PERSONA.md files
2. Ensure field names use `snake_case`
3. Ensure all required fields are present in example personas
4. Update CHANGELOG.md under `[Unreleased]`

## Versioning

The spec follows semantic versioning. During `0.x`, minor version bumps may include breaking changes — these are documented clearly in CHANGELOG.md. After `1.0`, semver applies normally.

Breaking changes: removing a required field, changing a field type, removing an allowed enum value.

Non-breaking changes: adding an optional field, adding an allowed enum value, clarifying documentation.

## Governance

The spec is maintained by [Personaxis](https://personaxis.com). Significant changes go through a public comment period before merging.

The specification belongs to the community. Personaxis builds the tooling and platform around it.
