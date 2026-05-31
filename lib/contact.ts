export const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/R/ti/p/@sxg2195h";
export const facebookUrl = "https://www.facebook.com/1381990545159062";

export function createLineProductInquiryUrl(productName: string) {
  const message = `我想詢問這件商品：${productName}`;
  const separator = lineUrl.includes("?") ? "&" : "?";
  return `${lineUrl}${separator}text=${encodeURIComponent(message)}`;
}
