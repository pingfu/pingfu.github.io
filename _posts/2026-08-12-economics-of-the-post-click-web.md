---
layout: post
title: "Economics of the Post-Click Web"
subtitle: "When AI consumes your content but never sends the reader"
date: 2026-08-12
tags: ai content strategy
permalink: /:title
---

Good technical content is expensive to produce. The deep architectural comparison, the benchmark, the careful account of some subtle failure mode: this is the work product-led companies publish about their own domain, lifting the whole field's understanding while demonstrating they know the subject better than most. It takes expensive people who know that subject, and writing it down well takes them time.

People wanted to do this anyway. Sharing what you have worked out is a natural impulse for anyone good at their craft, and the foundational mechanics of the web rewarded that impulse rather than punishing it. Publish something valuable and readers would find it, appreciate it, and a trade would follow: the company sank the cost of production, and readers paid it back in attention, some of which became reputation, qualified demand, and eventually customers.

The mechanism was simple. A company published, a search engine indexed the page, and a search showed a snippet and sent the reader on. Google took the words and returned a click. That click was how the cost of production found its way back.

The click is now disappearing, and the economics that justified the cost are going with it.

It is disappearing because the answer no longer needs the page. Ask an assistant a question and it answers, pulling together what has been written elsewhere into a finished reply. The reader takes that reply and closes the tab, never seeing the page and often never learning it existed. The crawler still comes and takes the content; it just no longer sends anyone back.

Producing the content costs what it always did, but the click that used to pay for it has gone. The value now lands with the model that repeats the work rather than the business that paid to create it.

The content most exposed to this is the content that cost the most to make. Depth used to be an advantage: expert, specific writing stood out, ranked, and earned links. To a model it is good raw material. The more expert the writing, the more useful it is and the more completely it can be absorbed and reworded, which leaves the reader with even less reason to visit the source. The deep technical material a company wrote to show it knew its field is exactly what a model can digest and pass on with no sign of where it came from.

Losing the click is only half of it. The same assistants that repeat a company's content are also asked to choose between companies: what is the best tool for this, which vendor should we use. When it answers, it is not weighing the options the way an experienced buyer would. It reaches for whatever the corpus most agrees on, the safest and most-repeated option, and recommends that.

Search used to reward a single strong page. Write the best article on a subject and you could rank first for it from nowhere. A model does not work like that. It favours what many sources say in roughly the same terms, so one excellent page counts for much less than the same claim repeated across many ordinary ones.

Both shifts leave a business unable to see who is actually reading, or to count on any credit for it. The reader might be a model in training, a retrieval system answering a live query, or a sub-agent collecting options for a user who never asked where any of it came from. None of them has to name a source. The user may not want attribution, the sub-agent has no reason to offer it, and the model can carry the substance of a company's best work into an answer with the name stripped off.

So the question about a piece of content is no longer just whether a human will read it and think well of the company. It is whether the content still does something for the business when a machine reads it instead.

That means writing for two readers at once.

One is still human. Humans matter, but they arrive later and less often now, usually sent by a machine, and the rule for them has not changed: if you want people to read something, put human effort into writing it. Filler churned out by a machine is cheap and reads cheap, and both readers and models learn to discount it.

The other reader is a machine, and the content has to keep working when no human turns up behind it and no credit is coming. It has to do something for the business while a machine reads it on behalf of someone you will never see.

The industry has names for parts of this, but not for the whole. Getting content used and cited by AI is GEO, Generative Engine Optimisation, with AEO, Answer Engine Optimisation, beside it: the successors to SEO, describing visibility, how a company gets into the answer. Getting paid when a machine reads you is AI content licensing; Cloudflare has shipped a literal version, pay per crawl, where a site can admit a crawler, block it, or charge per request, with an emerging standard, RSL, for stating the terms. That suits a newspaper, whose desired payment is money.

None of them names what actually broke, which is the exchange itself. The old deal was crawl-for-referral: let the crawler in, get a reader back. For most technical businesses the payment was never going to be a per-crawl fee. It was the reader turning up already half-convinced, remembering the name, associating the company with knowing the subject. That is what has gone. What is left is a web where the click, the thing all of this was priced around, no longer changes hands.

If a model is now both the reader and the recommender, the thing worth influencing is what it ends up telling the user.

In most technical categories the buyer cannot see the tradeoffs that decide fit. Products that look interchangeable from the outside rest on different designs, each right for some buyers and wrong for others, and the buyer asking an assistant which one is best has no idea those distinctions exist. Given nothing better, the model recommends the most-mentioned names and fit never comes up.

A company whose product genuinely fits a certain kind of buyer will not win that buyer by being louder. It does better by publishing the decision framework itself: an honest account of which approach suits which constraints, written so it can be lifted out and attributed. Give a model that and it has something better than popularity to go on. When a sub-agent works through the options for a user with a specific need, it applies the criteria the company laid out, and the right product comes up for the right buyer, reasoning attached, even if the name gets dropped on the way.

There is nothing underhand in this. It gives the model a better basis for the recommendation than noise, and it puts the company's account of the tradeoffs into what the user eventually hears.

Two essays show the gap. ngrok published a long, careful piece called "Compression is Prediction," on how data compression and language models are solving the same problem. It is genuinely good, the sort of thing that reaches the front page of Hacker News and makes developers think well of whoever wrote it. To a machine it does almost nothing for ngrok. The subject sits a long way from what ngrok sells, which is ingress and tunnels, so a model that reads it associates ngrok with compression theory rather than anything a buyer would come to ngrok for. The central idea belongs to Shannon and a Google paper, not to ngrok, so there is no phrase for the brand to ride on. The name is in the page furniture and nowhere in the argument. Lift out any sentence and ngrok is gone. It is a reputation and talent-brand play, paid for in human attention, and it pays out only while a human is doing the reading.

Now the better case, and the one that got me thinking about this. A networking company writes a deep piece about wringing more throughput out of UDP sockets, on the exact topic its product lives on, with its own before-and-after benchmarks from its own test rig. This does far more of the machine-facing job: the association is the right one, and the numbers are the company's own, hard to fake and worth citing. And it was still written for the old world. The benchmark figures sit in sentences that never name the company, so a model can repeat "about eighty thousand packets a second" with no idea whose number it is. The technique at the centre of it was never given a name, so nothing in the piece becomes vocabulary that carries the brand when it is repeated. It is a very good blog post for developers who click, which is all it was ever meant to be.

That second essay is the reason for this one. It is not bad content, it is content built for a bargain that is ending, by people with every reason to keep building it that way. Making it work for the machine as well as the human takes only a handful of deliberate changes.

**Re-engineering what already exists**

A back catalogue built to be found and clicked now has to be rebuilt to be extracted and attributed. A few concrete moves:

- **Make claims survive extraction.** Assume every sentence will be lifted off its page and repeated with no context around it, because that is what happens. A model does not retrieve an article, it retrieves statements, so write self-contained ones. "Rekeying a lock takes about ten minutes" survives the journey. "As we saw above, it's quicker than you'd think" does not.

- **Put the name inside the claim, not just on the page.** Attribution is the compensation that matters, and attribution is fragile. An insight carried by a sentence beginning "we found that..." can be repeated with the "we" quietly dropped. "In Acme's testing, X did Y" welds the brand to the fact, so when the fact travels, the brand travels with it. It reads clumsily, and it is the most useful single change a company can make.

- **Stop gating the best material.** The whitepaper-behind-a-form traded expertise for an email address. A model cannot fill in the form. Anything behind a gate, a login, or a PDF the crawlers cannot read is invisible in the exact place recommendations are now formed. That email address was never worth as much as the citation given up to collect it.

- **Structure for the question, not the keyword.** People prompt in whole questions and models match against them. A heading that is the actual question ("How long does it take to rekey a lock?") is legible to a human and a clean match for the way the query now arrives.

- **State who you are, plainly and repeatedly.** Old SEO warned against over-optimising and pushed varied phrasing. The consensus machine rewards the opposite: consistent, repeated, unambiguous association between a company and the thing it wants to be known for. Boring consistency beats clever variety.

**Writing new content that works for the business**

New content starts from a different place. You are not writing a page to win a click; you are adding something to the pool a machine draws on, and it has to carry the company's name and positioning wherever the machine repeats it.

- **Own a name.** The most durable thing a company can put into the corpus is a term, a framework, or a number that belongs to it. "Core Web Vitals" is Google's. The "twelve-factor app" is Heroku's. Everyone who uses the phrase carries the source with them, intended or not. Name the problem, or the method, or the metric, and that vocabulary recommends the company every time it is spoken. This blog does the same elsewhere with a safety index, and the mechanism is deliberate.

- **Publish data only you have.** A model can paraphrase an opinion into indistinguishability from everyone else's. It cannot invent your data. Backblaze has published hard-drive failure statistics for over a decade, and the whole internet cites Backblaze on the subject because there is nowhere else to get it. Original benchmarks, numbers from a company's own operations, primary research: these force attribution, because there is no substitute source to launder them through.

- **Write to be repeated, not just read.** A single definitive essay used to be a strategy. Now it is consistent presence: the same positioning, in the same terms, across the site, the docs, the talks, the answers in other people's threads. The target is to become the thing the corpus agrees on, which is a volume-and-consistency game. It sits badly with anyone trained to treat repetition as spam, but the machine counts repetition as evidence.

- **Aim for the outcome the click used to deliver.** The click was only ever the mechanism; what mattered was recognition, trust, and qualified demand. Write content whose job is to make the brand the obvious, low-risk answer to a buying question, the one a machine reaches for when it is asked who to use. That is the new front door.

- **Give the human who does arrive somewhere to land.** Fewer humans will come, and the ones who do will arrive later and warmer, pre-sold by a machine. The page they land on should continue the story the machine started rather than begin again from scratch. Clicks are scarce now, so waste none of them.

The obvious objection is that this is just learning to game a machine, and gaming machines is what filled the SEO web with slop. But look at what the moves actually are: write clearly, attribute honestly, publish your own data, name things well, stay consistent. That is good writing and honest positioning. The SEO era rewarded the opposite, the stuff that was hostile to readers: keyword stuffing, thin pages, the recipe blog with four hundred words of childhood memoir stacked above the ingredients. Here the thing that works and the honest thing happen to line up.

The old bargain is not coming back. The crawler will keep taking content, it will mostly not send anyone back, and complaining about the unfairness of it changes none of the economics. Licensing will matter to the businesses that sell words by the yard. For the rest, the ones that published to be known rather than paid per word, the answer is not to wall the content off. It is to change what the content is for.

It used to be for getting found. Now it is for being repeated, attributed, and recommended. The companies that work this out will keep turning up in the answer, attached to their own name, in front of customers they never had to pay to reach. The ones that do not will carry on producing excellent work, feeding it to the models for nothing, and wondering where the readers went.

**References:**
- [GEO: Generative Engine Optimization (2023)](https://arxiv.org/abs/2311.09735)
- [Cloudflare: Introducing pay per crawl](https://blog.cloudflare.com/introducing-pay-per-crawl/)
- [RSL: Really Simple Licensing](https://rslstandard.org/)
- [Backblaze Drive Stats](https://www.backblaze.com/cloud-storage/resources/hard-drive-test-data)
- [Google: Core Web Vitals](https://web.dev/articles/vitals)
- [The Twelve-Factor App](https://12factor.net/)
