import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Phone, ShoppingBag } from "lucide-react";
import logo from "../../assets/morya-logo.svg";
import { useCart } from "../../lib/cart";
import { catalog } from "../../data/catalog";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Categories" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-[0_2px_20px_-8px_rgba(11,31,58,0.15)]"
          : "bg-white"
      }`}
    >
      <div className="border-b border-border/70 bg-soft/70 text-[11px] text-navy">
        <div className="container-x flex items-center justify-between py-1.5">
          <span>Premium printing, made simple.</span>
          <a href="tel:+918554842103" className="font-semibold">
            Need help? +91 85548 42103
          </a>
        </div>
      </div>
      <div className="container-x flex h-16 items-center justify-between gap-3 py-2 md:h-18 md:py-3">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Morya Printing Point" className="h-10 w-10 md:h-11 md:w-11" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display font-bold text-navy text-[15px]">Morya Printing Point</div>
            <div className="text-[10px] tracking-[0.16em] uppercase text-orange font-bold">
              Print. Brand. Deliver.
            </div>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          {NAV.map((n) =>
            n.label === "Categories" ? (
              <div key={`${n.to}-${n.label}`} className="group relative">
                <Link
                  to="/products"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:text-navy xl:text-sm"
                  activeProps={{ className: "text-navy font-semibold" }}
                >
                  Categories <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-xl border bg-white p-4 shadow-[0_24px_60px_-28px_rgba(30,58,138,.45)]">
                    <div className="mb-3 flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-display text-lg font-bold text-navy">
                          Shop by category
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Browse all print categories from Morya.
                        </div>
                      </div>
                      <Link to="/products" className="text-xs font-bold text-orange">
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {catalog.map((category) => (
                        <Link
                          key={category.slug}
                          to="/products"
                          search={{ category: category.slug }}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:bg-soft hover:text-orange"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={`${n.to}-${n.label}`}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="shrink-0 rounded-md px-2.5 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:text-navy xl:text-sm"
                activeProps={{ className: "text-navy font-semibold" }}
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link to="/cart" className="btn-navy !py-2 !px-3 text-sm">
            <ShoppingBag className="h-4 w-4" /> Cart
            {count > 0 && (
              <span className="ml-0.5 rounded-full bg-orange px-1.5 py-0.5 text-[10px] leading-none">
                {count}
              </span>
            )}
          </Link>
          <a href="tel:+918554842103" className="btn-navy !py-2 !px-3 text-sm">
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-md text-navy"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-md text-navy"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden slide-down border-t bg-white">
          <div className="container-x py-4 flex flex-col gap-1">
            {NAV.map((n) =>
              n.label === "Categories" ? (
                <div key={`${n.to}-${n.label}`} className="rounded-md bg-soft/60 p-2">
                  <Link
                    to="/products"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-md px-3 py-3 font-semibold text-navy"
                  >
                    Categories <ChevronDown className="h-4 w-4" />
                  </Link>
                  <div className="grid grid-cols-2 gap-1 px-1 pb-2">
                    {catalog.map((category) => (
                      <Link
                        key={category.slug}
                        to="/products"
                        search={{ category: category.slug }}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-xs font-semibold text-foreground/75 hover:bg-white hover:text-orange"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={`${n.to}-${n.label}`}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-foreground/80 hover:bg-soft"
                  activeProps={{ className: "bg-soft text-navy font-semibold" }}
                >
                  {n.label}
                </Link>
              ),
            )}
            <div className="flex gap-2 pt-3">
              <Link to="/cart" onClick={() => setOpen(false)} className="btn-navy flex-1 text-sm">
                <ShoppingBag className="h-4 w-4" /> Cart {count > 0 ? `(${count})` : ""}
              </Link>
              <a href="tel:+918554842103" className="btn-navy flex-1 text-sm">
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
