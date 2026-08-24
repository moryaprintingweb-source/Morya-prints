import { InfoPage } from "../components/site/InfoPage";

export function ShippingPaymentPolicy() {
  return (
    <InfoPage
      eyebrow="Shipping & Payment"
      title="Shipping & Payment Policy."
      subtitle="How delivery, pickup, payment confirmation and billing work for print orders."
      crumb="Shipping & Payment Policy"
      sections={[
        {
          title: "Delivery and pickup",
          items: [
            "Local delivery is available across Pune and nearby areas after order confirmation.",
            "Pickup from the Kothrud shop is available for urgent or sample-check orders.",
            "Delivery timelines depend on artwork approval, product type, quantity and location.",
          ],
        },
        {
          title: "Payment confirmation",
          items: [
            "Final payment amount is confirmed after reviewing size, quantity, material and finishing.",
            "Accepted payment methods include cash, UPI, bank transfer, cards and other agreed digital methods.",
            "Production may begin after advance payment or full payment, based on order type.",
          ],
        },
        {
          title: "Billing and charges",
          items: [
            "GST, delivery and urgent-production charges may apply where relevant.",
            "Invoices or receipts are shared according to the agreed order and payment details.",
            "Large, custom or installation-based orders may require separate delivery and handling charges.",
          ],
        },
      ]}
    />
  );
}
