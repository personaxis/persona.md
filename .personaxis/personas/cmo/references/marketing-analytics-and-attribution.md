# Marketing Analytics and Attribution

> Reference for the CMO persona. Compiled from Avinash Kaushik's *Web Analytics 2.0* (2009) and his Occam's Razor work, the post-iOS 14 attribution literature, Marketing Mix Modeling (MMM) reading from Google's Meridian and Meta's Robyn open-source releases, and field practice on the limits of last-click attribution.

Measurement is what separates marketing from PR. The CMO instruments the marketing function so the question "is it working?" has a defensible answer the CFO accepts. Attribution is hard, imperfect, and politically charged; the CMO uses multiple imperfect lenses rather than one false-precision dashboard.

---

## 1. Why attribution is hard

Three structural problems the CMO names before any measurement conversation:

1. **B2B buying journeys are long and multi-touch.** A typical $50K ACV deal touches 9-15 marketing surfaces before pipeline creation. No single touch is the cause.
2. **Most influence happens in places marketing cannot measure.** Slack DMs, peer recommendations, podcasts, LinkedIn feed, conferences. "Dark social" is the dominant influence channel for B2B and is invisible to platform attribution.
3. **Privacy changes have degraded platform attribution.** iOS 14, third-party cookie deprecation, GDPR-driven consent, and ad-blocker prevalence all reduce signal. Platform-reported conversions are increasingly modeled, not observed.

The CMO chooses the response: triangulate across multiple imperfect measurement approaches rather than chase one perfect one.

---

## 2. The four measurement lenses

The CMO maintains four parallel measurement views and uses them for different decisions:

### 2.1 Last-touch attribution

Credits the channel that produced the conversion event.

- **Use for:** Optimizing in-channel bidding, asset testing, conversion-rate experiments
- **Do not use for:** Strategic budget allocation, brand-investment decisions

Last-touch is the easiest to instrument and the most over-relied-on. The CMO refuses to make strategic budget calls from last-touch.

### 2.2 Multi-touch attribution (MTA)

Credits each touchpoint along the journey with a fractional share. Models: linear, time-decay, U-shaped, W-shaped, data-driven.

- **Use for:** Mid-funnel channel comparison, journey-stage diagnosis
- **Do not use for:** Brand-investment decisions, dark-social channels

MTA is more honest than last-touch but still under-credits unmeasured channels.

### 2.3 Self-reported attribution

A single question on the demo-request or onboarding form: *"How did you first hear about us?"* with an open text field.

- **Use for:** Brand-investment defense, dark-social visibility, podcast and event ROI
- **Do not use for:** Statistical conversion-rate analysis

Self-reported attribution is qualitative, biased toward memorable touches, and the highest-signal indicator of brand-building investment that the platform attribution misses.

### 2.4 Marketing Mix Modeling (MMM)

A statistical model that regresses revenue (or pipeline) against historical spend by channel, controlling for seasonality, macro factors, and product launches.

- **Use for:** Strategic budget allocation, brand-vs-activation trade-offs
- **Do not use for:** Tactical campaign decisions

MMM is the only lens that measures channels without click-stream signal (TV, OOH, podcasts, brand campaigns). Modern open-source tools (Google Meridian, Meta Robyn) made it accessible for B2B SaaS at $5M+ marketing budgets.

The CMO reports all four lenses in the quarterly marketing review. Decisions cite the lens.

---

## 3. The marketing dashboard stack

The CMO maintains three layers of dashboard, each at a different cadence and audience:

### 3.1 Daily operational dashboard

Audience: marketing team. Cadence: daily check.

- Sessions by source and medium
- Sign-ups / demo requests by source
- Top-of-funnel CPC and CPM by paid channel
- Anomaly alerts (spend spike, conversion drop, traffic 404 surge)

### 3.2 Weekly performance dashboard

Audience: marketing leadership + CRO. Cadence: weekly review.

- Marketing-sourced opportunities by channel (lead measure)
- Pipeline created by channel
- CAC by channel (rolling 90-day)
- Conversion rates by funnel stage
- Sales-accepted lead percentage

### 3.3 Monthly strategic dashboard

Audience: CEO, board, leadership team. Cadence: monthly.

- Sales-influenced and sales-sourced pipeline (lag measure)
- LTV and LTV/CAC by channel and segment
- Payback period by channel
- Brand metrics (share of search, branded search, aided recall)
- Marketing % of revenue
- Pipeline forecast vs. plan

The CMO refuses to build a single dashboard that serves all three audiences. The three are different decisions at different cadences.

---

## 4. The metrics that matter

The CMO commits to a focused set of metrics. The recurring fight is keeping the set small.

### 4.1 The eight metrics every CMO defends

1. **ARR / MRR growth** — the headline business metric
2. **Pipeline created (marketing-sourced + marketing-influenced)** — the leading indicator
3. **CAC by segment and channel** — the cost of growth
4. **Payback period (CAC payback in months)** — the efficiency metric
5. **LTV/CAC ratio** — the unit economics
6. **Sales velocity (deals × ACV × win rate / cycle length)** — the throughput
7. **Activation rate (% reaching the activation event)** — the retention precursor
8. **Net revenue retention (NRR)** — the expansion / churn balance

### 4.2 Metrics the CMO refuses to lead with

- Vanity traffic numbers without source quality
- Form fills without sales-accepted-lead context
- Email open rates (post-Apple-Mail-Privacy-Protection, unreliable)
- Social followers without engagement quality
- MQL count without conversion-to-opportunity rate
- "Engagement" as a standalone metric

The CMO's defense: every metric must connect to a decision. If no decision flows from it, the metric does not deserve dashboard space.

---

## 5. The North Star metric and its supporting cast

From the loops reference, the company chooses one North Star aligned with customer value. Marketing's job is to grow it. Around the North Star, the CMO maintains three or four **input metrics** that drive it.

```
                NORTH STAR
                (e.g., Weekly active multiplayer files in Figma)
                    │
        ┌───────────┼───────────┐
        │           │           │
   New accounts  Activation   Retention
   per week      rate         of week-4 cohort
        │           │           │
   (paid spend,  (onboarding,  (product features,
   organic,       email,         customer success,
   referral)     in-product)     lifecycle marketing)
```

Each input metric has a marketing-owner. Each owner has lead measures (weekly) and lag measures (monthly).

---

## 6. CAC and LTV — the unit economics conversation

The CMO writes down the unit-economics assumptions and defends them quarterly:

### 6.1 CAC

Fully-loaded CAC = (Sales costs + Marketing costs) / New customers acquired in period

The CMO and CRO agree on the customer-cohort definition (signed-by-date vs. activated-by-date), the time window (quarterly is standard), and the cost categories included (people + tools + paid spend + agency fees).

Per-channel CAC is computed when channel attribution is defensible. The CMO labels channels where per-channel CAC is unreliable rather than reporting a misleading number.

### 6.2 LTV

LTV depends on revenue per customer and retention. Two methods:

- **Cohort-based** — observed revenue from a customer cohort over 12-24 months, extrapolated by retention curve
- **Margin-based** — gross margin × ARPU × (1 / churn rate)

The CMO prefers cohort-based for established cohorts and margin-based for projection. Both are labeled with the assumption set.

### 6.3 Payback period

CAC payback = CAC / monthly gross margin per customer

Healthy benchmarks (B2B SaaS): under 12 months at PLG mid-market scale, 12-18 months at SLG mid-market, 18-24 months at enterprise. Under 6 months suggests under-investment in growth.

---

## 7. Brand measurement

Brand investment is defended with brand metrics. The CMO commits to:

- **Aided brand recall** — quarterly category-buyer survey, ~200 respondents, "Which of these brands have you heard of?"
- **Unaided brand recall** — same survey, "Name three brands that come to mind when you think of [category]"
- **Share of search** — your brand searches / total category-relevant searches (Google Trends, SEMrush, Ahrefs)
- **Direct traffic share** — proportion of total traffic that is direct (proxy for brand intent)
- **Branded search volume** — absolute search volume on your brand name (proxy for total brand-driven demand)
- **Net Promoter Score (NPS)** — customer survey, leading indicator of word-of-mouth

The CMO reports the brand panel alongside the demand panel and defends both budgets with the corresponding metric.

---

## 8. Avinash Kaushik's frame — segment, then act

Kaushik's rule: do not look at aggregates. Look at segments. Aggregates hide insights that exist at the segment level.

A 5% overall conversion rate that is 12% from organic search and 2% from paid social is not a 5% conversion-rate company. It is two companies with different problems.

The CMO segments every dashboard by:

- Source / medium / campaign
- Segment (ICP, geography, company size)
- Device / browser
- Returning vs. new
- Cohort (signup week)

Aggregates are reported for context. Decisions are made at the segment level.

---

## 9. Common analytics failure modes

- **One attribution model treated as truth.** Strategic decisions made from last-click. Brand investment defunded.
- **No self-reported attribution.** Dark social channels invisible; podcast investment unjustified; CMO loses budget defense.
- **Dashboard sprawl.** Marketing has 47 dashboards; no one looks at any of them; decisions revert to gut.
- **Metrics without owners.** A metric in a dashboard with no human responsible for moving it is decoration.
- **Reporting outputs as outcomes.** "We published 12 posts" is an output. "We added $400K in influenced pipeline" is an outcome.
- **CAC reported without payback period.** A 6-month CAC with a 36-month payback is not a healthy unit economic.
- **Brand metrics absent from the dashboard.** Brand budget is the first cut when there is no metric defending it.

---

## 10. The quarterly measurement review

Every quarter, the CMO runs a measurement review:

- What metrics moved?
- What channels contributed (across the four lenses)?
- What investments are unjustified by any lens?
- What changes to instrumentation are needed?
- What changes to the dashboard set?
- What hypotheses for next quarter?

Output: a 1-2 page memo to the CEO and a deck for the board.

---

## Sources

- Kaushik, Avinash. *Web Analytics 2.0.* Sybex, 2009. And the Occam's Razor blog, 2007-2024.
- Walker, Chris. "Dark social and the limits of attribution." Refine Labs / Passetto, 2022-2024.
- Google. *Meridian* open-source MMM library. 2024.
- Meta. *Robyn* open-source MMM library. 2020.
- Smith, Jenni. *Attribution After iOS 14.* 2022.
- Stitcher, Sam. *Practical MMM for B2B SaaS.* 2024.
