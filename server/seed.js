import { pool } from "./db.js";

const visuals = [
  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=80",
];

const seedCatalog = [
  {
    slug: "visiting-cards",
    name: "Visiting Cards",
    eyebrow: "Make an impression",
    products: [
      {
        slug: "visiting-cards-standard-visiting-cards",
        name: "Standard Visiting Cards",
        starting_at: 300,
        quantity: "100 / 200 / 500 / 1000",
        single_side_price: "300 / 500 / 1200 / 1800",
        both_side_price: "450 / 750 / 1800 / 2700",
        image_url: visuals[0],
        description:
          "Standard visiting cards from the Excel sheet with printing type and quantity options.",
      },
      {
        slug: "visiting-cards-premium-visiting-cards",
        name: "Premium Visiting Cards",
        starting_at: 600,
        quantity: "100 / 200 / 500 / 1000",
        single_side_price: "600 / 900 / 1800 / 2200",
        both_side_price: "900 / 1350 / 2700 / 3300",
        image_url: visuals[1],
        description:
          "Premium visiting cards from the Excel sheet with printing type, quantity and corner type options.",
      },
    ],
  },
  {
    slug: "flyers-pamphlets",
    name: "Flyers",
    eyebrow: "Spread the word",
    products: [
      {
        slug: "flyers-pamphlets-90-gsm-flyers-glossy",
        name: "90 GSM Flyers (Glossy)",
        starting_at: 600,
        quantity: "100 / 200 / 500 / 1000 / 2000 / 5000 / 10000",
        single_side_price: "600 / 900 / 1200 / 1500 / 1800 / 4500 / 7200",
        both_side_price: "900 / 1350 / 1800 / 2250 / 2700 / 6750 / 10800",
        image_url: "/products/flyers-pamphlets-a5-flyers.webp",
        description:
          "90 GSM glossy flyers from the Excel sheet with size, printing type and quantity options.",
      },
    ],
  },
  {
    slug: "bill-book",
    name: "Bill Book",
    eyebrow: "Business records",
    products: [
      {
        slug: "bill-book-bill-book-b-w",
        name: "Bill Book B/W",
        starting_at: 600,
        quantity: "1 / 2 / 5 / 10 Books",
        single_side_price: "600 / 900 / 1200 / 1800",
        both_side_price: "900 / 1350 / 1800 / 2700",
        image_url: "/products/office-printing-receipt-books.jpg",
        description:
          "Black-and-white bill book from the Excel sheet with size, printing type, copy and numbering options.",
      },
      {
        slug: "bill-book-prescription-pads",
        name: "Prescription Pads",
        starting_at: 600,
        quantity: "1 / 2 / 5 / 10 Books",
        single_side_price: "600 / 900 / 1200 / 1800",
        both_side_price: "900 / 1350 / 1800 / 2700",
        image_url: visuals[1],
        description:
          "Prescription pad from the Excel sheet with size, printing type and book quantity options.",
      },
    ],
  },
  {
    slug: "letter-head",
    name: "Letter Head",
    eyebrow: "Official stationery",
    products: [
      {
        slug: "letter-head-letterheads",
        name: "Letterheads",
        starting_at: 500,
        quantity: "100 / 200 / 500 / 1000",
        single_side_price: "500 / 800 / 1500 / 2000",
        both_side_price: "750 / 1200 / 2250 / 3000",
        image_url: "/products/office-printing-letterheads.jpg",
        description: "Letterhead printing from the Excel sheet with quantity option.",
      },
    ],
  },
  {
    slug: "envelope",
    name: "Envelope",
    eyebrow: "Branded mailers",
    products: [
      {
        slug: "envelope-envelopes",
        name: "Envelopes",
        starting_at: 700,
        quantity: "100 / 200 / 500 / 1000",
        single_side_price: "700 / 1200 / 1800 / 2400",
        both_side_price: "1050 / 1800 / 2700 / 3600",
        image_url: "/products/office-printing-envelopes.jpg",
        description: "Envelope printing from the Excel sheet with quantity option.",
      },
    ],
  },
  {
    slug: "stickers-labels",
    name: "Stickers",
    eyebrow: "Stick with your brand",
    products: [
      {
        slug: "stickers-labels-paper-sticker",
        name: "Paper Sticker",
        starting_at: 299,
        quantity: "500",
        image_url: visuals[0],
        description:
          "Paper sticker from the Excel sheet with size, custom width, custom height and quantity options.",
      },
      {
        slug: "stickers-labels-non-tearable-sticker",
        name: "Non Tearable Sticker",
        starting_at: 399,
        quantity: "500",
        image_url: visuals[1],
        description:
          "Non tearable sticker from the Excel sheet with size, custom width, custom height and quantity options.",
      },
    ],
  },
  {
    slug: "flex-printing",
    name: "Flex Printing",
    eyebrow: "Built for visibility",
    products: [
      {
        slug: "flex-printing-regular-flex",
        name: "Regular Flex",
        starting_at: 22,
        quantity: "2",
        image_url: "/products/flex-printing-star-flex-printing.webp",
        description:
          "Regular flex from the Excel sheet with size, custom width, custom height and quantity options.",
      },
    ],
  },
  {
    slug: "vinyl-printing",
    name: "Vinyl Printing",
    eyebrow: "Transform every surface",
    products: [
      {
        slug: "vinyl-printing-vinyl-printing",
        name: "Vinyl Printing",
        starting_at: 25,
        quantity: "2",
        single_side_price: "25",
        image_url: "/products/vinyl-printing-vinyl-printing.jpg",
        description:
          "Vinyl printing from the Excel sheet with size, custom width, custom height, lamination and quantity options.",
      },
    ],
  },
  {
    slug: "sunboard",
    name: "Sunboard",
    eyebrow: "Mounted brand display",
    products: [
      {
        slug: "sunboard-sunboard",
        name: "Sunboard",
        starting_at: 999,
        quantity: "2",
        image_url: visuals[2],
        description:
          "Sunboard from the Excel sheet with size, custom width, custom height, lamination, sunboard thickness and quantity options.",
      },
    ],
  },
  {
    slug: "brochure-book",
    name: "Brochure / Book",
    eyebrow: "Tell your full story",
    products: [
      {
        slug: "brochure-book-brochures",
        name: "Brochures",
        starting_at: 1999,
        quantity: "100",
        single_side_price: "1999 / 2999",
        both_side_price: "2999 / 3999",
        image_url: visuals[2],
        description:
          "Brochure/book product from the Excel sheet with size, pages, folding, cover, inner paper, lamination, binding and quantity options.",
      },
    ],
  },
];

const defaultSettings = [
  {
    key: "announcement_bar_text",
    label: "Announcement bar text",
    value: "YOUR TRUSTED PRINTING PARTNER FOR FAST & QUALITY PRINTS.",
  },
  { key: "home_hero_1_image", label: "Homepage banner image 1", value: "" },
  { key: "home_hero_2_image", label: "Homepage banner image 2", value: "" },
  { key: "home_hero_3_image", label: "Homepage banner image 3", value: "" },
  { key: "home_hero_1_eyebrow", label: "Hero 1 eyebrow", value: "Business essentials" },
  {
    key: "home_hero_1_title",
    label: "Hero 1 title",
    value: "Premium visiting cards, flyers and brand stationery.",
  },
  {
    key: "home_hero_1_text",
    label: "Hero 1 description",
    value: "Create a polished first impression with sharp print quality and custom finishes.",
  },
  { key: "home_hero_1_button", label: "Hero 1 button text", value: "Explore products" },
  { key: "home_hero_1_slug", label: "Hero 1 button category slug", value: "visiting-cards" },
  { key: "home_hero_2_eyebrow", label: "Hero 2 eyebrow", value: "Outdoor visibility" },
  {
    key: "home_hero_2_title",
    label: "Hero 2 title",
    value: "Flex, vinyl, sunboard and signage that gets noticed.",
  },
  {
    key: "home_hero_2_text",
    label: "Hero 2 description",
    value: "Durable branding for shops, events, exhibitions and local promotions.",
  },
  { key: "home_hero_2_button", label: "Hero 2 button text", value: "Shop signage" },
  { key: "home_hero_2_slug", label: "Hero 2 button category slug", value: "flex-printing" },
  { key: "home_hero_3_eyebrow", label: "Hero 3 eyebrow", value: "Custom print jobs" },
  {
    key: "home_hero_3_title",
    label: "Hero 3 title",
    value: "Labels, stickers, brochures and packaging print.",
  },
  {
    key: "home_hero_3_text",
    label: "Hero 3 description",
    value: "Choose practical materials, sharp finishing and local support for every print job.",
  },
  { key: "home_hero_3_button", label: "Hero 3 button text", value: "Get a quote" },
  { key: "home_hero_3_slug", label: "Hero 3 button category slug", value: "brochure-book" },
  { key: "home_promo_left_image", label: "Left promo image", value: "" },
  { key: "home_promo_right_image", label: "Right promo image", value: "" },
  {
    key: "home_promo_left_eyebrow",
    label: "Left promo eyebrow",
    value: "Preserve a premium first impression",
  },
  {
    key: "home_promo_left_title",
    label: "Left promo title",
    value: "Print polished brochures, letter heads and bill books.",
  },
  {
    key: "home_promo_right_eyebrow",
    label: "Right promo eyebrow",
    value: "Wear and display your brand",
  },
  {
    key: "home_promo_right_title",
    label: "Right promo title",
    value: "Custom stickers, flex, vinyl and sunboard prints for teams and events.",
  },
  { key: "business_phone_display", label: "Phone display text", value: "+91 85548 42103" },
  { key: "business_phone_link", label: "Phone link number", value: "+918554842103" },
  { key: "business_whatsapp_number", label: "WhatsApp number", value: "918554842103" },
  { key: "business_email", label: "Email address", value: "Moryaprintingweb@gmail.com" },
  {
    key: "business_address",
    label: "Business address",
    value: "Shop No. 3, Jeet Building, near Jeet Ground, Lokmanya Colony, Kothrud, Pune 411038",
  },
  {
    key: "business_maps_url",
    label: "Google Maps URL",
    value: "https://maps.app.goo.gl/TSBbNMXqBig85rtJ9",
  },
  {
    key: "business_google_url",
    label: "Google Business Profile URL",
    value: "https://share.google/3stt5fmHZPr0ByYUY",
  },
];

const defaultBlogPosts = [
  {
    title: "Importance of Professional Printing for Businesses",
    slug: "importance-of-professional-printing-for-businesses",
    excerpt: "Why quality printing still shapes brand perception in a digital-first world.",
    content:
      "Professional printing gives your business a sharper first impression. Visiting cards, brochures, flyers, menus, invoices and packaging labels are often handled by customers before they speak to your team.\n\nGood paper, clean color, correct alignment and neat finishing make the brand feel reliable. Poor print quality can quietly reduce trust, even when the product or service is strong.\n\nFor local businesses, consistent printed material also helps customers remember the name, phone number, address and offer. That is why print still matters alongside websites, WhatsApp and social media.",
    imageUrl: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=1000",
    tag: "Printing",
    publishedAt: "Jun 2026",
  },
  {
    title: "How LED Signage Helps Brand Visibility",
    slug: "how-led-signage-helps-brand-visibility",
    excerpt: "The measurable impact of illuminated signage on foot traffic and recall.",
    content:
      "LED signage helps a shop or office stay visible in crowded streets, evening traffic and low-light conditions. A clear illuminated board can guide walk-in customers from a distance.\n\nThe biggest benefit is recall. When people pass the same location daily, a bright and readable sign helps them remember the business name when they need that service later.\n\nFor best results, keep the message short, use strong contrast and choose durable materials suitable for the location.",
    imageUrl: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1000",
    tag: "Signage",
    publishedAt: "May 2026",
  },
  {
    title: "Why Corporate Branding Matters",
    slug: "why-corporate-branding-matters",
    excerpt: "Consistent branding across every touchpoint builds unshakeable trust.",
    content:
      "Corporate branding is not only a logo. It includes the colors, fonts, tone, packaging, business stationery, signage and every printed item customers see.\n\nWhen these materials look consistent, the business feels organized and dependable. This is especially important for companies that meet clients, send quotations, deliver products or run events.\n\nA practical way to begin is by standardizing visiting cards, letterheads, envelopes, brochures, ID cards and presentation folders.",
    imageUrl: "https://images.unsplash.com/photo-1611095973763-414019e72400?w=1000",
    tag: "Branding",
    publishedAt: "Apr 2026",
  },
  {
    title: "Benefits of High-Quality Packaging Labels",
    slug: "benefits-of-high-quality-packaging-labels",
    excerpt: "How premium labels influence purchase decisions and reduce returns.",
    content:
      "Packaging labels carry important details such as brand name, product type, price, ingredients, usage instructions, batch information and contact details.\n\nHigh-quality labels make products look more professional on shelves and during delivery. They also reduce confusion by keeping information readable and durable.\n\nChoose label material based on where the product will be used. Paper stickers work for many indoor products, while non-tearable or waterproof options are better for tougher handling.",
    imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1000",
    tag: "Packaging",
    publishedAt: "Mar 2026",
  },
  {
    title: "Digital Printing vs Offset Printing",
    slug: "digital-printing-vs-offset-printing",
    excerpt: "Which technology fits your project - a practical decision framework.",
    content:
      "Digital printing is usually faster for small quantities and quick changes. It works well for short-run visiting cards, flyers, stickers, certificates and urgent marketing material.\n\nOffset printing is often better for large quantities where color consistency and per-piece cost matter. It is commonly used for bulk brochures, books, packaging and stationery.\n\nThe right choice depends on quantity, deadline, paper, finishing, budget and whether the artwork may change later.",
    imageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1000",
    tag: "Guide",
    publishedAt: "Feb 2026",
  },
];

export async function seedIfEmpty() {
  for (const [index, category] of seedCatalog.entries()) {
    await pool.execute(
      `INSERT INTO categories (slug, name, eyebrow, sort_order)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        eyebrow = VALUES(eyebrow),
        sort_order = VALUES(sort_order)`,
      [category.slug, category.name, category.eyebrow, index],
    );

    const [[savedCategory]] = await pool.execute("SELECT id FROM categories WHERE slug = ?", [
      category.slug,
    ]);

    for (const product of category.products) {
      await pool.execute(
        `INSERT INTO products
          (category_id, slug, name, description, image_url, starting_at, quantity, single_side_price, both_side_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          category_id = VALUES(category_id),
          name = VALUES(name),
          description = VALUES(description),
          image_url = VALUES(image_url),
          starting_at = VALUES(starting_at),
          quantity = VALUES(quantity),
          single_side_price = VALUES(single_side_price),
          both_side_price = VALUES(both_side_price)`,
        [
          savedCategory.id,
          product.slug,
          product.name,
          product.description,
          product.image_url,
          product.starting_at,
          product.quantity,
          product.single_side_price ?? null,
          product.both_side_price ?? null,
        ],
      );
    }
  }

  for (const setting of defaultSettings) {
    await pool.execute(
      `INSERT INTO site_settings (setting_key, setting_value, label)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE label = VALUES(label)`,
      [setting.key, setting.value, setting.label],
    );
  }

  for (const post of defaultBlogPosts) {
    await pool.execute(
      `INSERT INTO blog_posts (title, slug, excerpt, content, image_url, tag, published_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        excerpt = VALUES(excerpt),
        content = VALUES(content),
        image_url = VALUES(image_url),
        tag = VALUES(tag),
        published_at = VALUES(published_at)`,
      [
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.imageUrl,
        post.tag,
        post.publishedAt,
      ],
    );
  }
}
