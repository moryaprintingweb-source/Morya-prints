import { Link } from "../components/site/Link";
import {
  ArrowRight,
  Check,
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  Star,
  Truck,
  Upload,
  ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLayout } from "../components/site/SiteLayout";
import { allProducts, findProductBySlug } from "../data/catalog";
import {
  getDefaultSelections,
  getProductOptions,
  getVisibleSelections,
  type ProductOption as ProductOptionDefinition,
} from "../data/product-options";
import { useCart } from "../lib/cart";
import { api, type ApiProduct } from "../lib/api";
import { usePublicSiteSettings, whatsappHref } from "../lib/site-settings";
import heroImg from "../assets/hero.jpg";

type ProductOffer = {
  mrp?: number | null;
  offerLabel?: string;
  offerPercent?: number;
  offerActive?: boolean;
  offerStartsAt?: string | null;
  offerEndsAt?: string | null;
};

type ProductLike = (typeof allProducts)[number] & ProductOffer;

function normalizeApiProduct(product: ApiProduct): ProductLike {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    image: product.imageUrl || heroImg,
    startingAt: product.startingAt,
    mrp: product.mrp,
    quantity: product.quantity ?? "",
    singleSidePrice: product.singleSidePrice,
    bothSidePrice: product.bothSidePrice,
    offerLabel: product.offerLabel,
    offerPercent: product.offerPercent,
    offerActive: product.offerActive,
    offerStartsAt: product.offerStartsAt,
    offerEndsAt: product.offerEndsAt,
    category: {
      slug: product.category.slug,
      name: product.category.name,
      eyebrow: product.category.eyebrow ?? "",
      products: [],
    },
  } as ProductLike;
}

function isOfferVisible(product: ProductLike) {
  if (!product.offerActive) return false;
  const today = new Date();
  if (product.offerStartsAt && new Date(product.offerStartsAt) > today) return false;
  if (product.offerEndsAt && new Date(product.offerEndsAt) < today) return false;
  return Boolean(product.offerLabel || product.offerPercent || product.mrp);
}

export function ProductDetail({ slug }: { slug?: string }) {
  const routeSlug =
    slug ?? decodeURIComponent(window.location.pathname.split("/").filter(Boolean).at(-1) ?? "");
  const [apiProducts, setApiProducts] = useState<ProductLike[]>([]);
  const [loadingApiProducts, setLoadingApiProducts] = useState(true);
  const product =
    apiProducts.find((item) => item.slug === routeSlug) ?? findProductBySlug(routeSlug);
  const { addItem } = useCart();
  const { getSetting } = usePublicSiteSettings();
  const whatsappNumber = getSetting("business_whatsapp_number");
  const [selectedImage, setSelectedImage] = useState(product?.image ?? "");
  const [activeDetailTab, setActiveDetailTab] = useState<
    "description" | "specifications" | "other-information"
  >("description");
  const [isSaved, setIsSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const optionDefinitions = useMemo(() => (product ? getProductOptions(product) : []), [product]);
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    getDefaultSelections(optionDefinitions),
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoadingApiProducts(true);
    api<{ products: ApiProduct[] }>("/api/products")
      .then((result) => setApiProducts(result.products.map(normalizeApiProduct)))
      .catch(() => setApiProducts([]))
      .finally(() => setLoadingApiProducts(false));
  }, []);

  useEffect(() => {
    setSelections(getDefaultSelections(optionDefinitions));
    setUploadedFile(null);
    setSelectedImage(product?.image ?? "");
  }, [optionDefinitions, product?.image]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((item) => item.category.slug === product.category.slug && item.slug !== product.slug)
      .concat(allProducts.filter((item) => item.category.slug !== product.category.slug))
      .slice(0, 6);
  }, [product]);

  if (!product && loadingApiProducts) {
    return (
      <SiteLayout>
        <section className="container-x grid min-h-[420px] place-items-center py-12 text-center">
          <div>
            <h1 className="font-display text-4xl font-bold text-navy">Loading product</h1>
            <p className="mt-3 text-muted-foreground">Checking the MySQL product catalog.</p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <section className="container-x grid min-h-[420px] place-items-center py-12 text-center">
          <div>
            <h1 className="font-display text-4xl font-bold text-navy">Product not found</h1>
            <p className="mt-3 text-muted-foreground">This product may have moved.</p>
            <Link to="/products" className="btn-primary mt-6">
              Browse products
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const images = [product.image, ...related.slice(0, 4).map((item) => item.image)];
  const selectedImageIndex = Math.max(images.indexOf(selectedImage), 0);
  const selectAdjacentImage = (direction: number) => {
    setSelectedImage(images[(selectedImageIndex + direction + images.length) % images.length]);
  };
  const offerVisible = isOfferVisible(product);
  const mrp = product.mrp && product.mrp > product.startingAt ? product.mrp : null;
  const discount =
    product.offerPercent ||
    (mrp ? Math.max(1, Math.round(((mrp - product.startingAt) / mrp) * 100)) : 0);
  const selectedOptions = getVisibleSelections(optionDefinitions, selections);
  const hasMissingRequiredOption = optionDefinitions.some((option) => {
    const isVisible =
      !option.showWhen || selections[option.showWhen.optionId] === option.showWhen.value;
    return isVisible && option.required && !selections[option.id]?.trim();
  });
  const optionMessage = selectedOptions
    .map((option) => `${option.label}: ${option.value}`)
    .join("\n");
  const buyMessage = encodeURIComponent(
    `Hello Morya Printing Point, I want to order ${product.name}.\n${optionMessage}${uploadedFile ? `\nArtwork selected: ${uploadedFile.name}` : ""}\nPlease confirm the final price and delivery timeline.`,
  );

  const addProduct = () =>
    addItem(
      {
        slug: product.slug,
        name: product.name,
        category: product.category.name,
        image: product.image,
        price: product.startingAt,
        selectedOptions,
        artworkName: uploadedFile?.name,
      },
      1,
    );

  const addProductWithDefaultOptions = (item: ProductLike) => {
    const options = getProductOptions(item);
    addItem({
      slug: item.slug,
      name: item.name,
      category: item.category.name,
      image: item.image,
      price: item.startingAt,
      selectedOptions: getVisibleSelections(options, getDefaultSelections(options)),
    });
  };

  const toggleSaved = () => setIsSaved((saved) => !saved);

  const shareProduct = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} from Morya Printing Point.`,
          url: shareUrl,
        });
        setShareStatus("Shared");
        return;
      } catch {
        // Fall back to copying when native share is unavailable or cancelled.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied");
    } catch {
      setShareStatus("Copy link from address bar");
    }
  };

  return (
    <SiteLayout>
      <section className="container-x py-5 md:py-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-navy">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            search={{ category: product.category.slug }}
            className="hover:text-navy"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="font-semibold text-navy">{product.name}</span>
        </nav>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <div className="relative rounded-2xl border bg-white p-3">
              <button
                type="button"
                aria-label={isSaved ? "Remove saved product" : "Save product"}
                aria-pressed={isSaved}
                onClick={toggleSaved}
                className={`absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow-md transition hover:text-orange ${
                  isSaved ? "text-orange" : ""
                }`}
              >
                <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
              <img
                src={selectedImage}
                alt={product.name}
                className="aspect-square w-full rounded-xl bg-soft object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => selectAdjacentImage(-1)}
                    className="absolute left-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-r-lg border bg-white text-2xl shadow-sm transition hover:text-orange"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => selectAdjacentImage(1)}
                    className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-l-lg border bg-white text-2xl shadow-sm transition hover:text-orange"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-md border bg-white p-1 ${
                    selectedImage === image ? "border-navy" : "border-border"
                  }`}
                >
                  <img src={image} alt="" className="aspect-square w-full rounded object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:pt-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {offerVisible && (
                <span className="rounded-full bg-orange px-3 py-1 text-xs font-extrabold text-white">
                  {product.offerLabel || (discount ? `Save ${discount}%` : "Offer")}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                Category:{" "}
                <Link
                  to="/products"
                  search={{ category: product.category.slug }}
                  className="font-bold text-navy underline"
                >
                  {product.category.name}
                </Link>
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight text-navy md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex gap-0.5 text-orange" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground">Trusted local print quality</span>
            </div>
            <div className="mt-6 border-y py-5 text-sm leading-relaxed text-foreground">
              <p className="font-bold text-navy">Professional printing, tailored to your brand.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Custom sizes, materials and finishing options.</li>
                <li>Expert support for artwork, quantity and delivery planning.</li>
                <li>Quality-checked production from our Kothrud, Pune team.</li>
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <div className="font-display text-3xl font-bold text-orange">
                MRP Rs. {product.startingAt}
              </div>
              {offerVisible && mrp && (
                <div className="pb-1 text-sm text-muted-foreground line-through">MRP Rs. {mrp}</div>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tax included. Shipping calculated at checkout.
            </p>

            {(product.singleSidePrice || product.bothSidePrice) && (
              <div className="mt-5 rounded-xl border bg-soft p-4">
                <div className="text-sm font-bold text-navy">Price options from client sheet</div>
                <div className="mt-3 grid gap-2 text-sm font-semibold text-foreground sm:grid-cols-2">
                  {product.singleSidePrice && (
                    <div className="rounded-lg bg-white p-3">
                      <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                        Single side
                      </span>
                      Rs. {product.singleSidePrice}
                    </div>
                  )}
                  {product.bothSidePrice && (
                    <div className="rounded-lg bg-white p-3">
                      <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                        Both side
                      </span>
                      Rs. {product.bothSidePrice}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {optionDefinitions.map((option) => {
                const isVisible =
                  !option.showWhen ||
                  selections[option.showWhen.optionId] === option.showWhen.value;
                if (!isVisible) return null;
                return (
                  <ProductOptionField
                    key={option.id}
                    option={option}
                    value={selections[option.id] ?? ""}
                    onChange={(value) =>
                      setSelections((current) => ({ ...current, [option.id]: value }))
                    }
                  />
                );
              })}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Options are recorded with your request. Final pricing will be confirmed by the Morya
              team.
            </p>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-navy/25 bg-white px-4 py-3 text-sm font-bold text-navy transition hover:border-orange hover:text-orange"
              >
                <Upload className="h-5 w-5" /> {uploadedFile ? "Artwork selected" : "Upload design"}
              </button>
              <input
                ref={uploadInputRef}
                type="file"
                aria-label="Upload design file"
                accept=".pdf,.ai,.cdr,.psd,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
              />
            </div>
            {uploadedFile && (
              <p className="mt-2 text-xs font-medium text-green-700">
                Selected: {uploadedFile.name}. Send it with your WhatsApp order for confirmation.
              </p>
            )}

            <div className="mt-5 divide-y rounded-lg border bg-white">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-semibold text-navy">
                  Specs &amp; templates{" "}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  Share a print-ready PDF, AI, CDR, PSD, JPG or PNG file. Keep important text inside
                  the safe area; our team will confirm the final artwork before production.
                </div>
              </details>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-semibold text-navy">
                  Product options{" "}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  Custom sizes, paper/material, lamination, sides and finishing are available.
                  Contact us for a tailored quote or bulk-order pricing.
                </div>
              </details>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {selectedOptions.map((option) => (
                <Spec key={option.id} label={option.label} value={option.value} />
              ))}
              <Spec label="Starting Price" value={`Rs. ${product.startingAt}`} />
            </div>

            <div className="mt-7 flex gap-3">
              <button
                onClick={addProduct}
                disabled={hasMissingRequiredOption}
                className="btn-navy w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" /> Add To Cart
              </button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange" /> Estimated delivery after confirmation
              </span>
              <button
                type="button"
                aria-pressed={isSaved}
                onClick={toggleSaved}
                className="inline-flex items-center gap-2 font-bold text-navy"
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-orange" : ""}`} />{" "}
                {isSaved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={shareProduct}
                className="inline-flex items-center gap-2 font-bold text-navy"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
              {shareStatus && (
                <span className="text-xs font-semibold text-orange" role="status">
                  {shareStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x border-t py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div
              role="tablist"
              aria-label="Product details"
              className="flex max-w-full gap-6 overflow-x-auto border-b text-base font-semibold text-muted-foreground sm:gap-8 sm:text-lg"
            >
              {[
                ["description", "Description"],
                ["specifications", "Specifications"],
                ["other-information", "Other Information"],
              ].map(([tab, label]) => {
                const isActive = activeDetailTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() =>
                      setActiveDetailTab(
                        tab as "description" | "specifications" | "other-information",
                      )
                    }
                    className={`-mb-px shrink-0 border-b-2 pb-3 transition-colors ${
                      isActive ? "border-navy text-navy" : "border-transparent hover:text-navy"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div role="tabpanel" className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {activeDetailTab === "description" && (
                <ul className="space-y-2">
                  <li>{product.description}</li>
                  <li>Designed for clean brand presentation and reliable print quality.</li>
                  <li>Available with custom sizes, materials, lamination and finishing options.</li>
                  <li>
                    Best suited for businesses, events, packaging, promotions and local branding.
                  </li>
                </ul>
              )}
              {activeDetailTab === "specifications" && (
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Detail label="Print" value="Full color" />
                  <Detail label="Material" value="Custom material options" />
                  <Detail label="Finish" value="Matte, gloss, lamination or custom" />
                  <Detail label="Minimum order" value={product.quantity.split("/")[0].trim()} />
                  <Detail label="Available quantity" value={product.quantity} />
                  <Detail label="Starting price" value={`Rs. ${product.startingAt}`} />
                </dl>
              )}
              {activeDetailTab === "other-information" && (
                <ul className="space-y-2">
                  <li>Artwork, size, quantity and finishing are confirmed before production.</li>
                  <li>Delivery timelines depend on the final artwork and order quantity.</li>
                  <li>
                    Contact us on WhatsApp for custom sizes, bulk pricing or design assistance.
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-soft p-5">
            <h2 className="font-display text-xl font-bold text-navy">Need help choosing?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share size, quantity and deadline. Morya team will suggest the best material.
            </p>
            <a
              href={whatsappHref(whatsappNumber, buyMessage)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-5 w-full"
            >
              <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <ProductRow title="You May Also Like" products={related} />

      <section className="container-x py-10 text-center md:py-14">
        <h2 className="font-display text-3xl font-bold text-navy">Let customers speak for us</h2>
        <div className="mt-2 flex justify-center gap-1 text-yellow-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-5 w-5 fill-current" />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Trusted by local businesses in Pune.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Quick response and neat print quality.",
            "Helpful team for urgent branding work.",
            "Good finishing and clear guidance.",
          ].map((text, index) => (
            <blockquote
              key={text}
              className="rounded-lg border bg-white p-5 text-sm text-muted-foreground"
            >
              <div className="mb-3 flex justify-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>
              "{text}"
              <footer className="mt-4 font-bold text-navy">
                {["Himansh", "Akshara", "Deepak"][index]}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-soft py-10">
        <div className="container-x">
          <h2 className="font-display text-2xl font-bold text-navy">Frequently Bought Together</h2>
          <div className="mt-6 grid gap-6 rounded-lg bg-white p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-wrap items-center gap-4">
              {[product, ...related.slice(0, 2)].map((item, index) => (
                <div key={item.slug} className="flex items-center gap-4">
                  {index > 0 && <span className="text-2xl text-muted-foreground">+</span>}
                  <div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-md object-cover"
                    />
                    <div className="mt-2 max-w-28 text-xs font-bold text-navy">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total price from</div>
              <div className="font-display text-2xl font-bold text-navy">
                Rs.{" "}
                {[product, ...related.slice(0, 2)].reduce((sum, item) => sum + item.startingAt, 0)}
              </div>
              <button
                onClick={() => {
                  [product, ...related.slice(0, 2)].forEach((item) =>
                    addProductWithDefaultOptions(item),
                  );
                }}
                className="btn-navy mt-4"
              >
                Add selected to cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ProductOptionField({
  option,
  value,
  onChange,
}: {
  option: ProductOptionDefinition;
  value: string;
  onChange: (value: string) => void;
}) {
  if (option.type !== "select") {
    return (
      <label className="block text-sm font-bold text-navy">
        {option.label}
        <div className="relative mt-2">
          <input
            type={option.type}
            min={option.type === "number" ? "0" : undefined}
            step={option.type === "number" ? "any" : undefined}
            value={value}
            required={option.required}
            placeholder={option.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-14 text-base font-medium text-navy outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
          />
          {option.suffix && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              {option.suffix}
            </span>
          )}
        </div>
      </label>
    );
  }

  return (
    <label className="block text-sm font-bold text-navy">
      {option.label}
      <select
        value={value}
        required={option.required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-medium text-navy outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
      >
        {option.values?.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </select>
    </label>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-soft p-3">
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold text-navy">{value}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/70 pb-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-navy">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function ProductRow({ title, products }: { title: string; products: typeof allProducts }) {
  return (
    <section className="container-x py-8 md:py-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">{title}</h2>
        <Link to="/products" className="text-sm font-bold text-navy hover:text-orange">
          View all <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {products.map((item) => (
          <Link key={item.slug} to="/products/$slug" params={{ slug: item.slug }} className="group">
            <div className="relative overflow-hidden rounded-lg border bg-white">
              <span className="absolute left-2 top-2 z-10 rounded-full bg-orange px-2 py-1 text-[10px] font-extrabold text-white">
                -5%
              </span>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="aspect-square w-full bg-soft object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {item.category.name}
            </div>
            <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-navy">{item.name}</h3>
            <div className="mt-1 text-sm font-bold text-orange">From Rs. {item.startingAt}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
