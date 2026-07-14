import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "../components/site/InfoPage";

export const Route = createFileRoute("/return-refund-policy")({
  head: () => ({
    meta: [
      { title: "Return & Refund Policy | Morya Printing Point" },
      {
        name: "description",
        content: "Return and refund policy for customized print products and production issues.",
      },
    ],
  }),
  component: ReturnRefundPolicy,
});

function ReturnRefundPolicy() {
  return (
    <InfoPage
      eyebrow="Returns"
      title="Return & Refund Policy."
      subtitle="Guidelines for customized print orders, corrections and production-related issues."
      crumb="Return & Refund Policy"
      sections={[
        {
          title: "Custom print orders",
          items: [
            "Most printed products are customized and cannot be returned after approval.",
            "Please review artwork, text, quantity and specifications before production.",
            "Changes after production starts may require additional charges.",
          ],
        },
        {
          title: "Production issues",
          items: [
            "If there is a production error, contact the shop with photos and order details.",
            "Eligible issues may be corrected, reprinted or adjusted after review.",
            "Minor color variation from screen to print is not treated as a defect.",
          ],
        },
        {
          title: "Refund review",
          items: [
            "Refunds, if applicable, are reviewed case by case.",
            "Approved refunds follow the agreed payment method and timeline.",
            "Orders delayed by missing artwork, unclear approvals or customer changes may not qualify.",
          ],
        },
      ]}
    />
  );
}
