import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, ExternalLink } from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Morya Prints Pvt Ltd" },
      {
        name: "description",
        content:
          "Get a quote for printing, branding, LED signage or packaging. Contact Morya Prints Pvt Ltd.",
      },
    ],
  }),
  component: Contact,
});

const services = [
  "Commercial Printing",
  "Industrial Printing",
  "Corporate Branding",
  "LED Sign Boards",
  "Signage Boards",
  "Packaging Labels",
  "Safety Signages",
  "Digital Printing",
  "Offset Printing",
  "Other",
];

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact Us"
        title="Let's talk about your project."
        subtitle="Share your requirement — we'll respond with a quote within a few hours."
        crumb="Contact"
      />

      <section className="container-x py-20 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border bg-white p-8 md:p-10 shadow-sm">
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-navy">
                Thanks — message received!
              </h3>
              <p className="mt-2 text-muted-foreground">Our team will reach out to you shortly.</p>
              <button className="btn-primary mt-6" onClick={() => setSent(false)}>
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const message = `Hello Morya Printing Point, I would like an enquiry.\n\nName: ${form.get("name")}\nPhone: ${form.get("phone")}\nEmail: ${form.get("email")}\nService: ${form.get("service")}\nRequirement: ${form.get("message")}`;
                window.open(
                  `https://wa.me/918554842103?text=${encodeURIComponent(message)}`,
                  "_blank",
                  "noopener,noreferrer",
                );
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-navy">Send us an enquiry</h2>
                <p className="text-sm text-muted-foreground">All fields are required.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="John Doe" />
                <Field label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" />
              </div>
              <Field label="Email" name="email" type="email" placeholder="you@company.com" />
              <div>
                <label className="text-sm font-medium text-navy">Service Required</label>
                <select
                  name="service"
                  required
                  className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-navy">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <InfoCard
            icon={MapPin}
            title="Visit us"
            body="Shop No. 3, Jeet Building, near Jeet Ground, Lokmanya Colony, Kothrud, Pune 411038"
          />
          <InfoCard
            icon={Phone}
            title="Call us"
            body="+91 85548 42103 / 95521 26440"
            href="tel:+918554842103"
          />
          <InfoCard
            icon={MessageCircle}
            title="WhatsApp"
            body="Message us for a quick quote"
            href="https://wa.me/918554842103"
            accent
          />
          <InfoCard
            icon={ExternalLink}
            title="Google Business Profile"
            body="View profile, directions, reviews and business details"
            href="https://share.google/fzqShCOs399ka2PWD"
          />
          <InfoCard
            icon={Mail}
            title="Email"
            body="Moryaprintingweb@gmail.com"
            href="mailto:Moryaprintingweb@gmail.com"
          />

          <div className="rounded-2xl overflow-hidden border shadow-sm h-64">
            <iframe
              title="Location"
              src="https://www.google.com/maps?q=Jeet+Building+Kothrud+Pune&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-navy" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
  href,
  accent,
}: {
  icon: any;
  title: string;
  body: string;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <div
      className={`card-lift rounded-xl border p-5 flex items-start gap-4 ${accent ? "bg-orange text-white border-orange" : "bg-white"}`}
    >
      <div
        className={`grid h-11 w-11 place-items-center rounded-lg shrink-0 ${accent ? "bg-white/20 text-white" : "bg-soft text-navy"}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className={`font-semibold ${accent ? "text-white" : "text-navy"}`}>{title}</div>
        <div className={`text-sm ${accent ? "text-white/90" : "text-muted-foreground"}`}>
          {body}
        </div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}
