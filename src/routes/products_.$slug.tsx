import { createFileRoute, Link } from "@tanstack/react-router";
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
import { useMemo, useRef, useState, type ReactNode } from "react";
import { SiteLayout } from "../components/site/SiteLayout";
import { allProducts, findProductBySlug } from "../data/catalog";
import { useCart } from "../lib/cart";

export const Route = createFileRoute("/products_/$slug")({
  head: ({ params }) => {
    const product = findProductBySlug(params.slug);
    return {
      meta: [
        { title: `${product?.name ?? "Product"} | Morya Printing Point` },
        {
          name: "description",
          content:
            product?.description ??
            "Custom print product details from Morya Printing Point in Kothrud, Pune.",
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const product = findProductBySlug(slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(100);
  const [selectedImage, setSelectedImage] = useState(product?.image ?? "");
  const [activeDetailTab, setActiveDetailTab] = useState<
    "description" | "specifications" | "other-information"
  >("description");
  const [cardType, setCardType] = useState("Standard Cards");
  const [material, setMaterial] = useState("300 GSM Art Card");
  const [cornerType, setCornerType] = useState("Square Corners");
  const [orientation, setOrientation] = useState("Landscape");
  const [selectedPrice, setSelectedPrice] = useState(
    product?.singleSidePrice
      ? `Single Side - Rs. ${product.singleSidePrice.split("/")[0].trim()}`
      : product?.bothSidePrice
        ? `Both Side - Rs. ${product.bothSidePrice.split("/")[0].trim()}`
        : "",
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((item) => item.category.slug === product.category.slug && item.slug !== product.slug)
      .concat(allProducts.filter((item) => item.category.slug !== product.category.slug))
      .slice(0, 6);
  }, [product]);

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
  const mrp = Math.round(product.startingAt * 1.18);
  const discount = Math.max(5, Math.round(((mrp - product.startingAt) / mrp) * 100));
  const priceOptions = [
    ...(product.singleSidePrice ?? "").split("/").filter(Boolean).map((price) => ({
      label: `Single Side - Rs. ${price.trim()}`,
      value: `Single Side - Rs. ${price.trim()}`,
    })),
    ...(product.bothSidePrice ?? "").split("/").filter(Boolean).map((price) => ({
      label: `Both Side - Rs. ${price.trim()}`,
      value: `Both Side - Rs. ${price.trim()}`,
    })),
  ];
  const buyMessage = encodeURIComponent(
    `Hello Morya Printing Point, I want to order ${product.name}. Card type: ${cardType}. Material: ${material}. Corners: ${cornerType}. Orientation: ${orientation}. Selected price: ${selectedPrice}. Quantity: ${quantity}.${uploadedFile ? ` I have selected artwork: ${uploadedFile.name}` : ""}`,
  );
  const quantityOptions = [100, 200, 300, 400, 500, 750, 1000, 1500];

  const addProduct = () =>
    addItem(
      {
        slug: product.slug,
        name: product.name,
        category: product.category.name,
        image: product.image,
        price: product.startingAt,
      },
      quantity,
    );

  return (
    <SiteLayout>
      <section className="container-x py-5 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-navy">Home</Link>
          <span>/</span>
          <Link to="/products" search={{ category: product.category.slug }} className="hover:text-navy">
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
                aria-label="Save product"
                className="absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow-md transition hover:text-orange"
              >
                <Heart className="h-5 w-5" />
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
              <span className="rounded-full bg-orange px-3 py-1 text-xs font-extrabold text-white">
                Save {discount}%
              </span>
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
              <div className="pb-1 text-sm text-muted-foreground line-through">MRP Rs. {mrp}</div>
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

            <div className="mt-6 space-y-4">
              <ProductOption label="Card Type" value={cardType} onChange={setCardType}>
                {["Standard Cards", "Standard Plus Cards", "Textured Cards", "Metallic Cards", "Eco-Friendly Cards", "Non Tearable Cards", "Special Texture Cards", "Transparent Card"].map((option) => <option key={option}>{option}</option>)}
              </ProductOption>
              <ProductOption label="Materials" value={material} onChange={setMaterial}>
                {["300 GSM Art Card", "350 GSM Art Card", "Premium Matte Card", "Textured Card", "Metallic Card"].map((option) => <option key={option}>{option}</option>)}
              </ProductOption>
              <ProductOption label="Corner Type" value={cornerType} onChange={setCornerType}>
                {["Square Corners", "Rounded Corners"].map((option) => <option key={option}>{option}</option>)}
              </ProductOption>
              <ProductOption label="Orientation" value={orientation} onChange={setOrientation}>
                {["Landscape", "Portrait"].map((option) => <option key={option}>{option}</option>)}
              </ProductOption>
              <ProductOption label="Select Price" value={selectedPrice} onChange={setSelectedPrice}>
                {priceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </ProductOption>
              <label className="block text-sm font-bold text-navy">
                Quantity
                <select
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm font-semibold text-navy"
                >
                  {quantityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}{option === 200 ? " - Recommended" : option === 1000 ? " - Best Price" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>

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
                accept=".pdf,.ai,.cdr,.psd,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
              />
            </div>
            {uploadedFile && (
              <p className="mt-2 text-xs font-medium text-green-700">Selected: {uploadedFile.name}. Send it with your WhatsApp order for confirmation.</p>
            )}

            <div className="mt-5 divide-y rounded-lg border bg-white">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-semibold text-navy">
                  Specs &amp; templates <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  Share a print-ready PDF, AI, CDR, PSD, JPG or PNG file. Keep important text inside the safe area; our team will confirm the final artwork before production.
                </div>
              </details>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-semibold text-navy">
                  Product options <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  Custom sizes, paper/material, lamination, sides and finishing are available. Contact us for a tailored quote or bulk-order pricing.
                </div>
              </details>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Spec label="Card Type" value={cardType} />
              <Spec label="Material" value={material} />
              <Spec label="Corner Type" value={cornerType} />
              <Spec label="Orientation" value={orientation} />
              <Spec label="Selected Price" value={selectedPrice || `Rs. ${product.startingAt}`} />
              <Spec label="Quantity" value={quantity.toLocaleString()} />
            </div>

            <div className="mt-7 flex gap-3">
              <button onClick={addProduct} className="btn-navy w-full">
                <ShoppingBag className="h-4 w-4" /> Add To Cart
              </button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange" /> Estimated delivery after confirmation
              </span>
              <button className="inline-flex items-center gap-2 font-bold text-navy">
                <Heart className="h-4 w-4" /> Save
              </button>
              <button className="inline-flex items-center gap-2 font-bold text-navy">
                <Share2 className="h-4 w-4" /> Share
              </button>
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
              className="flex gap-8 border-b text-lg font-semibold text-muted-foreground"
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
                    className={`-mb-px border-b-2 pb-3 transition-colors ${
                      isActive
                        ? "border-navy text-navy"
                        : "border-transparent hover:text-navy"
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
                  <li>Best suited for businesses, events, packaging, promotions and local branding.</li>
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
                  <li>Contact us on WhatsApp for custom sizes, bulk pricing or design assistance.</li>
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
              href={`https://wa.me/918554842103?text=${buyMessage}`}
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
                    addItem({
                      slug: item.slug,
                      name: item.name,
                      category: item.category.name,
                      image: item.image,
                      price: item.startingAt,
                    }),
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

function ProductOption({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-navy">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-medium text-navy outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
      >
        {children}
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
