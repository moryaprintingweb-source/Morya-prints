import type { CatalogProduct } from "../data/catalog";

type PriceTier = {
  quantity: number;
  single: number;
  both?: number;
};

type FixedPriceRule = {
  kind: "fixed";
  tiers: PriceTier[];
  cornerAddOn?: number;
  duplicateAddOnRate?: number;
};

type AreaPriceRule = {
  kind: "area";
  unit: "inch" | "ft";
  base: number;
  rate: number;
  laminationRate?: number;
  sunboardRate?: number;
};

type PriceRule = FixedPriceRule | AreaPriceRule;

export type CalculatedPrice = {
  amount: number;
  label: string;
};

const fixedRules: Record<string, FixedPriceRule> = {
  "visiting-cards-standard-visiting-cards": {
    kind: "fixed",
    tiers: [
      { quantity: 100, single: 300, both: 450 },
      { quantity: 200, single: 500, both: 750 },
      { quantity: 500, single: 1200, both: 1800 },
      { quantity: 1000, single: 1800, both: 2700 },
    ],
  },
  "visiting-cards-premium-visiting-cards": {
    kind: "fixed",
    cornerAddOn: 300,
    tiers: [
      { quantity: 100, single: 600, both: 900 },
      { quantity: 200, single: 900, both: 1350 },
      { quantity: 500, single: 1800, both: 2700 },
      { quantity: 1000, single: 2200, both: 3300 },
    ],
  },
  "flyers-pamphlets-90-gsm-flyers-glossy": {
    kind: "fixed",
    tiers: [
      { quantity: 100, single: 600, both: 900 },
      { quantity: 200, single: 900, both: 1350 },
      { quantity: 500, single: 1200, both: 1800 },
      { quantity: 1000, single: 1500, both: 2250 },
      { quantity: 2000, single: 1800, both: 2700 },
      { quantity: 5000, single: 4500, both: 6750 },
      { quantity: 10000, single: 7200, both: 10800 },
    ],
  },
  "bill-book-bill-book-b-w": {
    kind: "fixed",
    duplicateAddOnRate: 0.2,
    tiers: [
      { quantity: 1, single: 600, both: 900 },
      { quantity: 2, single: 900, both: 1350 },
      { quantity: 5, single: 1200, both: 1800 },
      { quantity: 10, single: 1800, both: 2700 },
    ],
  },
  "bill-book-prescription-pads": {
    kind: "fixed",
    tiers: [
      { quantity: 1, single: 600, both: 900 },
      { quantity: 2, single: 900, both: 1350 },
      { quantity: 5, single: 1200, both: 1800 },
      { quantity: 10, single: 1800, both: 2700 },
    ],
  },
  "letter-head-letterheads": {
    kind: "fixed",
    tiers: [
      { quantity: 100, single: 500, both: 750 },
      { quantity: 200, single: 800, both: 1200 },
      { quantity: 500, single: 1500, both: 2250 },
      { quantity: 1000, single: 2000, both: 3000 },
    ],
  },
  "envelope-envelopes": {
    kind: "fixed",
    tiers: [
      { quantity: 100, single: 700, both: 1050 },
      { quantity: 200, single: 1200, both: 1800 },
      { quantity: 500, single: 1800, both: 2700 },
      { quantity: 1000, single: 2400, both: 3600 },
    ],
  },
};

const areaRules: Record<string, AreaPriceRule> = {
  "stickers-labels-paper-sticker": {
    kind: "area",
    unit: "inch",
    base: 100,
    rate: 0.6,
  },
  "stickers-labels-non-tearable-sticker": {
    kind: "area",
    unit: "inch",
    base: 100,
    rate: 0.6,
  },
  "flex-printing-regular-flex": {
    kind: "area",
    unit: "ft",
    base: 100,
    rate: 8,
  },
  "vinyl-printing-vinyl-printing": {
    kind: "area",
    unit: "ft",
    base: 100,
    rate: 25,
    laminationRate: 10,
  },
  "sunboard-sunboard": {
    kind: "area",
    unit: "ft",
    base: 100,
    rate: 25,
    laminationRate: 10,
    sunboardRate: 30,
  },
};

const priceRules: Record<string, PriceRule> = {
  ...fixedRules,
  ...areaRules,
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function getProductPriceTiers(product: Pick<CatalogProduct, "slug">) {
  const rule = fixedRules[product.slug];
  if (!rule) return null;
  return rule.tiers;
}

export function calculateProductPrice(
  product: Pick<CatalogProduct, "slug" | "startingAt">,
  selections: Record<string, string>,
): CalculatedPrice {
  const rule = priceRules[product.slug];
  if (!rule) return { amount: product.startingAt, label: `Rs. ${formatPrice(product.startingAt)}` };

  if (rule.kind === "area") {
    const quantity = parseNumber(selections.quantity) || 1;
    const { width, height } = getDimensions(selections, rule.unit);
    const area = Math.max(width, 0) * Math.max(height, 0);
    const lamination =
      selections.lamination && rule.laminationRate ? area * rule.laminationRate * quantity : 0;
    const sunboard = rule.sunboardRate ? area * rule.sunboardRate * quantity : 0;
    const amount = rule.base + area * rule.rate * quantity + lamination + sunboard;

    return { amount, label: `Rs. ${formatPrice(amount)}` };
  }

  const quantity = parseNumber(selections.quantity) || rule.tiers[0].quantity;
  const printType = selections.printingType?.toLowerCase().includes("both") ? "both" : "single";
  const base = priceForQuantity(rule.tiers, quantity, printType);
  const cornerAddOn =
    rule.cornerAddOn && selections.cornerType && selections.cornerType !== "Square Corners"
      ? rule.cornerAddOn
      : 0;
  const duplicateAddOn =
    rule.duplicateAddOnRate && selections.copies?.includes("2 Duplicate")
      ? base * rule.duplicateAddOnRate
      : 0;
  const amount = base + cornerAddOn + duplicateAddOn;

  return { amount, label: `Rs. ${formatPrice(amount)}` };
}

function priceForQuantity(tiers: PriceTier[], quantity: number, printType: "single" | "both") {
  const ordered = [...tiers].sort((a, b) => a.quantity - b.quantity);
  const priceAt = (tier: PriceTier) =>
    printType === "both" ? (tier.both ?? tier.single * 1.5) : tier.single;
  const exactTier = ordered.find((tier) => tier.quantity === quantity);
  if (exactTier) return priceAt(exactTier);

  const nextTier = ordered.find((tier) => quantity <= tier.quantity);
  if (nextTier) return priceAt(nextTier);

  const largestTier = ordered[ordered.length - 1];
  return (quantity * priceAt(largestTier)) / largestTier.quantity;
}

function getDimensions(selections: Record<string, string>, unit: "inch" | "ft") {
  const customWidth = parseNumber(selections.width);
  const customHeight = parseNumber(selections.height);
  if (customWidth && customHeight) return { width: customWidth, height: customHeight };

  const match = selections.size?.match(/([\d.]+)\D+([\d.]+)/);
  if (!match) return { width: unit === "inch" ? 1 : 1, height: unit === "inch" ? 1 : 1 };

  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function parseNumber(value?: string) {
  if (!value) return 0;
  const match = value.replace(/,/g, "").match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}
