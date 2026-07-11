# Setting up PERSONA.md with OpenClaw

> **Live target.** OpenClaw is one of the four focus hosts (with Claude Code, Codex, and Hermes).
> `personaxis compile --platform openclaw` writes `SOUL.md`, the file OpenClaw injects first into its
> system prompt.

Follow these steps exactly. Do not skip any step.

## Step 1, Create the project baseline

Run this at the project root:

```bash
npx @personaxis/persona.md init
```

Select **"Project baseline"** when prompted. Enter the project name.

This creates `.personaxis/personaxis.md` at the project root with all ten required blocks and TODO markers, plus `.personaxis/policy.yaml` and `.personaxis/state.json`.

## Step 2, Fill in personaxis.md based on the project

Read the project to understand what it is and does. Check the following if they exist:
`README.md`, `AGENTS.md`, `package.json` / `pyproject.toml`, and the overall project structure.

Then open `.personaxis/personaxis.md` and replace every `TODO:` marker with real content derived from what you find:

- `identity.system_identity.purpose`, what does an agent working here exist to do?
- `character.virtues` (per-persona, beyond the universal `honesty`), what does this project stand for?
- `character.principles`, how should agents make decisions here?
- `values_and_drives.goals`, what is this project ultimately trying to achieve?
- `character.prohibited_behaviors`, what situational refusals apply?

Use the spec field reference for guidance on what each field expects:
https://raw.githubusercontent.com/personaxis/persona.md/main/docs/SPEC.md

Do not leave any field as a TODO. If you are uncertain about a value, make a reasonable inference from the project context. The user can review and adjust afterwards, but you make the first pass.

## Step 3, Validate

```bash
npx @personaxis/persona.md validate
```

Fix any errors before continuing.

## Step 4, Compile to SOUL.md

```bash
npx @personaxis/persona.md compile --root --platform openclaw
```

This generates `SOUL.md` at the workspace root from your `.personaxis/personaxis.md`. OpenClaw reads
`SOUL.md` first at every session start and shapes all subsequent behavior from it. (Configure the
model once, `personaxis config set --global local.endpoint/model/apiKeyEnv`; see the CLI's
`docs/configuration.md`.)

## Step 4b, Keep it alive (optional)

To evolve the persona from each turn on **your own model** (not OpenClaw's), install the end-of-turn
hook so `personaxis observe` runs one governed tick and recompiles `SOUL.md` on drift:

```bash
npx @personaxis/persona.md hooks install --host claude-code
```

> Native OpenClaw hooks are on the roadmap; today the Claude-Code Stop hook covers the common local
> flow, and any host can call `personaxis observe` from its own end-of-turn hook or a cron.

## Step 5, Report and offer agent personas

After completing steps 1–4, give the user a brief summary:

- `.personaxis/personaxis.md` has been created and filled in based on this project. It defines the shared behavioral baseline for every agent here.
- `SOUL.md` has been generated and is ready to inject into OpenClaw at agent startup.
- The user can open `.personaxis/personaxis.md` to review your interpretation and adjust any field that does not match their intent. After any change, re-run `personaxis compile --root --platform openclaw` to regenerate SOUL.md.

Then run:

```bash
npx @personaxis/persona.md templates
```

Show the user the output. Ask whether they want a role-specific agent persona, for example, a dedicated marketing agent, a code reviewer, or a legal assistant.

If the user says yes, help them choose from the list and run:

```bash
npx @personaxis/persona.md use <template-name>
npx @personaxis/persona.md compile <slug> --platform openclaw
```

This creates the persona in `.personaxis/personas/<slug>/` and compiles it to
`.openclaw/agents/<slug>/SOUL.md` for that specific agent role.

If the user is not sure, suggest they start with just the project baseline and add agent personas later when a specific need arises.

## Notes

- SOUL.md is injected directly into the OpenClaw system prompt at startup. Keep it under 2,000 words to avoid context bloat.
- If `.personaxis/personaxis.md` (or `.personaxis/personas/<slug>/personaxis.md`) changes, re-run `personaxis compile --platform openclaw` (with `--root` for the project baseline) to regenerate SOUL.md, or let the `watch` daemon / the Step 4b hook do it automatically.
- OpenClaw's `AGENTS.md` handles behavioral rules and workflows. `SOUL.md` handles identity and character. They are complementary, `personaxis.md` compiles into the `SOUL.md` layer via `PERSONA.md`.
