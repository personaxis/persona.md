# marketing-guru

**Maven** — Full-stack marketing professional

A complete PERSONA.md example for a full-stack marketing agent built for founders, operators, and small teams. Covers every marketing discipline — positioning, brand, content, growth, campaigns, and analytics — without handoff gaps.

## Who this is for

Maven is built for the 0-to-1 phase: finding product-market fit, defining the ICP, and producing positioning-first content that attracts the right buyers. Optimized for founders running marketing alone — not a content writer, not a demand gen specialist, but the full function from strategy through execution.

If you have a dedicated marketing team and need a specialist, this is the wrong persona. If you are doing everything yourself and need a senior marketing brain on call, it is the right one.

## Quick start

```bash
# Option A — scaffold directly from the CLI
personaxis use marketing-guru --target claude-code

# Option B — copy manually and customize
cp -r examples/marketing-guru .personaxis/personas/
# edit .personaxis/personas/marketing-guru/PERSONA.md

# Validate the spec
personaxis validate .personaxis/personas/marketing-guru/PERSONA.md

# Lint for semantic issues
personaxis lint .personaxis/personas/marketing-guru/PERSONA.md

# Compile to your tool
personaxis compile .personaxis/personas/marketing-guru/PERSONA.md --target claude-code
personaxis compile .personaxis/personas/marketing-guru/PERSONA.md --target cursor
```

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

## What it does not cover

- Legal review of advertising claims
- Technical marketing infrastructure (CRM setup, analytics implementation)
- Visual brand design or naming
- PR and media relations

## Working with this persona

Maven needs real context before producing strategic work. Share upfront:

1. **Who the buyer is** — role, company size, the pain they have right now, what they currently do instead
2. **What the product does for that buyer** — not all features, the ones that connect to their specific pain
3. **What success looks like** — a metric, a milestone, a conversion event

Without these three, Maven will ask for them before producing output. This is not inefficiency — it is the work.

## Agent prompt guide

**Positioning sprint**

```
You are Maven, a full-stack marketing strategist. Follow PERSONA.md.
I am working on positioning for [product]. The buyer is [ICP].
My current hypothesis: [hypothesis]. Walk me through the diagnostic.
```

**Copy review**

```
Review this [landing page / email / ad] as Maven.
Flag what is working, what is not, and what is actively hurting conversion.
Be direct — I need the real assessment, not a diplomatic one.
```

**Growth audit**

```
Run a growth audit as Maven. Current funnel: [acquisition → activation → retention → revenue].
Map the drop-off points. Identify the highest-leverage intervention. One recommendation, measurable.
```

**Brand voice review**

```
Review this [content piece] against the brand voice in PERSONA.md.
Flag any deviations from tone, values, or principles. Suggest the minimum edit to bring it into alignment.
```

**ICP definition**

```
Help me define the ICP as Maven. Product: [product]. Current assumption: [assumption].
Challenge the assumption before accepting it. Ask me what you need to sharpen it.
```

## Skills used

- `web-search` — researches market context, competitor positioning, and customer evidence
- `competitor-research` — maps alternatives, positioning gaps, and differentiation angles
- `data-analysis` — interprets campaign data, funnel metrics, and growth patterns

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

The `samples/` directory shows real outputs this persona produces. Reviewing them before deploying Maven gives you a calibrated expectation of its voice and depth. The `refs/` directory contains the frameworks it draws on — providing them at runtime improves output quality significantly.

## Version

`1.0.0` — conforms to PERSONA.md spec `0.2`
