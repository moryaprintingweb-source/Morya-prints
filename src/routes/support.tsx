import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "../components/site/InfoPage";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support | Morya Printing Point" },
      {
        name: "description",
        content: "Get support for artwork, ordering, delivery and custom printing queries.",
      },
    ],
  }),
  component: Support,
});

function Support() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Helpful support for every print order."
      subtitle="Get guidance on artwork, material selection, order timelines, delivery and custom print requirements."
      crumb="Support"
      sections={[
        {
          title: "Order help",
          items: [
            "Share size, quantity, material and deadline to receive the right quote.",
            "Our team can suggest paper, vinyl, flex, lamination and finishing options.",
            "Urgent orders are accepted based on production availability.",
          ],
        },
        {
          title: "Artwork support",
          items: [
            "Send print-ready files where possible for faster processing.",
            "Artwork review can help catch size, margin, resolution and color issues.",
            "Custom design assistance can be discussed before production.",
          ],
        },
        {
          title: "Contact support",
          items: [
            "Call +91 85548 42103 for quick assistance.",
            "WhatsApp product requirements, files and reference images directly.",
            "Visit the Kothrud shop for in-person consultation and sample checks.",
          ],
        },
      ]}
    />
  );
}
