# Setting up PERSONA.md with Claude Code

Follow these steps exactly. Do not skip any step.

## Step 1 — Create the project baseline

Run this at the project root:

```bash
npx personaxis init
```

Select **"Project baseline"** when prompted. Enter the project name.

This creates `PERSONA.md` at the project root with all ten required blocks and TODO markers.

## Step 2 — Fill in PERSONA.md based on the project

Read the project to understand what it is and does. Check the following if they exist:
`CLAUDE.md`, `README.md`, `package.json` / `pyproject.toml`, and the overall codebase structure.

Then open `PERSONA.md` and replace every `TODO:` marker with real content derived from what you find:

- `identity.purpose` — what does an agent working here exist to do?
- `character.values` — what does this project stand for?
- `character.principles` — how should agents make decisions here?
- `drives_values.mission` — what is this project ultimately trying to achieve?
- `normative_self_reg.principledRefusals` — what should no agent here ever do?

Use the spec field reference for guidance on what each field expects:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/SPEC.md

Do not leave any field as a TODO. If you are uncertain about a value, make a reasonable inference from the project context. The user can review and adjust afterwards — but you make the first pass.

## Step 3 — Validate

```bash
npx personaxis validate
```

Fix any errors before continuing.

## Step 4 — Wire into Claude Code

```bash
npx personaxis compile --target claude-code
```

This adds the following section to `CLAUDE.md` (creating it if it does not exist):

```markdown
<!-- PERSONAXIS:BASELINE:BEGIN -->
## Behavioral Baseline

This project has a shared behavioral baseline defined in @PERSONA.md.
Read it before acting. The character, values, and limits defined there
apply to every agent working in this project, regardless of role.
<!-- PERSONAXIS:BASELINE:END -->
```

The `@PERSONA.md` syntax tells Claude Code to read the live file each session. If `PERSONA.md` changes, Claude Code automatically picks up the new version — no need to recompile or update memory.

## Step 5 — Report and offer agent personas

After completing steps 1–4, give the user a brief summary:

- `PERSONA.md` has been created and filled in based on this project. It defines the shared behavioral baseline — the character, values, and limits that apply to every agent here, regardless of role.
- `CLAUDE.md` has been updated with a reference section (`@PERSONA.md`). You will read this file at the start of every session.
- The user can open `PERSONA.md` to review your interpretation and adjust any field that does not match their intent.

Then run:

```bash
npx personaxis templates
```

Show the user the output. Ask whether they want to add a role-specific agent persona for this project — for example, a dedicated marketing agent, a code reviewer, or a legal assistant.

If the user says yes, help them choose from the list and run:

```bash
npx personaxis use <template-name> --target claude-code
```

This creates the persona in `.personaxis/personas/` and registers it as a Claude Code subagent in `.claude/agents/`. You can then invoke it with `/agents`.

If the user is not sure, suggest they start with just the project baseline and add agent personas later when a specific need arises.

## Notes

- Re-run `personaxis compile --target claude-code` after any change to root `PERSONA.md`. The section in `CLAUDE.md` is replaced, never duplicated.
- If you already have a `CLAUDE.md` with existing content, the compile command appends the baseline section. Your existing content is untouched.
- Named agent personas in `.personaxis/personas/` compile to `.claude/agents/` — these are Claude Code subagents, not replacements for the root baseline.
