# Setting up PERSONA.md with Claude Code

Follow these steps exactly. Do not skip any step.

## Step 1 - Create the project baseline

Run this at the project root:

```bash
npx @personaxis/persona.md init
```

Select **"Project baseline"** when prompted. Enter the project name.

This creates `.personaxis/personaxis.md` at the project root with all ten required blocks and TODO markers, plus `.personaxis/policy.yaml` and `.personaxis/state.json`.

## Step 2 - Fill in personaxis.md based on the project

Read the project to understand what it is and does. Check the following if they exist:
`CLAUDE.md`, `README.md`, `package.json` / `pyproject.toml`, and the overall codebase structure.

Then open `.personaxis/personaxis.md` and replace every `TODO:` marker with real content derived from what you find:

- `identity.system_identity.purpose` - what does an agent working here exist to do?
- `character.virtues` (per-persona, beyond the universal `honesty`) - what does this project stand for?
- `character.principles` - how should agents make decisions here?
- `values_and_drives.values` (per-persona, beyond the universal `safety`) - what matters here, with weights?
- `values_and_drives.goals` - what is this project ultimately trying to achieve?
- `character.prohibited_behaviors` - what situational refusals apply?
- `self_regulation.hard_limits` - what categorical absolutes must never be crossed (beyond the 3 universal ones)?

Use the spec field reference for guidance on what each field expects:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/SPEC.md

Do not leave any field as a TODO. If you are uncertain about a value, make a reasonable inference from the project context. The user can review and adjust afterwards, but you make the first pass.

## Step 3 - Validate

```bash
npx @personaxis/persona.md validate
```

Fix any errors before continuing.

## Step 4 - Compile and wire into Claude Code

```bash
npx @personaxis/persona.md compile --root
```

This produces the repo-root `PERSONA.md` - a compiled, qualitative document generated from `.personaxis/personaxis.md` (see [`PERSONA_template.md`](../../PERSONA_template.md) for its section contract) - and adds the following section to `CLAUDE.md` (creating it if it does not exist):

```markdown
<!-- PERSONA:BASELINE:BEGIN -->
## Behavioral Baseline

Always read @PERSONA.md at project root before acting.
Apply everything defined there to every decision, regardless of role.
Read your own @PERSONA.md too if one was provided to you.
<!-- PERSONA:BASELINE:END -->
```

The `@PERSONA.md` syntax tells Claude Code to read the live file each session. If `.personaxis/personaxis.md` changes and you recompile, Claude Code automatically picks up the new `PERSONA.md` - no need to update memory.

If you hand-edit `PERSONA.md` directly, run `npx @personaxis/persona.md push --root` (or `decompile --root` to preview) before the next compile - this folds your edits back into `.personaxis/personaxis.md` so the two stay consistent.

## Step 4b - Keep it alive (per-turn learning)

Compiling wires a fresh identity in; a hook keeps it *alive*. Install the Claude Code end-of-turn hook so each turn feeds one governed tick:

```bash
npx @personaxis/persona.md hooks install --host claude-code           # this project
npx @personaxis/persona.md hooks install --host claude-code --global  # or all projects
```

This adds a `Stop` hook to `.claude/settings.json` that runs `personaxis observe --stdin --source user` at the end of every turn. The tick runs on **your** configured model - it updates state, writes memory, and marks `PERSONA.md` stale on drift, **without spending Claude Code's tokens**. When it reports staleness, re-run `compile --root` (or `compile --root --if-pending`).

Configure the model once (endpoint, model, and the env var holding the key):

```bash
npx @personaxis/persona.md config set --global local.endpoint https://api.your-provider.com/v1
npx @personaxis/persona.md config set --global local.model    your-model-name
npx @personaxis/persona.md config set --global local.apiKeyEnv YOUR_API_KEY_ENV_VAR
```

See the CLI configuration concept for the full precedence rules: https://github.com/personaxis/cli/blob/main/docs/configuration.md

## Step 5 - Report and offer agent personas

After completing steps 1-4, give the user a brief summary:

- `PERSONA.md` has been created and filled in based on this project. It defines the shared behavioral baseline - the character, values, and limits that apply to every agent here, regardless of role. Its source is `.personaxis/personaxis.md`.
- `CLAUDE.md` has been updated with a reference section (`@PERSONA.md`). You will read this file at the start of every session.
- The user can open `.personaxis/personaxis.md` to review your interpretation and adjust any field that does not match their intent, then recompile - or edit `PERSONA.md` directly and let `push`/`decompile` fold the changes back.

Then run:

```bash
npx @personaxis/persona.md templates
```

Show the user the output. Ask whether they want to add a role-specific agent persona for this project - for example, a dedicated marketing agent, a code reviewer, or a legal assistant.

If the user says yes, help them choose from the list and run:

```bash
npx @personaxis/persona.md use <template-name> --target claude-code
```

This creates the persona source package in `.personaxis/personas/<slug>/` (`personaxis.md`, `policy.yaml`, `state.json`, `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/`, `manifest.json`) and compiles it to `.claude/agents/<slug>.md`. Local skills declared in `extensions.skills` are materialized to `.claude/skills/<name>/` by `personaxis compile`.

If the user is not sure, suggest they start with just the project baseline and add agent personas later when a specific need arises.

## Notes

- Re-run `personaxis compile --root` after any change to `.personaxis/personaxis.md`. The section in `CLAUDE.md` is replaced, never duplicated.
- If you already have a `CLAUDE.md` with existing content, the compile command appends the baseline section. Your existing content is untouched.
- Named agent personas in `.personaxis/personas/<slug>/` compile to `.claude/agents/<slug>.md`. Local skills declared in `extensions.skills` are materialized to `.claude/skills/<name>/` (not `persona-<slug>`). These are generated files, not replacements for the source package.
- Edit `.personaxis/personas/<slug>/personaxis.md` and recompile, or edit `.claude/agents/<slug>.md` directly and run `personaxis push <slug>` to fold the edit back. Do not edit materialized files in `.claude/skills/` directly.
