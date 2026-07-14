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
    "1aghUepuJutSwk_8YbiBQLc3m7nsflVoP": visuals[3],
    "10Kkj5oe8XOhbqP3A_dikqJzJcQwb8wW5": visuals[1],
    "1Ay1NmELuTkfwvv8iBqUB1EFUH51Zocy7": visuals[2],
  };

  return fallbacks[id] ?? visuals[0];
};

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
        image: driveImage("1NR71Gud5NV3kJCAihnsYE2oftW7PkCyu"),
        sourceImageUrl:
          "https://drive.google.com/file/d/1NR71Gud5NV3kJCAihnsYE2oftW7PkCyu/view?usp=drive_link",
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "199 / 299 / 499 / 999",
        bothSidePrice: "299 / 399 / 799 / 1299",
        description:
          "Our Standard Visiting Cards are the perfect choice for professionals, startups, and businesses looking for high-quality business cards at an affordable price. Printed on premium cardstock using advanced digital printing technology, these cards deliver sharp text, vibrant colors, and a professional finish. Available in single or double-sided printing with multiple paper thickness options, they are ideal for everyday networking, meetings, and brand promotion. Fast printing and custom designs available.",
      },
      {
        name: "Premium Visiting Cards",
        startingAt: 799,
        image: driveImage("1RXt2Rq_RU14o09s3h0VNyX6MtWgjWHD7"),
        sourceImageUrl:
          "https://drive.google.com/file/d/1RXt2Rq_RU14o09s3h0VNyX6MtWgjWHD7/view?usp=drive_link",
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "799 / 1299 / 1899 / 2399",
        bothSidePrice: "999 / 1499 / 2099 / 2499",
        description:
          "Make a lasting first impression with our Premium Visiting Cards, crafted using superior-quality cardstock and luxury finishes. Choose from velvet, textured, metallic, or thick premium paper with options like Spot UV, foil stamping, embossing, and soft-touch lamination. These elegant business cards are designed to reflect your brand's professionalism and leave a memorable impact. Perfect for executives, entrepreneurs, corporate professionals, and luxury brands seeking a premium identity.",
      },
      {
        name: "Matte Lamination Cards",
        startingAt: 299,
        image: driveImage("1NR71Gud5NV3kJCAihnsYE2oftW7PkCyu"),
        sourceImageUrl:
          "https://drive.google.com/file/d/1NR71Gud5NV3kJCAihnsYE2oftW7PkCyu/view?usp=drive_link",
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "299 / 399 / 599 / 1099",
        bothSidePrice: "399 / 499 / 899 / 1399",
        description:
          "Our Matte Lamination Visiting Cards offer a smooth, elegant, and glare-free finish that enhances the overall appearance of your business cards. The protective matte coating increases durability while providing a premium, sophisticated look and comfortable feel. Resistant to fingerprints and minor scratches, these cards are ideal for professionals who prefer a clean and modern design. Perfect for corporate businesses, consultants, architects, and creative professionals.",
      },
      {
        name: "Gloss Lamination Cards",
        startingAt: 299,
        image: driveImage("1aghUepuJutSwk_8YbiBQLc3m7nsflVoP"),
        sourceImageUrl:
          "https://drive.google.com/file/d/1aghUepuJutSwk_8YbiBQLc3m7nsflVoP/view?usp=drive_link",
        quantity: "100 / 200 / 500 / 1000",
        singleSidePrice: "299 / 399 / 599 / 1099",
        bothSidePrice: "399 / 499 / 899 / 1399",
        description:
          "Gloss Lamination Visiting Cards feature a shiny, vibrant finish that makes colors appear richer and images more eye-catching. The glossy protective coating enhances durability while giving your business cards a polished, professional appearance. These cards are ideal for businesses that want bold, colorful designs with excellent visual impact. Perfect for retail stores, marketing agencies, photographers, restaurants, salons, and businesses looking to stand out with premium-quality printed cards.",
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
        singleSidePrice: "1299 / 1699",
        bothSidePrice: "1699 / 1999",
        description:
          "Promote your business, products, events, or special offers with professionally printed A5 Flyers. Printed on premium-quality paper using high-resolution digital or offset printing, our A5 flyers feature vibrant colors, sharp images, and a premium finish. Available in single or double-sided printing with matte or gloss lamination options, they are perfect for marketing campaigns, promotional events, restaurants, educational institutes, and retail businesses. Custom designs and fast delivery available.",
      },
      {
        name: "A4 Flyers",
        startingAt: 1999,
        image: driveImage("10Kkj5oe8XOhbqP3A_dikqJzJcQwb8wW5"),
        sourceImageUrl:
          "https://drive.google.com/file/d/10Kkj5oe8XOhbqP3A_dikqJzJcQwb8wW5/view?usp=drive_link",
        quantity: "1000 / 2000",
        singleSidePrice: "1999 / 2999",
        bothSidePrice: "2999 / 3999",
        description:
          "Our A4 Flyers provide ample space to showcase detailed information, product catalogs, service lists, or promotional campaigns. Printed on premium-quality paper with crisp text and vibrant colors, these flyers are ideal for business presentations, product launches, exhibitions, schools, healthcare, and corporate marketing. Choose from multiple paper GSM options and matte or gloss finishes to create a professional marketing material that leaves a lasting impression.",
      },
      {
        name: "Brochures",
        startingAt: 1999,
        image: driveImage("1Ay1NmELuTkfwvv8iBqUB1EFUH51Zocy7"),
        sourceImageUrl:
          "https://drive.google.com/file/d/1Ay1NmELuTkfwvv8iBqUB1EFUH51Zocy7/view?usp=drive_link",
        quantity: "500 / 1000",
        singleSidePrice: "1999 / 2999",
        bothSidePrice: "2999 / 3999",
        description:
          "Our Brochures are designed to present your business, products, and services in a professional and attractive way. Ideal for corporate profiles, real estate projects, hospitals, educational institutes, product catalogs, and marketing campaigns, these brochures are printed with high-quality paper and sharp color reproduction. Available in bi-fold, tri-fold, and multi-page formats with multiple finishing options, they help communicate your brand message effectively.",
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
        quantity: "Custom size",
        singleSidePrice: "25",
        description:
          "Our Vinyl Printing service is ideal for indoor and outdoor branding, advertising, and decorative applications. Printed using high-quality vinyl material with vibrant inks, it offers excellent durability, weather resistance, and long-lasting performance. Perfect for shop branding, wall graphics, vehicle graphics, glass stickers, product promotions, and signage. Available in matte, gloss, transparent, and custom-cut finishes for a professional brand presentation.",
      },
      {
        name: "One Way Vision Vinyl",
        startingAt: 35,
        image: "https://cpimg.tistatic.com/10337942/b/4/One-Way-Vision-Printing-Services..jpg",
        quantity: "Custom size",
        singleSidePrice: "35",
        description:
          "One Way Vision Vinyl is perfect for glass surfaces where you want attractive branding from the outside while maintaining visibility from the inside. Commonly used on office glass, shop windows, vehicles, malls, and commercial spaces, it provides privacy along with effective advertising. Printed with high-resolution graphics, it is durable, weather-resistant, and easy to apply, making it a smart solution for promotional and decorative glass branding.",
      },
      {
        name: "Frosted Vinyl",
        startingAt: 45,
        image: visuals[2],
        quantity: "Custom size",
        singleSidePrice: "45",
        description:
          "Frosted Vinyl is a stylish solution for glass partition branding, office privacy, and decorative interiors. It gives a premium etched-glass appearance while allowing light to pass through, making it ideal for corporate offices, clinics, salons, showrooms, restaurants, and meeting rooms. Available with custom patterns, logos, and cut designs, frosted vinyl adds elegance and privacy to any glass surface.",
      },
      {
        name: "Clear Transparent Vinyl",
        startingAt: 45,
        image:
          "https://image.made-in-china.com/365f3j00MmQbDikrbIqL/Printable-Clear-Transparent-Vinyl-Paper-for-Inkjet-Printer.webp",
        quantity: "Custom size",
        singleSidePrice: "45",
        description:
          "Clear Transparent Vinyl is ideal for premium glass branding, product labels, window graphics, and transparent sticker applications. It provides a clean and professional finish while allowing the background surface to remain visible. Suitable for offices, retail stores, product packaging, cafes, and promotional branding, this vinyl offers sharp print quality and excellent adhesive strength for a neat, long-lasting result.",
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
        image: visuals[0],
        quantity: "Custom size",
        description:
          "Star Flex Printing is a popular and cost-effective solution for banners, hoardings, promotional boards, event backdrops, and outdoor advertising. Printed on durable flex material with vibrant colors and sharp visibility, it is suitable for both indoor and outdoor use. Ideal for shops, events, political campaigns, exhibitions, sales promotions, and business branding, Star Flex provides strong visual impact at an affordable price.",
      },
      {
        name: "Eco Solvent Flex",
        startingAt: 35,
        image:
          "https://cpimg.tistatic.com/10927083/b/4/Eco-Solvent-Vinyl-Window-Graphics-Printing-Services.jpg",
        quantity: "Custom size",
        description:
          "Eco Solvent Flex Printing offers superior print quality with rich colors, smooth gradients, and long-lasting durability. It is suitable for premium indoor and outdoor branding where fine detailing and vibrant output are required. Commonly used for retail branding, exhibition displays, shop boards, banners, posters, and promotional graphics, eco solvent printing provides a cleaner finish with better color accuracy and durability.",
      },
      {
        name: "Black Back Printing",
        startingAt: 30,
        image: visuals[2],
        quantity: "Custom size",
        description:
          "Black Back Printing is ideal for high-opacity banners and displays where light blocking is required. The black backing prevents see-through effects and improves visibility, making it perfect for outdoor banners, event branding, promotional displays, and advertising boards. It offers strong color output, better readability, and a professional finish, especially in areas with strong lighting or overlapping backgrounds.",
      },
      {
        name: "Backlit Flex",
        startingAt: 45,
        image: visuals[3],
        quantity: "Custom size",
        description:
          "Backlit Flex Printing is designed for illuminated signboards, glow signs, light boxes, and premium display branding. It allows light to pass through evenly, making graphics appear bright, clear, and attractive at night or in indoor lighting setups. Perfect for retail stores, restaurants, showrooms, malls, and commercial signage, backlit flex ensures excellent visibility and a premium brand appearance.",
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
        singleSidePrice: "2499",
        description:
          "Our Letterhead Printing service helps businesses create professional and branded communication materials. Printed on high-quality paper with sharp logos, text, and brand colors, letterheads are ideal for official documents, quotations, invoices, proposals, and corporate communication. Suitable for companies, consultants, hospitals, schools, and professionals, our letterheads add credibility and consistency to your business identity.",
      },
      {
        name: "Envelopes",
        startingAt: 2699,
        image: visuals[1],
        quantity: "1000",
        singleSidePrice: "2699",
        description:
          "Custom Envelope Printing is perfect for businesses that want a professional and branded mailing solution. Printed with your company logo, address, and design, these envelopes are ideal for official letters, invoices, invitations, documents, and corporate communication. Available in multiple sizes and paper options, our envelopes help strengthen your brand identity with every dispatch.",
      },
      {
        name: "Receipt Books",
        startingAt: 1500,
        image: "https://m.media-amazon.com/images/I/71iG-bxy5WL.jpg",
        quantity: "5 book / 10 Book",
        singleSidePrice: "1500 / 1800",
        description:
          "Receipt Books are essential for shops, businesses, service providers, and organizations that need proper billing and payment records. Available in duplicate or triplicate formats with custom branding, numbering, and business details, our receipt books are printed on quality paper for clear writing and easy record keeping. Ideal for retail stores, offices, schools, societies, and service businesses.",
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
