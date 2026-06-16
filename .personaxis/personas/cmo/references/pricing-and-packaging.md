# Pricing and Packaging

> Reference for the CMO persona. Compiled from Madhavan Ramanujam's *Monetizing Innovation* (2016), Patrick Campbell's ProfitWell research, Kyle Poyar's writing on PLG pricing, and case studies across the B2B SaaS pricing literature.

Pricing is positioning expressed in numbers. The CMO does not own the final pricing decision (that belongs to product and finance), but owns the inputs: who the buyer is, what they value, what they will pay, what the alternatives charge, and what the messaging implication is. A CMO who cannot defend the price points cannot defend the positioning.

---

## 1. The Ramanujam thesis — design the product around the price

Most companies build the product, then guess the price. Ramanujam's argument: the price should be designed alongside the product, anchored in customer willingness-to-pay (WTP) research done before engineering ships the feature set.

### 1.1 Why companies misprice

Ramanujam classifies four failure modes:

- **Feature shocks** — products with features no one wants, priced as if everyone does
- **Minivations** — products priced too low, leaving margin on the table
- **Hidden gems** — features customers would pay separately for, bundled into the base tier
- **Undeads** — products that no segment wants enough to pay for, kept alive by hope

The CMO's diagnostic question: *"For each feature, what would the buyer pay if we charged separately for it?"* If the answer is "nothing," the feature does not warrant the engineering cost. If the answer is "more than the current package," the package is mispriced.

---

## 2. Willingness-to-pay research

WTP is measured before launch through structured customer conversations. Three methods the CMO uses:

### 2.1 Van Westendorp Price Sensitivity Meter

Four questions to each prospect:

1. At what price would this product be **too expensive**, you would not consider buying it?
2. At what price would this product be **expensive but you would still consider buying it**?
3. At what price would this product feel like a **bargain**?
4. At what price would this product be **so cheap you would question its quality**?

Plot the four curves. The intersection of "too expensive" and "bargain" is the **point of marginal cheapness** (PMC). The intersection of "expensive but considering" and "too cheap" is the **point of marginal expensiveness** (PME). The acceptable price range sits between PMC and PME.

### 2.2 Conjoint analysis

Present customers with multiple product configurations and prices. Statistical decomposition reveals the marginal price each feature commands. Expensive to run; produces the highest-quality data; warranted for high-ACV B2B products.

### 2.3 Trade-off framing

Cheap and fast. The CMO presents three packages with different feature/price combinations and asks the prospect to rank them. The middle package is the anchor. The prospect's rationalization for ranking reveals which features carry weight.

---

## 3. Packaging strategy

Packaging is the choice of how to bundle features into tiers. Three canonical structures:

### 3.1 Good / Better / Best

Three tiers, each adding capabilities. Works when:

- The buyer has multiple jobs at multiple price points
- Expansion within an account is plausible
- The middle tier carries 60-70% of revenue (anchor effect)

The CMO designs the middle tier first. It is the default-purchase target. The other two tiers are anchors that make the middle look correct.

### 3.2 Per-seat with feature gates

Common in PLG. Free or low-cost individual tier, paid team tier with collaboration features, paid enterprise tier with security and admin. Works when:

- The product has individual-to-team expansion built in
- Collaboration features are the natural expansion trigger
- Security / SSO / SCIM are the natural enterprise trigger

The CMO confirms the **feature-to-segment fit** before locking the gate. A feature that gates expansion from free to paid must be one that the buyer at the paid tier needs and the free tier does not.

### 3.3 Usage-based / consumption pricing

Customer pays per unit of value (API call, GB processed, message sent, document signed). Works when:

- Value is tightly correlated with a measurable unit
- Cost-to-serve scales with the unit
- Customers prefer paying for outcomes over commitments

Pure usage-based pricing creates revenue volatility. Most companies pair a base subscription with usage overages. The CMO advocates for hybrid models in most B2B contexts.

### 3.4 Hybrid

Subscription + usage, subscription + seats, freemium + enterprise. The dominant pattern in mature B2B SaaS. The CMO defends the hybrid against simplicity arguments because the hybrid captures more of the value surface.

---

## 4. The pricing page as a marketing artifact

The pricing page is the highest-traffic deal-stage artifact. The CMO treats it as positioning, not as a cart.

Required elements:

- **Tier names that reinforce positioning**, not generic ("Free, Pro, Enterprise" is acceptable; "Bronze, Silver, Gold" is not)
- **One sentence per tier describing the buyer**, not the features ("For teams running their first compliance program")
- **Feature list per tier**, ordered by importance, not alphabetically
- **Value anchors** — the alternative the buyer is comparing against ($X consultant hour, $Y manual process)
- **Clear CTA per tier**, matching the actual sales motion (self-serve, demo, contact sales)
- **An FAQ that addresses the four sales objections** the team hears most often
- **Social proof** specific to each tier (a logo from each tier's segment)

What the CMO removes from the pricing page:

- Pricing toggles with three different billing cadences (monthly/annual/biannual) — confuses choice
- "Contact sales" on every tier — eliminates self-serve as an option
- Feature parity tables that exceed 30 rows — buyer fatigue
- Crossed-out "regular" prices — undermines premium positioning

---

## 5. Discounting policy

Discounts ship messaging. A 50% off promo communicates that the list price is theater. The CMO maintains a discounting policy with three rules:

1. **Discounts are time-bound and reason-coded.** Year-end, launch, multi-year, design partner. Never "because they asked."
2. **Sales has a discount ceiling without escalation.** Above the ceiling requires VP approval. Above 2× the ceiling requires CEO + CFO + CMO.
3. **Discounts come with reciprocal commitments.** Multi-year, reference, case study, expanded scope. Never free price reduction.

The CMO reviews discounting trends monthly. Rising average discount is a positioning problem disguised as a sales problem.

---

## 6. Repricing — when and how

Repricing is rare and intentional. The CMO treats it as a quarterly-scoped initiative.

### 6.1 When to reprice

- New WTP research shows current pricing leaves 20%+ on the table
- The product surface has expanded materially since last pricing
- A new tier or feature gates expansion from free to paid
- Competitive pricing has moved enough to require recalibration
- Gross margin pressure (typically usage-based products) requires it

### 6.2 How to reprice

- **Grandfather existing customers.** Always. Repricing them produces churn that exceeds expansion gain.
- **Pre-announce new pricing to existing customers.** They learn from sales, not from a blog post.
- **Stage the change.** Roll out to new logos first, monitor for 30 days, then communicate broadly.
- **Document the rationale.** A page customers can read explaining what changed and why.
- **Train sales on the new pricing.** A rep who fumbles the new pricing in the first three deals leaves money on the table for a year.

### 6.3 The 12-month no-reprice window

After a reprice, the CMO commits to 12 months without another change. Pricing volatility erodes trust faster than a missed margin target.

---

## 7. Pricing's interaction with positioning

The CMO checks every pricing decision against the locked positioning:

| Positioning | Pricing implication |
|---|---|
| Premium / category leader | Highest tier should price 15-30% above named competitor |
| Category disruptor | Pricing model should be visibly different (usage vs. seat, outcome vs. license) |
| Down-market alternative | Lowest tier should be visibly cheaper than the category leader's lowest tier |
| Best-in-class for a segment | Pricing should be visibly segment-aligned (per-clinic, per-store, per-team-of-N) |

A premium positioning with bottom-of-market pricing produces buyer confusion. A category-disruptor positioning with traditional pricing produces buyer skepticism. Pricing and positioning ship together or they undermine each other.

---

## 8. Common pricing failure modes

- **"We picked the price by looking at competitors."** Competitor pricing reveals competitor confidence, not buyer willingness. The CMO does WTP research instead.
- **"Annual contracts only."** Forecloses self-serve. Some segments will not commit to a year without a quarter of usage.
- **"Free tier covers everything important."** Free should produce activation and reveal value. Free that covers the team-collaboration use case will not convert.
- **"Enterprise pricing is on call."** Some enterprise pricing should be on call. All of it being on call signals lack of confidence.
- **"We have not changed pricing in 4 years."** Either the product surface or the market has moved. Pricing that has not moved is leaving money on the table or repelling segments that should be buying.

---

## Sources

- Ramanujam, Madhavan; Tacke, Georg. *Monetizing Innovation: How Smart Companies Design the Product Around the Price.* Wiley, 2016.
- Campbell, Patrick. *Pricing Strategy.* ProfitWell research, 2018-2024.
- Poyar, Kyle. *Growth Unhinged* newsletter on PLG pricing, 2022-2026.
- OpenView Partners. *2026 PLG Pricing Benchmarks Report.*
- Schmidt, Eric; Rosenberg, Jonathan. *How Google Works.* Grand Central Publishing, 2014. Chapter on pricing.
