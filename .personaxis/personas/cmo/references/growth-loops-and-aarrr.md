# Growth Loops and AARRR

> Reference for the CMO persona. Compiled from Dave McClure's "Startup Metrics for Pirates" (2007), Brian Balfour and Reforge's growth-loops work (2018+), Sean Ellis's *Hacking Growth* (2017), and Andrew Chen's writing on networked effects.

Growth funnels are the entry point. Growth loops are the durable model. The CMO uses funnels to diagnose stage-by-stage conversion and loops to design compounding distribution. Most companies optimize the funnel and never build the loop, then wonder why CAC rises every quarter.

---

## 1. AARRR, the diagnostic funnel

Dave McClure's "Pirate Metrics" framework names five stages every business has to instrument:

| Stage | Question | Lead measure | Typical instrumentation |
|---|---|---|---|
| **Acquisition** | Where do users come from? | Sessions, sign-ups by source | UTM, ad platforms, GA4, attribution model |
| **Activation** | Do they have a successful first experience? | % reaching the activation event | Product analytics, cohort funnels |
| **Retention** | Do they come back? | DAU/WAU/MAU, cohort retention curves | Product analytics, retention dashboards |
| **Revenue** | Do they pay? | ARR, MRR, ARPU, gross margin | Billing, finance |
| **Referral** | Do they bring others? | K-factor, virality, NPS-driven invites | Referral tracking, NPS surveys |

The CMO instruments all five before allocating budget. Without the instrumentation, every channel decision is a guess.

### 1.1 The activation event

Activation is the most under-instrumented stage. The CMO defines a specific, observable, time-bounded event that correlates with long-term retention. Examples:

- **Slack:** team sends 2,000 messages within 30 days
- **Dropbox:** user installs the desktop app, uploads ≥1 file within 1 day
- **HubSpot:** user connects email + creates a contact within 7 days
- **Notion:** user creates 3 pages + invites 1 teammate within 7 days

The activation event is the lead measure for retention. Marketing's job ends when the activation event fires, not when the sign-up completes.

### 1.2 Retention curves

The CMO reads retention as a curve, not a number. Three patterns:

```
Smiling curve         Flat retention         Cliff retention
(retention > 0% asymptote)
  100% ┐               100% ┐                 100% ┐
       │                    │                      │
       │                    │                      │
       └─────────╴          └─────────╴            └──╲
                                                       ╲
       PMF achieved.        Stable, no growth.        No PMF.
       Loops viable.        Loops drive growth.       Fix product first.
```

A flat retention curve at ≥40% (B2B SaaS) is the gate for scaling acquisition. Before it, every dollar spent leaks. The CMO refuses to scale acquisition above the retention floor.

---

## 2. From funnels to loops

A **funnel** runs left to right and converts input to output. A **loop** runs in a circle and converts output back into input. Loops compound; funnels do not.

```
Funnel (does not compound)

  Top of funnel ──> Convert ──> Activate ──> Retain ──> Revenue
   (paid spend)                                            │
                                                           v
                                                       Done.

Loop (compounds)

       ┌─────────────────────────────────────────────────────┐
       │                                                     │
       v                                                     │
  New users ──> Activate ──> Take action ──> Output ─────────┘
                              that produces
                              distribution
```

### 2.1 Reforge's loop taxonomy

Reforge's research (Balfour, Casey Winters) classifies loops into four families:

**Content loops**: users produce content, content attracts new users via search or social. Examples: Pinterest pins, Stack Overflow answers, Notion templates, GitHub repos.

**Viral loops**: users invite other users. Sub-types:
- *Word-of-mouth* (Slack, Zoom, invitation is functional)
- *Network invitation* (Dropbox referral credit, invitation is incentivized)
- *Viral content* (Loom video shared with non-users, invitation is incidental)

**Paid loops**: revenue from existing users funds acquisition of new users. Compounds only when LTV > CAC and payback is faster than runway pressure.

**Sales loops**: customer success generates references and case studies, which generate enterprise pipeline. Compounds only when the success motion is reliable.

### 2.2 Anatomy of a loop

Every loop has the same four elements:

1. **Input**: what brings the user in (channel, search, invite, ad)
2. **Action**: what the user does (sign up, create content, invite, buy)
3. **Output**: what the user produces (content, invitation, referral, revenue)
4. **Re-input**: how the output produces new input

A loop is healthy when each step has a measured conversion rate and the loop's *compounding rate* (output per user × conversion of output to new user) is > 1 over a meaningful time window.

### 2.3 The compounding equation

For a loop with:
- N users at time t
- A actions per user (output produced)
- C conversion of action to new user

Then:

```
N(t+1) = N(t) × (1 + A × C)
```

The CMO instruments A and C separately. Most "viral loop is broken" diagnoses are actually a problem in A (users are not producing the output) or C (the output is not converting). Without separation, the fix is wrong.

---

## 3. Loop selection by stage and motion

Not every business gets every loop. The CMO matches loops to product and motion:

| Motion | Default loops |
|---|---|
| **PLG B2B** (Slack, Notion, Linear) | Viral team-invitation + content marketing + ICP-targeted paid |
| **SLG B2B** (Salesforce-style enterprise sales) | Sales-led: customer references + content authority + ABM + events |
| **B2C consumer** (Duolingo, Headspace) | Content (SEO + UGC) + paid + lifecycle re-engagement |
| **Marketplace** (Airbnb-style) | Two-sided viral + paid acquisition on the thin side + content SEO |
| **Developer tool** (Stripe, Vercel) | Docs SEO + content + product-led referral + community |

The CMO does not chase loops that the motion will not support. A consumer-style viral loop in a $50K ACV enterprise sale is not a fit.

---

## 4. Building the first loop, sequencing

The CMO sequences loop work in three phases:

### Phase 1, Instrument the funnel (weeks 1–4)
- AARRR dashboard live
- Activation event defined and measured
- Retention curve plotted by weekly cohort
- One source of truth for ARR, ARPU, CAC, LTV, payback

### Phase 2, Diagnose the constraint (weeks 5–8)
- Where is the funnel leaking the most relative to benchmark?
- Is retention shaped right? If not, stop scaling acquisition.
- What loop, if working, would compound the company's distribution?

### Phase 3, Build the loop (weeks 9–24)
- Pick one loop. Build it end-to-end. Instrument A and C separately.
- Ship the v1 with a hypothesis, a lead measure, a lag measure, and kill criteria
- Review weekly. Iterate the lowest-converting step

The CMO does not run three loops in parallel until one is working. Loop debugging requires undivided attention.

---

## 5. Common loop failure modes

- **Funnel-thinking on loop work.** Optimizing acquisition cost in a content loop without optimizing publishing frequency. The loop's compounding requires both.
- **Confusing virality with growth.** A K-factor > 0 does not make a loop. A loop requires sustained input → output → input that compounds the user base.
- **Building a loop the product cannot sustain.** A team-invitation loop requires a multi-user product. Bolting it onto a single-user tool produces invitations that go nowhere.
- **Killing a loop too early.** Loops compound on a 90–180 day window. Killing one after 30 days because it did not pay back is a category mistake.
- **Killing a loop too late.** Loops that have not crossed compounding (A × C < 1) after 180 days are not coming back.

---

## 6. The CMO's loops review (monthly cadence)

For every active loop:

| Loop | A (output per user) | C (output → new user) | Compounding (A×C) | Verdict |
|---|---|---|---|---|
| Content (SEO) | 0.4 posts/user/month | 0.012 | 0.0048 (below 1) | Long arc; review at 180 days |
| Team invites | 2.1 invites/user | 0.31 | 0.65 (below 1) | Investigate C (invitation flow) |
| Customer references | 0.05 references/customer | 0.40 | 0.02 (below 1) | Slow loop; track at 360 days |
| Paid (LTV/CAC) | n/a | LTV/CAC = 3.2 | Compounding | Healthy; scale carefully |

Loops below 1 are not failures by definition. Some loops compound slowly. The CMO names the expected window for each loop at launch.

---

## 7. North Star metric

A single, customer-value-aligned metric that the loop is engineered to grow. Properties:

- Aligned with long-term retention and revenue
- Measurable at a daily or weekly cadence
- Influenced by the entire company, not only by marketing
- Memorable enough to anchor decisions in cross-functional meetings

Examples:
- Airbnb: Nights booked
- Spotify: Time spent listening
- Slack: Messages sent in active teams
- Figma: Multiplayer files actively edited

The CMO defends the North Star metric against substitution. "Sign-ups" is rarely the right North Star. Sign-ups grow when paid spend grows; they do not signal product health.

---

## Sources

- McClure, Dave. "Startup Metrics for Pirates: AARRR." 2007.
- Ellis, Sean; Brown, Morgan. *Hacking Growth.* Currency, 2017.
- Balfour, Brian. *Growth Loops: The Future of Growth Models.* Reforge, 2018.
- Winters, Casey. "Growth Loops are the New Funnels." Reforge, 2018.
- Chen, Andrew. *The Cold Start Problem.* HarperBusiness, 2021.
- Yvon, Sean. *Working Backwards from Retention.* Reforge, 2020.
