USE morya_prints;

INSERT INTO categories (slug, name, eyebrow, sort_order) VALUES
('visiting-cards', 'Visiting Cards', 'Make an impression', 0),
('flyers-pamphlets', 'Flyers', 'Spread the word', 1),
('bill-book', 'Bill Book', 'Business records', 2),
('letter-head', 'Letter Head', 'Official stationery', 3),
('envelope', 'Envelope', 'Branded mailers', 4),
('stickers-labels', 'Stickers', 'Stick with your brand', 5),
('flex-printing', 'Flex Printing', 'Built for visibility', 6),
('vinyl-printing', 'Vinyl Printing', 'Transform every surface', 7),
('sunboard', 'Sunboard', 'Mounted brand display', 8),
('brochure-book', 'Brochure / Book', 'Tell your full story', 9)
ON DUPLICATE KEY UPDATE
name = VALUES(name),
eyebrow = VALUES(eyebrow),
sort_order = VALUES(sort_order);

INSERT INTO products
(category_id, slug, name, description, image_url, starting_at, quantity, single_side_price, both_side_price, offer_label, offer_percent, offer_active)
SELECT c.id, p.slug, p.name, p.description, p.image_url, p.starting_at, p.quantity, p.single_side_price, p.both_side_price, p.offer_label, p.offer_percent, p.offer_active
FROM (
  SELECT 'visiting-cards' category_slug, 'visiting-cards-standard-visiting-cards' slug, 'Standard Visiting Cards' name, 'Standard visiting cards from the Excel sheet with printing type and quantity options.' description, 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80' image_url, 300 starting_at, '100 / 200 / 500 / 1000' quantity, '300 / 500 / 1200 / 1800' single_side_price, '450 / 750 / 1800 / 2700' both_side_price, NULL offer_label, 0 offer_percent, 0 offer_active
  UNION ALL SELECT 'visiting-cards', 'visiting-cards-premium-visiting-cards', 'Premium Visiting Cards', 'Premium visiting cards from the Excel sheet with printing type, quantity and corner type options.', 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80', 600, '100 / 200 / 500 / 1000', '600 / 900 / 1800 / 2200', '900 / 1350 / 2700 / 3300', NULL, 0, 0
  UNION ALL SELECT 'flyers-pamphlets', 'flyers-pamphlets-90-gsm-flyers-glossy', '90 GSM Flyers (Glossy)', '90 GSM glossy flyers from the Excel sheet with size, printing type and quantity options.', '/products/flyers-pamphlets-a5-flyers.webp', 600, '100 / 200 / 500 / 1000 / 2000 / 5000 / 10000', '600 / 900 / 1200 / 1500 / 1800 / 4500 / 7200', '900 / 1350 / 1800 / 2250 / 2700 / 6750 / 10800', NULL, 0, 0
  UNION ALL SELECT 'bill-book', 'bill-book-bill-book-b-w', 'Bill Book B/W', 'Black-and-white bill book from the Excel sheet with size, printing type, copy and numbering options.', '/products/office-printing-receipt-books.jpg', 600, '1 / 2 / 5 / 10 Books', '600 / 900 / 1200 / 1800', '900 / 1350 / 1800 / 2700', NULL, 0, 0
  UNION ALL SELECT 'bill-book', 'bill-book-prescription-pads', 'Prescription Pads', 'Prescription pad from the Excel sheet with size, printing type and book quantity options.', 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80', 600, '1 / 2 / 5 / 10 Books', '600 / 900 / 1200 / 1800', '900 / 1350 / 1800 / 2700', NULL, 0, 0
  UNION ALL SELECT 'letter-head', 'letter-head-letterheads', 'Letterheads', 'Letterhead printing from the Excel sheet with quantity option.', '/products/office-printing-letterheads.jpg', 500, '100 / 200 / 500 / 1000', '500 / 800 / 1500 / 2000', '750 / 1200 / 2250 / 3000', NULL, 0, 0
  UNION ALL SELECT 'envelope', 'envelope-envelopes', 'Envelopes', 'Envelope printing from the Excel sheet with quantity option.', '/products/office-printing-envelopes.jpg', 700, '100 / 200 / 500 / 1000', '700 / 1200 / 1800 / 2400', '1050 / 1800 / 2700 / 3600', NULL, 0, 0
  UNION ALL SELECT 'stickers-labels', 'stickers-labels-paper-sticker', 'Paper Sticker', 'Paper sticker from the Excel sheet with size, custom width, custom height and quantity options.', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80', 299, '500', NULL, NULL, NULL, 0, 0
  UNION ALL SELECT 'stickers-labels', 'stickers-labels-non-tearable-sticker', 'Non Tearable Sticker', 'Non tearable sticker from the Excel sheet with size, custom width, custom height and quantity options.', 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80', 399, '500', NULL, NULL, NULL, 0, 0
  UNION ALL SELECT 'flex-printing', 'flex-printing-regular-flex', 'Regular Flex', 'Regular flex from the Excel sheet with size, custom width, custom height and quantity options.', '/products/flex-printing-star-flex-printing.webp', 22, '2', NULL, NULL, NULL, 0, 0
  UNION ALL SELECT 'vinyl-printing', 'vinyl-printing-vinyl-printing', 'Vinyl Printing', 'Vinyl printing from the Excel sheet with size, custom width, custom height, lamination and quantity options.', '/products/vinyl-printing-vinyl-printing.jpg', 25, '2', '25', NULL, NULL, 0, 0
  UNION ALL SELECT 'sunboard', 'sunboard-sunboard', 'Sunboard', 'Sunboard from the Excel sheet with size, custom width, custom height, lamination, sunboard thickness and quantity options.', 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=900&q=80', 999, '2', NULL, NULL, NULL, 0, 0
  UNION ALL SELECT 'brochure-book', 'brochure-book-brochures', 'Brochures', 'Brochure/book product from the Excel sheet with size, pages, folding, cover, inner paper, lamination, binding and quantity options.', 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=900&q=80', 1999, '100', '1999 / 2999', '2999 / 3999', NULL, 0, 0
) p
JOIN categories c ON c.slug = p.category_slug
ON DUPLICATE KEY UPDATE
category_id = VALUES(category_id),
name = VALUES(name),
description = VALUES(description),
image_url = VALUES(image_url),
starting_at = VALUES(starting_at),
quantity = VALUES(quantity),
single_side_price = VALUES(single_side_price),
both_side_price = VALUES(both_side_price),
offer_label = VALUES(offer_label),
offer_percent = VALUES(offer_percent),
offer_active = VALUES(offer_active);

INSERT INTO site_settings (setting_key, setting_value, label) VALUES
('announcement_bar_text', 'YOUR TRUSTED PRINTING PARTNER FOR FAST & QUALITY PRINTS.', 'Announcement bar text'),
('home_hero_1_image', '', 'Homepage banner image 1'),
('home_hero_2_image', '', 'Homepage banner image 2'),
('home_hero_3_image', '', 'Homepage banner image 3'),
('home_hero_1_eyebrow', 'Business essentials', 'Hero 1 eyebrow'),
('home_hero_1_title', 'Premium visiting cards, flyers and brand stationery.', 'Hero 1 title'),
('home_hero_1_text', 'Create a polished first impression with sharp print quality and custom finishes.', 'Hero 1 description'),
('home_hero_1_button', 'Explore products', 'Hero 1 button text'),
('home_hero_1_slug', 'visiting-cards', 'Hero 1 button category slug'),
('home_hero_2_eyebrow', 'Outdoor visibility', 'Hero 2 eyebrow'),
('home_hero_2_title', 'Flex, vinyl, sunboard and signage that gets noticed.', 'Hero 2 title'),
('home_hero_2_text', 'Durable branding for shops, events, exhibitions and local promotions.', 'Hero 2 description'),
('home_hero_2_button', 'Shop signage', 'Hero 2 button text'),
('home_hero_2_slug', 'flex-printing', 'Hero 2 button category slug'),
('home_hero_3_eyebrow', 'Custom print jobs', 'Hero 3 eyebrow'),
('home_hero_3_title', 'Labels, stickers, brochures and packaging print.', 'Hero 3 title'),
('home_hero_3_text', 'Choose practical materials, sharp finishing and local support for every print job.', 'Hero 3 description'),
('home_hero_3_button', 'Get a quote', 'Hero 3 button text'),
('home_hero_3_slug', 'brochure-book', 'Hero 3 button category slug'),
('home_promo_left_image', '', 'Left promo image'),
('home_promo_right_image', '', 'Right promo image'),
('home_promo_left_eyebrow', 'Preserve a premium first impression', 'Left promo eyebrow'),
('home_promo_left_title', 'Print polished brochures, letter heads and bill books.', 'Left promo title'),
('home_promo_right_eyebrow', 'Wear and display your brand', 'Right promo eyebrow'),
('home_promo_right_title', 'Custom stickers, flex, vinyl and sunboard prints for teams and events.', 'Right promo title'),
('business_phone_display', '+91 85548 42103', 'Phone display text'),
('business_phone_link', '+918554842103', 'Phone link number'),
('business_whatsapp_number', '918554842103', 'WhatsApp number'),
('business_email', 'Moryaprintingweb@gmail.com', 'Email address'),
('business_address', 'Shop No. 3, Jeet Building, near Jeet Ground, Lokmanya Colony, Kothrud, Pune 411038', 'Business address'),
('business_maps_url', 'https://maps.app.goo.gl/TSBbNMXqBig85rtJ9', 'Google Maps URL'),
('business_google_url', 'https://share.google/3stt5fmHZPr0ByYUY', 'Google Business Profile URL')
ON DUPLICATE KEY UPDATE label = VALUES(label);
