import {
  BookOpen,
  BriefcaseBusiness,
  CreditCard,
  Flag,
  PanelTop,
  RectangleHorizontal,
  ScanLine,
  Sticker,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import flexStar from "../assets/products/flex-printing-star-flex-printing.webp";
import a5Flyers from "../assets/products/flyers-pamphlets-a5-flyers.webp";
import envelopes from "../assets/products/office-printing-envelopes.jpg";
import letterheads from "../assets/products/office-printing-letterheads.jpg";
import receiptBooks from "../assets/products/office-printing-receipt-books.jpg";
import vinylPrinting from "../assets/products/vinyl-printing-vinyl-printing.jpg";

export type Product = {
  name: string;
  startingAt: number;
  image: string;
  sourceImageUrl?: string;
  description: string;
  quantity: string;
  singleSidePrice?: string;
  bothSidePrice?: string;
};

export type Category = {
  slug: string;
  name: string;
  eyebrow: string;
  icon: LucideIcon;
  products: Product[];
};

const visuals = [
  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=80",
];

const driveImage = (id: string) => {
  const fallbacks: Record<string, string> = {
    "1NR71Gud5NV3kJCAihnsYE2oftW7PkCyu": visuals[0],
    "1RXt2Rq_RU14o09s3h0VNyX6MtWgjWHD7": visuals[1],
    "1Ay1NmELuTkfwvv8iBqUB1EFUH51abvua": visuals[2],
  };

  return fallbacks[id] ?? visuals[0];
};

export const catalog: Category[] = [
  {
    slug: "visiting-cards",
    name: "Visiting Cards",
    eyebrow: "Make an impression",
    icon: CreditCard,
    products: [
      {
        name: "Standard Visiting Cards",
        startingAt: 300,
        image: driveImage("1NR71Gud5NV3kJCAihnsYE2oftW7PkCyu"),
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "300 / 500 / 1200 / 1800",
        bothSidePrice: "450 / 750 / 1800 / 2700",
        description:
          "Standard visiting cards from the Excel sheet with printing type and quantity options.",
      },
      {
        name: "Premium Visiting Cards",
        startingAt: 600,
        image: driveImage("1RXt2Rq_RU14o09s3h0VNyX6MtWgjWHD7"),
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "600 / 900 / 1800 / 2200",
        bothSidePrice: "900 / 1350 / 2700 / 3300",
        description:
          "Premium visiting cards from the Excel sheet with printing type, quantity and corner type options.",
      },
    ],
  },
  {
    slug: "flyers-pamphlets",
    name: "Flyers",
    eyebrow: "Spread the word",
    icon: RectangleHorizontal,
    products: [
      {
        name: "90 GSM Flyers (Glossy)",
        startingAt: 600,
        image: a5Flyers,
        quantity: "100 / 200 / 500 / 1000 / 2000 / 5000 / 10000",
        singleSidePrice: "600 / 900 / 1200 / 1500 / 1800 / 4500 / 7200",
        bothSidePrice: "900 / 1350 / 1800 / 2250 / 2700 / 6750 / 10800",
        description:
          "90 GSM glossy flyers from the Excel sheet with size, printing type and quantity options.",
      },
    ],
  },
  {
    slug: "bill-book",
    name: "Bill Book",
    eyebrow: "Business records",
    icon: BriefcaseBusiness,
    products: [
      {
        name: "Bill Book B/W",
        startingAt: 600,
        image: receiptBooks,
        quantity: "1 / 2 / 5 / 10 Books",
        singleSidePrice: "600 / 900 / 1200 / 1800",
        bothSidePrice: "900 / 1350 / 1800 / 2700",
        description:
          "Black-and-white bill book from the Excel sheet with size, printing type, copy and numbering options.",
      },
      {
        name: "Prescription Pads",
        startingAt: 600,
        image: visuals[1],
        quantity: "1 / 2 / 5 / 10 Books",
        singleSidePrice: "600 / 900 / 1200 / 1800",
        bothSidePrice: "900 / 1350 / 1800 / 2700",
        description:
          "Prescription pad from the Excel sheet with size, printing type and book quantity options.",
      },
    ],
  },
  {
    slug: "letter-head",
    name: "Letter Head",
    eyebrow: "Official stationery",
    icon: RectangleHorizontal,
    products: [
      {
        name: "Letterheads",
        startingAt: 500,
        image: letterheads,
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "500 / 800 / 1500 / 2000",
        bothSidePrice: "750 / 1200 / 2250 / 3000",
        description: "Letterhead printing from the Excel sheet with quantity option.",
      },
    ],
  },
  {
    slug: "envelope",
    name: "Envelope",
    eyebrow: "Branded mailers",
    icon: BriefcaseBusiness,
    products: [
      {
        name: "Envelopes",
        startingAt: 700,
        image: envelopes,
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "700 / 1200 / 1800 / 2400",
        bothSidePrice: "1050 / 1800 / 2700 / 3600",
        description: "Envelope printing from the Excel sheet with quantity option.",
      },
    ],
  },
  {
    slug: "stickers-labels",
    name: "Stickers",
    eyebrow: "Stick with your brand",
    icon: ScanLine,
    products: [
      {
        name: "Paper Sticker",
        startingAt: 299,
        image: visuals[0],
        quantity: "500",
        description:
          "Paper sticker from the Excel sheet with size, custom width, custom height and quantity options.",
      },
      {
        name: "Non Tearable Sticker",
        startingAt: 399,
        image: visuals[1],
        quantity: "500",
        description:
          "Non tearable sticker from the Excel sheet with size, custom width, custom height and quantity options.",
      },
    ],
  },
  {
    slug: "flex-printing",
    name: "Flex Printing",
    eyebrow: "Built for visibility",
    icon: Flag,
    products: [
      {
        name: "Regular Flex",
        startingAt: 22,
        image: flexStar,
        quantity: "2",
        description:
          "Regular flex from the Excel sheet with size, custom width, custom height and quantity options.",
      },
    ],
  },
  {
    slug: "vinyl-printing",
    name: "Vinyl Printing",
    eyebrow: "Transform every surface",
    icon: Sticker,
    products: [
      {
        name: "Vinyl Printing",
        startingAt: 25,
        image: vinylPrinting,
        quantity: "2",
        singleSidePrice: "25",
        description:
          "Vinyl printing from the Excel sheet with size, custom width, custom height, lamination and quantity options.",
      },
    ],
  },
  {
    slug: "sunboard",
    name: "Sunboard",
    eyebrow: "Mounted brand display",
    icon: PanelTop,
    products: [
      {
        name: "Sunboard",
        startingAt: 999,
        image: visuals[2],
        quantity: "2",
        description:
          "Sunboard from the Excel sheet with size, custom width, custom height, lamination, sunboard thickness and quantity options.",
      },
    ],
  },
  {
    slug: "brochure-book",
    name: "Brochure / Book",
    eyebrow: "Tell your full story",
    icon: BookOpen,
    products: [
      {
        name: "Brochures",
        startingAt: 1999,
        image: driveImage("1Ay1NmELuTkfwvv8iBqUB1EFUH51abvua"),
        quantity: "100",
        singleSidePrice: "1999 / 2999",
        bothSidePrice: "2999 / 3999",
        description:
          "Brochure/book product from the Excel sheet with size, pages, folding, cover, inner paper, lamination, binding and quantity options.",
      },
    ],
  },
];

export const featuredProducts = catalog
  .flatMap((category) =>
    category.products.map((product) => ({ ...product, category: category.name })),
  )
  .slice(0, 10);

export const productSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const allProducts = catalog.flatMap((category) =>
  category.products.map((product) => ({
    ...product,
    category,
    slug: productSlug(`${category.slug}-${product.name}`),
  })),
);

export type CatalogProduct = (typeof allProducts)[number];

export const findProductBySlug = (slug: string) =>
  allProducts.find((product) => product.slug === slug);
