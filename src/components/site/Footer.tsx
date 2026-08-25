import { Link } from "./Link";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { usePublicSiteSettings, whatsappHref } from "../../lib/site-settings";

const shopLinks = [
  ["visiting-cards", "Visiting Cards"],
  ["stickers-labels", "Stickers & Labels"],
  ["flex-printing", "Flex & Banners"],
  ["sunboard", "Signage Boards"],
  ["envelope", "Packaging"],
  ["letter-head", "Office Printing"],
  ["flyers-pamphlets", "Flyers & Pamphlets"],
  ["brochure-book", "Brochures"],
];

export function Footer() {
  const { getSetting } = usePublicSiteSettings();
  const phoneDisplay = getSetting("business_phone_display");
  const phoneLink = getSetting("business_phone_link");
  const whatsappNumber = getSetting("business_whatsapp_number");
  const email = getSetting("business_email");
  const address = getSetting("business_address");
  const mapsUrl = getSetting("business_maps_url");
  const googleUrl = getSetting("business_google_url");

  return (
    <footer className="mt-20 bg-navy text-white/80">
      <div className="container-x grid gap-8 py-14 md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_1fr_1fr_1.35fr] xl:gap-10">
        <div className="lg:max-w-sm">
          <div className="flex items-center gap-3">
            <picture>
              <source srcSet="/morya-footer-logo.webp" type="image/webp" />
              <img
                src="/morya-footer-logo.png"
                alt="Morya Printing Point"
                width="80"
                height="80"
                decoding="async"
                loading="lazy"
                className="h-20 w-20"
              />
            </picture>
            <div>
              <div className="font-display font-bold text-white">Morya Printing Point</div>
              <div className="text-[10px] font-bold uppercase tracking-[.14em] text-orange">
                Print. Brand. Deliver.
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Digital printing, flex printing, stickers, lamination, paper finishing, signage and
            custom branding—made with care in Kothrud, Pune.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              [
                Facebook,
                "Facebook",
                "https://www.facebook.com/people/Morya-Printing-Point/pfbid02LV2uRUNe3BpdhRbeRCNPQ8zKjtMyEoxEhGKUGzispXfvtZoAQYMR5GskABgw4rrCl/",
              ],
              [Instagram, "Instagram", "https://www.instagram.com/morya_printing_point/"],
              [Youtube, "YouTube", "https://www.youtube.com/@moryadigitalprinting"],
              [Twitter, "X", "https://x.com/shendedesign"],
            ].map(([Icon, label, href]) => (
              <a
                key={label as string}
                href={href as string}
                target="_blank"
                rel="noreferrer"
                aria-label={`Morya Printing Point on ${label}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-orange"
              >
                <Icon className="h-4 w-4 text-white" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Website pages</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Home"],
              ["/services", "Services"],
              ["/products", "Categories & Products"],
              ["/gallery", "Gallery"],
              ["/blog", "Blog"],
              ["/about", "About Us"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-orange">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Popular categories</h4>
          <ul className="space-y-2 text-sm">
            {shopLinks.map(([slug, label]) => (
              <li key={slug}>
                <Link
                  to="/products"
                  search={{ category: slug }}
                  className="transition hover:text-orange"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Support & policies</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/support", "Support"],
              ["/faq", "FAQ"],
              ["/shipping-payment-policy", "Shipping & Payment Policy"],
              ["/privacy-policy", "Privacy Policy"],
              ["/terms-conditions", "Terms & Conditions"],
              ["/return-refund-policy", "Return & Refund Policy"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-orange">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 hover:text-orange"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                {address}
              </a>
            </li>
            <li>
              <a
                href={googleUrl}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 hover:text-orange"
              >
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                Google Business Profile
              </a>
            </li>
            <li>
              <a href={`tel:${phoneLink}`} className="flex gap-3 hover:text-orange">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                {phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappHref(whatsappNumber)} className="flex gap-3 hover:text-orange">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="flex gap-3 hover:text-orange">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} Morya Printing Point. All rights reserved.</p>
          <p>GSTIN: 27KGIPS2055F1Z2</p>
        </div>
      </div>
    </footer>
  );
}
