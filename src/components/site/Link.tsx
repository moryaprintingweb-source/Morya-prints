import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string | number | boolean | undefined>;
  activeOptions?: { exact?: boolean };
  activeProps?: { className?: string };
  children: ReactNode;
};

function toHref(
  to: string,
  params?: Record<string, string>,
  search?: Record<string, string | number | boolean | undefined>,
) {
  let href = to;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      href = href.replace(`$${key}`, encodeURIComponent(value));
    });
  }

  const query = new URLSearchParams();
  Object.entries(search ?? {}).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  return query.size ? `${href}?${query.toString()}` : href;
}

export function Link({
  to,
  params,
  search,
  activeOptions,
  activeProps,
  className,
  children,
  ...props
}: LinkProps) {
  const href = toHref(to, params, search).replace("/products_/", "/products/");
  const path = href.split("?")[0];
  const currentPath = typeof window === "undefined" ? "" : window.location.pathname;
  const isActive = activeOptions?.exact ? currentPath === path : currentPath.startsWith(path);
  const mergedClassName =
    isActive && activeProps?.className ? `${className ?? ""} ${activeProps.className}`.trim() : className;

  return (
    <a href={href} className={mergedClassName} {...props}>
      {children}
    </a>
  );
}
