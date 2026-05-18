---
layout: post
title: "Building a Server Room, Part 5: Live, Patched, and Handed Over"
subtitle: "Cisco, HP, a hygrometer on the sill, and 50 staff back on production work by 11am Monday"
date: 2014-09-16
tags: infrastructure server-room fitout
permalink: /:title
---

*This is the fifth and final post in a series of five documenting the planning, architecture, and build of a new server room under various building and budgetary constraints.*

- [Part 1 — Nine Cabinets into Three](/server-room-build-part-1)
- [Part 2 — Fibre, Floor, and First Frames](/server-room-build-part-2)
- [Part 3 — Passive Infrastructure and the Carrier Handoff](/server-room-build-part-3)
- [Part 4 — Power, Cooling, and Connectivity](/server-room-build-part-4)
- Part 5 — Live, Patched, and Handed Over
{:.series-nav}

Nearly four weeks on from part 4. The room is finished, the kit is racked, the staff have moved in, and the office around it is in daily use.

<figure>
  <img src="/uploads/fitout/2014-09-16/1.jpg" alt="Finished office area showing the comms room door with a viewing panel, beside a large wall mural of a pair of headphones drawn in line work">
  <figcaption>The completed comms room door, headphones mural alongside</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-09-16/7.jpg" alt="Three production racks fully populated and patched with bright green, yellow, and orange Cat5e leads dressed down the side">
  <figcaption>Production racks, fully patched</figcaption>
</figure>

Coloured patch leads do the documentation job for us: at a glance you can see which switch a port lands on, which VLAN it belongs to, and whether something has been re-patched by hand in the middle of the night.

<figure>
  <img src="/uploads/fitout/2014-09-16/2.jpg" alt="Top of the network rack with the BT 21CN NTU at the top, a Cisco Catalyst access switch, an integrated services router, and two Cisco ASA firewalls below">
  <figcaption>Network rack: BT 21CN NTE, Cisco switches, and a pair of ASA firewalls</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-09-16/3.jpg" alt="HP disk shelves and storage chassis stacked in cabinets two and three">
  <figcaption>HP c3000 enclosure and SAN units brought across from the old room</figcaption>
</figure>

HP c3000 enclosure and SAN units make up the bulk of cabinets two and three. The c3000 was the largest single asset we carried across from the old room, and condensing nine cabinets into three only worked because it was already a blade enclosure rather than a rack of pizza boxes.

<figure>
  <img src="/uploads/fitout/2014-09-16/4.jpg" alt="Spares storage shelves with desktops on the top, Mac mini and small NAS units in the middle, a laptop and Cisco IP phone on the next shelf, and tower PCs on the floor below">
  <figcaption>Steel shelving for spares and equipment better suited to shelves than 19" cabinets, complete with the obligatory Cisco VoIP handset</figcaption>
</figure>

The steel shelving carries everything that doesn't earn a rack unit: cold-spare desktops, small appliances, a Mac mini, and a hot-swap Cisco VoIP phone ready to drop in if anyone's deskset fails.

<figure>
  <img src="/uploads/fitout/2014-09-16/6.jpg" alt="Tall blue and grey shelving stacked with spare desktops, clear plastic crates, laptop bags, and a single IP phone in a shelf bay">
  <figcaption>Spares organised so anything we need at 3am is in reach without unboxing</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-09-16/5.jpg" alt="Comms room door from the corridor side with a printed floor plan, a small dry-wipe whiteboard, and a digital thermostat on the wall beside the door">
  <figcaption>Illustrated floor port map and whiteboard alongside the comms room door</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-09-16/8.jpg" alt="Close-up of a mechanical keypad lock fitted to the oak door frame">
  <figcaption>Mechanical keypad: no batteries, no card reader, no panel to fail</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-09-16/9.jpg" alt="Overhead door closer arm on the oak frame of the comms room door">
  <figcaption>Overhead closer so the acoustic seal isn't left to a habit</figcaption>
</figure>

The floor port map prints onto the wall outside the door so anyone tracing a cable doesn't need to be on the network to find the right port. The keypad is mechanical by choice, fewer moving parts, no batteries, and no software stack to keep on top of.

<figure>
  <img src="/uploads/fitout/2014-09-16/10.jpg" alt="Digital temperature and humidity meter on a wooden window sill, showing readings of around 21°C and 57% RH, the dockside visible through the window">
  <figcaption>Day-one environmental monitoring: a hygrometer on the window sill, dockside through the window</figcaption>
</figure>

A finishing touch: a temperature and humidity sensor on the sill, with the dockside view as a bonus. It's a £20 device on day one, with SNMP-capable probes on the order to follow.

All 50 or so staff were online and back on production work by 11am Monday morning.

<figure>
  <img src="/uploads/fitout/2014-09-16/11.jpg" alt="Boardroom finished with a long timber table, leather chairs, a ceiling-mounted projector, a drop-down screen, and a continuous blue LED cove around the ceiling perimeter">
  <figcaption>The boardroom, finished</figcaption>
</figure>

The boardroom, glimpsed in the background of the very first photo in part one of this series, now finished.

<figure>
  <img src="/uploads/fitout/2014-09-16/12.jpg" alt="Tall device test wall covered in handsets and tablets on small shelves, a tabletop arcade cabinet at the base, and a strip of artificial putting green on the floor in front">
  <figcaption>Device test lab, with an arcade cabinet and a putting green for good measure</figcaption>
</figure>

<figure>
  <img src="/uploads/fitout/2014-09-16/13.jpg" alt="Open-plan office floor in everyday use with rows of monitors, desk plants, an IP phone, and a panoramic dockside view through the windows">
  <figcaption>The wider office floor in daily use, dockside view through the windows</figcaption>
</figure>

## Wrap-up

I'm disappointed that the fit-out budget didn't allow us to install Cat6. It's a big shame in terms of future proofing the installation, but network performance over the Cat5e access ports has been entirely fine in practice, and the structured cabling is certified and warranted by a professional installer.

If I were doing this again, or arguing the case for the next one, the headline lessons are:

* **Cable to Cat6 with multi-mode fibre runs**, and do it as part of the initial cabling project. Retrofitting any cable type after the floor and dado are closed costs disproportionately more than getting it right first time.
* **Use a structured cabling contractor who will certify and warrant the install.** Make it as fast as you can afford. The cables outlive the kit at both ends.
* **All cabling up to fire code, with proper fire stops** between compartments. This is non-negotiable in a shared office block.
* **Run flexible power under the floor**, terminated in IP44 commando sockets, so racks can be re-positioned without re-wiring the DB.
* **Size the UPS for the actual critical load, with realistic runtime,** and consider a generator for prolonged outages if uptime warrants it.
* **More space under the raised floor.** 11cm of clearance with pre-existing building services running through it is not enough, and I designed around it rather than fixing it.
* **More space generally, better physical security, water detection, and proper environmental monitoring** rather than a hygrometer on the sill.
* **Multi-homed BGP resilience** at the carrier level, sized to the cost of downtime to the business. We have it; smaller offices often don't, and regret it the first time the only circuit goes dark.

The bigger lesson is that the design has to be appropriate to the requirements of the business: the cost of downtime, the cost of recovery, the cost of employee idle time, the cost of lost sales, and the cost of poor publicity. Build for that, not for what a hyperscaler would do.

It's worth reading what the very large operators do, even if you'll never build at that scale. Facebook's data center fabric write-up is a good example: they make the case that forcing air through a raised-floor plenum and perforated floor tiles is an inefficient use of energy, and instead pressurise the entire data hall with cool air. That isn't a lesson you can directly apply to three cabinets in an office block, but the underlying point, design for the actual thermal load and stop copying patterns from the last room you built, is universal. And keep an eye on hardware lifecycles: Cisco's published end-of-life schedules are a useful reminder that anything bought today has a defined runway and should be planned out, not panicked out.

A server room built well lasts ten to fifteen years. This one should comfortably see out that horizon at this site, and if and when the business outgrows it again, most of the lessons above will still apply.

---

*Part 4: [&larr; Power, cooling, and connectivity](/server-room-build-part-4)*
