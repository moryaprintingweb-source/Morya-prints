import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";

export function CTA() {
  return (
    <section className="container-x my-20">
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-12 md:px-14 md:py-16 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-center">
          <div>
            <span className="eyebrow">Ready to start?</span>
            <h3 className="mt-2 text-2xl md:text-4xl font-bold font-display">
              Let’s bring your next print project to life.
            </h3>
            <p className="mt-2 text-white/70 max-w-2xl">
              From a handful of business cards to full shop branding, share your idea and get a
              clear, quick quote.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              Get a Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+918554842103" className="btn-outline">
              <Phone className="h-4 w-4" /> Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
