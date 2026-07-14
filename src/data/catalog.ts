import {
  BadgeIndianRupee,
  BookOpen,
  Box,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  ClipboardList,
  CreditCard,
  Flag,
  Gift,
  Image,
  Layers3,
  MapPinned,
  Package,
  PanelTop,
  RectangleHorizontal,
  ScanLine,
  Shirt,
  SignpostBig,
  Sticker,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Product = {
  name: string;
  startingAt: number;
  image: string;
  description: string;
  quantity: string;
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

const fromNames = (
  names: string[],
  startingAt: number,
  description: string,
  quantity = "Custom quantity",
) =>
  names.map((name, index) => ({
    name,
    startingAt: startingAt + index * 100,
    image: visuals[index],
    description,
    quantity,
  }));

export const catalog: Category[] = [
  {
    slug: "visiting-cards",
    name: "Visiting Cards",
    eyebrow: "Make an impression",
    icon: CreditCard,
    products: [
      {
        name: "Standard Visiting Cards",
        startingAt: 199,
        image: visuals[0],
        quantity: "100 / 200 / 500 / 1000",
        description: "Sharp, full-colour business cards for everyday networking.",
      },
      {
        name: "Premium Visiting Cards",
        startingAt: 799,
        image: visuals[1],
        quantity: "100 / 200 / 500 / 1000",
        description: "Luxury cardstock with an elevated, professional finish.",
      },
      {
        name: "Matte Lamination Cards",
        startingAt: 299,
        image: visuals[2],
        quantity: "100 / 200 / 500 / 1000",
        description: "Smooth, glare-free cards with durable protection.",
      },
      {
        name: "Gloss Lamination Cards",
        startingAt: 299,
        image: visuals[3],
        quantity: "100 / 200 / 500 / 1000",
        description: "Vibrant, glossy cards that make colours pop.",
      },
      {
        name: "Spot UV Visiting Cards",
        startingAt: 899,
        image: visuals[4],
        quantity: "100 / 200 / 500",
        description: "Premium raised highlights for an unforgettable first impression.",
      },
    ],
  },
  {
    slug: "flyers-pamphlets",
    name: "Flyers & Pamphlets",
    eyebrow: "Spread the word",
    icon: RectangleHorizontal,
    products: [
      {
        name: "A5 Flyers",
        startingAt: 1299,
        image:
          "https://www.inkprint.in/_next/image?url=https%3A%2F%2Finkprint2-bucket.s3.amazonaws.com%2Fimg%2Fproduct_image%2Fset%2FFlyers_pamphlets_WEBP_W4LSQTL.webp&w=1200&q=75",
        quantity: "1000 / 2000",
        description: "Compact, high-impact flyers for promotions and events.",
      },
      {
        name: "A4 Flyers",
        startingAt: 1999,
        image: visuals[1],
        quantity: "1000 / 2000",
        description: "More room for detailed offers, menus and product information.",
      },
      {
        name: "Folded Brochures",
        startingAt: 1999,
        image: visuals[2],
        quantity: "500 / 1000",
        description: "Bi-fold, tri-fold and custom brochures made to tell your story.",
      },
      {
        name: "Marketing Posters",
        startingAt: 349,
        image: visuals[3],
        quantity: "Custom quantity",
        description: "Bold poster prints for campaigns, retail and events.",
      },
      {
        name: "Menu Cards",
        startingAt: 699,
        image: visuals[4],
        quantity: "50 / 100 / 250",
        description: "Restaurant and cafe menus with professional finishes.",
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
        image: "https://www.arcprint.in/category/wp-content/uploads/2024/05/illumate.jpg",
        quantity: "Per sq. ft.",
        description: "Durable indoor and outdoor vinyl graphics for branding.",
      },
      {
        name: "One Way Vision Vinyl",
        startingAt: 35,
        image: "https://cpimg.tistatic.com/10337942/b/4/One-Way-Vision-Printing-Services..jpg",
        quantity: "Per sq. ft.",
        description: "Privacy and vibrant outside graphics for glass applications.",
      },
      {
        name: "Frosted Vinyl",
        startingAt: 45,
        image: visuals[2],
        quantity: "Per sq. ft.",
        description: "Elegant etched-glass privacy for offices and retail spaces.",
      },
      {
        name: "Clear Transparent Vinyl",
        startingAt: 45,
        image: visuals[3],
        quantity: "Per sq. ft.",
        description: "Clean transparent adhesive graphics for windows and labels.",
      },
      {
        name: "Custom Window Graphics",
        startingAt: 55,
        image: visuals[4],
        quantity: "Per sq. ft.",
        description: "Tailored glass branding, decals and decorative treatments.",
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
        name: "Star Flex Printing",
        startingAt: 22,
        image:
          "https://i0.wp.com/sparshmedia.com/wp-content/uploads/2026/03/Star-Flex-Banner-Front-lit.webp?fit=600%2C600&ssl=1",
        quantity: "Per sq. ft.",
        description: "Vibrant, weather-ready banners and promotional flex.",
      },
      {
        name: "Eco Solvent Flex",
        startingAt: 35,
        image: visuals[1],
        quantity: "Per sq. ft.",
        description: "Premium, low-odour flex with rich colour and detail.",
      },
      {
        name: "Black Back Flex",
        startingAt: 30,
        image: visuals[2],
        quantity: "Per sq. ft.",
        description: "Opaque flex for maximum impact over existing graphics.",
      },
      {
        name: "Backlit Flex",
        startingAt: 45,
        image: visuals[3],
        quantity: "Per sq. ft.",
        description: "Illuminated graphics for light boxes and glow signboards.",
      },
      {
        name: "Hoarding Prints",
        startingAt: 28,
        image: visuals[4],
        quantity: "Per sq. ft.",
        description: "Large-format outdoor advertising engineered for durability.",
      },
    ],
  },
  {
    slug: "office-printing",
    name: "Office Printing",
    eyebrow: "Business essentials",
    icon: BriefcaseBusiness,
    products: [
      {
        name: "Letterheads",
        startingAt: 2499,
        image:
          "https://d3pyarv4eotqu4.cloudfront.net/printongo/images/product/004_01131325202409.jpg",
        quantity: "1000",
        description: "Premium letterheads for professional business communication.",
      },
      {
        name: "Custom Envelopes",
        startingAt: 2699,
        image: visuals[1],
        quantity: "1000",
        description: "Branded envelopes for documents, invoices and invitations.",
      },
      {
        name: "Receipt Books",
        startingAt: 1500,
        image: "https://m.media-amazon.com/images/I/71iG-bxy5WL.jpg",
        quantity: "5 / 10 books",
        description: "Duplicate or triplicate receipt books with your business details.",
      },
      ...fromNames(
        ["GST Bill Books", "Company Profile Folders"],
        1799,
        "Practical, on-brand stationery for everyday business use.",
        "Custom quantity",
      ),
    ],
  },
  {
    slug: "stickers-labels",
    name: "Stickers & Labels",
    eyebrow: "Stick with your brand",
    icon: ScanLine,
    products: fromNames(
      [
        "Product Labels",
        "Waterproof Stickers",
        "Die-Cut Stickers",
        "Custom Sticker Sheets",
        "Barcode Labels",
      ],
      299,
      "Custom-cut, high-adhesion stickers and labels for products and packaging.",
    ),
  },
  {
    slug: "banners-standees",
    name: "Banners & Standees",
    eyebrow: "Own the room",
    icon: SignpostBig,
    products: fromNames(
      ["Roll-Up Standees", "X-Banners", "Fabric Standees", "Event Backdrops", "Table Top Standees"],
      699,
      "Portable display printing that gets your message seen.",
    ),
  },
  {
    slug: "signage-boards",
    name: "Signage Boards",
    eyebrow: "Be seen, day and night",
    icon: PanelTop,
    products: fromNames(
      [
        "ACP Sign Boards",
        "Acrylic Sign Boards",
        "LED Sign Boards",
        "3D Letter Signage",
        "Shop Name Boards",
      ],
      999,
      "Professional indoor and outdoor signage made to specification.",
    ),
  },
  {
    slug: "packaging",
    name: "Packaging",
    eyebrow: "Ready for the shelf",
    icon: Box,
    products: fromNames(
      [
        "Packaging Boxes",
        "Corrugated Boxes",
        "Paper Carry Bags",
        "Kraft Paper Bags",
        "Custom Gift Bags",
      ],
      899,
      "Smart, sturdy packaging that carries your brand further.",
    ),
  },
  {
    slug: "catalogues",
    name: "Catalogues & Books",
    eyebrow: "Tell your full story",
    icon: BookOpen,
    products: fromNames(
      [
        "A4 Product Catalogues",
        "A5 Catalogues",
        "Perfect Bound Books",
        "Spiral Notebooks",
        "Annual Reports",
      ],
      1499,
      "Beautifully produced multi-page print for products, ideas and reports.",
    ),
  },
  {
    slug: "photo-prints",
    name: "Photo Prints",
    eyebrow: "Print the moments",
    icon: Camera,
    products: fromNames(
      ["Photo Prints", "Canvas Prints", "Photo Frames", "Photo Books", "Passport Photos"],
      199,
      "Crisp, colour-true photo printing for memories and displays.",
    ),
  },
  {
    slug: "invitations",
    name: "Invitations",
    eyebrow: "Make it memorable",
    icon: Gift,
    products: fromNames(
      [
        "Wedding Invitations",
        "Birthday Invitations",
        "Event Invitations",
        "Thank You Cards",
        "Save The Date Cards",
      ],
      399,
      "Thoughtfully printed stationery for life’s important occasions.",
    ),
  },
  {
    slug: "certificates",
    name: "Certificates & IDs",
    eyebrow: "Officially yours",
    icon: BadgeIndianRupee,
    products: fromNames(
      ["Achievement Certificates", "ID Cards", "Employee Badges", "Lanyards", "Membership Cards"],
      199,
      "Professional identity and recognition prints for teams and institutions.",
    ),
  },
  {
    slug: "calendars-diaries",
    name: "Calendars & Diaries",
    eyebrow: "Stay on brand",
    icon: CalendarDays,
    products: fromNames(
      ["Wall Calendars", "Desk Calendars", "Corporate Diaries", "Planners", "Notepads"],
      249,
      "Useful branded essentials that stay on desks all year.",
    ),
  },
  {
    slug: "apparel",
    name: "Apparel Printing",
    eyebrow: "Wear your brand",
    icon: Shirt,
    products: fromNames(
      [
        "Custom T-Shirts",
        "Corporate Polo T-Shirts",
        "Printed Caps",
        "Safety Jackets",
        "Event Jerseys",
      ],
      299,
      "Reliable apparel branding for teams, events and promotions.",
    ),
  },
  {
    slug: "display",
    name: "Display & POS",
    eyebrow: "Built to convert",
    icon: MapPinned,
    products: fromNames(
      ["POP Displays", "Danglers", "Shelf Strips", "Promotional Canopies", "Counter Displays"],
      499,
      "Retail-ready displays designed to guide attention and drive action.",
    ),
  },
  {
    slug: "vehicle-branding",
    name: "Vehicle Branding",
    eyebrow: "Take your brand places",
    icon: Image,
    products: fromNames(
      [
        "Car Vinyl Wraps",
        "Bike Graphics",
        "Commercial Vehicle Branding",
        "Fleet Decals",
        "Magnetic Car Signs",
      ],
      799,
      "High-visibility vehicle graphics with durable, professional application.",
    ),
  },
  {
    slug: "safety-signage",
    name: "Safety Signage",
    eyebrow: "Safety, clearly stated",
    icon: ClipboardList,
    products: fromNames(
      [
        "Mandatory Safety Signs",
        "Warning Boards",
        "Directional Signage",
        "Fire Safety Signs",
        "Reflective Sign Boards",
      ],
      199,
      "Clear, durable signage for safer workplaces and facilities.",
    ),
  },
  {
    slug: "gifts",
    name: "Corporate Gifts",
    eyebrow: "Give something memorable",
    icon: Gift,
    products: fromNames(
      ["Custom Mugs", "Branded Pens", "Employee Welcome Kits", "Keychains", "Awards & Trophies"],
      149,
      "Practical branded gifts for clients, teams and occasions.",
    ),
  },
  {
    slug: "custom-prints",
    name: "Custom Prints",
    eyebrow: "Made for your idea",
    icon: Layers3,
    products: fromNames(
      ["Wall Decals", "Fabric Prints", "Canvas Prints", "Custom Cutouts", "One-Off Print Jobs"],
      299,
      "Bring any print concept to life with tailored materials and finishing.",
    ),
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
