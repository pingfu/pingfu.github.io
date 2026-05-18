---
layout: post
title: "Building a Server Room, Part 1: Nine Cabinets into Three"
subtitle: "Setting the brief, on a fit-out budget"
date: 2014-07-23
tags: infrastructure server-room fitout
permalink: /:title
---

*This is the first in a series of five posts documenting the planning, architecture, and build of a new server room under various building and budgetary constraints.*

- Part 1 — Nine Cabinets into Three
- [Part 2 — Fibre, Floor, and First Frames](/server-room-build-part-2)
- [Part 3 — Passive Infrastructure and the Carrier Handoff](/server-room-build-part-3)
- [Part 4 — Power, Cooling, and Connectivity](/server-room-build-part-4)
- [Part 5 — Live, Patched, and Handed Over](/server-room-build-part-5)
{:.series-nav}

For some months I've been preparing to move the IT infrastructure of a Cardiff based company into a new office space. Besides moving with minimal downtime to production staff, the business had made the strategic decision to lean more heavily on cloud hosting for their customers, and so challenged me to reduce their current on-premise hardware footprint into the smallest viable space I could for the office.

The business had previously (around 2004) invested in building an on-premise server room, with cooling and UPS power supplying nine 47U cabinets of rack mounted servers in a standard office block, in addition to renting expensive rack space in a tier-4 data center for high-profile customers, or those with policies governing where their sensitive data could be held (read: Government).

The most natural split when planning which systems would be migrated out to cloud hosting was to only move services where the cost of running on cloud could be recouped. Consequently only client-chargeable services would be migrated, keeping development servers and other infrastructure like file servers in-house to make best use of previous investments in rack mounted hardware.

With significant planning, fantastic client co-operation, updated charging structures and revision of hosting contracts it looked achievable to condense nine cabinets of highly bespoke live services running on a resilient BGP multi-homed connection down into three cabinets of only development servers and internal infrastructure necessary for BAU.

Well in advance of drawing up the designs for the new server room then, there was a huge effort to migrate live client applications and services from on-premise colocation hardware out to a mixture of IaaS and PaaS cloud deployments. I'm not going to cover that work in these posts, but instead skip on to the server room build.

Moving office is a huge expense for any business to undertake, and the board viewed the downsizing of a nine cabinet server room into a much smaller space as a cost-saving exercise. Consequently this is a build on a budget, with existing hardware re-used wherever possible and extravagances spared if there wasn't a direct and immediately compelling business case to support them.

With the background covered, on to a first look at the new space.

<figure>
  <img src="/uploads/fitout/2014-07-23/1.jpg" alt="Empty office floor with three blue rack frames stacked in the middle, windows on both sides">
  <figcaption>The wider shell, freshly painted, awaiting fit-out. The three cabinets we've brought across are parked in the middle, and the would-be boardroom is through the doorway on the right</figcaption>
</figure>

We've brought three racks to the new office space. Unfortunately that isn't the new comms room space. The board room is pictured on the right, keep an eye on that as it develops!

<figure>
  <img src="/uploads/fitout/2014-07-23/2.jpg" alt="Drywall doorway opening into a tiled room with a radiator visible against the far wall">
  <figcaption>The shell of the designated comms room beginning to take shape</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-07-23/3.jpg" alt="Grey anti-static floor tiles being laid with underlay sheets folded back at the edges">
  <figcaption>Anti-static floor tile coverings going down</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-07-23/4.jpg" alt="Floor void lifted in the comms room exposing copper pipework, two engineers in hi-vis inspecting, a radiator visible against the far wall">
  <figcaption>Heating and water pipework already routed through the space we wanted for the comms room</figcaption>
</figure>

It's exciting to see the shell of the comms room space I've designed start to take shape, but it looks empty and unimpressive. It's promising to see the anti-static floor tile coverings are laid, but those radiators will need to be disconnected!

Our strategic roadmap shrinks the comms room footprint from nine cabinets down to three for the move. The wider fit out design leaves this space as the designated comms room area, but unfortunately the plumbers got in before we did, so we need to work around both the pipes, and the miniscule clearance on the raised floor.

<figure>
  <img src="/uploads/fitout/2014-07-23/5.jpg" alt="Bright empty office room with paint buckets on the floor and a radiator under the window">
  <figcaption>The would-be boardroom, about to be painted</figcaption>
</figure>

---

*Part 2: [Services rough-in &rarr;](/server-room-build-part-2)*
