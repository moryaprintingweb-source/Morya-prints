import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Clock3, MapPin, PackageCheck } from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { CTA } from "../components/site/CTA";
import printingImg from "../assets/printing.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Morya Printing Point | Pune" },
      {
        name: "description",
        content:
          "Meet Morya Printing Point, a one-stop shop for custom printing, flex, stickers, signage and paper finishing in Kothrud, Pune.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About us"
        title="Print solutions that keep your business moving."
        subtitle="Morya Printing Point is a local, full-service printing partner for businesses, events, shops, schools and personal projects."
        crumb="About"
      />
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <img
          src={printingImg}
          alt="Printing materials ready for production"
          className="h-full min-h-80 w-full rounded-3xl object-cover shadow-xl"
        />
        <div>
          <span className="eyebrow">Our story</span>
          <h2 className="section-title mt-2">A dependable local partner for every print need.</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            From quick digital prints to large-format flex, custom stickers, lamination and precise
            paper finishing, we help customers turn ideas into sharp, useful, beautiful print. Our
            approach is simple: clear guidance, dependable quality and a finish that makes your work
            look its best.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              [BadgeCheck, "Premium quality", "Material and finish chosen for the job"],
              [Clock3, "Fast turnaround", "Helpful support when time matters"],
              [PackageCheck, "One-stop print shop", "Cards, labels, flex, boards and more"],
              [MapPin, "Based in Kothrud", "Serving Pune and nearby areas"],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof BadgeCheck;
              return (
                <div key={title as string} className="rounded-xl bg-soft p-4">
                  <ItemIcon className="h-5 w-5 text-orange" />
                  <h3 className="mt-3 font-display font-bold text-navy">{title as string}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{text as string}</p>
                </div>
              );
            })}
          </div>
          <Link to="/products" className="btn-primary mt-7">
            Explore products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <section className="container-x pb-20">
        <div className="rounded-2xl border bg-white p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <span className="eyebrow">Brand guidelines</span>
              <h2 className="section-title mt-2">Clean, modern and built for fast decisions.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The website follows Morya Printing Point's preferred visual direction: professional,
                corporate, mobile-first and simple to navigate.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-soft p-4">
                <h3 className="font-display font-bold text-navy">Brand colors</h3>
                <div className="mt-4 grid gap-3">
                  <Swatch color="#F97316" label="Primary Orange" />
                  <Swatch color="#1E3A8A" label="Corporate Blue" />
                  <Swatch color="#fffff5" label="Warm Background" darkText />
                </div>
              </div>
              <div className="rounded-xl bg-soft p-4">
                <h3 className="font-display font-bold text-navy">Preferred fonts</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Poppins", "Montserrat", "Outfit", "Manrope", "Urbanist"].map((font) => (
                    <span
                      key={font}
                      className="rounded-full border bg-white px-3 py-2 text-xs font-bold text-navy"
                    >
                      {font}
                    </span>
                  ))}
                </div>
              </div>
              {[
                "Clean and modern UI",
                "Professional corporate appearance",
                "Mobile-first responsive design",
                "Fast loading pages",
                "Simple navigation",
              ].map((item) => (
                <div key={item} className="rounded-xl border bg-white p-4">
                  <BadgeCheck className="h-5 w-5 text-orange" />
                  <div className="mt-3 font-display font-bold text-navy">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </SiteLayout>
  );
}

function Swatch({
  color,
  label,
  darkText = false,
}: {
  color: string;
  label: string;
  darkText?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-12 w-20 place-items-center rounded-lg border text-[10px] font-extrabold ${
          darkText ? "text-navy" : "text-white"
        }`}
        style={{ backgroundColor: color }}
      >
        {color}
      </div>
      <span className="text-sm font-bold text-navy">{label}</span>
    </div>
  );
}
