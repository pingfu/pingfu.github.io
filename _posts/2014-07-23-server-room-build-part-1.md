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
- [Part 5 — Live, Patched, and Moved In](/server-room-build-part-5)
{:.series-nav}

For some months I've been preparing to move the IT infrastructure of a Cardiff based company into a new office space. Besides moving with minimal downtime to the production team, the business had made the strategic decision to lean more heavily on cloud hosting for their customers, and so challenged me to reduce their on-premise hardware footprint to the smallest viable space possible for the office.

The business had previously (around 2004) invested in building an on-premise server room, with cooling and UPS power supplying nine 47U cabinets of rack mounted servers in a standard office block, in addition to renting expensive rack space in a tier-4 data centre for high-profile customers, or those with policies governing where their sensitive data could be held (read: Government).

The most natural split when planning which systems would be migrated out to cloud hosting was to only move services where the cost of running on cloud could be recouped. Consequently only customer-chargeable services would be migrated, keeping development servers and other infrastructure like file servers in-house to make best use of previous investments in rack mounted hardware.

With significant planning, fantastic customer co-operation, updated charging structures and revision of hosting contracts, it looked achievable to condense nine cabinets of highly bespoke production workloads running on a resilient BGP multi-homed connection down into three cabinets of only development servers and internal infrastructure necessary for BAU. The production workloads themselves would move to cloud hosting.

Well in advance of drawing up the designs for the new server room then, there was a huge effort to migrate the production customer-facing applications and services from on-premise colocation hardware out to a mixture of IaaS and PaaS cloud deployments. I'm not going to cover that work in these posts, but instead skip on to the server room build.

Moving office is a huge expense for any business to undertake, and the board viewed the downsizing of a nine cabinet server room into a much smaller space as a cost-saving exercise. Consequently this is a build on a budget, with existing hardware re-used wherever possible and extravagances spared if there wasn't a direct and immediately compelling business case to support them.

With the background covered, on to a first look at the new space.

<figure>
  <img src="/uploads/fitout/2014-07-23/1.jpg" alt="The wider shell, freshly painted, awaiting fit-out. The three cabinets we've brought across are parked in the middle">
  <figcaption>The wider shell, freshly painted, awaiting fit-out. The three cabinets we've brought across are parked in the middle</figcaption>
</figure>

We've brought three racks with us from the old office. You can see them above, in an area that will become part of the open-plan floor space. 

<figure>
  <img src="/uploads/fitout/2014-07-23/2.jpg" alt="The shell of the designated comms room beginning to take shape">
  <figcaption>The shell of the designated comms room beginning to take shape</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-07-23/3.jpg" alt="Anti-static floor tile coverings going down">
  <figcaption>Anti-static floor tile coverings going down</figcaption>
</figure>

It's exciting to see the shell of the comms room start to take shape, but it does look a bit empty (and unimpressive) at the moment. The roadmap shrinks the current footprint from nine cabinets down to three for the move, so this is what we've got to work with. Still, encouraging to see rapid progress against the build plan with anti-static floor tile coverings laid, but the bloody plumbers got in first and fitted heating and water pipework under the raised floor and helpfully added two radiators in the server room space (sigh!) which will now need to be disconnected. The clearance they've left in the floor void is miniscule too, and we're going to be fighting them for every centimetre.

<figure>
  <img src="/uploads/fitout/2014-07-23/4.jpg" alt="Ah. Heating and water pipework has already been routed through the space we allocated on drawings for the comms room">
  <figcaption>Ah. Heating and water pipework has already been routed through the space we allocated on drawings for the comms room</figcaption>
</figure>

The board room is pictured below on the right through the doorway, keep an eye on that as it develops!

<figure>
  <img src="/uploads/fitout/2014-07-23/5.jpg" alt="The would-be boardroom through the doorway on the right, about to be painted">
  <figcaption>The would-be boardroom through the doorway on the right, about to be painted</figcaption>
</figure>

---

*Part 2: [Fibre, floor, and first frames &rarr;](/server-room-build-part-2)*
