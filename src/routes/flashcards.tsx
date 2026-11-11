import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Flashcards · World Geography Codes" },
      { name: "description", content: "Flip flashcards for IATA city and airport codes, countries and TC areas." },
      { property: "og:title", content: "Flashcards · World Geography Codes" },
      { property: "og:description", content: "Flip flashcards for IATA city and airport codes, countries and TC areas." },
    ],
  }),
  beforeLoad: () => { throw redirect({ to: "/type-it", replace: true }); },
});
