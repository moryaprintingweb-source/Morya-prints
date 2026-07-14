import { createFileRoute } from "@tanstack/react-router";
import {
  Factory, ShoppingBag, Building2, HeartPulse, GraduationCap, Home, HardHat, Car, Ticket, Store,
} from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { CTA } from "../components/site/CTA";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve — Morya Prints Pvt Ltd" },
      { name: "description", content: "Trusted printing and signage partner across manufacturing, retail, corporate, healthcare, education, real estate, construction and more." },
    ],
  }),
  component: Industries,
});

const list = [
  { icon: Factory, title: "Manufacturing", desc: "Industrial labels, safety signage, factory branding." },
  { icon: ShoppingBag, title: "Retail", desc: "Store branding, POP displays, promotional print." },
  { icon: Building2, title: "Corporate Offices", desc: "Stationery, office signage, brand rollouts." },
  { icon: HeartPulse, title: "Healthcare", desc: "Directional signage, patient forms, wayfinding." },
  { icon: GraduationCap, title: "Education", desc: "Prospectus, ID cards, campus signage." },
  { icon: Home, title: "Real Estate", desc: "Site boards, brochures, marketing collateral." },
  { icon: HardHat, title: "Construction", desc: "Site branding, safety signage, hoardings." },
  { icon: Car, title: "Automobile", desc: "Showroom branding, dealer collateral, labels." },
  { icon: Ticket, title: "Events", desc: "Standees, banners, backdrops and on-site branding." },
  { icon: Store, title: "Local Businesses", desc: "Shop signage, printing and promo material." },
];

function Industries() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Industries" title="Industries We Serve" subtitle="From large-scale manufacturers to neighbourhood businesses — we tailor solutions for every sector." crumb="Industries" />

      <section className="container-x py-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {list.map((i) => (
          <div key={i.title} className="card-lift rounded-xl border bg-white p-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-navy to-cyan text-white">
              <i.icon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-display font-semibold text-navy">{i.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{i.desc}</p>
          </div>
        ))}
      </section>

      <CTA />
    </SiteLayout>
  );
}
