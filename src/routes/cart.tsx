import { Link } from "../components/site/Link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SiteLayout } from "../components/site/SiteLayout";
import { api } from "../lib/api";
import { useCart } from "../lib/cart";
import { usePublicSiteSettings, whatsappHref } from "../lib/site-settings";

export function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { getSetting } = usePublicSiteSettings();
  const whatsappNumber = getSetting("business_whatsapp_number");
  const [saveStatus, setSaveStatus] = useState("");
  const message = encodeURIComponent(
    `Hello Morya Printing Point, I want a quote for:\n${items
      .map((item) => {
        const options = item.selectedOptions
          .map((option) => `  ${option.label}: ${option.value}`)
          .join("\n");
        const artwork = item.artworkName ? `\n  Artwork: ${item.artworkName}` : "";
        return `- ${item.name}${item.quantity > 1 ? ` (cart quantity: ${item.quantity})` : ""}${options ? `\n${options}` : ""}${artwork}`;
      })
      .join(
        "\n",
      )}\nStarting estimate from website: Rs. ${total}\nPlease confirm the final price and delivery timeline.`,
  );
  const saveQuoteRequest = async () => {
    try {
      setSaveStatus("Saving request...");
      const result = await api<{ id: number }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items,
          total,
          notes: "Created from website cart before WhatsApp quote request.",
        }),
      });
      setSaveStatus(`Saved as quote request #${result.id}`);
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : "Unable to save quote request");
    }
  };

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
                  key={item.id}
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
                    {item.selectedOptions.length > 0 && (
                      <dl className="mt-3 grid gap-x-5 gap-y-1 rounded-md bg-soft p-3 text-sm sm:grid-cols-2">
                        {item.selectedOptions.map((option) => (
                          <div key={option.id} className="flex gap-2">
                            <dt className="text-muted-foreground">{option.label}:</dt>
                            <dd className="font-semibold text-navy">{option.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {item.artworkName && (
                      <p className="mt-2 text-xs font-medium text-green-700">
                        Artwork selected: {item.artworkName}
                      </p>
                    )}
                    <div className="mt-4 inline-flex items-center rounded-full border bg-white">
                      <button
                        aria-label="Decrease cart quantity"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        aria-label="Increase cart quantity"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
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
                  <span className="text-muted-foreground">Starting estimate</span>
                  <span className="font-bold text-navy">Rs. {total}</span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Product options do not change the website estimate yet. Final pricing is confirmed
                with your quote.
              </p>
              <a
                href={whatsappHref(whatsappNumber, message)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-6 w-full"
                onClick={saveQuoteRequest}
              >
                Request quote on WhatsApp
              </a>
              {saveStatus && (
                <p className="mt-3 text-xs font-semibold text-muted-foreground" role="status">
                  {saveStatus}
                </p>
              )}
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
