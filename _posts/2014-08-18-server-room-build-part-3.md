---
layout: post
title: "Building a Server Room, Part 3: Passive Infrastructure and the Carrier Handoff"
subtitle: "Patch panels, power lines, an acoustic door, and a /21 of PI space"
date: 2014-08-18
tags: infrastructure server-room fitout
permalink: /:title
---

*This is the third in a series of five posts documenting the planning, architecture, and build of a new server room under various building and budgetary constraints.*

- [Part 1 — Nine Cabinets into Three](/server-room-build-part-1)
- [Part 2 — Fibre, Floor, and First Frames](/server-room-build-part-2)
- Part 3 — Passive Infrastructure and the Carrier Handoff
- [Part 4 — Power, Cooling, and Connectivity](/server-room-build-part-4)
- [Part 5 — Live, Patched, and Handed Over](/server-room-build-part-5)
{:.series-nav}

Three weeks on from part 2. The cabinets are in position, the cabling contractor is on site, and the BT engineers have been back to light the circuit. This is the post where the room starts to look like a comms room.

<figure>
  <img src="/uploads/fitout/2014-08-18/1.jpg" alt="Rack with a black vertical cable manager flanked by tall stacks of patch panels, the leftmost rack is empty">
  <figcaption>Patch panels installed into Cab 1</figcaption>
</figure>

Patch panels are installed in Cab 1, the comms cab. A little under 312 patch panel ports comprise the access port trunking to floor boxes around the office, with a further 72 patch panel points further up in Cab 1 patching across to cabinets two and three, and to the dado for the steel shelves.

<figure>
  <img src="/uploads/fitout/2014-08-18/2.jpg" alt="Wall-mounted distribution board enclosure feeding a vertical cable tray, with a copper earth bar to the right">
  <figcaption>Power distribution board, cable tray, and copper earth bar on the far wall</figcaption>
</figure>

The power distribution board is mounted on the far wall, and each cabinet is earthed back to the copper bar visible to the right of it. Seven power lines emerge from the DB: two 32 amp (UPS and dado trunking) and five 16 amp (a single 16 amp to Cab 1, and two 16 amp feeds each to cabinets two and three).

<figure>
  <img src="/uploads/fitout/2014-08-18/3.jpg" alt="Comms room door from the corridor side with a tall narrow viewing pane">
  <figcaption>Acoustically sealed comms room door, with a viewing panel</figcaption>
</figure>

The comms room door is acoustically sealed. The narrow viewing panel lets you see whether anyone is inside before you punch in the code, and lets you see the front of Cab 1 from outside the room.

<figure>
  <img src="/uploads/fitout/2014-08-18/4.jpg" alt="Long aluminium vertical strip of 13A sockets and data outlets mounted against a wall next to a window, thick purple multicore looped down from the window">
  <figcaption>Power and data dado trunking under construction, ready to supply the steel shelving</figcaption>
</figure>

A first look at the power and data dado trunking as it is built. This runs at low level along the wall behind the steel shelving units, presenting 13A sockets and Cat5e outlets at workable heights for equipment that doesn't justify a 19" cabinet.

<figure>
  <img src="/uploads/fitout/2014-08-18/5.jpg" alt="Open office space with a yellow stepladder in the middle and an exposed red brick feature wall on the left">
  <figcaption>Brick cladding fitted as a feature in the wider office space</figcaption>
</figure>

Brick cladding is fitted to certain spaces in the office area. The comms room is white-walled and functional, but the office side gets to have some character.

<figure>
  <img src="/uploads/fitout/2014-08-18/6.jpg" alt="Close-up of an ADVA FSP150CP NTU mounted in a rack, sticker reads 21cn, yellow patch lead plugged into the access port">
  <figcaption>BT OpenReach FSP150CP NTE, labelled 21cn, lit on a yellow patch lead</figcaption>
</figure>

The fibre tray is installed and so is the BT OpenReach NTE. A 100Mbit circuit is run in on a 100Mbit bearer: a Virgin Media line delivered on a BT tail. The line presents PI space, advertising via BGP a route to a /21 network (2048 IP addresses).

---

*Part 2: [&larr; Fibre, floor, and first frames](/server-room-build-part-2)* &middot; *Part 4: [Power, cooling, and connectivity &rarr;](/server-room-build-part-4)*
