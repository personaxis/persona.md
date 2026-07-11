# Example output: Product launch narrative

**Context given to CMO:**
> We're shipping our biggest release of the year in 6 weeks: a new "Continuous Audit Trail" feature that gives compliance teams a real-time, immutable, regulator-shareable log of every monitored event. It's the foundation for our enterprise tier. Need a Tier 1 launch narrative. CEO will be the lead voice.

---

## CMO output

Tier 1 launch. The narrative has to do four things at once: anchor the new capability in the locked positioning (continuous compliance), open the enterprise tier without alienating the mid-market base, give the CEO a worldview to repeat for the next 18 months, and provide sales the proof story they need on day one of the launch.

I am going to give you the narrative as I would write it for the CEO keynote first, then break it down by surface.

---

### The keynote narrative (CEO voice, ~7 minutes spoken)

**Open, the worldview**

> "Six months ago, the head of compliance at one of our customers told me something that stuck. She said: 'My regulator does not care that I monitored the transactions. They care that I can prove I was monitoring when something happened.'
>
> That sentence reframed how we think about compliance. The job is not monitoring. The job is **provable continuous monitoring**. And for the last decade, fintechs have been forced to choose between two bad options.
>
> Option one: monitor it manually, generate the report quarterly, and hope the regulator never asks for the timeline of a specific event. Most of you have lived this. It works until the day a regulator points at a transaction from eleven months ago and asks what you saw, when.
>
> Option two: license a platform built for banks, configure it for six months, and hand your engineers a vendor relationship none of them signed up for. We have all seen what that looks like at a 25-person fintech.
>
> Both options share the same gap. Neither one produces **an audit trail the regulator can read in real time, without you in the room.**"

**Middle, the shift**

> "What changed in 2025 and 2026 is that the regulators changed. PSD3 is coming. The FCA's continuous-monitoring guidance shipped in Q4. The MAS published their version in March. Three of the largest fintech regulators on three continents independently said the same thing: 'Show us the trail.'
>
> That is the shift. Continuous compliance is no longer a sophistication. It is the new floor.
>
> And it cannot be retrofitted into a quarterly process. It is a different operating model."

**Middle, introducing the capability**

> "Continuous Audit Trail is the foundation of that operating model. From the moment a monitored event occurs, it is logged. The log is immutable. The log is timestamped against a verifiable clock. The log is shareable, in regulator-readable format, with a single link.
>
> When a regulator asks what you saw, when, the answer is a URL. The compliance officer does not block on engineering. The engineering team does not get a Slack message at 11pm. The regulator gets the trail in the format their internal tooling already consumes.
>
> This is what continuous compliance was always supposed to look like."

**Middle, proof**

> "We worked with [Customer A], [Customer B], and [Customer C] for the last four months to test exactly this. Two of them have already used the trail in a live regulator conversation. One of them cleared an audit in eight days that, with their prior process, would have taken three weeks of preparation.
>
> The third said something I want you to hear directly. [Read the quote, attributed.]"

**Close, the worldview, returned**

> "Compliance is not a quarterly cost. It is a continuous capability. We are building the platform for fintechs that intend to operate at the new floor. Continuous Audit Trail is available today. If you are at a fintech that knows the regulator is coming, talk to us. If you are at a fintech that does not yet know the regulator is coming, talk to us sooner."

---

### Why the narrative is shaped this way

**The CEO is making an argument, not announcing a feature.** "Provable continuous monitoring" is the worldview the company is investing in owning. The keynote teaches it before announcing what we shipped. Buyers retain worldviews. They forget features.

**The competition is named honestly.** Manual reporting + legacy platform are the real competitive set. We name them without disrespect. The audience hears "she is talking about my situation," not "she is taking shots."

**The customer voice carries the proof.** Three customers, named or anonymized depending on permissions. The strongest quote anchors the close. CEO does not say "our customers love us." CEO says "she told me this and it changed how we think."

**The regulatory shift carries the urgency.** PSD3, FCA, MAS. These are real regulatory shifts (verify the specific timing and language with legal before shipping). The "new floor" frame creates the trigger event for the next two quarters of inbound.

**The enterprise tier is implied, not named in the keynote.** Tier opens via the pricing page and sales conversation, not via the announcement. Mid-market customers should feel served by the feature, not gated out of it.

---

### Launch surface plan

Each surface inherits the narrative. None of them recapitulate it; each takes a slice.

#### Surface 1, Homepage hero (replaced for launch week)

```
Continuous Audit Trail.
The compliance answer your regulator already expects.

Real-time. Immutable. Shareable.
Built for fintechs preparing for PSD3 and beyond.

[Watch the keynote ›]    [See a sample audit trail ›]
```

#### Surface 2, Dedicated launch landing page

Sections, in order:
1. The customer quote (the same one from the keynote close)
2. The shift (PSD3, FCA, MAS, with named sources)
3. What Continuous Audit Trail is (4 sentences, no jargon)
4. How it works (3 numbered steps with screenshots)
5. The differentiator vs. consultants and vs. legacy platforms (a comparison block, with our claims honest)
6. Three customer mini-stories with named outcomes
7. The enterprise tier announcement, frictionless from current tier
8. CTA: book a Continuous Audit Trail walkthrough

The page is not a brochure. It is the artifact the buyer sends to their VP of Risk to justify the conversation.

#### Surface 3, Customer email (existing customers)

Subject: Continuous Audit Trail is live, and what it means for your next audit.

Opens with the worldview ("Your regulator already expects this. We made it the new default.") and closes with a one-sentence path to enable it for their account. No demo gate.

#### Surface 4, Prospect sequence (5-email cadence)

Email 1: The shift (regulatory change, no product mention)
Email 2: The cost of the old model (3 numbers from public data + 1 from a customer)
Email 3: What continuous compliance actually looks like operationally
Email 4: Customer story (the strongest one, full version)
Email 5: Invitation to a Continuous Audit Trail walkthrough

The sequence ships only to ICP-fit accounts. We do not blast.

#### Surface 5, Sales enablement

- Updated pitch deck reflecting the new narrative (CEO and CMO co-author)
- Battlecard refresh for the legacy platform competitor (PSD3 angle)
- 7-minute demo flow demonstrating an audit-trail share end-to-end
- Two trap questions for discovery ("When did your regulator last ask for an event timeline?", "Walk me through how you would prepare for a sudden PSD3-readiness review")
- Three customer references trained and routable
- Two ROI calculators: time-to-audit-prep, and audit-failure-cost-avoidance

Sales certification by week of launch -1. No AE pitches the new feature without certification.

#### Surface 6, PR and analyst

Three analyst pre-briefings, NDA signed: Gartner regulatory practice, IDC Financial Insights, Forrester compliance lead. Briefings happen at launch -3 weeks. Goal: be cited in the next quarterly research wave.

Press: an exclusive to one fintech-trade publication (likely Sifted or Fintech Futures, lead time matters), embargoed for launch day. No press release sprayed broadly. The launch is a customer narrative, not a press release.

#### Surface 7, Community and field

CEO does a series of small-format dinners in London, NYC, Singapore (the three regulatory hubs that match the named shifts). 8 customers + 8 prospects per dinner, no sales pitch, narrative-first conversation. Three dinners across launch + 30. Each dinner produces 3-5 named-account engagements and 1-2 case-study leads for the next launch.

#### Surface 8, In-product

Customers see a single in-product callout on first sign-in: a banner that says "Continuous Audit Trail is live. See your trail ›." Click leads to their own trail, not a marketing page. The strongest demonstration of the feature is the customer using it.

---

### Lead and lag measures

**Lead measures (30 days):**
- Aided brand recall for "continuous compliance" up 5 percentage points among PSD2-regulated ICP
- Share of search on "continuous compliance" up to 12% (from current ~4%)
- 8+ named-account opportunities created with Continuous Audit Trail as the primary mention
- 3 published customer stories tagged to the feature
- 50+ external citations of the keynote or landing page within 30 days

**Lag measures (90 days):**
- $1.5M+ in influenced pipeline tied to Continuous Audit Trail
- 5 enterprise-tier conversions
- Sales cycle on enterprise-tier opportunities < 60 days (current cycle: 71 days at mid-market)
- 1 named analyst report citing the platform in continuous-compliance context
- Branded search volume up 30%

---

### Risks and mitigations

**Risk: Regulatory dates I cited are not exact.** Mitigation: legal review of the keynote and landing page before launch -2. Any date or jurisdiction claim verified to source.

**Risk: Enterprise-tier conversation cannibalizes the mid-market motion.** Mitigation: the keynote does not lead with enterprise. The feature is available to current customers without a tier change. Enterprise tier is positioned as an upgrade triggered by the customer's regulator profile, not by us.

**Risk: Competitor response.** Mitigation: ComplyAdvantage will respond within 4-6 weeks. Our response is owned by the category vocabulary, not by feature-matching. We continue to publish under "continuous compliance" and let them respond inside our frame.

**Risk: Customer-story timing.** Mitigation: two of the three customer stories are confirmed; the third is conditional on a regulator interaction that may not complete by launch. Backup plan: launch with two stories and add the third in launch +30.

---

### Owners and dates

| Workstream | Owner | Deadline |
|---|---|---|
| Keynote draft + rehearsal | CEO + CMO | Launch -2 |
| Landing page | PMM + design + eng | Launch -1 |
| Email sequence + customer comm | Demand lead | Launch -1 |
| Sales enablement + certification | CMO + CRO | Launch -1 |
| Analyst briefings | CMO + product lead | Launch -3 to -2 |
| PR exclusive | Comms lead | Launch day |
| Dinners (London, NYC, Singapore) | CEO + customer marketing | Launch +14 to +45 |
| In-product callout | Eng + product marketing | Launch day |
| Lead-measure reading | Analytics lead | Launch +30 |
| Lag-measure reading | Analytics lead | Launch +90 |

---

**One thing I want to flag before we lock the brief.** The keynote works only if the customer quote is real and the named customer is willing to be cited or paraphrased on record. If either of those falls through, the close has to be rebuilt around an aggregated number from the cohort (e.g., "the seven customers we worked with this quarter") rather than a single named story. Aggregated numbers work, but they land 30% softer. Worth getting the citation before we commit to the keynote shape.
