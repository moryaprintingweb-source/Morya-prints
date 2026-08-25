import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { api } from "../lib/api";
import { usePublicSiteSettings, whatsappHref } from "../lib/site-settings";

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

export function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { getSetting } = usePublicSiteSettings();
  const phoneDisplay = getSetting("business_phone_display");
  const phoneLink = getSetting("business_phone_link");
  const whatsappNumber = getSetting("business_whatsapp_number");
  const email = getSetting("business_email");
  const address = getSetting("business_address");
  const mapsUrl = getSetting("business_maps_url");
  const googleUrl = getSetting("business_google_url");

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact Us"
        title="Let's talk about your project."
        subtitle="Share your requirement - we'll respond with a quote within a few hours."
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
                Thanks - message received!
              </h3>
              <p className="mt-2 text-muted-foreground">Our team will reach out to you shortly.</p>
              <button className="btn-primary mt-6" onClick={() => setSent(false)}>
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setSubmitting(true);
                const form = new FormData(e.currentTarget);
                const payload = {
                  name: String(form.get("name") ?? ""),
                  phone: String(form.get("phone") ?? ""),
                  email: String(form.get("email") ?? ""),
                  service: String(form.get("service") ?? ""),
                  message: String(form.get("message") ?? ""),
                };
                const message = `Hello Morya Printing Point, I would like an enquiry.\n\nName: ${form.get("name")}\nPhone: ${form.get("phone")}\nEmail: ${form.get("email")}\nService: ${form.get("service")}\nRequirement: ${form.get("message")}`;
                try {
                  await api("/api/inquiries", {
                    method: "POST",
                    body: JSON.stringify(payload),
                  });
                  window.open(
                    whatsappHref(whatsappNumber, message),
                    "_blank",
                    "noopener,noreferrer",
                  );
                  setSent(true);
                } catch (submitError) {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : "Unable to save enquiry. Please call or WhatsApp us directly.",
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-navy">Send us an enquiry</h2>
                <p className="text-sm text-muted-foreground">All fields are required.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="John Doe" minLength={2} />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  minLength={7}
                  pattern="^[+()\-\s0-9]+$"
                  title="Use only digits, spaces, +, - and brackets"
                />
              </div>
              <Field label="Email" name="email" type="email" placeholder="you@company.com" />
              <div>
                <label htmlFor="service" className="text-sm font-medium text-navy">
                  Service Required
                </label>
                <select
                  id="service"
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
                <label htmlFor="message" className="text-sm font-medium text-navy">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending..." : "Send Message"} <Send className="h-4 w-4" />
              </button>
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            </form>
          )}
        </div>

        <div className="space-y-4">
          <InfoCard icon={MapPin} title="Visit us" body={address} href={mapsUrl} />
          <InfoCard icon={Phone} title="Call us" body={phoneDisplay} href={`tel:${phoneLink}`} />
          <InfoCard
            icon={MessageCircle}
            title="WhatsApp"
            body="Message us for a quick quote"
            href={whatsappHref(whatsappNumber)}
            accent
          />
          <InfoCard
            icon={ExternalLink}
            title="Google Business Profile"
            body="View profile, directions, reviews and business details"
            href={googleUrl}
          />
          <InfoCard icon={Mail} title="Email" body={email} href={`mailto:${email}`} />

          <div className="rounded-2xl overflow-hidden border shadow-sm h-64">
            <iframe
              title="Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1891.7200032502062!2d73.8046583!3d18.5090081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfc1fe039b07%3A0x943f49aea30028!2sMorya%20Printing%20Point%20%26%20Flex%20Printing!5e0!3m2!1sen!2sin!4v1784182046182!5m2!1sen!2sin"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
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
  minLength,
  pattern,
  title,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  minLength?: number;
  pattern?: string;
  title?: string;
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
        minLength={minLength}
        pattern={pattern}
        title={title}
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
  icon: LucideIcon;
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
