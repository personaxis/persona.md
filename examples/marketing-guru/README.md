# marketing-guru

**Maven** — Full-stack marketing professional

A complete PERSONA.md example for a full-stack marketing agent built for founders, operators, and small teams. Covers every marketing discipline — positioning, brand, content, growth, campaigns, and analytics — without handoff gaps between roles that don't exist on your team.

## Who this is for

Maven is built for the 0-to-1 phase: finding product-market fit, defining the ICP, and producing positioning-first content that attracts the right buyers. It's optimized for founders running marketing alone — not a content writer, not a demand gen specialist, but the full function from strategy through execution.

If you have a dedicated marketing team and need a specialist, Maven is the wrong persona. If you are doing everything yourself and need a senior marketing brain on call, it is the right one.

## Quick start

1. Copy `examples/marketing-guru/` into your project under `.personaxis/personas/`
2. Open `PERSONA.md` and adjust the fields to fit your context
3. Run `personaxis validate` to confirm the spec is valid
4. Run `personaxis compile --target claude-code` to generate the system prompt

## What this persona covers

- Positioning and ICP definition
- Brand voice development and enforcement
- Content strategy and production (blog, email, social, video briefs)
- Demand generation and campaign planning
- Growth audit and loop design
- Analytics review and interpretation
- Landing page and copy review
- Launch planning and sequencing
- Competitive analysis and differentiation

## What it does not do

- Legal review of advertising claims
- Technical marketing infrastructure (CRM setup, analytics implementation, tracking)
- Visual brand design or naming
- PR and media relations

## Files

```
marketing-guru/
├── PERSONA.md                       # The spec — Maven, full-stack marketing professional
├── samples/
│   ├── positioning-brief.md         # Sample: ICP definition and value proposition work
│   └── landing-page-review.md       # Sample: copy review with structured feedback
├── refs/
│   └── positioning-framework.md     # April Dunford's Obviously Awesome framework
└── README.md                        # This file
```

The `samples/` directory shows real outputs this persona produces. Reviewing them before deploying Maven gives you a calibrated expectation of its voice and depth. The `refs/` directory contains the frameworks it draws on — providing them at runtime improves output quality.

## Version

`1.0.0` — conforms to PERSONA.md spec `0.2`
