# Setting up PERSONA.md with Cursor

> **Archived target:** Cursor export is archived for now. Active setup guides are Claude Code (`docs/setup/claude-code.md`) and Codex (`docs/setup/codex.md`). This document remains for historical reference.

Follow these steps exactly. Do not skip any step.

## Step 1 — Create the project baseline

Run this at the project root:

```bash
npx @personaxis/persona.md init
```

Select **"Project baseline"** when prompted. Enter the project name.

This creates `.personaxis/personaxis.md` at the project root with all ten required blocks and TODO markers, plus `.personaxis/policy.yaml` and `.personaxis/state.json`.

## Step 2 — Fill in personaxis.md based on the project

Read the project to understand what it is and does. Check the following if they exist:
`README.md`, `package.json` / `pyproject.toml`, existing rule files in `.cursor/rules/`, and the overall codebase structure.

Then open `.personaxis/personaxis.md` and replace every `TODO:` marker with real content derived from what you find:

- `identity.system_identity.purpose` — what does an agent working here exist to do?
- `character.virtues` (per-persona, beyond the universal `honesty`) — what does this project stand for?
- `character.principles` — how should agents make decisions here?
- `values_and_drives.goals` — what is this project ultimately trying to achieve?
- `reflexive_self_regulation.principled_refusals` — what situational refusals apply?

Use the spec field reference for guidance on what each field expects:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/SPEC.md

Do not leave any field as a TODO. If you are uncertain about a value, make a reasonable inference from the project context. The user can review and adjust afterwards — but you make the first pass.

## Step 3 — Validate

```bash
npx @personaxis/persona.md validate
```

Fix any errors before continuing.

## Step 4 — Compile to Cursor rules

```bash
npx @personaxis/persona.md compile --root --target cursor
```

This creates `.cursor/rules/persona.mdc` with `alwaysApply: true`, generated from `.personaxis/personaxis.md`. Cursor loads it into every conversation in this project automatically.

## Step 5 — Report and offer agent personas

After completing steps 1–4, give the user a brief summary:

- `.personaxis/personaxis.md` has been created and filled in based on this project. It defines the shared behavioral baseline for every agent here.
- `.cursor/rules/persona.mdc` has been generated and will be applied automatically to every Cursor conversation in this project.
- The user can open `.personaxis/personaxis.md` to review your interpretation and adjust any field that does not match their intent. After any change, re-run `personaxis compile --root --target cursor` to regenerate the rule file.

Then run:

```bash
npx @personaxis/persona.md templates
```

Show the user the output. Ask whether they want to add a role-specific agent persona — for example, a dedicated marketing agent, a code reviewer, or a legal assistant.

If the user says yes, help them choose from the list and run:

```bash
npx @personaxis/persona.md use <template-name> --target cursor
```

This creates the persona in `.personaxis/personas/<slug>/` and compiles a separate `.cursor/rules/<slug>.mdc` for that agent.

If the user is not sure, suggest they start with just the project baseline and add agent personas later when a specific need arises.

## Notes

- Unlike Claude Code, Cursor does not support `@file` references in rules. The compiled persona content is written into the `.mdc` file directly.
- If `.personaxis/personaxis.md` (or `.personaxis/personas/<slug>/personaxis.md`) changes, re-run `personaxis compile --target cursor` (with `--root` for the project baseline) to regenerate the rule file.
- Keep rule files focused — Cursor loads `alwaysApply: true` rules into every message. A large rule file increases token usage.
