export type ProductCategory = "Dresses" | "Tops" | "Bottoms" | "Outerwear" | "Accessories" | "Sale";

export const categories: { label: string; value: ProductCategory | "All" }[] = [
  { label: "全部商品", value: "All" },
  { label: "洋裝", value: "Dresses" },
  { label: "上衣", value: "Tops" },
  { label: "褲裝", value: "Bottoms" },
  { label: "外套", value: "Outerwear" },
  { label: "配件", value: "Accessories" },
  { label: "特價", value: "Sale" }
];

export const categoryOptions = categories.filter(
  (category): category is { label: string; value: ProductCategory } => category.value !== "All"
);

export function getCategoryLabel(value: ProductCategory) {
  return categoryOptions.find((category) => category.value === value)?.label ?? value;
}
