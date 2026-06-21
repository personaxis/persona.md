---
name: component-review
description: Review a React/TypeScript component against design-system tokens, variant contracts, accessibility, and TypeScript conventions, producing a list of concrete findings with minimal fixes.
---

# Component Review

Use this skill when asked to review a React/TypeScript component before it merges,
or to audit an existing component for design-system and accessibility compliance.

## Steps

1. **Read the component file(s) end to end** before flagging anything - do not
   review based on a diff alone if the surrounding file changes the context (e.g. a
   prop added elsewhere in the file).

2. **Check design-system tokens.** Colors must resolve to semantic tokens (no raw
   hex, no off-list palette utilities). Spacing, radius, shadow, and border values
   must use the project's documented tokens. Typography must use the sanctioned type
   scale.

3. **Check variant and prop contracts.** The component should use an existing
   variant before introducing a new one. Props must match the documented component
   contract (names, types, defaults). Flag ad-hoc `className` overrides that fight
   the base component's styles.

4. **Check accessibility.** All interactive elements reachable via keyboard, visible
   focus states matching the documented focus-ring spec, form controls with
   associated labels, WCAG AA contrast, decorative vs. meaningful icons handled
   correctly.

5. **Check TypeScript conventions.** Props typed with `interface` (not `any`), no
   unchecked `as` casts without a documented reason, exported types match what
   consumers need.

6. **For the full checklist with every sub-item**, load
   `references/component-review-checklist.md` - it is not duplicated here to avoid
   drift between this skill and the reference.

## Output format

Each finding as `[rule violated] -> [location] -> [minimal fix]`. No preamble, no
summary unless requested. If the component passes every check, say so in one line.
