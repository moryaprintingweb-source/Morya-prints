import type { CatalogProduct } from "./catalog";

export type ProductOption = {
  id: string;
  label: string;
  type: "select" | "text" | "number";
  values?: string[];
  placeholder?: string;
  suffix?: string;
  required?: boolean;
  showWhen?: { optionId: string; value: string };
};

export type SelectedProductOption = {
  id: string;
  label: string;
  value: string;
};

const printSides: ProductOption = {
  id: "printingType",
  label: "Printing Type",
  type: "select",
  values: ["Single Side", "Both Sides"],
  required: true,
};

const paperSizes = ["A5 (148 × 210 mm)", "A4 (210 × 297 mm)", "A3 (297 × 420 mm)"];
const stickerSizes = [
  "1 × 1 inch",
  "1.25 × 1.25 inch",
  "1.5 × 1.5 inch",
  "1.75 × 1.75 inch",
  "2 × 2 inch",
  "2.25 × 2.25 inch",
  "2.5 × 2.5 inch",
  "2.75 × 2.75 inch",
  "3 × 3 inch",
  "3.25 × 3.25 inch",
  "3.5 × 3.5 inch",
  "4 × 4 inch",
  "5 × 5 inch",
  "5.5 × 5.5 inch",
  "6 × 6 inch",
  "7 × 7 inch",
  "8 × 8 inch",
  "8.5 × 8.5 inch",
  "Custom Size",
];

const largeFormatSizes = [
  "1 × 1 ft",
  "1 × 1.5 ft",
  "2 × 1 ft",
  "2 × 1.5 ft",
  "2 × 2 ft",
  "3 × 2 ft",
  "3 × 3 ft",
  "3 × 4 ft",
  "3 × 5 ft",
  "3 × 6 ft",
  "3 × 8 ft",
  "3 × 10 ft",
  "4 × 5 ft",
  "4 × 6 ft",
  "4 × 8 ft",
  "5 × 5 ft",
  "5 × 6 ft",
  "5 × 8 ft",
  "5 × 10 ft",
  "6 × 6 ft",
  "6 × 8 ft",
  "8 × 5 ft",
  "8 × 8 ft",
  "8 × 10 ft",
  "10 × 10 ft",
  "10 × 12 ft",
  "10 × 15 ft",
  "10 × 20 ft",
  "10 × 25 ft",
  "10 × 30 ft",
  "Custom Size",
];

const standardQuantities = ["100", "200", "500", "1,000"];
const extendedQuantities = [
  "10",
  "20",
  "30",
  "50",
  "100",
  "200",
  "500",
  "1,000",
  "2,000",
  "3,000",
  "5,000",
  "10,000",
];

const select = (id: string, label: string, values: string[]): ProductOption => ({
  id,
  label,
  type: "select",
  values,
  required: true,
});

const customDimensions = (suffix: "inch" | "ft"): ProductOption[] => [
  {
    id: "width",
    label: "Width",
    type: "number",
    placeholder: "Enter width",
    suffix,
    required: true,
    showWhen: { optionId: "size", value: "Custom Size" },
  },
  {
    id: "height",
    label: "Height",
    type: "number",
    placeholder: "Enter height",
    suffix,
    required: true,
    showWhen: { optionId: "size", value: "Custom Size" },
  },
];

const cardOptions: ProductOption[] = [
  printSides,
  select("cornerType", "Corner Type", ["Square Corners", "Rounded Corners"]),
  select("quantity", "Quantity", standardQuantities),
];

const flyerOptions: ProductOption[] = [
  select("size", "Size", paperSizes),
  printSides,
  select("quantity", "Quantity", ["500", "1,000", "2,000", "3,000", "5,000", "10,000"]),
];

const billBookOptions: ProductOption[] = [
  select("size", "Size", paperSizes),
  printSides,
  select("quantity", "Books", ["1 Book", "2 Books", "5 Books", "10 Books"]),
  select("copies", "Copies", ["Original", "Original + 1 Duplicate", "Original + 2 Duplicates"]),
  select("numbering", "Numbering", ["No", "Yes"]),
  {
    id: "numberingFrom",
    label: "Numbering From",
    type: "number",
    placeholder: "Enter starting number",
    required: true,
    showWhen: { optionId: "numbering", value: "Yes" },
  },
];

const prescriptionPadOptions: ProductOption[] = [
  select("size", "Size", paperSizes),
  printSides,
  select("quantity", "Books", ["1 Book", "2 Books", "5 Books", "10 Books"]),
];

const stickerOptions: ProductOption[] = [
  select("size", "Size", stickerSizes),
  ...customDimensions("inch"),
  select("quantity", "Quantity", extendedQuantities),
];

const largeFormatOptions = (includeLamination: boolean): ProductOption[] => [
  select("size", "Size", largeFormatSizes),
  ...customDimensions("ft"),
  ...(includeLamination ? [select("lamination", "Lamination", ["Gloss", "Matte"])] : []),
  select("quantity", "Quantity", ["1", "2", "3", "4", "5", "10", "20"]),
];

const sunboardOptions: ProductOption[] = [
  select("size", "Size", largeFormatSizes),
  ...customDimensions("ft"),
  select("lamination", "Lamination", ["Gloss", "Matte"]),
  select("sunboard", "Sunboard", ["3 MM", "5 MM", "10 MM"]),
  select("quantity", "Quantity", ["1", "2", "3", "4", "5", "10", "20"]),
];

const brochureOptions: ProductOption[] = [
  select("size", "Size", [...paperSizes, "Custom Size"]),
  ...customDimensions("inch"),
  select("pages", "Pages", ["4", "8", "16", "20", "24", "28", "32", "36", "40", "44", "48", "52"]),
  select("folding", "Folding", ["Single Fold", "Bi-Fold", "Tri-Fold"]),
  select("cover", "Cover", [
    "100 GSM",
    "130 GSM",
    "170 GSM",
    "250 GSM with Lamination",
    "300 GSM with Lamination",
    "350 GSM with Lamination",
  ]),
  select("inner", "Inner Paper", [
    "100 GSM",
    "130 GSM",
    "170 GSM",
    "250 GSM with Lamination",
    "300 GSM with Lamination",
    "350 GSM with Lamination",
  ]),
  select("lamination", "Lamination", ["Gloss", "Matte"]),
  select("binding", "Binding", [
    "Perfect Binding",
    "Spiral Binding",
    "Wire-O Binding",
    "Comb Binding",
  ]),
  select("quantity", "Quantity", ["1", "2", "3", "4", "5", "10", "20", "50", "100", "200", "500"]),
];

const simpleQuantity = (values = extendedQuantities): ProductOption[] => [
  select("quantity", "Quantity", values),
];

export function getProductOptions(product: CatalogProduct): ProductOption[] {
  const category = product.category.slug;
  const name = product.name.toLowerCase();

  if (category === "visiting-cards") return cardOptions;
  if (category === "flyers-pamphlets") {
    return name.includes("brochure") ? brochureOptions : flyerOptions;
  }
  if (category === "office-printing") {
    if (name.includes("receipt") || name.includes("bill book")) return billBookOptions;
    if (name.includes("prescription")) return prescriptionPadOptions;
    if (name.includes("company profile")) return brochureOptions;
    return simpleQuantity();
  }
  if (category === "stickers-labels") return stickerOptions;
  if (category === "flex-printing") return largeFormatOptions(false);
  if (category === "vinyl-printing") return largeFormatOptions(true);
  if (category === "signage-boards" && name.includes("sunboard")) return sunboardOptions;
  if (category === "catalogues") return brochureOptions;

  const values = product.quantity
    .split("/")
    .map((value) => value.trim())
    .filter((value) => /^\d/.test(value));
  return simpleQuantity(values.length ? values : ["1"]);
}

export function getDefaultSelections(options: ProductOption[]) {
  return Object.fromEntries(options.map((option) => [option.id, option.values?.[0] ?? ""]));
}

export function getVisibleSelections(
  options: ProductOption[],
  selections: Record<string, string>,
): SelectedProductOption[] {
  return options
    .filter(
      (option) =>
        !option.showWhen || selections[option.showWhen.optionId] === option.showWhen.value,
    )
    .map((option) => ({
      id: option.id,
      label: option.label,
      value: `${selections[option.id]?.trim() ?? ""}${
        option.suffix && selections[option.id]?.trim() ? ` ${option.suffix}` : ""
      }`,
    }))
    .filter((option) => option.value !== "");
}
