import { lazy, Suspense, useEffect, type ReactNode } from "react";

const About = lazy(() => import("./routes/about").then((module) => ({ default: module.About })));
const Admin = lazy(() => import("./routes/admin").then((module) => ({ default: module.Admin })));
const Blog = lazy(() => import("./routes/blog").then((module) => ({ default: module.Blog })));
const BlogDetail = lazy(() =>
  import("./routes/blog").then((module) => ({ default: module.BlogDetail })),
);
const Cart = lazy(() => import("./routes/cart").then((module) => ({ default: module.Cart })));
const Contact = lazy(() =>
  import("./routes/contact").then((module) => ({ default: module.Contact })),
);
const FAQ = lazy(() => import("./routes/faq").then((module) => ({ default: module.FAQ })));
const Gallery = lazy(() =>
  import("./routes/gallery").then((module) => ({ default: module.Gallery })),
);
const Home = lazy(() => import("./routes").then((module) => ({ default: module.Home })));
const Industries = lazy(() =>
  import("./routes/industries").then((module) => ({ default: module.Industries })),
);
const PrivacyPolicy = lazy(() =>
  import("./routes/privacy-policy").then((module) => ({ default: module.PrivacyPolicy })),
);
const ProductDetail = lazy(() =>
  import("./routes/products_.$slug").then((module) => ({ default: module.ProductDetail })),
);
const Products = lazy(() =>
  import("./routes/products").then((module) => ({ default: module.Products })),
);
const ReturnRefundPolicy = lazy(() =>
  import("./routes/return-refund-policy").then((module) => ({
    default: module.ReturnRefundPolicy,
  })),
);
const Services = lazy(() =>
  import("./routes/services").then((module) => ({ default: module.Services })),
);
const ShippingPaymentPolicy = lazy(() =>
  import("./routes/shipping-payment-policy").then((module) => ({
    default: module.ShippingPaymentPolicy,
  })),
);
const Support = lazy(() =>
  import("./routes/support").then((module) => ({ default: module.Support })),
);
const TermsConditions = lazy(() =>
  import("./routes/terms-conditions").then((module) => ({ default: module.TermsConditions })),
);

function RouteLoading() {
  return <div className="min-h-screen bg-background" />;
}

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>;
}

function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    const robotsMeta = robots ?? document.createElement("meta");

    document.title = "Page not found | Morya Printing Point";
    robotsMeta.name = "robots";
    robotsMeta.content = "noindex, nofollow";
    if (!robots) document.head.appendChild(robotsMeta);

    return () => {
      document.title = previousTitle;
      if (previousRobots !== undefined) {
        robotsMeta.content = previousRobots;
      } else {
        robotsMeta.remove();
      }
    };
  }, []);

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
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);

  if (productMatch?.[1]) {
    return (
      <LazyRoute>
        <ProductDetail slug={decodeURIComponent(productMatch[1])} />
      </LazyRoute>
    );
  }

  if (blogMatch?.[1]) {
    return (
      <LazyRoute>
        <BlogDetail slug={decodeURIComponent(blogMatch[1])} />
      </LazyRoute>
    );
  }

  let route: ReactNode;

  switch (pathname.replace(/\/$/, "") || "/") {
    case "/":
      route = <Home />;
      break;
    case "/about":
      route = <About />;
      break;
    case "/admin":
      route = <Admin />;
      break;
    case "/blog":
      route = <Blog />;
      break;
    case "/cart":
      route = <Cart />;
      break;
    case "/contact":
      route = <Contact />;
      break;
    case "/faq":
      route = <FAQ />;
      break;
    case "/gallery":
      route = <Gallery />;
      break;
    case "/industries":
      route = <Industries />;
      break;
    case "/privacy-policy":
      route = <PrivacyPolicy />;
      break;
    case "/products":
      route = <Products />;
      break;
    case "/return-refund-policy":
      route = <ReturnRefundPolicy />;
      break;
    case "/services":
      route = <Services />;
      break;
    case "/shipping-payment-policy":
      route = <ShippingPaymentPolicy />;
      break;
    case "/support":
      route = <Support />;
      break;
    case "/terms-conditions":
      route = <TermsConditions />;
      break;
    default:
      route = <NotFound />;
  }

  return <LazyRoute>{route}</LazyRoute>;
}
