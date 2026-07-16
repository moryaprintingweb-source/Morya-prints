import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { CTA } from "../components/site/CTA";
import { Masonry } from "../components/gallery/Masonry";

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
  { id: "offset", img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=1200", label: "Offset Printing", height: 560 },
  { id: "led", img: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1200", label: "LED Signage", height: 390 },
  { id: "branding", img: "https://images.unsplash.com/photo-1611095973763-414019e72400?w=1200", label: "Corporate Branding", height: 470 },
  { id: "stationery", img: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200", label: "Stationery", height: 420 },
  { id: "packaging", img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200", label: "Packaging Labels", height: 530 },
  { id: "digital", img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200", label: "Digital Prints", height: 400 },
  { id: "labels", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200", label: "Industrial Labels", height: 480 },
  { id: "safety", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200", label: "Safety Signage", height: 410 },
  { id: "bulk", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200", label: "Bulk Printing", height: 500 },
];

function Gallery() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="Portfolio & Recent Work" subtitle="A visual walk-through of projects delivered across industries." crumb="Gallery" />

      <section className="container-x py-20">
        <Masonry items={images} />
      </section>

      <CTA />
    </SiteLayout>
  );
}
