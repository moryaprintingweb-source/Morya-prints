import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { CTA } from "../components/site/CTA";
import { allProducts as catalogProducts, catalog, featuredProducts } from "../data/catalog";
import heroImg from "../assets/hero.jpg";
import printingImg from "../assets/printing.jpg";
import ledImg from "../assets/led-sign.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Morya Printing Point | Custom Printing in Pune" },
      {
        name: "description",
        content:
          "Shop custom visiting cards, stickers, flex, banners, signage, labels and more from Morya Printing Point, Kothrud, Pune.",
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
      <HeroCarousel />

      <section className="border-b bg-white py-4">
        <div className="container-x grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Trust icon={Truck} title="Fast local delivery" text="Across Pune & nearby areas" />
          <Trust icon={ShieldCheck} title="Quality checked" text="Before every handover" />
          <Trust icon={Sparkles} title="100+ print options" text="Sizes, papers & finishes" />
          <Trust icon={Headphones} title="Friendly support" text="Call or WhatsApp us" />
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

      <CTA />
    </SiteLayout>
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

  const goToPrevious = () =>
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  const goToNext = () => setActiveSlide((current) => (current + 1) % heroSlides.length);

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
          <div className="max-w-2xl rounded-2xl border border-white/15 bg-white/95 p-5 shadow-2xl backdrop-blur md:p-8">
            <span className="eyebrow">{heroSlides[activeSlide].eyebrow}</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-navy md:text-5xl">
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

        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition hover:bg-orange hover:text-white md:flex"
          aria-label="Previous banner"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition hover:bg-orange hover:text-white md:flex"
          aria-label="Next banner"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

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
                className={`${categoryCards ? "aspect-[4/3]" : "aspect-square"} relative overflow-hidden bg-soft`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {!categoryCards && (
                  <span className="absolute left-2 top-2 rounded bg-cyan px-2 py-1 text-[10px] font-extrabold uppercase text-navy">
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
    <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
      <Icon className="h-5 w-5 text-orange" />
      <div>
        <div className="text-sm font-extrabold text-navy">{title}</div>
        <div className="text-xs text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}

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
