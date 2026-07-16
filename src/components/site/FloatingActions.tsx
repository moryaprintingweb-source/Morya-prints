import {
  ArrowUp,
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <aside
        aria-label="Follow Morya Printing Point"
        className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 gap-1 md:flex md:flex-col"
      >
        {[
          [Facebook, "Facebook", "https://www.facebook.com/people/Morya-Printing-Point/pfbid02LV2uRUNe3BpdhRbeRCNPQ8zKjtMyEoxEhGKUGzispXfvtZoAQYMR5GskABgw4rrCl/", "bg-[#1877f2]"],
          [Youtube, "YouTube", "https://www.youtube.com/@moryadigitalprinting", "bg-[#ff0000]"],
          [Instagram, "Instagram", "https://www.instagram.com/morya_printing_point/", "bg-[#e4405f]"],
          [Twitter, "X", "https://x.com/shendedesign", "bg-black"],
          [null, "WhatsApp", "https://api.whatsapp.com/send?phone=918554842103", "bg-[#25D366]"],
        ].map(([Icon, label, href, color]) => (
          <a
            key={label as string}
            href={href as string}
            target="_blank"
            rel="noreferrer"
            aria-label={`Morya Printing Point on ${label}`}
            className={`grid h-8 w-8 place-items-center rounded-r-md text-white shadow-md transition hover:w-10 ${color}`}
          >
            {label === "WhatsApp" ? (
              <img src="/whatsapp.svg" alt="" className="h-3.5 w-3.5 brightness-0 invert" />
            ) : (
              <Icon className="h-3.5 w-3.5" />
            )}
          </a>
        ))}
      </aside>
      <aside
        aria-label="Contact Morya Printing Point"
        className="fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 gap-1 md:flex md:flex-col"
      >
        <a
          href="https://maps.app.goo.gl/TSBbNMXqBig85rtJ9"
          target="_blank"
          rel="noreferrer"
          aria-label="Find Morya Printing Point on the map"
          className="grid h-8 w-8 place-items-center rounded-l-md bg-[#4285f4] text-white shadow-md transition hover:w-10"
        >
          <MapPin className="h-3.5 w-3.5" />
        </a>
        <a
          href="tel:+918554842103"
          aria-label="Call Morya Printing Point"
          className="grid h-8 w-8 place-items-center rounded-l-md bg-orange text-white shadow-md transition hover:w-10"
        >
          <Phone className="h-3.5 w-3.5" />
        </a>
      </aside>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6">
        {showTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-12 w-12 place-items-center rounded-full border bg-white text-navy shadow-lg transition hover:-translate-y-1 hover:text-orange"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a
        href="https://wa.me/918554842103"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:-translate-y-1 md:hidden"
      >
        <img src="/whatsapp.svg" alt="" className="h-6 w-6 brightness-0 invert" />
      </a>
      </div>
    </>
  );
}
