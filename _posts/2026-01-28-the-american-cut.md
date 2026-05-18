---
layout: post
title: "The American Cut"
subtitle: "How it came to be that Wall Street owns British payments"
date: 2026-01-28
tags: payments infrastructure
permalink: /:title
---

Why is Britain the only major economy which doesn't own its payment infrastructure?

<figure>
  <img src="/uploads/vocalink.png" alt="Vocalink website">
  <figcaption></figcaption>
</figure>

Most major economies have something called a national payment infrastructure: servers and digital networks that route payment instructions directly between banks within their jurisdiction.

- America has [FedNow](https://www.federalreserve.gov/paymentsystems/fednow_about.htm)
- China has [UnionPay](https://www.unionpayintl.com/en/)
- India has [UPI](https://www.npci.org.in/what-we-do/upi/product-overview)
- Brazil has [Pix](https://www.bcb.gov.br/en/financialstability/pix_en)
- Australia has [NPP](https://nppa.com.au/)
- Singapore has [PayNow](https://www.abs.org.sg/consumer-banking/pay-now)
- Thailand has [PromptPay](https://www.bot.or.th/en/financial-innovation/digital-finance/digital-payment/PromptPay.html)
- Late to the game, Europe is *building* [Wero](https://wero-wallet.eu/)

These systems are almost always domestically owned: by the *Federal Reserve* in America, a *state-backed consortium of Chinese banks* under the People's Bank of China in ... China, a *consortium of 16 founding European banks and payment companies* in Europe, and so on.

The companies which deliver this infrastructure are so important that they usually fall under the umbrella of critical national infrastructure (alongside power grids, water supply, and telecoms), because foreign control means foreign leverage: the ability to raise fees, access transaction data, and disrupt or deny service entirely.

You might therefore quite reasonably conclude that all but international payments would flow through these domestic systems, and you'd be right. Except inside the UK, where that's not the case (yay!).

So, let's begin.

As British citizens, when we buy petrol, groceries, order online or catch the bus, we're almost certainly making card payments, and in those cases the transaction is not handled by our national payment infrastructure; instead, it is routed from our bank through Mastercard or Visa's network (who take a cut of the transaction for providing the service) and then back to the merchant bank to settle, even if the merchant and the customer share the same British bank and are both in the UK.

This is of course not a uniquely British problem. It's also how local payments look for most of the world, where card transactions mean paying rent to Visa and Mastercard to the tune of $70+ billion annually in combined net revenue.

This, as you might imagine, is a comfortable arrangement for the US Government, since the US-domiciled duopoly, together with the Government, decides who can participate, who can't, what fees are charged, and ultimately whose interests are served. Soft power doesn't get much softer than that.

Readers in China, India, Brazil, Sweden, the Netherlands and Poland, however, might be scratching their heads at this point, as the Governments of those countries have all invested in their national payment infrastructure, making it easy for consumers to use at point of sale, and so have also successfully reduced their dependency on Visa and Mastercard.

This is also a priority issue for the European Commission and European Central Bank as they continue to build out the Wero system, hoping to achieve "greater independence from the market power of American payment service providers" and provide "sovereignty and independence from the US in terms of payment solutions."

Anyway, back to Blighty. We in Britain, of course, took a different path.

Back in 1998, when Gordon Brown was Chancellor under a Labour government, the prevailing economic philosophy was that competition benefits consumers, but regulation is needed to prevent monopolies. Brown commissioned Don Cruickshank, who had just finished running Oftel (the British telecoms regulator), to examine competition in British banking.

Cruickshank, having seen how breaking British Telecom's monopoly had opened up telecommunications, believed the same medicine could work for the payments industry.

His 2000 report concluded that the UK's payment systems were an oligopoly. A consortium of big banks owned the payments infrastructure, set prices, and decided who got to play. He recommended the establishment of an independent regulator with statutory powers, which he called "PayCom".

Brown's government rejected it in favour of industry self-regulation, the prevailing theory being that banks, as grown-ups, could be trusted to police themselves. Eight years later, the 2008 financial crisis discredited "light touch" regulation and Labour lost the 2010 election. So that worked out.

---

In 2013, George Osborne, the new Conservative Chancellor in the coalition government, needed to show his party could reform the City. Breaking bank power was politically essential.

Osborne pushed through the Financial Services (Banking Reform) Act, finally creating Cruickshank's regulator, now called the Payment Systems Regulator (PSR). To lead it, the government appointed Hannah Nixon from Ofgem, the energy regulator.

She saw payment infrastructure the way she saw electricity grids: public utilities that shouldn't be owned by their biggest customers.

Her 2015 Market Review identified the problem: the big banks (notably Barclays, HSBC, Lloyds, RBS, and Santander, who together held about 85% of the shares) controlled Vocalink, the company that operated Britain's national payment infrastructure, while also being its main users. This gave them no incentive to innovate or lower fees. Her solution was to force them to sell.

Nixon recommended the banks divest; however, her hoped-for "competitive market" didn't materialise. There was no queue of British fintechs with £700 million to spend on national payment infrastructure. There was exactly one serious bidder, and before Nixon could formally require divestment, Mastercard offered to buy and the PSR accepted their offer as a way to resolve the ownership problem. The fix for "the wrong people own this" turned out to be "let different wrong people own it."

Yes, you read that correctly.

Mastercard wanted Vocalink because Vocalink's infrastructure handles something called Account-to-Account (A2A) transfers, where money moves directly between bank accounts without touching a card network.

When you tap your card at a terminal, whether contactless, chip and pin, or online checkout, that transaction routes through Mastercard or Visa's network. They take a cut of every transaction (interchange fees), typically 0.2-1.5% depending on the card type. That's how Mastercard makes money.

Their shareholders expect that revenue to grow. When money moves through A2A, it's faster (seconds vs days for settlement) and cheaper (fractions of a penny vs percentage-based fees). For Mastercard, it's an existential threat.

By acquiring Vocalink, Mastercard would gain control over the infrastructure that could route payments around their card network. They would own both the toll road and the free alternative.

And the PSR handed it over under the naive belief that this would improve competition. It would not. See [Privatisation of British Rail](https://en.wikipedia.org/wiki/Privatisation_of_British_Rail)

---

The deal was announced on 21 July 2016, four weeks after the Brexit referendum, while the pound was in freefall against the dollar. Philip Hammond had been Chancellor for just eight days, having replaced George Osborne when Theresa May took over from David Cameron in the post-referendum reshuffle.

The government could have intervened on national interest grounds. Instead, Hammond welcomed the deal, announcing that "MasterCard's decision to buy VocaLink shows that Britain remains an attractive destination for international investors."

<figure>
  <img src="/uploads/Paris_Tuileries_Garden_Facepalm_statue.jpg" alt="~Caïn by Henri Vidal, Tuileries Garden, Paris, 1896. Cain is depicted hiding his face in his hand after killing his brother.~ Facepalm.">
  <figcaption>fffffffff.</figcaption>
</figure>

The Competition and Markets Authority reviewed the deal. They raised concerns about ATM switching, where Mastercard and Vocalink were two of only three credible providers. On the core issue, a card network acquiring the A2A infrastructure that could bypass it, the CMA found "no competition concerns." That is to say, the body charged with protecting competition concluded that allowing a card monopoly to buy the only thing that might compete with cards was, on balance, fine. They accepted behavioural remedies: Mastercard would license some protocols and transfer LINK's messaging specification. The deal was approved in April 2017.

Brexit was no doubt a major political driver of the time, but it strikes me as a strange move nevertheless. Those who voted for Britain to leave the European Union did so on a platform of increasing sovereignty, and "taking back control" from foreign powers. For the Government to promptly complete a fire sale of critical national infrastructure to an American corporation seems, at the very least, and if we're being generous, somewhat at odds with that ideology.

---

So Mastercard and Visa operate a global duopoly on card payments, which includes the UK.

They are both publicly traded US corporations whose legal obligation is to maximise returns for their, largely American, institutional investors like Vanguard and BlackRock. They have no duty to the British public, no obligation to keep fees low, and no requirement to act in the national interest.

Once Brexit removed the cap on UK-EEA interchange fees, Mastercard and Visa did what unregulated duopolies tend to do, which is raise prices. Cross-border fees rose fivefold, from 0.2% to 1.15% for debit cards and 0.3% to 1.5% for credit cards. In June 2025, the Competition Appeal Tribunal ruled that Visa and Mastercard's interchange fee structures breach competition law, with potential damages in the billions.

In July 2025, the Bank of England fined Vocalink £11.9 million for failing to meet risk management requirements. This was the first fine the Bank has ever issued to a payment infrastructure operator.

The systems that route most of the nation's money were found to have inadequate controls under their new American ownership.

In March 2025, Keir Starmer's Labour government announced they were abolishing the PSR as an independent entity, folding its functions into the FCA. The regulator that took thirteen years to create is being wound down just as the consequences of its one major intervention become clear.

Visa and Mastercard's suspension of Russian operations in 2022 (still in force as of writing) is directly cited by the European Commission and European Central Bank as motivation for building Wero. Despite the awful name, it's still an important step toward sovereignty, one that escapes us in Britain. We're busy abolishing the payment regulator.

I suppose at each turn, everyone was acting in good faith, following their beliefs, political pressures, and ideologies, and hopefully doing what they thought was right for the British public. However, the result is that Britain's payment infrastructure is now owned by a US corporation whose shareholders expect fees to rise, whose business model depends on card payments staying dominant, and who now controls the only alternative.

- Brown believed in regulated competition.
- Osborne believed in breaking bank power.
- Nixon believed infrastructure shouldn't be controlled by its users.
- Hammond believed foreign investment meant confidence in the British economy.
- Starmer believes regulation means red tape.

The banks received £700 million for Mastercard to acquire the infrastructure. The British public now pay higher fees, with an American corporation sitting between them and their own money.

Looking back from 2026:

1. Fees rose fivefold after Brexit removed the cap
2. Vocalink was fined £11.9 million for inadequate controls under American ownership
3. The UK regulator is being abolished just as the consequences of its actions become clear
4. Europe is building an alternative
5. Britain is dismantling its oversight

---

**Sources:**
- [Cruickshank Report (2000)](https://paymentsystemsconsultancy.com/download/hmt-competition-in-uk-banking-cruickshank-report-march-2000/)
- [PSR Market Review MR15/2](https://www.gov.uk/cma-cases/mastercard-vocalink-merger-inquiry)
- [Fortune: MasterCard Is Buying VocaLink (21 July 2016)](https://fortune.com/2016/07/21/mastercard-vocalink-payments/)
- [CMA: Competition concerns over Mastercard/VocaLink merger](https://www.gov.uk/government/news/competition-concerns-over-mastercardvocalink-merger)
- [CMA: Mastercard/VocaLink undertakings accepted (April 2017)](https://www.gov.uk/government/news/cma-accepts-mastercardvocalink-undertakings)
- [PSR: Cross-border interchange fee review](https://www.psr.org.uk/our-work/market-reviews/market-review-into-cross-border-interchange-fees/)
- [Bank of England fines Vocalink (July 2025)](https://www.bankofengland.co.uk/news/2025/july/boe-fines-vocalink-limited)
- [PSR abolition announcement (March 2025)](https://www.skadden.com/insights/publications/2025/03/uk-government-abolishes-payment-systems-regulator)


