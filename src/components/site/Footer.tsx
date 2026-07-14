import { Link } from "@tanstack/react-router";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import logo from "../../assets/morya-logo.svg";

const shopLinks = [
  "Visiting Cards",
  "Stickers & Labels",
  "Flex & Banners",
  "Signage Boards",
  "Packaging",
  "Office Printing",
  "Photo Prints",
  "Corporate Gifts",
];

export function Footer() {
  return (
    <footer className="mt-20 bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Morya Printing Point" className="h-12 w-12" />
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
            {[Facebook, Instagram, Linkedin].map((Icon, index) => (
              <a
                key={index}
                href="https://wa.me/918554842103"
                aria-label="Contact Morya Printing Point on WhatsApp"
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
            {shopLinks.map((item) => (
              <li key={item}>
                <Link to="/products" className="transition hover:text-orange">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Support & policies</h4>
          <ul className="mb-6 space-y-2 text-sm">
            {[
              ["/support", "Support"],
              ["/faq", "FAQ"],
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
          <h4 className="mb-4 font-semibold text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              Shop No. 3, Jeet Building, near Jeet Ground, Lokmanya Colony, Kothrud, Pune 411038
            </li>
            <li>
              <a
                href="https://share.google/fzqShCOs399ka2PWD"
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 hover:text-orange"
              >
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                Google Business Profile
              </a>
            </li>
            <li>
              <a href="tel:+918554842103" className="flex gap-3 hover:text-orange">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                +91 85548 42103
              </a>
            </li>
            <li>
              <a href="https://wa.me/918554842103" className="flex gap-3 hover:text-orange">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                WhatsApp us
              </a>
            </li>
            <li>
              <a href="mailto:Moryaprintingweb@gmail.com" className="flex gap-3 hover:text-orange">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                Moryaprintingweb@gmail.com
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
