---
layout: post
title: "Building a Server Room, Part 4: Power, Cooling, and Connectivity"
subtitle: "UPS, three-phase commando, Daikin cassettes, and Aruba on the ceilings"
date: 2014-08-22
tags: infrastructure server-room fitout
permalink: /:title
---

*This is the fourth in a series of five posts documenting the planning, architecture, and build of a new server room under various building and budgetary constraints.*

- [Part 1 — Nine Cabinets into Three](/server-room-build-part-1)
- [Part 2 — Fibre, Floor, and First Frames](/server-room-build-part-2)
- [Part 3 — Passive Infrastructure and the Carrier Handoff](/server-room-build-part-3)
- Part 4 — Power, Cooling, and Connectivity
- [Part 5 — Live, Patched, and Moved In](/server-room-build-part-5)
{:.series-nav}

Four days on from part 3 (22 August 2014). Patch panels are in, the carrier is live, and the room now has to be given power, cooling, and the wireless coverage that the open-plan floor space runs on. Before any of that, a note on telephony: we've abandoned the traditional PBX and ISDN lines in favour of SIP trunking and VoIP handsets. One fewer system in the rack and one fewer copper service into the building.

<figure>
  <img src="/uploads/fitout/2014-08-22/6.jpg" alt="The UPS sits at the base of the rack">
  <figcaption>The UPS sits at the base of the rack</figcaption>
</figure>

The UPS is installed at the base of the rack due to its weight. The three cabinets are bolted together as a single mechanical assembly, with the side panels left in place so that each cabinet keeps its own front-to-back airflow path rather than turning the row into one big shared thermal zone.

<figure>
  <img src="/uploads/fitout/2014-08-22/2.jpg" alt="Rear of Cab 1: patch leads dressed neatly down one side, IEC leads down the other">
  <figcaption>Rear of Cab 1: patch leads dressed neatly down one side, IEC leads down the other</figcaption>
</figure>

Patch panels, power lines, UPS, and PSUs are installed and the cabinets are earthed. Power into each rack arrives via IP44 quick-release angled commando sockets under the raised floor: 16A single phase to Cab 1, and a mix of 16A and 32A feeds to cabinets two and three, sized for what each cabinet is expected to hold.

<figure>
  <img src="/uploads/fitout/2014-08-22/3.jpg" alt="Cable tray running from the wall enclosure down into the floor void">
  <figcaption>Cable tray running from the wall enclosure down into the floor void</figcaption>
</figure>

The cable tray to the OpenReach NTE is installed alongside the earth path. Every metallic element in the room, racks, trays, the DB enclosure, lands on the copper bar visible top-right of frame.

<figure>
  <img src="/uploads/fitout/2014-08-22/7.jpg" alt="21CN NTE rack-mounted in Cab 1 with the patch field directly below it">
  <figcaption>21CN NTE rack-mounted in Cab 1 with the patch field directly below it</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-08-22/5.jpg" alt="Variable-height steel shelving in the store room, dado supplying power and data alongside">
  <figcaption>Variable-height steel shelving in the store room, dado supplying power and data alongside</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-08-22/1.jpg" alt="Dado-fed PDU strip running floor-to-ceiling alongside the shelving">
  <figcaption>Dado-fed PDU strip running floor-to-ceiling alongside the shelving</figcaption>
</figure>

The store room runs on variable-height steel shelving with dado trunking presenting power and data points. The shelving is rated for distributed load, not point load, which constrains what we can put on it. That choice was made with one eye on the floor tile loadings underneath, the building isn't a data centre and neither it nor the raised floor are spec'd to take a tonne of disk array stood on four feet.

<figure>
  <img src="/uploads/fitout/2014-08-22/4.jpg" alt="Daikin ceiling cassette, isolator on the wall">
  <figcaption>Daikin ceiling cassette, isolator on the wall</figcaption>
</figure>

Air-conditioning is installed. A ceiling-cassette comfort unit rather than precision cooling, sized for the load three cabinets generate rather than the nine we left behind.

<figure>
  <img src="/uploads/fitout/2014-08-22/10.jpg" alt="One of three Aruba access points, ceiling-mounted with power and data alongside">
  <figcaption>One of three Aruba access points, ceiling-mounted with power and data alongside</figcaption>
</figure>

One of three Aruba wireless units is ceiling-mounted. Each Aruba is complemented by a power and data point. The Arubas are PoE, but the 13A socket ensures future flexibility at this fitting point if we ever swap to something that isn't.

<figure>
  <img src="/uploads/fitout/2014-08-22/8.jpg" alt="The comms room from the corridor side">
  <figcaption>The comms room from the corridor side</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-08-22/9.jpg" alt="Still working around the builders, with the open-plan floor space coming together at the same time">
  <figcaption>Still working around the builders, with the open-plan floor space coming together at the same time</figcaption>
</figure>

The open-plan floor space is being finished in parallel, which means dust, scaffold towers, and shared corridors right up until handover.

---

*Part 3: [&larr; Passive infrastructure and the carrier handoff](/server-room-build-part-3)* &middot; *Part 5: [Live, patched, and moved in &rarr;](/server-room-build-part-5)*
