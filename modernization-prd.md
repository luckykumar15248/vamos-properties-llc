# Vamos Properties LLC — product requirements

## Product

Vamos Properties LLC buys houses in Maricopa County from owners who need a fast, private way out. The site’s job is a same-day conversation with Patrick or Jaime. Rankings and pages exist to start that conversation.

Two offers:

1. **Cash offer.** Buy the house as-is, on the seller’s date, with no agent commission and no seller-paid closing costs. The loan is paid off at a licensed title company. This is the default recommendation.
2. **Take over payments.** Bring a delinquent mortgage current and keep making the payments after the deed transfers. Use this when a cash sale would net little or nothing and the existing loan is worth keeping. The loan can remain in the seller’s name.

## Audience

Homeowners in the Phoenix metro who are already under stress:

- Pre-foreclosure or a recorded Notice of Trustee’s Sale
- Behind on payments
- Divorce, with both parties needing a clean exit
- Inheritance or probate
- Job loss or a payment they can no longer make

They are usually on a phone. They are comparing Vamos with cash-buyer sites that promise a “fair” offer and a 24-hour number. They need a local person, a straight explanation, and a call back the same day.

## Experience

Above the fold on every seller page:

- A headline about their situation
- Two choices: cash offer, or help with the payments
- Address, then name and mobile
- A sticky call button

The form takes under a minute. Fields: address, name, mobile, situation, trustee-sale date when they have a notice, preferred path (cash, takeover, or “tell me which fits”), and a required consent checkbox for calls and texts. Email is optional.

After submit, the thank-you page shows the phone number. Twilio texts the seller and both founders. The daytime response target is five minutes (8:00–19:00 America/Phoenix).

Trust content is founder photos, the local number, the title company used at closing, and short stories that name a situation and a city. Offer math is explained in plain words: a cash price is below a retail listing because Vamos pays the costs, buys as-is, and closes on the seller’s date.

## Pages in the first release

Home, Stop Foreclosure, Take Over Payments, About, Contact, Spanish Stop Foreclosure (`/es/stop-foreclosure`), and suburb pages for Phoenix, Mesa, Glendale, Chandler, Gilbert, Peoria, Surprise, Avondale, and Tempe.

Suburb pages share the form and the two paths. Each one has its own opening paragraph, one local fact, and its own FAQ.

## Compliance and disclosures

An Arizona real estate attorney reviews the foreclosure timeline and the takeover page before launch.

Required statements, in ordinary language:

- A cash sale is intended to pay off the mortgage at closing so the seller is done with that loan.
- Taking over payments does not, by itself, remove the seller from the loan. The lender may have a due-on-sale right. If agreed payments are missed, the seller’s credit can still be harmed.
- Vamos does not repair credit, guarantee a sale date, or promise an offer equal to a listed price.
- Arizona trustee sales generally cannot be held before the 91st day after the Notice of Trustee’s Sale is recorded. The page tells the reader to confirm their own notice and to talk with a lawyer or housing counselor if they want advice about the loan.
- Submitting the form asks Vamos to call and text. The consent line names Vamos Properties, says message and data rates may apply, and says consent is not a condition of a purchase. The stored record keeps the exact sentence, time, page URL, and a hash of the IP.
- No fee is charged to request an offer. Any exception is written on the page before someone submits.

Out of scope for the public site: credit-repair funnels, “subject-to” jargon as the headline, guaranteed foreclosure outcomes, and a listings catalog in the seller menu.

## Success measures

- Qualified leads per week, split by page and by situation
- Percent of daytime leads with a first outbound text or call inside five minutes
- Show rate for appointments
- Close rate by path (cash vs. takeover)
- Share of leads with a trustee-sale date inside 21 days

Vanity traffic is secondary to leads that include a phone number and an address.
