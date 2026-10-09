# Contributing to PERSONA.md

PERSONA.md is an open specification. Contributions are welcome, from typo fixes to new field proposals.

## Types of contributions

**Bug fixes:** Typos, broken links, incorrect field descriptions. Open a PR directly.

**Clarifications:** Ambiguous language in the spec. Open a PR with your proposed wording and a brief rationale.

**New fields or changes to existing fields:** Open an issue first. Fields that describe how a persona works (procedures, criteria, sources) are preferred over fields that describe state. Describe the use case, why existing fields do not cover it, and any backward-compatibility implications. Breaking changes require a spec version bump.

**Personas:** This repository is the specification and keeps no example personas; the only one here is its maintainer. Personas are shared through the registry, each created by `personaxis create` with its creation report.

## Before you open a PR

1. Run `personaxis validate` on every persona your change touches.
2. Use `snake_case` for field names.
3. Keep every required field in the maintainer persona.
4. Update CHANGELOG.md under `[Unreleased]`.
5. Do not add personal data to any commit, even one a later commit removes: a check on every pull request reads what each commit adds and fails the build.

## Versioning

The spec follows semantic versioning. Breaking changes increment the major version and ship with a codemod (`personaxis migrate`). Additive changes increment the minor version.

Breaking changes: removing a required field, changing a field type, removing an allowed enum value.

Non-breaking changes: adding an optional field, adding an allowed enum value, clarifying documentation.

## Governance

The spec is maintained by [Personaxis](https://personaxis.com). Significant changes are discussed in an issue before merging. The specification is MIT licensed. The reference CLI lives in [its own repository](https://github.com/personaxis/personaxis), and anything about how to run it belongs there, not here.
