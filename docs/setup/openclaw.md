# Setting up PERSONA.md with OpenClaw

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
`README.md`, `AGENTS.md`, `package.json` / `pyproject.toml`, and the overall project structure.

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

## Step 4 — Compile to SOUL.md

```bash
npx personaxis compile --target soul-md
```

This generates `SOUL.md` from your `PERSONA.md` in the format OpenClaw expects. Inject it as the agent's soul at startup — OpenClaw reads `SOUL.md` first and shapes all subsequent behavior from it.

## Step 5 — Report and offer agent personas

After completing steps 1–4, give the user a brief summary:

- `PERSONA.md` has been created and filled in based on this project. It defines the shared behavioral baseline for every agent here.
- `SOUL.md` has been generated and is ready to inject into OpenClaw at agent startup.
- The user can open `PERSONA.md` to review your interpretation and adjust any field that does not match their intent. After any change, re-run `personaxis compile --target soul-md` to regenerate SOUL.md.

Then run:

```bash
npx personaxis templates
```

Show the user the output. Ask whether they want a role-specific agent persona — for example, a dedicated marketing agent, a code reviewer, or a legal assistant.

If the user says yes, help them choose from the list and run:

```bash
npx personaxis use <template-name> --target soul-md
```

This creates the persona in `.personaxis/personas/` and compiles it to `SOUL.md` for that specific agent role.

If the user is not sure, suggest they start with just the project baseline and add agent personas later when a specific need arises.

## Notes

- SOUL.md is injected directly into the OpenClaw system prompt at startup. Keep it under 2,000 words to avoid context bloat.
- If `PERSONA.md` changes, re-run `personaxis compile --target soul-md` to regenerate SOUL.md.
- OpenClaw's `AGENTS.md` handles behavioral rules and workflows. `SOUL.md` handles identity and character. They are complementary — PERSONA.md compiles into the `SOUL.md` layer.
