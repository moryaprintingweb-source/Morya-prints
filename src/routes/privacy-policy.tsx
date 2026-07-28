import { InfoPage } from "../components/site/InfoPage";

export function PrivacyPolicy() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title="Privacy Policy."
      subtitle="How Morya Printing Point handles customer contact details, enquiries, artwork and order information."
      crumb="Privacy Policy"
      sections={[
        {
          title: "Information collected",
          items: [
            "We may collect name, phone number, email, address and order requirements.",
            "Artwork files, reference images and brand details may be shared for printing.",
            "Website cart selections are stored locally in the customer's browser.",
          ],
        },
        {
          title: "How information is used",
          items: [
            "Information is used to prepare quotes, process orders and coordinate delivery.",
            "Artwork is used only for the requested print or design work.",
            "Contact details may be used for order updates and support communication.",
          ],
        },
        {
          title: "Data care",
          items: [
            "Customer information is not sold to third parties.",
            "Sensitive files should be shared only when required for production.",
            "Customers can request clarification about stored order information.",
          ],
        },
      ]}
    />
  );
}
