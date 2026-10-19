export const guides = [
  {
    slug: "cash-sale",
    title: "How a cash sale works",
    description:
      "What happens from the first call to a Maricopa County title company, and what a cash price does and does not include.",
    blurb: "The steps, the timeline, and the part where you can still say no.",
  },
  {
    slug: "trustee-sale",
    title: "After a Notice of Trustee's Sale",
    description:
      "How an Arizona trustee sale date works, and what to gather before you ask for a cash offer.",
    blurb: "The date on the notice, what a sale does not erase, and when to call.",
  },
  {
    slug: "life-events",
    title: "Divorce, probate, or a job loss",
    description:
      "How to sell a Maricopa County house when the reason is a divorce, an estate, or a payment you cannot make.",
    blurb: "Who has to sign, what title will ask for, and which path fits.",
  },
] as const;

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
