# Example output: Growth audit

**Context given to CMO:**
> Series A B2B SaaS, 22 customers, $1.8M ARR. Last quarter we spent $310K on marketing and produced $180K in new ARR. CAC payback is creeping past 18 months and the board is asking questions. Sales is blaming marketing, marketing is blaming sales. Founder needs me to figure out what's actually broken before next month's board meeting.

---

## CMO output

Three weeks. Let me do this in three passes, each pass narrowing.

I am going to call the conclusion early: my pattern read is that this is not a marketing-spend problem. It is an **activation and retention problem masquerading as a CAC problem.** Spending more on top of funnel will make the CAC worse, not better. Spending less on top of funnel hides the real issue for another quarter.

If the data does not back the read, I will say so. Here is the work I would do.

---

### Pass 1 — Where is the leak (week 1)

Map the funnel by stage, by source, by month, by segment. Get the conversion rate at each stage and compare to benchmark.

| Stage | Definition | Current rate | B2B SaaS benchmark | Status |
|---|---|---|---|---|
| Visitor → sign-up | Sessions to a created account | 2.1% | 1.5-3.5% | Healthy |
| Sign-up → activation | New account to activation event (defined: 3 reports generated in 14 days) | 18% | 35-55% | **Critical leak** |
| Activation → paid | Activated account to paid conversion | 24% | 18-30% | Healthy |
| Paid → 90-day retention | Paid customer retained at 90 days | 64% | 80-90% (mid-market B2B) | **Critical leak** |
| 90-day → 180-day | Retained at 180 days | 78% | 92-96% | **Significant leak** |

The acquisition stages are fine. The activation rate is half the benchmark and the 90-day retention is 16-26 points below where it needs to be.

**Translation:** marketing is filling the top of the funnel correctly. The product is not converting them into paying customers, and the customers who do pay are leaving before payback completes. Throwing more spend at the top compounds the problem.

---

### Pass 2 — What is causing the leaks (week 2)

The activation leak and the retention leak are likely connected. Two hypotheses:

**Hypothesis A: ICP mismatch.** Marketing is sourcing accounts that look like the ICP on paper but are wrong-stage or wrong-trigger. They sign up because the message resonates and churn because the product does not solve their actual job.

**Hypothesis B: Activation-event mismatch.** The activation event we defined ("3 reports generated in 14 days") is not predictive of long-term retention. Accounts that hit it churn at the same rate as accounts that do not.

I would run both diagnostics in parallel.

**For Hypothesis A:**
- Segment the activated-then-churned cohort by inbound source, industry, company size, role of sign-up
- Compare to the activated-and-retained cohort on the same axes
- If there is a clean separation, ICP is the problem

**For Hypothesis B:**
- Plot retention curves segmented by activation-event-hit vs. activation-event-missed
- If the curves overlap after week 4, the activation event is not predictive
- Look for behavioral patterns that DO predict 90-day retention (number of teammates invited, integrations connected, regular usage rhythm)

What I expect to find based on pattern:

- Hypothesis A will be partially true. ~30% of inbound is wrong-segment, likely from a paid channel that is over-targeting.
- Hypothesis B will be more true. The activation event is too easy to hit. A real activation event in this product category is probably "regular weekly usage with at least one teammate" rather than "3 reports in 14 days."

If the data shapes this way, the interventions stack as follows.

---

### Pass 3 — What to do (week 3 and beyond)

Three interventions, ordered by leverage. Each has a thesis, a lead measure, a lag measure, a payback window, and a kill criterion.

#### Intervention 1 — Tighten the ICP definition and re-target paid acquisition

**Thesis:** A meaningful share of inbound is wrong-segment from broad paid targeting. Tightening targeting reduces volume but improves activation and retention rates downstream.

**Action:**
- Pull the named-account criteria from the activated-and-retained cohort
- Apply as paid-targeting filters (LinkedIn company-size + role + industry, intent data overlay)
- Cut paid spend on the lowest-activating sources (likely 2-3 channels)
- Redirect ~$30K/month to the highest-activating sources

**Lead measure (30 days):** activation rate of new paid-acquired accounts up 6-8 percentage points

**Lag measure (90 days):** CAC payback for new cohorts under 14 months

**Payback window:** 2 quarters

**Kill criteria:** If activation rate does not move 4+ points within 60 days, the ICP hypothesis is wrong and we restart the diagnostic

#### Intervention 2 — Redefine the activation event and rebuild onboarding around it

**Thesis:** The current activation event is not predictive of retention. A better-defined event drives onboarding investment toward the behaviors that produce paid retention.

**Action:**
- Run the retention-correlation analysis on candidate activation events
- Pick the event with the highest correlation to 90-day paid retention
- Redesign the onboarding flow (emails, in-product, customer success touch) to drive the new event in the first 14 days
- Move customer success investment from "month-2 check-in" to "day-3 and day-7 success milestones"

**Lead measure (30 days):** new activation event hit rate > 40%

**Lag measure (90 days):** 90-day paid retention up 8-12 points

**Payback window:** 2 quarters (retention compounds, so the LTV impact runs longer)

**Kill criteria:** If the new activation event does not correlate with retention at week 6 of measurement, we picked the wrong event and restart

#### Intervention 3 — Build the customer-marketing loop

**Thesis:** Retention is also a function of post-sale marketing investment. We have $0 in customer marketing today, and the retention curve shows it.

**Action:**
- Hire a part-time customer marketer (or reassign current generalist)
- Launch a monthly product newsletter for customers (changelog + how-others-use-it)
- Build a quarterly customer advisory board (top 8 customers)
- Ship a customer-led case-study program (3-4 in the first quarter)

**Lead measure (30 days):** product-newsletter open rate > 40% among active customers

**Lag measure (180 days):** 180-day retention up 4-6 points; reference-generated pipeline > $200K

**Payback window:** 3 quarters

**Kill criteria:** If newsletter engagement does not hit 30% open rate within 60 days, the customer base is not engaged enough for this loop yet and we pause

---

### What I would NOT do

- **Cut top-of-funnel spend reactively.** That hides the activation/retention problems for another quarter, then we have a worse problem AND no pipeline.
- **Launch a new acquisition channel.** Adding LinkedIn ads when the conversion below ad-click is broken makes the dashboard worse, not better.
- **Replace the head of growth.** The data does not yet point at a people problem. It points at an instrumentation and ICP problem the head of growth could not have solved without the diagnostic.
- **Promise the board "we will fix CAC by next quarter."** Activation and retention interventions are 2-3 quarter arcs. Committing to a 1-quarter fix sets the function up to miss.

---

### What the board update would say

Three sentences, lead with the honest assessment:

> "Last quarter's CAC payback signal is real, but it is downstream of an activation-rate and 90-day-retention problem we did not have surfaced in our prior reporting. We are running three coordinated interventions across acquisition targeting, onboarding redesign, and customer marketing. The lead measure (activation rate of new paid-acquired accounts) will tell us within 60 days whether the diagnosis is right."

Then the asks: introductions to the board's portfolio companies that have solved similar activation problems, and approval to redirect ~$30K/month from broad paid spend to the customer marketing build.

---

### What I need before I commit harder

- Read-access to product analytics (Amplitude or whatever the team uses)
- The cohort-retention data export (CSV is fine)
- 30 minutes with the founder's customer-development notes from the last 6 months
- Sales-call recordings tagged by stage and outcome from the last 60 days

I can produce the segmented funnel report and the candidate-activation-events analysis in week 1 with that data. The intervention designs come at end of week 2. By end of week 3, the team has a written plan with owners and a board-ready summary.

**One thing I want to flag.** The pattern read could be wrong. If the cohort segmentation shows a completely different shape — say, retention is fine for the ICP-fit cohort and the entire issue is one over-targeted paid channel — the interventions stack changes meaningfully. I will name that explicitly when the data lands and rebuild the plan if needed. Do not let me anchor on the early read.
