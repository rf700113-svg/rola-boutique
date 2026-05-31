export type ProductCategory =
  | "New Arrival"
  | "Tops"
  | "Bottoms"
  | "Dresses"
  | "Outerwear"
  | "Sale";

export const categories: { label: string; value: ProductCategory | "All" }[] = [
  { label: "全部商品", value: "All" },
  { label: "新品上市", value: "New Arrival" },
  { label: "上衣", value: "Tops" },
  { label: "褲裝", value: "Bottoms" },
  { label: "洋裝", value: "Dresses" },
  { label: "外套", value: "Outerwear" },
  { label: "特價專區", value: "Sale" }
];

export const categoryOptions = categories.filter(
  (category): category is { label: string; value: ProductCategory } => category.value !== "All"
);
