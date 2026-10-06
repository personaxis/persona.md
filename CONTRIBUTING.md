# Contributing to PERSONA.md

PERSONA.md is an open specification. Contributions are welcome, from typo fixes to new field proposals.

## Types of contributions

**Bug fixes:** Typos, broken links, incorrect field descriptions. Open a PR directly.

**Clarifications:** Ambiguous language in the spec. Open a PR with your proposed wording and a brief rationale.

**New fields or changes to existing fields:** Open an issue first. Fields that describe how a persona works (procedures, criteria, sources) are preferred over fields that describe state. Describe the use case, why existing fields do not cover it, and any backward-compatibility implications. Breaking changes require a spec version bump.

**New example personas:** Open a PR with a complete persona package: `personaxis.md`, `policy.yaml`, `state.json`, at least one skill under `skills/` and one reference under `references/` with its sources, plus the compiled document. The persona must do a real job and pass `personaxis validate`, and every example output must come from a real run on a named model, never typed by hand.

## Before you open a PR

1. Run schema validation against your changes if they touch PERSONA.md files
2. Ensure field names use `snake_case`
3. Ensure all required fields are present in example personas
4. Update CHANGELOG.md under `[Unreleased]`

## Versioning

The spec follows semantic versioning. Breaking changes increment the major version and ship with a codemod (`personaxis migrate`). Additive changes increment the minor version.

Breaking changes: removing a required field, changing a field type, removing an allowed enum value.

Non-breaking changes: adding an optional field, adding an allowed enum value, clarifying documentation.

## Governance

The spec is maintained by [Personaxis](https://personaxis.com). Significant changes are discussed in an issue before merging. The specification is MIT licensed, and the reference CLI lives in a separate repository.
