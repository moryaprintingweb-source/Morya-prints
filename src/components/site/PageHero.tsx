import { Link } from "./Link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  crumb,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumb: string;
}) {
  return (
    <section className="container-x relative overflow-hidden bg-navy text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(600px 300px at 10% 20%, #00AEEF 0%, transparent 60%), radial-gradient(500px 300px at 90% 80%, #FF7A00 0%, transparent 60%)",
        }}
      />
      <div className="relative py-16 md:py-24">
        {eyebrow && <span className="eyebrow text-orange">{eyebrow}</span>}
        <h1 className="mt-3 break-words font-display text-3xl font-bold leading-tight fade-up sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            {subtitle}
          </p>
        )}
        <nav className="mt-6 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{crumb}</span>
        </nav>
      </div>
    </section>
  );
}
