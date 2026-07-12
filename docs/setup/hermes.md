# Setting up PERSONA.md with Hermes (Nous Research)

> **Live target.** Hermes is one of the four focus hosts (with Claude Code, Codex, and OpenClaw).
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
to a file. See the CLI's `docs/configuration.md`.

## Step 3, Compile to SOUL.md

```bash
npx personaxis compile --root --platform hermes
```

This writes `.hermes/SOUL.md`. Point your Hermes profile at it, or copy it to `~/.hermes/SOUL.md`
(Hermes loads that as the agent identity; each Hermes **profile** can carry its own `SOUL.md`,
`config.yaml`, and `.env`). Sub-personas compile to `.hermes/agents/<slug>/SOUL.md`.

## Step 4, Keep it alive (optional)

To evolve the persona from each turn on **your own model**, run one governed tick per turn and let it
recompile `SOUL.md` on drift:

```bash
# from a Hermes end-of-turn hook or a cron, pipe the turn to:
personaxis observe --stdin        # or: personaxis observe --observation "<turn>"
```

`personaxis watch` (a local daemon) also recompiles `SOUL.md` whenever you hand-edit the spec. Native
per-host hook installers beyond Claude Code are on the roadmap.

## Notes

- SOUL.md is injected verbatim as identity; keep it focused. Re-run `compile --platform hermes` after
  any change to `.personaxis/personaxis.md`.
- Hermes also supports MCP servers per profile, you can additionally expose the persona on-demand via
  `personaxis-mcp` (see the CLI's `docs/integrations/claude-code.md` for the tool list; the same server
  works for any MCP host).
