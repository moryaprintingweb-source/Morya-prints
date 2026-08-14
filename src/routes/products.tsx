import { Link } from "../components/site/Link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  MessageCircle,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { PageHero } from "../components/site/PageHero";
import { allProducts, catalog } from "../data/catalog";
import {
  getDefaultSelections,
  getProductOptions,
  getVisibleSelections,
} from "../data/product-options";
import { useCart } from "../lib/cart";
import { api, type ApiCategory, type ApiProduct } from "../lib/api";
import { usePublicSiteSettings, whatsappHref } from "../lib/site-settings";
import heroImg from "../assets/hero.jpg";

type PublicProduct = {
  slug: string;
  name: string;
  description: string;
  image?: string;
  startingAt: number;
  mrp?: number | null;
  quantity?: string;
  singleSidePrice?: string;
  bothSidePrice?: string;
  offerLabel?: string;
  offerPercent?: number;
  offerActive?: boolean;
  offerStartsAt?: string | null;
  offerEndsAt?: string | null;
  category: {
    slug: string;
    name: string;
    eyebrow?: string;
  };
};

const fallbackCategories: ApiCategory[] = catalog.map((category, index) => ({
  id: index + 1,
  slug: category.slug,
  name: category.name,
  eyebrow: category.eyebrow,
  is_active: 1,
  sort_order: index,
}));

const fallbackProducts: PublicProduct[] = allProducts;

function normalizeApiProduct(product: ApiProduct): PublicProduct {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    startingAt: product.startingAt,
    mrp: product.mrp,
    quantity: product.quantity,
    singleSidePrice: product.singleSidePrice,
    bothSidePrice: product.bothSidePrice,
    offerLabel: product.offerLabel,
    offerPercent: product.offerPercent,
    offerActive: product.offerActive,
    offerStartsAt: product.offerStartsAt,
    offerEndsAt: product.offerEndsAt,
    category: product.category,
  };
}

function isOfferVisible(product: PublicProduct) {
  if (!product.offerActive) return false;
  const today = new Date();
  if (product.offerStartsAt && new Date(product.offerStartsAt) > today) return false;
  if (product.offerEndsAt && new Date(product.offerEndsAt) < today) return false;
  return Boolean(product.offerLabel || product.offerPercent || product.mrp);
}

export function Products() {
  const { getSetting } = usePublicSiteSettings();
  const whatsappNumber = getSetting("business_whatsapp_number");
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") ?? undefined;
  const initialSearch = searchParams.get("search") ?? undefined;
  const [categories, setCategories] = useState<ApiCategory[]>(fallbackCategories);
  const [allProductsList, setAllProductsList] = useState<PublicProduct[]>(fallbackProducts);
  const [active, setActive] = useState(initialCategory ?? "all");
  const { addItem } = useCart();
  const [query, setQuery] = useState(initialSearch ?? "");

  useEffect(() => {
    Promise.all([
      api<{ categories: ApiCategory[] }>("/api/categories"),
      api<{ products: ApiProduct[] }>("/api/products"),
    ])
      .then(([categoryResult, productResult]) => {
        setCategories(categoryResult.categories);
        setAllProductsList(productResult.products.map(normalizeApiProduct));
      })
      .catch(() => {
        setCategories(fallbackCategories);
        setAllProductsList(fallbackProducts);
      });
  }, []);

  const products = useMemo(
    () =>
      allProductsList.filter(
        (product) =>
          (active === "all" || product.category.slug === active) &&
          `${product.name} ${product.category.name}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [active, allProductsList, query],
  );
  const selected = categories.find((item) => item.slug === active);
  const addProductWithDefaultOptions = (product: PublicProduct) => {
    const optionDefinitions = getProductOptions(product as (typeof allProducts)[number]);
    const selectedOptions = getVisibleSelections(
      optionDefinitions,
      getDefaultSelections(optionDefinitions),
    );

    addItem({
      slug: product.slug,
      name: product.name,
      category: product.category.name,
      image: product.image || heroImg,
      price: product.startingAt,
      selectedOptions,
    });
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Print shop"
        title="Find the right print for every idea."
        subtitle="Choose from 20 curated categories and 100 customisable products. Need something unique? We can help."
        crumb="Products"
      />
      <section className="container-x py-10">
        <div className="rounded-2xl border bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <input
                id="product-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-xl bg-soft py-3 pl-11 pr-10 text-sm outline-none ring-cyan focus:ring-2"
                placeholder="Search visiting cards, flex, labels, banners..."
              />
              {query && (
                <button
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <a
              href={whatsappHref(whatsappNumber)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary !py-3 text-sm"
            >
              <MessageCircle className="h-4 w-4" /> Need a custom quote?
            </a>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-orange" />
          <span className="text-sm font-bold text-navy">Browse by category</span>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {[{ slug: "all", name: "All products" }, ...categories].map((category) => (
            <button
              key={category.slug}
              onClick={() => setActive(category.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${active === category.slug ? "bg-navy text-white" : "border bg-white text-navy hover:border-orange"}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>
      <section className="container-x pb-20">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">{selected?.eyebrow ?? "All print products"}</span>
            <h2 className="section-title mt-2">
              {selected ? selected.name : "Browse all 100 products"}
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">{products.length} products shown</span>
        </div>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const offerVisible = isOfferVisible(product);
              return (
                <article
                  key={`${product.category.slug}-${product.name}`}
                  className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link to="/products/$slug" params={{ slug: product.slug }}>
                    <div className="relative aspect-[5/4] overflow-hidden bg-soft">
                      <img
                        src={product.image || heroImg}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy">
                        {product.category.name}
                      </span>
                      {offerVisible && (
                        <span className="absolute right-3 top-3 rounded-full bg-orange px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                          {product.offerLabel ||
                            (product.offerPercent ? `${product.offerPercent}% off` : "Offer")}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to="/products/$slug" params={{ slug: product.slug }}>
                      <h3 className="font-display text-lg font-bold text-navy">{product.name}</h3>
                    </Link>
                    <p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Starting at
                        </span>
                        <div className="font-display text-lg font-bold text-navy">
                          Rs. {product.startingAt}
                        </div>
                        {isOfferVisible(product) &&
                          product.mrp &&
                          product.mrp > product.startingAt && (
                            <div className="text-xs font-semibold text-muted-foreground line-through">
                              Rs. {product.mrp}
                            </div>
                          )}
                      </div>
                      <button
                        onClick={() => addProductWithDefaultOptions(product)}
                        className="inline-flex items-center gap-1 rounded-lg bg-orange px-3 py-2 text-xs font-bold text-white"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" /> Add
                      </button>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-orange" /> {product.quantity}
                    </div>
                    {(product.singleSidePrice || product.bothSidePrice) && (
                      <div className="mt-3 grid gap-1 rounded-lg bg-soft p-3 text-[11px] font-semibold text-navy">
                        {product.singleSidePrice && (
                          <div>Single side: Rs. {product.singleSidePrice}</div>
                        )}
                        {product.bothSidePrice && <div>Both side: Rs. {product.bothSidePrice}</div>}
                      </div>
                    )}
                    <Link
                      to="/products/$slug"
                      params={{ slug: product.slug }}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-orange"
                    >
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-14 text-center">
            <h3 className="font-display text-xl font-bold text-navy">No matching products yet.</h3>
            <button
              onClick={() => {
                setQuery("");
                setActive("all");
              }}
              className="mt-4 font-semibold text-orange"
            >
              Show all products
            </button>
          </div>
        )}
        <div className="mt-16 rounded-3xl bg-soft p-7 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="eyebrow">Can’t find what you need?</span>
              <h2 className="section-title mt-2">
                We do custom sizes, finishes and one-off print jobs.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Send your requirement on WhatsApp and get help choosing the right material, quantity
                and finish.
              </p>
            </div>
            <a
              href={whatsappHref(whatsappNumber)}
              target="_blank"
              rel="noreferrer"
              className="btn-navy"
            >
              Talk to printing expert <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
