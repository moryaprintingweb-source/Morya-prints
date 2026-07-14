import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "./SiteLayout";
import { PageHero } from "./PageHero";

export function InfoPage({
  eyebrow,
  title,
  subtitle,
  crumb,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  crumb: string;
  sections: { title: string; items: string[] }[];
}) {
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} crumb={crumb} />
      <section className="container-x py-10 md:py-16">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="rounded-xl border bg-white p-5 md:p-6">
              <h2 className="font-display text-2xl font-bold text-navy">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-xl bg-soft p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy">Need more help?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Call or WhatsApp Morya Printing Point for order support, custom quotes and artwork
                guidance.
              </p>
            </div>
            <Link to="/contact" className="btn-primary">
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
