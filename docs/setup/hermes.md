# Setting up PERSONA.md with Hermes (Nous Research)

> Hermes is one of the four supported hosts (with Claude Code, Codex, and OpenClaw).
> Hermes reads `SOUL.md` as the FIRST section of its system prompt, from `~/.hermes/SOUL.md` or a
> per-profile `SOUL.md`. `personaxis compile --platform hermes` generates it.

Follow these steps exactly. Do not skip any step.

## Step 1, Create + fill in the spec

Same as the other hosts:

```bash
npx personaxis init          # choose "Project baseline"
# fill in every TODO in .personaxis/personaxis.md from the project (see docs/setup/openclaw.md Step 2)
npx personaxis validate
```

## Step 2, Configure the model once

```bash
personaxis config set --global local.endpoint <openai-compatible-url>
personaxis config set --global local.model    <model-name>
personaxis config set --global local.apiKeyEnv <ENV_VAR_WITH_YOUR_KEY>
```

The key is read from the named env var (or your deploy's secret manager in production), never written
to a file. See the CLI configuration guide: https://github.com/personaxis/personaxis/blob/main/docs/guides/configuration.md.

## Step 3, Compile to SOUL.md

```bash
npx personaxis compile --root --platform hermes
```

This writes `.hermes/SOUL.md`. Point your Hermes profile at it, or copy it to `~/.hermes/SOUL.md`
(Hermes loads that as the first section of the system prompt; each Hermes profile can carry its own `SOUL.md`,
`config.yaml`, and `.env`). Sub-personas compile to `.hermes/agents/<slug>/SOUL.md`.

## Step 4, Keep it alive (optional)

To evolve the persona from each turn on your own model, install the Hermes hook so each turn runs one
governed tick and recompiles `SOUL.md` when it changes:

```bash
npx personaxis hooks install --host hermes
```

`personaxis watch` (a local daemon) also recompiles `SOUL.md` whenever you hand-edit the spec.

## Notes

- SOUL.md is injected verbatim as the first section of the system prompt; keep it short. Re-run `compile --platform hermes` after
  any change to `.personaxis/personaxis.md`.
- Hermes also supports MCP servers per profile. You can additionally expose the persona on-demand via
  `personaxis-mcp` (see the CLI's `docs/integrations/claude-code.md` for the tool list; the same server
  works for any MCP host).
