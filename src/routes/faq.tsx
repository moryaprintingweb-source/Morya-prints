import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "../components/site/InfoPage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Morya Printing Point" },
      {
        name: "description",
        content: "Frequently asked questions about custom printing, artwork, pricing and delivery.",
      },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <InfoPage
      eyebrow="FAQ"
      title="Frequently asked questions."
      subtitle="Quick answers for common printing, artwork and delivery questions."
      crumb="FAQ"
      sections={[
        {
          title: "How do I place an order?",
          items: [
            "Choose a product, add it to cart or send details on WhatsApp.",
            "Share size, quantity, artwork file and delivery deadline.",
            "The team confirms material, finish, price and timeline before production.",
          ],
        },
        {
          title: "Can I order custom sizes?",
          items: [
            "Yes, custom sizes are available for many print products.",
            "Pricing depends on material, size, quantity, finishing and urgency.",
            "One-off print jobs can be quoted after reviewing the requirement.",
          ],
        },
        {
          title: "Do you deliver?",
          items: [
            "Local delivery is available across Pune and nearby areas where feasible.",
            "Delivery timing depends on order size, production queue and location.",
            "Pickup from the Kothrud shop is also available.",
          ],
        },
      ]}
    />
  );
}
