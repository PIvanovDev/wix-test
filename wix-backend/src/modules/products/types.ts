export type TProductVariant = {
  id: string;
  price: number;
  choices: Record<'Size' | 'Color', string>;
}

type ProductOption = {
  name: string;
  choices: { value: string }[];
}

export type TProduct = {
  id: string;
  name: string;
  productType: "physical" | "digital";
  priceData: {
    price: number;
  };
  productOptions: ProductOption[];
  category: string;
  inventoryItemId: string;
  description: string;
  variants: TProductVariant[];
  manageVariants: boolean;
};