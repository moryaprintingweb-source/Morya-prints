import { InfoPage } from "../components/site/InfoPage";

export function FAQ() {
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
        {
          title: "What file formats do you accept?",
          items: [
            "PDF, AI, CDR, PSD, JPG and PNG files are accepted for most print jobs.",
            "High-resolution, print-ready files help avoid delays and quality issues.",
            "Our team can review margins, size, resolution and color concerns before production.",
          ],
        },
        {
          title: "How is pricing calculated?",
          items: [
            "Website prices are starting estimates for common sizes and quantities.",
            "Final pricing depends on material, size, quantity, finishing, delivery and urgency.",
            "Bulk orders and custom sizes are quoted after checking full requirements.",
          ],
        },
        {
          title: "Which payment methods are available?",
          items: [
            "Payment can be made by cash, UPI, bank transfer, cards or agreed digital methods.",
            "Advance payment may be required for custom, bulk or urgent production orders.",
            "GST and delivery charges are confirmed before final billing where applicable.",
          ],
        },
        {
          title: "Can you help with design?",
          items: [
            "Design assistance can be discussed for visiting cards, flyers, labels and signage.",
            "Reference images, logo files, brand colors and exact text help speed up design work.",
            "Design charges, if applicable, are confirmed before starting the artwork.",
          ],
        },
      ]}
    />
  );
}
