export type TProductVariant = {
  id: string;
  price: number;
  choices: Record<'Size' | 'Color', string>;
}

type ProductOption = {
  name: string;
  choices: { value: string }[];
}

export type TImageUrl = {
  url: string;
}

export type TProduct = {
  id: string;
  name: string;
  productType: "physical" | "digital";
  productOptions: ProductOption[];
  category: string;
  description: string;
  variants: TProductVariant[];
  manageVariants: boolean;
  priceData: {
    price: number;
  };
  media: {
    mainMedia: {
      image: TImageUrl
    }
  },
};