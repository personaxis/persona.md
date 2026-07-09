# Setting up PERSONA.md with Codex

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
`AGENTS.md`, `README.md`, `package.json` / `pyproject.toml`, existing Codex files in `.codex/`, existing skills in `.agents/skills/`, and the overall codebase structure.

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

## Step 4 - Compile and wire into Codex

```bash
npx @personaxis/persona.md compile --root
```

This produces the repo-root `PERSONA.md` - a compiled, qualitative document generated from `.personaxis/personaxis.md` (see [`PERSONA_template.md`](../../PERSONA_template.md) for its section contract) - and adds a managed PERSONA.md section to `AGENTS.md` (creating it if it does not exist). Codex reads `AGENTS.md` as project instructions, so the section tells Codex to read the live root `PERSONA.md` and apply it as the behavioral baseline.

The section is wrapped in markers:

```markdown
<!-- PERSONA:BASELINE:BEGIN -->
## Behavioral Baseline

Always read @PERSONA.md at project root before acting.
Apply everything defined there to every decision, regardless of role.
Read your own @PERSONA.md too if one was provided to you.
<!-- PERSONA:BASELINE:END -->
```

Re-running the command replaces this section instead of duplicating it. Existing human-authored `AGENTS.md` content is preserved.

If you hand-edit `PERSONA.md` directly, run `npx @personaxis/persona.md push --root` (or `decompile --root` to preview) before the next compile - this folds your edits back into `.personaxis/personaxis.md` so the two stay consistent.

## Step 4b - Keep it alive (per-turn learning)

Codex has a **`Stop` hook** (like Claude Code), so per-turn learning is one command:

```bash
npx @personaxis/persona.md hooks install --host codex          # project (.codex/hooks.json)
npx @personaxis/persona.md hooks install --host codex --global # user (~/.codex/hooks.json)
```

This runs `personaxis observe --stdin` at the end of every turn — one governed tick on **your** model,
recompiling on drift, with no Codex tokens spent. You can additionally keep the persona alive through:

- **Subagent:** `.codex/agents/<slug>.toml` (Step 5) — Codex adopts the persona as a custom agent.
- **On-demand tools:** register the `personaxis-mcp` MCP server, or run `personaxis serve` for an HTTP boundary, so Codex can read/adjust the persona and run a governed `observe` tick when it chooses to.

Either way, configure the model once (endpoint, model, and the env var holding the key):

```bash
npx @personaxis/persona.md config set --global local.endpoint https://api.your-provider.com/v1
npx @personaxis/persona.md config set --global local.model    your-model-name
npx @personaxis/persona.md config set --global local.apiKeyEnv YOUR_API_KEY_ENV_VAR
```

See the CLI configuration concept for the full precedence rules: https://github.com/personaxis/cli/blob/main/docs/configuration.md

## Step 5 - Report and offer agent personas

After completing steps 1-4, give the user a brief summary:

- `PERSONA.md` has been created and filled in based on this project. It defines the shared behavioral baseline for every agent here. Its source is `.personaxis/personaxis.md`.
- `AGENTS.md` has been updated with a managed PERSONA.md section. Codex will read it as project instructions.
- The user can open `.personaxis/personaxis.md` to review your interpretation and adjust any field that does not match their intent, then recompile - or edit `PERSONA.md` directly and let `push`/`decompile` fold the changes back.

Then run:

```bash
npx @personaxis/persona.md templates
```

Show the user the output. Ask whether they want to add a role-specific agent persona for this project - for example, a dedicated marketing agent, a code reviewer, or a legal assistant.

If the user says yes, help them choose from the list and run:

```bash
npx @personaxis/persona.md use <template-name> --target codex
```

This creates the source persona package in `.personaxis/personas/<slug>/` (`personaxis.md`, `policy.yaml`, `state.json`, `memory.md`, `memory/`, `references/`, `examples/`, `skills/`, `assets/`, `manifest.json`) and compiles it to `.codex/agents/<slug>.toml`. The `.codex/agents/<slug>.toml` file follows the Codex custom-agent format: a TOML file with `name`, `description`, and `developer_instructions` (the compiled persona instructions). Local skills declared in `extensions.skills` are materialized to `.agents/skills/<name>/` by `personaxis compile`.

If the user is not sure, suggest they start with just the project baseline and add agent personas later when a specific need arises.

## Notes

- Re-run `personaxis compile --root` after any change to `.personaxis/personaxis.md`. The managed section in `AGENTS.md` is replaced, never duplicated.
- If you already have an `AGENTS.md` with existing content, the compile command appends or updates only the managed PERSONA.md section. Your existing content is untouched.
- Named agent personas in `.personaxis/personas/<slug>/` compile to `.codex/agents/<slug>.toml`. Local skills declared in `extensions.skills` are materialized to `.agents/skills/<name>/` (not `persona-<slug>`). These are generated files, not replacements for the source package.
- Edit `.personaxis/personas/<slug>/personaxis.md` and recompile, or edit `.codex/agents/<slug>.toml` directly and run `personaxis push <slug>` to fold the edit back. Do not edit materialized files in `.agents/skills/` directly.
- `personaxis.md` does not define MCP servers, plugins, or command approval rules. The Codex target does not generate `.codex/config.toml` or `.codex/rules/` from behavioral persona fields.
