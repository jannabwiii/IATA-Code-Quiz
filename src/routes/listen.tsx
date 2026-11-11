import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/listen")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Listen & pick · World Geography Codes" },
      { name: "description", content: "Hear a city name or a spelled-out airport code, then pick the right match." },
      { property: "og:title", content: "Listen & pick · World Geography Codes" },
      { property: "og:description", content: "Hear a city name or a spelled-out airport code, then pick the right match." },
    ],
  }),
  beforeLoad: () => { throw redirect({ to: "/multiple-choice", replace: true }); },
});
