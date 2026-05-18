---
layout: post
title: 'The "Safety by Design" Index'
subtitle: "A common language for rating the designed-in safety level of devices"
date: 2026-05-18
tags: safety design framework
permalink: /:title
---

A climber I know was recently talking up the Petzl GriGri, a popular belay device, as the obviously safer choice compared to a tube-style ATC. The argument went roughly: the GriGri locks automatically when the rope is pulled hard, so even if the belayer lets go, the climber is held.

That's true, but only partly. The GriGri has well-documented failure modes when held incorrectly, when the brake hand comes off in the wrong moment, or when a panicked belayer overrides the cam. There are videos online of experienced climbers hitting the deck while using one. The device does a lot of work to help, but it does not remove the operator from the safety equation.

The conversation stuck with me, not because they were wrong about the GriGri being a useful device, but because the mental model around it was off. Believing a device is safer than it actually is changes how you use it. You relax. You stop double-checking. You let your partner climb above a ledge with too much slack out. In that sense, a misunderstood "safe" device can be more dangerous than a basic one that demands your full attention.

This is the gap I think the [Safety by Design Index](https://safety-framework.fawltea.net/) is trying to fill.

## What it is

It's a six-level scale (0 to 5) for classifying how much of a device's safety is built into the device itself, versus how much is delegated to the person using it. Level 0 offers no protection at all. Level 5 has the hazard designed out entirely. Everything in between is a spectrum of how much the device helps, encourages, assists, or enforces safe operation.

The framing the authors land on is "like IP ratings, but for safety," which is a useful shorthand. IP ratings tell you whether a device can survive being dropped in a puddle. This index tells you whether the device can survive being used by a tired human at the end of a long day.

## Why I think it's needed

The honest answer is that most consumer-facing safety language is marketing. "Safety features," "advanced protection," "auto-lock," "fail-safe" (a term that has a specific engineering meaning and is regularly misapplied). None of these tell you what the device actually does when the operator makes a mistake, and more importantly, what it doesn't do.

The result is the GriGri conversation, repeated across every domain where a device sits between a person and a hazard. Chainsaws, drills, ladders, cars, electrical equipment, climbing gear, kitchen tools, lab equipment. People form mental models from advertising, anecdotes, and the confidence of whoever taught them. Those models are often wrong in ways that matter, and there is no shared vocabulary to correct them without sounding pedantic.

A simple, numeric rating gives people a thing to point at. "It's a Level 3, the device helps but you still need to know what you're doing" is a much shorter conversation than the one I had at the climbing wall.

## What else exists in this space

The index doesn't appear out of nowhere. It sits in a small Venn diagram of overlapping ideas, most of which are aimed at engineers and regulators rather than the people actually holding the device.

- **[Hierarchy of Controls](https://www.cdc.gov/niosh/hierarchy-of-controls/about/index.html)** (NIOSH). The conceptual ancestor, and the one the index explicitly builds on. It ranks workplace risk controls from most to least effective: elimination, substitution, engineering controls, administrative controls, PPE. It's a design philosophy, not a device rating.
- **[IP ratings](https://www.iec.ch/ip-ratings)** (IEC 60529). Standardised, two-digit ratings for ingress protection against solids and liquids. The model the Safety by Design Index borrows its accessibility from, but scoped to environmental resistance, not user protection.
- **[Inherently Safer Design](https://en.wikipedia.org/wiki/Inherent_safety)** (Trevor Kletz). A chemical engineering philosophy that says the safest hazard is the one that no longer exists. Closely related to Level 5 of the index, but applied to industrial process design rather than consumer devices.
- **[Poka-yoke](https://en.wikipedia.org/wiki/Poka-yoke)**. The lean manufacturing principle of mistake-proofing: shaping a part so it can only be installed the correct way round, for example. A design technique rather than a rating, but the engineering behind Levels 3 and 4 leans heavily on it.
- **[SIL](https://en.wikipedia.org/wiki/Safety_integrity_level)** (IEC 61508) and **[ASIL](https://en.wikipedia.org/wiki/Automotive_Safety_Integrity_Level)** (ISO 26262). Functional safety integrity levels for industrial and automotive systems. Rigorous, quantitative, and entirely internal to engineering teams. A consumer will never see a SIL rating on a product label.
- **[DAL](https://en.wikipedia.org/wiki/DO-178C)** (DO-178C). The aviation equivalent for software. Same story: critical, invisible to end users.
- **CVSS**. The Common Vulnerability Scoring System for software security. Tangentially related in that it's a numeric scale for risk, but the subject is exploitability, not physical safety, and the audience is security teams.
- **UL, CE, BSI marks**. Compliance certifications that tell you a device meets a baseline standard. Pass or fail, with no signal about how much safer one Level 4 device is than a Level 1 one in the same category.

The Safety by Design Index sits in the gap between the engineering frameworks (rigorous, invisible, internal) and the compliance marks (visible, but binary). It's aimed at the conversation between two people standing next to the device, not the conversation between a manufacturer and a regulator.

That gap is, I think, the most important one to close, because that's where the GriGri conversation happens.

## The framework, summarised

The Quick Reference table from the framework's own page, reproduced here for context:

| Level | Name | What the device provides |
|:---:|---|---|
| **0** | No Protection | No protection. Hazard fully exposed. |
| **1** | Safe Only With Correct Use | No engineering controls. Safety depends on the operator. |
| **2** | Safety Encouraged | Cues and warnings, but no enforcement. |
| **3** | Safety Assisted | Automatic protection, but incorrect technique or misuse can still cause harm. |
| **4** | Fail-Safe | Enforced safe state. Cannot be overridden by operator. |
| **5** | Inherently Safe | Hazard designed out. Cannot cause serious harm. |

The full text, with worked examples for each level, is on the project page. The examples are worth reading, because they expose how easily devices that feel similar end up at different levels. A tube-style belay device is a Level 1, because nothing on the device does any work for you. A GriGri is a Level 3, because the cam assists, but technique still matters. An auto-belay in a climbing gym is a Level 4, because the climber genuinely cannot override the braking system during normal use.

That's a useful three-step ladder to point at the next time someone tells me a GriGri is "basically fail-safe."

## Where I'd like to see this go

A framework like this is only useful if it spreads. The most valuable outcome would be product pages, reviews, and instructor materials starting to quote a level alongside the marketing copy, the same way camera bodies quote IP67 or appliances quote energy ratings. It gives buyers and operators a shared anchor, and it gives manufacturers a target to design against.

It also gives the rest of us a way to have the GriGri conversation without it turning into a lecture. "It's a Level 3, here's what that means" is a much more constructive starting point than "well, actually."

The framework is open source and Creative Commons licensed. If you teach, instruct, write reviews, design products, or just argue with friends about belay devices, it's worth a look.

---

**Sources:**

- [Safety by Design Index](https://safety-framework.fawltea.net/)
- [GitHub: fawltea/Safety-Framework](https://github.com/fawltea/Safety-Framework)
- [NIOSH Hierarchy of Controls](https://www.cdc.gov/niosh/hierarchy-of-controls/about/index.html)
- [IEC IP Ratings](https://www.iec.ch/ip-ratings)
