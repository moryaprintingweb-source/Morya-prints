import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { useCart } from "../lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart | Morya Printing Point" },
      {
        name: "description",
        content: "Review selected print products and request a quote from Morya Printing Point.",
      },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const message = encodeURIComponent(
    `Hello Morya Printing Point, I want a quote for:\n${items
      .map((item) => `- ${item.name} x ${item.quantity}`)
      .join("\n")}\nEstimated total from website: Rs. ${total}`,
  );

  return (
    <SiteLayout>
      <section className="container-x py-8 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">Your cart</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-navy md:text-5xl">
              Selected print products
            </h1>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-sm font-bold text-orange">
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="grid min-h-[360px] place-items-center rounded-lg border bg-soft p-8 text-center">
            <div>
              <ShoppingBag className="mx-auto h-12 w-12 text-orange" />
              <h2 className="mt-4 font-display text-2xl font-bold text-navy">
                Your cart is empty.
              </h2>
              <p className="mt-2 text-muted-foreground">Add products and request a quick quote.</p>
              <Link to="/products" className="btn-primary mt-6">
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="grid gap-4 rounded-lg border bg-white p-3 sm:grid-cols-[120px_1fr_auto]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-full rounded-md bg-soft object-cover sm:w-[120px]"
                  />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-orange">
                      {item.category}
                    </div>
                    <h2 className="mt-1 font-display text-xl font-bold text-navy">{item.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">From Rs. {item.price}</p>
                    <div className="mt-4 inline-flex items-center rounded-full border bg-white">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.slug)}
                    className="grid h-10 w-10 place-items-center rounded-md text-muted-foreground hover:bg-soft hover:text-orange"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-lg border bg-white p-5">
              <h2 className="font-display text-2xl font-bold text-navy">Quote summary</h2>
              <div className="mt-5 space-y-3 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-bold">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated from price</span>
                  <span className="font-bold text-navy">Rs. {total}</span>
                </div>
              </div>
              <a
                href={`https://wa.me/918554842103?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-6 w-full"
              >
                Request quote on WhatsApp
              </a>
              <Link to="/products" className="btn-navy mt-3 w-full">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
