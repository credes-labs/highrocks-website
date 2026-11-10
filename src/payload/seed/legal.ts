/**
 * Starting drafts for the legal pages. Bracketed items, e.g. [Company legal name], must be filled in,
 * and both documents should be reviewed by a lawyer before launch. Editable in the CMS.
 */

type LegalSeed = { slug: "privacy" | "terms"; title: string; summary: string; sections: { heading: string; body: string }[] };

export const legalPages: LegalSeed[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    summary:
      "We collect only what we need to run the HighRocks waitlist and website: your name and email, and optionally your phone number and birth year. We never sell your data, and you can ask us to delete it at any time.",
    sections: [
      {
        heading: "Who we are",
        body: `HighRocks ("we", "us") is a Hyrox training app in development. This policy explains how we handle personal data on this website and on the early-access waitlist.

The data controller is [Company legal name], [registered address]. For anything about your data, email [privacy contact email].`,
      },
      {
        heading: "What we collect",
        body: `When you join the waitlist:
- Your name and email address (required).
- Your phone number and birth year, if you choose to give them.
- The date you joined and which form you used.

When you visit the site:
- Standard server logs (IP address, browser type, pages requested), which our hosting provider keeps for a short time for security and troubleshooting.
- If bot protection is switched on, Cloudflare Turnstile checks the form submission to tell people from bots.

We do not use advertising or tracking cookies. If we add analytics later, we will update this policy and ask for consent where the law requires it.`,
      },
      {
        heading: "Why we use it",
        body: `- To keep your place on the waitlist and email you about early access and the launch. Our legal basis is your consent, which you give when you join.
- To estimate your Hyrox age group from your birth year, so the app can suggest realistic targets.
- To keep the site secure and stop spam. Our legal basis is our legitimate interest in protecting the service.`,
      },
      {
        heading: "Who we share it with",
        body: `We never sell your personal data. We share it only with service providers that help us run HighRocks, under contracts that require them to protect it:
- Website and database hosting: [hosting provider].
- Email delivery: Resend.
- Bot protection: Cloudflare (Turnstile).

Some of these providers may process data outside your country. Where that happens, we rely on appropriate safeguards such as standard contractual clauses.`,
      },
      {
        heading: "How long we keep it",
        body: `We keep waitlist details until the app launches and for up to 12 months after, or until you unsubscribe or ask us to delete them, whichever comes first. Server logs are kept for no more than 30 days.`,
      },
      {
        heading: "Your rights",
        body: `Depending on where you live, you can:
- Ask for a copy of the data we hold about you.
- Ask us to correct or delete it.
- Withdraw your consent and leave the waitlist at any time; reply "unsubscribe" to any email from us.
- Object to or ask us to restrict how we use it.
- Complain to your local data protection authority.

To use any of these rights, email [privacy contact email]. We will reply within 30 days.`,
      },
      {
        heading: "Children",
        body: `HighRocks is not intended for anyone under 16, and we do not knowingly collect their data. If you think a child has joined the waitlist, contact us and we will delete their details.`,
      },
      {
        heading: "Security",
        body: `We protect your data with encrypted connections (HTTPS), access limited to the people who need it, and providers with strong security practices. No system is completely secure, but we work to keep your data safe and will tell you and the authorities about any serious breach as the law requires.`,
      },
      {
        heading: "Changes to this policy",
        body: `If we change how we use your data, we will update this page and the date at the top. For significant changes, we will email people on the waitlist.`,
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & conditions",
    summary:
      "These terms cover your use of the HighRocks website and the early-access waitlist. Joining is free, a waitlist place does not guarantee access, and our training content is general information, not medical advice.",
    sections: [
      {
        heading: "About these terms",
        body: `These terms apply to the HighRocks website and waitlist, run by [Company legal name] ("HighRocks", "we", "us"). By using the site or joining the waitlist, you agree to them. If you do not agree, please do not use the site.`,
      },
      {
        heading: "The waitlist",
        body: `- Joining the waitlist is free and does not commit you to anything.
- A place on the waitlist does not guarantee access to the app, a launch date, or particular features or pricing.
- Please give accurate details. You can leave the waitlist at any time.
- How we handle your details is explained in our privacy policy.`,
      },
      {
        heading: "Training information is not medical advice",
        body: `Our articles, FAQs, pace calculator and drills are general information for people training for fitness races. They are not medical advice and do not replace guidance from a doctor, physiotherapist or qualified coach.

Hyrox-style training is physically demanding. Check with a health professional before starting a new programme, especially if you have an injury or a medical condition, and stop if you feel pain, dizziness or shortness of breath. You train at your own risk.`,
      },
      {
        heading: "Hyrox",
        body: `HYROX is a trademark of its owner. HighRocks is an independent training app. It is not affiliated with, endorsed by or sponsored by HYROX. We mention Hyrox only to describe the race our app helps you train for. Race formats, stations and weights can change, so always check the official HYROX rulebook for your event.`,
      },
      {
        heading: "Using the site",
        body: `You agree not to misuse the site, including by:
- Trying to break, overload or get unauthorised access to it.
- Submitting false details or signing other people up without their permission.
- Scraping it in bulk for anything other than search indexing.`,
      },
      {
        heading: "Our content",
        body: `The HighRocks name, logo, design and content belong to us or our licensors. You may share links to our pages and quote short extracts with credit. Please do not copy or republish our content in full without permission.`,
      },
      {
        heading: "Links to other sites",
        body: `We may link to other websites. We are not responsible for their content or how they handle your data.`,
      },
      {
        heading: "Our liability",
        body: `We work to keep the site accurate and available, but we provide it "as is" and cannot promise it will always be error-free or online. To the extent the law allows, we are not liable for any loss arising from your use of the site or its training information. Nothing in these terms limits liability that cannot be limited by law.`,
      },
      {
        heading: "Changes and governing law",
        body: `We may update these terms. The date at the top shows when they last changed. These terms are governed by the laws of [jurisdiction], and the courts of [jurisdiction] have jurisdiction over any dispute.`,
      },
      {
        heading: "Contact",
        body: `Questions about these terms? Email [contact email].`,
      },
    ],
  },
];
