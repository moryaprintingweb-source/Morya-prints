import { ArrowUp, MessageCircle } from "lucide-react";
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
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:-translate-y-1"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
