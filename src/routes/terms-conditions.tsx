import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "../components/site/InfoPage";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Morya Printing Point" },
      {
        name: "description",
        content: "Terms and conditions for quotes, artwork approval, production and delivery.",
      },
    ],
  }),
  component: TermsConditions,
});

function TermsConditions() {
  return (
    <InfoPage
      eyebrow="Terms"
      title="Terms & Conditions."
      subtitle="Important order, artwork and production terms for Morya Printing Point customers."
      crumb="Terms & Conditions"
      sections={[
        {
          title: "Quotes and pricing",
          items: [
            "Prices shown on the website are starting estimates and may change by specification.",
            "Final pricing is confirmed after reviewing size, quantity, material and finishing.",
            "Taxes, delivery and urgent production charges may apply where relevant.",
          ],
        },
        {
          title: "Artwork approval",
          items: [
            "Customers are responsible for checking spelling, numbers, layout and final content.",
            "Production starts after quote and artwork confirmation.",
            "Color output may vary slightly between screen preview and printed material.",
          ],
        },
        {
          title: "Production and delivery",
          items: [
            "Timelines depend on material availability, order size and current workload.",
            "Delivery timelines are estimates unless specifically confirmed.",
            "Morya Printing Point may refuse artwork that is unlawful or unsuitable for production.",
          ],
        },
      ]}
    />
  );
}
