import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { CTA } from "../components/site/CTA";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Morya Prints Pvt Ltd" },
      { name: "description", content: "Insights, guides and articles on printing, LED signage, branding and corporate identity." },
    ],
  }),
  component: Blog,
});

const posts = [
  { title: "Importance of Professional Printing for Businesses", excerpt: "Why quality printing still shapes brand perception in a digital-first world.", img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=1000", date: "Jun 2026", tag: "Printing" },
  { title: "How LED Signage Helps Brand Visibility", excerpt: "The measurable impact of illuminated signage on foot traffic and recall.", img: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1000", date: "May 2026", tag: "Signage" },
  { title: "Why Corporate Branding Matters", excerpt: "Consistent branding across every touchpoint builds unshakeable trust.", img: "https://images.unsplash.com/photo-1611095973763-414019e72400?w=1000", date: "Apr 2026", tag: "Branding" },
  { title: "Benefits of High-Quality Packaging Labels", excerpt: "How premium labels influence purchase decisions and reduce returns.", img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1000", date: "Mar 2026", tag: "Packaging" },
  { title: "Digital Printing vs Offset Printing", excerpt: "Which technology fits your project — a practical decision framework.", img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1000", date: "Feb 2026", tag: "Guide" },
];

function Blog() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Blog" title="Insights from the print & signage floor." subtitle="Practical guides and industry perspectives from our team." crumb="Blog" />

      <section className="container-x py-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.title} className="card-lift rounded-2xl border bg-white overflow-hidden group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute top-4 left-4 rounded-full bg-orange px-3 py-1 text-[11px] font-semibold text-white uppercase tracking-wide">{p.tag}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> {p.date}
              </div>
              <h3 className="mt-2 font-display font-bold text-lg text-navy leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-orange transition-colors">
                Read more <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </section>

      <CTA />
    </SiteLayout>
  );
}
