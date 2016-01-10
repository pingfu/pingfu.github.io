---
layout: post
title: "Building a Server Room (Part 1/5)"
date: 2014-07-23
categories: 
tags: 
---

*This is the first in a series of five posts documenting the planning, architecture, and build of a new comms room subject to building, budgetary and time constraints. The space is now complete, so all posts are made retrospectively (2014-11-21).*

Recently I was contracted to assist a Cardiff-based technology company move offices. My role was to design a space in their new offices for the existing IT infrastructure, and manage their transition to the new office with the help of a small team of infrastructure engineers.

Prior to the advent, and popularity of cloud-based computing, the company had invested (circa 2005) in an on-premise server room in what would soon to become their old office. The  server room had a custom engineered twin-condenser cooling system, a raised floor, and a battery-backed UPS supplying three-phase power to nine 47U cabinets full of co-located rack-mounted hardware, some internal, some client owned in a commercial office block in Cardiff city-centre.

Long before work began to designs the new office, I led an effort by the infrastructure engineering team to migrate live client applications and services from on-premise colocation hardware to a mixture of IaaS and PaaS Cloud deployments. It took about six months to plan and implement the necessary migrations, but this series of posts we'll ignore that work, and to pick-up as work on the new office hard fit out begins.

The business wanted to use the office move as an opportunity to undertake a cost-saving exercise to scale back the on-premise hardware footprint, and move what it could out to cloud providers, challenging me to reduce their hardware footprint post-move into the smallest viable physical space. The office move also represented an opportunity to undertake a cost, and space-saving exercise with regards to the IT infrastructure. Accordingly, these posts will follow the construction of a comms room built without extravagances, balancing best practise against cost efficiency where appropriate.

Despite the initial capital investment in on-premise, a significant hardware refresh would have been due within 18 months, so while the existing hardware was beginning to age, it could still put to good use post move supporting internal systems. On balance, switching to a cloud-based hosting model was a natural fit for the company’s production environments.

The first rule of data center design is to plan for the future (it's usually cheaper to over-provision capacity you don't today, than to add it retrospectively). However despite the long-term cost effectiveness, but this isn't always the most tenable position, economically speaking.

With this in mind, fast-forward a few months, and after extensive planning, fantastic client co-operation, revisions to contracts, and updated charging structures my team was ready to move. We had migrated all production and client-owned equipment running in the nine 47U cabinets of bare-metal and hypervised infrastructure running on a resilient BGP multi-homed feeds to a mix of PaAS and IaAS cloud architectures. This left only two cabinets of development-servers and internal infrastructure remaining on-premise to support BAU. We also planned for a third cabinet to support switching and comms in new office space.

So, with the background covered, let's take a first look at the shell of the new comms room.

<!--excerpt-->

<div class="slick-carousel">
	<div>
		<img src="/uploads/fitout/2014-07-23/1.jpg">
		<p><code>Photo 1</code> Three cabinets have moved to the new office, but have been delivered in to what will become a part of the open-plan workspace, not the comms room. This is intentional of course, the sound-dampening wall partitions are still being constructed.</p>
	</div>
	<div>
		<img src="/uploads/fitout/2014-07-23/2.jpg">
		<p><code>Photo 2</code> The shell of the comms room space is starting to take shape, but it doesn't look very impressive yet.</p>
	</div>
	<div>
		<img src="/uploads/fitout/2014-07-23/3.jpg">
		<p><code>Photo 3</code> The anti-static floor tiles have been glued down.</p>
	</div>
	<div>
		<img src="/uploads/fitout/2014-07-23/4.jpg">
		<p><code>Photo 4</code> Unfortunately the plumbers beat us to it, so those radiators will need to be disconnected. There is another problem too, those heating pipes run right under where we were expecting to place the cabinets and terminate the patch panels.</p>
	</div>
	<div>
		<img src="/uploads/fitout/2014-07-23/5.jpg">
		<p><code>Photo 5</code> On the other side of the building, the boardroom is starting to take shape (right-hand side of the picture), keep an eye on that as it develops.</p>
	</div>
</div>

This building is brand new, and we have the whole second floor. As you can see in `Photo 1`, the raised floor and lighting is already installed. We've brought 3 of the 7 emptied cabinets across from old offices. `Photo 2` is a view of the new server room doorway (single point of entry). Anti-static floor tiles are down too, and the window is open. Unfortunately the office space didn't present us with a window free area, so we're stuck with at least some degree of solar gain in the comms room.

The plumbers also got into the building before we did, so we locked off the radiators off immediately, no need to remove them. The building is an eco-friendly construction, designed for natural temperature regulation most of the year round according to the local climate conditions, and the building's location, shape, fabric, elevations, and window arrangements.

In `Photo 4` you can really see how much of a problem plumbers can cause if they get in before you. Hot water pipes are running directly under the floor space we'd negotiated for the comms room and cabinets, and the raised floor is barely raised at all with only 11 cm of clearance, you can barely push a single cat6 under one of those insulated pipes.

By this point however, I've already amended our initial plans for the orientation of the equipment in the room, and in the interests of cost-saving, decided against making any changes to the space. You may have already noticed the coiled white cable at the back of `Photo 4`, this is the fibre for our internet connection already blown in. Waste no time!

Finally, `Photo 5` is a first look at what will become the boardroom, keep an eye on that as it develops.




