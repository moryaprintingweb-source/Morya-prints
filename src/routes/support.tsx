import { InfoPage } from "../components/site/InfoPage";
import { usePublicSiteSettings } from "../lib/site-settings";

export function Support() {
  const { getSetting } = usePublicSiteSettings();
  const phoneDisplay = getSetting("business_phone_display");

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
            `Call ${phoneDisplay} for quick assistance.`,
            "WhatsApp product requirements, files and reference images directly.",
            "Visit the Kothrud shop for in-person consultation and sample checks.",
          ],
        },
      ]}
    />
  );
}
