---
layout: post
title: "Building a Server Room (Part 1/5)"
date: 2014-07-23
categories: Contract Server-Room Architecture
tags: server-room
---

*This is the first in a series of five posts documenting the planning, architecture, and build of a new server room under various building, budgetary and time constraints. The build is now complete and I’m making this first post retrospectively (2014-11-21).*

I recently had the fortuitous opportunity be involved in the office move of a Cardiff-based technology company. My role was to design a new home for their existing servers, and manage the migration of the IT infrastructure into the new space with the help of a small team of systems and infrastructure engineers.

About 10 years ago the company had invested in the construction of an on-premise server room in what was soon to become their old offices. Their server room had custom built twin-condenser cooling, a raised floor, and battery-backed ups power supplying three-phase power to nine 47U cabinets of rack-mounted equipment, in a commercial office block in the city-center.

Long before work began on designs for their new office, there was a concerted effort from the infrastructure engineering team to migrate live client applications and services from on-premise colocation hardware to a mixture of IaaS and PaaS Cloud providers. It tooks us about six months to plan and implement the changes necessary for the move, but in this series of posts we'll skim over that work, and to jump in as work on the new office fit-out begins.

<!--excerpt-->

The business wanted to use the move as an opportunity to undertake a cost-saving exercise to scale back the on-premise hardware footprint, and move what it could out to cloud hosting, challenging me to reduce their hardware footprint post-move into the smallest viable space we could get away with.

The most natural fit for the business and their cloud hosting model was to migrate infrastructure where the cost of running on cloud could be directly recouped from customers, or where a hardware refresh would be due within a year. Otherwise there was already a good capital investment in hardware on-site which could be put to good (re)use post move.

As the business viewed the downsizing as a cost-saving exercise, this becomes the story of a server room built without extravagances, saving money where justifiable, and in one or two places perhaps a little less justifiably so!  

While the carte blanche rule of data center design is to plan for the future (it is cheaper after all to provision capacity you don't need now than to add it retrospectively) this can occasionally run at odds with the direction of a business. In this case, the board of directors were keen to find a way to release engineer time for developer and infrastructure support, scaling back the expensive on-premise hosting arm of the business.

Fast-forward a few months, and after extensive planning, fantastic client co-operation, updated charging structures, and revisions to contracts, my team had a green light to proceed. We broke apart nine cabinets of bare-metal and hypervised live client servers running on a resilient BGP multi-homed connection and migrated it out to a mix of PaAS and IaAS cloud hosting, leaving only two cabinets of development-servers and internal infrastructure on-premise to support BAU. We also knew we'd need a third cabinet in new space, for comms.

So, with the background covered, lets take a first look at the shell of the new office space.

<div class="owl-carousel">
	<div><img class="lazyOwl" data-src="/uploads/fitout/2014-07-23/1.jpg"></div>
	<div><img class="lazyOwl" data-src="/uploads/fitout/2014-07-23/2.jpg"></div>
	<div><img class="lazyOwl" data-src="/uploads/fitout/2014-07-23/3.jpg"></div>
	<div><img class="lazyOwl" data-src="/uploads/fitout/2014-07-23/4.jpg"></div>
	<div><img class="lazyOwl" data-src="/uploads/fitout/2014-07-23/5.jpg"></div>
</div>

<ul>
	<li>Photo <code>1</code>: Three cabinets have made it over to the new office, but they've been dropped off in what will become a part of the open-plan area and not the server room. The sound-dampening wall partitions were still being built.</li>
	<li>Photo <code>2</code>: It’s exciting to see the shell of the comms room space start to take shape, but it looks empty and unimpressive at the moment.</li>
	<li>Photo <code>4</code>: At least the anti-static floor tile coverings are down, but those radiators will need to be disconnected.</li>
	<li>Photo <code>5</code>: The boardroom is pictured on the right-hand side of the picture, keep an eye on that as it develops.</li>
</ul>

The building is brand new, and we have the entire second floor. As you can see in photo `1`, the raised floor and lighting are already in, and we've brought three emptied racks across from the soon-to-be previous office. Photo `2` is a view of the new server room (single point of entry) doorway. Anti-static floor tiles are already down, and the window is open. Unfortunately the office space didn't present us with a window free area, so we're stuck with at least some degree of solar gain in the room. Also, the plumbers got into the building before us, hence the radiators. The building is eco-friendly and designed for natural temperature control most of the year owing to the climate and the building's location, shape and window arrangements. Needless to say the radiators were locked off immediately.

In photo `4` you can really see how it much of a problem plumbers can cause if they get in before you. Hot water pipes are running directly under the floor space we've negotiated for the server room, and the raised floor is barely raised at all with only 11cm of clearance, you can barely run a single cat6 under one of those insulated pipes.

By this point however, I've already amended our initial plans for the orientation of the equipment in the server room, and in the interests of cost-saving, decided against making any changes to the space. You may have already noticed the coiled white cable at the back of photo `4`, this is the fibre for our internet connection already blown in. Waste no time!

Finally, for variety, photo `5` is a first look at what will become the boardroom. I'm including it because, quite frankly, it's going to look fantastic when finished!

