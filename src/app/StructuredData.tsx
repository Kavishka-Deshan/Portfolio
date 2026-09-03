import { site } from "@/content/portfolio";

/*
 * Schema.org JSON-LD.
 *
 * Two graph nodes, linked by @id:
 *   Person  — the identity Google should associate with the name "Kavishka
 *             Deshan". sameAs points at the profiles that corroborate it.
 *   WebSite — this domain, with the Person as its author/publisher.
 *
 * Rendered as a plain <script> in a Server Component, so the markup is present
 * in the static HTML with no client JS and no hydration involvement.
 * Only profiles that actually exist are listed — Google penalises sameAs
 * entries it cannot verify.
 */

const SITE_URL = "https://kavishkadeshan.dev";
const PERSON_ID = `${SITE_URL}/#person`;
const SITE_ID = `${SITE_URL}/#website`;

export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Kavishka Deshan",
        givenName: "Kavishka",
        familyName: "Deshan",
        url: SITE_URL,
        image: `${SITE_URL}/profile.jpg`,
        jobTitle: "Software Engineering Undergraduate",
        description:
          "Software Engineering undergraduate at NIBM, Sri Lanka, and a fullstack developer building " +
          "mobile and web applications end to end.",
        email: `mailto:${site.email}`,
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "National Institute of Business Management (NIBM)",
          address: {
            "@type": "PostalAddress",
            addressCountry: "LK",
          },
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
          addressRegion: "Sri Lanka",
        },
        knowsAbout: [
          "Software Engineering",
          "Fullstack Web Development",
          "Mobile Application Development",
          "React",
          "Next.js",
          "TypeScript",
          "Flutter",
          "Node.js",
          "Firebase",
          "Supabase",
        ],
        sameAs: [site.github, site.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE_URL,
        name: "Kavishka Deshan — Portfolio",
        description:
          "Portfolio of Kavishka Deshan, Software Engineering undergraduate and fullstack developer " +
          "based in Sri Lanka.",
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is not user-controlled here, and < is escaped so
      // a value can never terminate the script element early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
