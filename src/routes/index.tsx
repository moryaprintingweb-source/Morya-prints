import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Headphones,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { CTA } from "../components/site/CTA";
import { allProducts as catalogProducts, catalog, featuredProducts } from "../data/catalog";
import heroImg from "../assets/hero.jpg";
import printingImg from "../assets/printing.jpg";
import ledImg from "../assets/led-sign.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Morya Printing Point | Custom Printing in Pune" },
      {
        name: "description",
        content:
          "Custom printing in Pune for visiting cards, stickers, flex banners, vinyl, signage, labels and business stationery from Morya Printing Point, Kothrud.",
      },
      {
        name: "keywords",
        content:
          "printing shop in Pune, custom printing Pune, visiting cards Pune, flex printing Pune, sticker printing Pune, vinyl printing Pune, signage printing Kothrud, Morya Printing Point",
      },
    ],
  }),
  component: Home,
});

const categoryHighlights = [
  "visiting-cards",
  "apparel",
  "office-printing",
  "stickers-labels",
  "signage-boards",
  "banners-standees",
  "packaging",
  "gifts",
];

const homeVisuals = [heroImg, printingImg, ledImg];

const heroSlides = [
  {
    image: heroImg,
    eyebrow: "Business essentials",
    title: "Premium visiting cards, flyers and office prints.",
    text: "Start with crisp everyday print products made for Pune businesses.",
    actions: [
      { label: "Visiting Cards", slug: "visiting-cards" },
      { label: "Flyers", slug: "flyers-pamphlets" },
    ],
  },
  {
    image: printingImg,
    eyebrow: "Brand visibility",
    title: "Custom signage, vinyl, flex and display prints.",
    text: "Make your shop, event or campaign look polished from every angle.",
    actions: [
      { label: "Signage", slug: "signage-boards" },
      { label: "Flex Printing", slug: "flex-printing" },
    ],
  },
  {
    image: ledImg,
    eyebrow: "Storefront impact",
    title: "Boards, standees and packaging that make your brand easy to notice.",
    text: "Choose practical materials, sharp finishing and local support for every print job.",
    actions: [
      { label: "Packaging", slug: "packaging" },
      { label: "Banners", slug: "banners-standees" },
    ],
  },
];

function Home() {
  const highlightedCategories = categoryHighlights
    .map((slug) => catalog.find((category) => category.slug === slug))
    .filter(Boolean)
    .concat(catalog)
    .filter(
      (category, index, items) =>
        items.findIndex((item) => item?.slug === category?.slug) === index,
    )
    .slice(0, 10);
  const popular = featuredProducts.slice(0, 6);
  const trending = catalogProducts.slice(5, 11);
  const labelsAndPackaging = catalogProducts.filter((item) =>
    ["stickers-labels", "packaging", "vinyl-printing"].includes(item.category.slug),
  );
  const exploreMore = catalogProducts.slice(36, 42);
  const newArrivals = catalogProducts.slice(70, 76);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HeroCarousel />

      <section className="bg-white py-10 md:py-14">
        <div className="container-x grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Trust icon={Truck} title="Fast Printing & Delivery" text="Same-day dispatch across Pune & nearby areas" />
          <Trust icon={ShieldCheck} title="Premium Print Quality" text="Quality checked before every delivery" />
          <Trust icon={Sparkles} title="Complete Printing Solution" text="Cards, flyers, banners, stickers & more" />
          <Trust icon={Headphones} title="Friendly Customer Support" text="Call, WhatsApp or visit our store" />
        </div>
      </section>

      <section className="bg-navy py-10 text-white">
        <div className="container-x grid gap-7 text-center sm:grid-cols-3">
          <Stat value="10,000+" label="Orders" />
          <Stat value="2,000+" label="Customers" />
          <Stat value="200+" label="Products" />
        </div>
      </section>

      <ProductSection
        title="Explore all categories"
        action="View all"
        products={highlightedCategories.map((category, index) => ({
          name: category!.name,
          image: categoryImage(category!, index),
          slug: category!.slug,
          tag: "5 products",
        }))}
        categoryCards
      />

      <ProductSection
        title="Our Most Popular Products"
        action="Shop popular"
        products={popular.map((product, index) => {
          const fullProduct = catalogProducts.find(
            (item) => item.name === product.name && item.category.name === product.category,
          );
          return {
            name: product.name,
            image: productImage(product.image, index),
            slug: fullProduct?.category.slug ?? "all",
            productSlug: fullProduct?.slug,
            tag: `From Rs. ${product.startingAt}`,
          };
        })}
      />

      <ProductSection
        title="Trending"
        products={trending.map((product, index) => ({
          name: product.name,
          image: productImage(product.image, index + 2),
          slug: product.category.slug,
          productSlug: product.slug,
          tag: `From Rs. ${product.startingAt}`,
        }))}
      />

      <ProductSection
        title="Labels, Stickers and Packaging"
        products={labelsAndPackaging.slice(0, 6).map((product, index) => ({
          name: product.name,
          image: productImage(product.image, index + 4),
          slug: product.category.slug,
          productSlug: product.slug,
          tag: `From Rs. ${product.startingAt}`,
        }))}
      />

      <section className="border-y bg-white">
        <div className="container-x grid gap-px bg-border lg:grid-cols-2">
          <PromoBand
            image={ledImg}
            eyebrow="Preserve a premium first impression"
            title="Print polished catalogues, menus, certificates and photo products."
            actions={[
              { label: "Photo Prints", slug: "photo-prints" },
              { label: "Catalogues", slug: "catalogues" },
              { label: "Certificates", slug: "certificates" },
            ]}
          />
          <PromoBand
            image={printingImg}
            eyebrow="Wear and display your brand"
            title="Custom T-shirts, caps, boards and standees for teams and events."
            actions={[
              { label: "Apparel", slug: "apparel" },
              { label: "Display", slug: "display" },
              { label: "Banners", slug: "banners-standees" },
            ]}
          />
        </div>
      </section>

      <ProductSection
        title="Explore More"
        products={exploreMore.map((product, index) => ({
          name: product.name,
          image: productImage(product.image, index + 6),
          slug: product.category.slug,
          productSlug: product.slug,
          tag: `From Rs. ${product.startingAt}`,
        }))}
      />

      <ProductSection
        title="New Arrivals"
        products={newArrivals.map((product, index) => ({
          name: product.name,
          image: productImage(product.image, index + 8),
          slug: product.category.slug,
          productSlug: product.slug,
          tag: `From Rs. ${product.startingAt}`,
        }))}
      />

      <section className="bg-soft py-14">
        <div className="container-x grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <img
            src={heroImg}
            alt="Printed stationery samples"
            loading="lazy"
            className="h-full min-h-[260px] w-full rounded-lg object-cover"
          />
          <div className="max-w-xl">
            <span className="eyebrow">It is good to be on the list</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl">
              Get quotes, artwork help and print updates directly from Morya.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Share your requirement once and our team will guide you on material, quantity,
              finishing and delivery timelines.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://wa.me/918554842103"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                WhatsApp your requirement <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/contact" className="btn-navy">
                Contact shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <InfoBlock
            title="Morya Printing Point in Pune"
            text="A local print partner for business stationery, marketing material, signage, stickers, labels, apparel and custom jobs from Kothrud."
          />
          <InfoBlock
            title="Even low quantities"
            text="Order smaller batches for trials, events or urgent needs, then scale up when your design is ready."
          />
          <InfoBlock
            title="Artwork and finishing support"
            text="Get practical help with paper, lamination, vinyl, flex, sticker cutting and display choices before printing."
          />
        </div>
      </section>

      <ReviewsWall />

      {/* Legacy compact review card retained here only for reference.
      <section className="bg-soft py-14">
        <div className="container-x grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <a
            href="https://share.google/Zoo4vsRMy8dQrC9Cc"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-8 text-center shadow-[0_18px_50px_-28px_rgba(11,31,58,.5)] transition hover:-translate-y-1"
          >
            <div className="mx-auto flex w-fit gap-1 text-orange">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}
            </div>
            <div className="mt-4 font-display text-5xl font-semibold text-navy">4.9</div>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">from 200+ Google reviews</p>
            <span className="mt-5 inline-block text-sm font-semibold text-orange">Read our Google reviews →</span>
          </a>
          <div>
            <span className="eyebrow">Loved by local businesses</span>
            <h2 className="mt-3 section-title">Prints that earn repeat orders.</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              From quick everyday prints to important brand launches, customers trust Morya for helpful guidance, dependable quality and fast local service.
            </p>
          </div>
        </div>
      </section> */}

      <section className="container-x py-16">
        <div className="mb-7">
          <span className="eyebrow">Need help?</span>
          <h2 className="mt-3 section-title">Frequently Asked Questions (FAQs)</h2>
          <p className="mt-3 text-muted-foreground">Quick answers before you place your print order.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[homeFaqs.slice(0, 6), homeFaqs.slice(6)].map((column, columnIndex) => (
            <Accordion key={columnIndex} type="single" collapsible className="border border-border bg-white">
              {column.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${columnIndex}-${index}`} className="px-5 last:border-b-0">
                  <AccordionTrigger className="min-h-12 py-3 font-semibold text-navy hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
        <Link to="/faq" className="mt-6 inline-flex text-sm font-semibold text-orange hover:text-navy">View all FAQs <ArrowRight className="ml-1 h-4 w-4" /></Link>
      </section>

      <CTA />
    </SiteLayout>
  );
}

const googleBusinessProfile = "https://share.google/mgKsD0HQ5OS26Xewa";
const googleReviews = [
  { name: "anil kumar Tvn", rating: 5, text: "Praised dependable service, quality work and helpful support whenever needed." },
  { name: "Deveshree shinde", rating: 5, text: "Highlighted same-day foam-board delivery, co-operative service and excellent quality." },
  { name: "Vilas Mulay", rating: 5, text: "Appreciated the technical support, product range and quality of flex and pamphlet printing." },
  { name: "yasser Shaikh", rating: 5, text: "Shared positive feedback about the service and the quality of the finished work." },
  { name: "Ram Kelkar", rating: 5, text: "Valued print quality, timely work, reasonable pricing and friendly communication." },
  { name: "Mansi Makhi", rating: 4, text: "Mentioned quality printing, useful design guidance, quick delivery and polite staff." },
  { name: "Avinash Ramgude", rating: 5, text: "Noted good quality, material guidance, reasonable rates and timely sticker printing." },
  { name: "Amit Phadke", rating: 5, text: "Recommended the design skills, customer-first approach and end-to-end printing support." },
  { name: "Subodh Vaidya", rating: 5, text: "Highlighted a fast response, quick delivery and reasonable pricing." },
];

function ReviewsWall() {
  return (
    <section className="overflow-hidden bg-[#f8fafc] py-16 md:py-20">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(250px,.7fr)_minmax(0,1.7fr)] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow">Google reviews</span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-navy sm:text-5xl">
            True journeys.<br />
            True transformation.
          </h2>
          <a
            href={googleBusinessProfile}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-2xl font-bold text-[#4285F4]">G</span>
            <span className="text-left">
              <span className="flex items-center gap-1 font-display text-2xl font-semibold text-navy">
                4.8 <Star className="h-5 w-5 fill-[#fbbc04] text-[#fbbc04]" />
              </span>
              <span className="text-sm text-muted-foreground">from 223 Google reviews</span>
            </span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Read verified customer feedback directly on our Google Business Profile.
          </p>
          <a
            href={googleBusinessProfile}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center text-sm font-semibold text-orange transition hover:text-navy"
          >
            View all Google reviews <ArrowRight className="ml-1.5 h-4 w-4" />
          </a>
        </div>

        <div className="max-h-[558px] overflow-y-auto pr-3 [scrollbar-color:#f97316_#e2e8f0] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-200 [&::-webkit-scrollbar]:w-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {googleReviews.map((review, index) => (
            <a
              key={review.name}
              href={googleBusinessProfile}
              target="_blank"
              rel="noreferrer"
              aria-label={`Read ${review.name}'s Google review for Morya Printing Point`}
              className="flex h-[174px] flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_12px_30px_-24px_rgba(11,31,58,.55)] ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex gap-1 text-[#fbbc04]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className={`h-4 w-4 ${starIndex < review.rating ? "fill-current" : "fill-slate-200 text-slate-200"}`} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
              <span className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {review.name}
              </span>
            </a>
          ))}
          <a
            href={googleBusinessProfile}
            target="_blank"
            rel="noreferrer"
            className="flex h-[174px] flex-col justify-between rounded-2xl bg-navy p-5 text-white shadow-[0_12px_30px_-24px_rgba(11,31,58,.55)] transition duration-200 hover:-translate-y-1"
          >
            <span className="text-sm font-semibold text-orange">More customer feedback</span>
            <span className="font-display text-xl font-semibold leading-tight">Read all 223 Google reviews</span>
            <span className="inline-flex items-center text-sm font-semibold">Open Google <ArrowRight className="ml-1.5 h-4 w-4" /></span>
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function categoryImage(category: (typeof catalog)[number], index: number) {
  const categorySpecific: Record<string, string> = {
    "visiting-cards": heroImg,
    apparel: printingImg,
    "office-printing": category.products[0].image,
    "stickers-labels": ledImg,
    "signage-boards": ledImg,
    "banners-standees": printingImg,
    packaging: heroImg,
    "flyers-pamphlets": category.products[0].image,
    "vinyl-printing": category.products[0].image,
    "flex-printing": category.products[0].image,
  };

  return categorySpecific[category.slug] ?? homeVisuals[index % homeVisuals.length];
}

function productImage(image: string, index: number) {
  const repeatedGeneric =
    image.includes("1586953208448") ||
    image.includes("1601924582970") ||
    image.includes("1541417904950") ||
    image.includes("1607083206869") ||
    image.includes("1523726491678");

  return repeatedGeneric ? homeVisuals[index % homeVisuals.length] : image;
}

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="border-b bg-white">
      <div className="relative min-h-[520px] overflow-hidden bg-navy md:min-h-[560px]">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== activeSlide}
          >
            <img src={slide.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/10" />
          </div>
        ))}

        <div className="container-x relative z-10 flex min-h-[520px] items-end py-8 md:min-h-[560px] md:items-center md:py-14">
          <div className="max-w-2xl rounded-2xl border border-white/20 bg-white/80 p-5 shadow-2xl backdrop-blur md:p-8">
            <span className="eyebrow">{heroSlides[activeSlide].eyebrow}</span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy md:text-5xl">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {heroSlides[activeSlide].text}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {heroSlides[activeSlide].actions.map((action) => (
                <Link
                  key={action.slug}
                  to="/products"
                  search={{ category: action.slug }}
                  className="btn-navy"
                >
                  {action.label}
                </Link>
              ))}
              <Link to="/products" className="btn-primary">
                Explore products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide ? "w-9 bg-orange" : "w-2.5 bg-white/80 hover:bg-white"
              }`}
              aria-label={`Show banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection({
  title,
  products,
  action = "View all",
  categoryCards = false,
}: {
  title: string;
  action?: string;
  products: { name: string; image: string; slug: string; productSlug?: string; tag: string }[];
  categoryCards?: boolean;
}) {
  return (
    <section className="container-x py-10 md:py-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-navy">{title}</h2>
        <Link to="/products" className="text-sm font-bold text-navy hover:text-orange">
          {action} <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {products.map((product) => {
          const linkProps = product.productSlug
            ? { to: "/products/$slug" as const, params: { slug: product.productSlug } }
            : { to: "/products" as const, search: { category: product.slug } };

          return (
            <Link
              key={`${title}-${product.slug}-${product.name}`}
              {...linkProps}
              className="group overflow-hidden rounded-lg border bg-white transition hover:-translate-y-1 hover:border-cyan hover:shadow-[0_18px_34px_-24px_rgba(11,31,58,.55)]"
            >
              <div
                className="aspect-[5/4] relative overflow-hidden bg-soft"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {!categoryCards && (
                  <span className="absolute left-2 top-2 rounded bg-navy px-2 py-1 text-[10px] font-semibold uppercase text-white">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-3">
                {categoryCards && (
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-orange">
                    {product.tag}
                  </div>
                )}
                <h3 className="line-clamp-2 min-h-10 text-sm font-extrabold leading-snug text-navy">
                  {product.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PromoBand({
  image,
  eyebrow,
  title,
  actions,
}: {
  image: string;
  eyebrow: string;
  title: string;
  actions: { label: string; slug: string }[];
}) {
  return (
    <div className="relative min-h-[360px] overflow-hidden bg-navy">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-5 right-5 rounded-lg bg-white p-5 shadow-xl md:left-8 md:right-auto md:max-w-[340px]">
        <span className="text-xs font-extrabold uppercase tracking-wide text-orange">
          {eyebrow}
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-navy">{title}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Link
              key={action.slug}
              to="/products"
              search={{ category: action.slug }}
              className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-orange"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Trust({ icon: Icon, title, text }: { icon: typeof Truck; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#f9d6cb] p-2.5 text-center sm:rounded-[1.35rem] sm:p-3">
      <div className="flex min-h-10 items-center justify-center px-1 text-sm font-semibold leading-tight text-navy sm:min-h-12 sm:px-2 sm:text-base lg:min-h-14 lg:text-lg">
        {title}
      </div>
      <div className="flex min-h-[124px] flex-col items-center justify-center rounded-xl bg-[#f47a24] px-2.5 py-4 text-white shadow-inner sm:min-h-[150px] sm:px-4 sm:py-5 lg:min-h-[178px] lg:rounded-[1.05rem] lg:px-5 lg:py-6">
        <span className="mb-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/20 ring-1 ring-white/45 sm:mb-3 sm:h-9 sm:w-9 lg:mb-4 lg:h-11 lg:w-11">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" strokeWidth={2.25} />
        </span>
        <p className="text-sm font-medium italic leading-snug sm:text-base lg:text-2xl">{text}</p>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const counterRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const target = Number(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const animate = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayValue(target);
        return;
      }

      const duration = 1400;
      const startTime = performance.now();
      const tick = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.round(target * easedProgress));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={counterRef}>
      <div className="font-display text-4xl font-semibold text-white md:text-5xl">{displayValue.toLocaleString()}+</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[.16em] text-white/70">{label}</div>
    </div>
  );
}

const homeFaqs = [
  { question: "What services does Morya Printing Point offer?", answer: "Morya Printing Point offers visiting cards, flyers, brochures, letterheads, envelopes, menu cards, ID cards, flex printing, vinyl printing, one-way vision, frosted vinyl, transparent vinyl, banners, stickers, certificates, invitations and customised business printing solutions." },
  { question: "Do you provide same-day printing?", answer: "Yes. We offer same-day printing for selected products such as standard visiting cards, flyers and document printing, depending on order quantity and artwork approval." },
  { question: "Can I order a single print or small quantity?", answer: "Yes. We accept both single-piece and bulk printing orders. Whether you need one document or thousands of printed materials, we can help." },
  { question: "What file formats do you accept?", answer: "We accept PDF, AI, CDR, PSD, JPG, PNG and other high-resolution print-ready files. For the best print quality, files should be prepared in CMYK colour mode." },
  { question: "What are your most popular printing products?", answer: "Popular products include visiting cards, flyers, brochures, vinyl printing, flex banners, letterheads, ID cards, stickers, menu cards and wedding invitations." },
  { question: "Do you print custom-sized products?", answer: "Yes. We provide custom sizes and finishing options based on your requirements. Contact us for personalised printing solutions." },
  { question: "How long does printing take?", answer: "Turnaround time depends on the product and quantity. Many standard jobs are completed within the same day, while larger or customised orders may take one to three business days." },
  { question: "Do you deliver printed products?", answer: "Yes. We offer local delivery and can arrange shipping across India. Delivery charges and timelines depend on your location and order size." },
  { question: "Why choose Morya Printing Point?", answer: "Morya Printing Point is known for high-quality printing, affordable pricing, fast turnaround, professional designs, premium materials and excellent customer support for businesses and individuals." },
  { question: "Do you offer bulk-order discounts?", answer: "Yes. We provide special pricing for bulk printing orders. Contact us with your requirements for a customised quotation." },
  { question: "What payment methods do you accept?", answer: "We accept cash, UPI, bank transfer, credit and debit cards, and other digital payment methods. GST is applicable as per government regulations." },
  { question: "Do you print for businesses, schools and events?", answer: "Absolutely. We provide customised printing solutions for businesses, educational institutions, corporate events, exhibitions, restaurants, retail stores, weddings, birthdays and other special occasions." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy">
        <Check className="h-4 w-4 text-orange" />
        {title}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
