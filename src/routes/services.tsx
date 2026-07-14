import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Printer,
  Factory,
  Building2,
  Lightbulb,
  Signpost,
  Package,
  FileText,
  Store,
  ShieldAlert,
  Monitor,
  Layers,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { CTA } from "../components/site/CTA";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Morya Prints Pvt Ltd" },
      {
        name: "description",
        content:
          "Commercial and industrial printing, corporate branding, LED sign boards, packaging labels, safety signage, digital and offset print services.",
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: Printer,
    title: "Commercial Printing",
    desc: "Brochures, catalogues, flyers, posters, invitation cards and full-colour marketing collateral produced on precision offset & digital presses.",
  },
  {
    icon: Factory,
    title: "Industrial Printing",
    desc: "Durable prints and industrial labels for machinery, warehousing, hazardous environments and process manufacturing.",
  },
  {
    icon: Building2,
    title: "Corporate Branding",
    desc: "Stationery, uniforms, office signage and complete brand identity systems for growing enterprises.",
  },
  {
    icon: Lightbulb,
    title: "LED Signage Boards",
    desc: "In-house designed and manufactured LED sign boards, illuminated boxes and display panels with weather-grade finish.",
  },
  {
    icon: Signpost,
    title: "Signage Boards",
    desc: "ACP, acrylic, metal, glow and 3D signage — indoor and outdoor — engineered for longevity.",
  },
  {
    icon: Package,
    title: "Packaging Labels",
    desc: "Product labels, barcode stickers, tamper-proof and food-grade packaging labels in every size and shape.",
  },
  {
    icon: FileText,
    title: "Computerized Job Work",
    desc: "Bill books, forms, registers, letterheads and computer-based stationery printed on demand.",
  },
  {
    icon: Store,
    title: "Retail Branding",
    desc: "Store branding, POP displays, danglers, standees and complete shop-front signage for retail chains.",
  },
  {
    icon: ShieldAlert,
    title: "Safety Signages",
    desc: "Industrial safety, statutory, warning and directional signage compliant with regulatory standards.",
  },
  {
    icon: Monitor,
    title: "Digital Printing",
    desc: "Short-run, on-demand, high-resolution digital printing with pinpoint colour accuracy.",
  },
  {
    icon: Layers,
    title: "Offset Printing",
    desc: "Volume offset printing with consistent, calibrated colour output for bulk orders.",
  },
  {
    icon: Sparkles,
    title: "Custom Branding Products",
    desc: "Corporate gifting, apparel branding, mugs, danglers, calendars and one-off promotional products.",
  },
];

function Services() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Services"
        title="End-to-end printing, branding and signage."
        subtitle="A single vendor for every print and signage requirement — from design to installation."
        crumb="Services"
      />

      <section className="container-x py-20 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.title} className="card-lift rounded-2xl border bg-white p-8 group">
            <div className="flex items-start gap-5">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-soft group-hover:bg-navy transition-colors shrink-0">
                <s.icon className="h-7 w-7 text-navy group-hover:text-orange transition-colors" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-xl text-navy">{s.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/contact" className="btn-navy !py-2 !px-3 text-xs">
                    Enquire <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href="https://wa.me/918554842103"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary !py-2 !px-3 text-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Get Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <CTA />
    </SiteLayout>
  );
}
