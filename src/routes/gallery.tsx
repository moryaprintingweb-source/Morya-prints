import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { CTA } from "../components/site/CTA";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Morya Prints Pvt Ltd" },
      { name: "description", content: "A portfolio of our printing, branding, LED signage, packaging and corporate print work." },
    ],
  }),
  component: Gallery,
});

const images = [
  { src: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=1200", label: "Offset Printing" },
  { src: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1200", label: "LED Signage" },
  { src: "https://images.unsplash.com/photo-1611095973763-414019e72400?w=1200", label: "Corporate Branding" },
  { src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200", label: "Stationery" },
  { src: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200", label: "Packaging Labels" },
  { src: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200", label: "Digital Prints" },
  { src: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200", label: "Industrial Labels" },
  { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200", label: "Safety Signage" },
  { src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200", label: "Bulk Printing" },
];

function Gallery() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="Portfolio & Recent Work" subtitle="A visual walk-through of projects delivered across industries." crumb="Gallery" />

      <section className="container-x py-20 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
        {images.map((im, i) => (
          <div key={i} className="mb-5 break-inside-avoid card-lift rounded-xl overflow-hidden border bg-white group relative">
            <img src={im.src} alt={im.label} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy/90 to-transparent">
              <div className="text-white font-semibold text-sm">{im.label}</div>
            </div>
          </div>
        ))}
      </section>

      <CTA />
    </SiteLayout>
  );
}
