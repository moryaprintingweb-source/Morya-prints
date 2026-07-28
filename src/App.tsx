import { About } from "./routes/about";
import { Blog } from "./routes/blog";
import { Cart } from "./routes/cart";
import { Contact } from "./routes/contact";
import { FAQ } from "./routes/faq";
import { Gallery } from "./routes/gallery";
import { Home } from "./routes";
import { Industries } from "./routes/industries";
import { PrivacyPolicy } from "./routes/privacy-policy";
import { ProductDetail } from "./routes/products_.$slug";
import { Products } from "./routes/products";
import { ReturnRefundPolicy } from "./routes/return-refund-policy";
import { Services } from "./routes/services";
import { Support } from "./routes/support";
import { TermsConditions } from "./routes/terms-conditions";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a href="/" className="btn-primary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const { pathname } = window.location;
  const productMatch = pathname.match(/^\/products\/([^/]+)\/?$/);

  if (productMatch?.[1]) {
    return <ProductDetail slug={decodeURIComponent(productMatch[1])} />;
  }

  switch (pathname.replace(/\/$/, "") || "/") {
    case "/":
      return <Home />;
    case "/about":
      return <About />;
    case "/blog":
      return <Blog />;
    case "/cart":
      return <Cart />;
    case "/contact":
      return <Contact />;
    case "/faq":
      return <FAQ />;
    case "/gallery":
      return <Gallery />;
    case "/industries":
      return <Industries />;
    case "/privacy-policy":
      return <PrivacyPolicy />;
    case "/products":
      return <Products />;
    case "/return-refund-policy":
      return <ReturnRefundPolicy />;
    case "/services":
      return <Services />;
    case "/support":
      return <Support />;
    case "/terms-conditions":
      return <TermsConditions />;
    default:
      return <NotFound />;
  }
}
