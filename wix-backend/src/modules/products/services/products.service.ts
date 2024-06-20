import { Inject, Injectable } from '@nestjs/common';
import { TProduct, TProductVariant } from '../types';
import { IDataProvider, TPaginationOptions } from 'src/utils/types';
import { ProductsDataProvider, TFilterProductOptions } from '../providers/products.provider';

export type TProductListOptions = TFilterProductOptions & TPaginationOptions;

function getProductOptions(variants: TProductVariant[]) {
  const productOptions: Record<string, string[]> = {}

  variants.forEach((variant) => {
    Object.entries(variant.choices).forEach(([key, value]) => {
      if(!productOptions[key]) {
        productOptions[key] = [value]
        return
      }

      if(!productOptions[key].includes(value)) {
        productOptions[key].push(value)
      }
    })
  })

  return Object.entries(productOptions).map(([name, choices]) => ({
    name,
    choices: choices.map((value) => ({ value, description: value }))
  }));

}

@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductsProvider') private readonly productsProvider: IDataProvider<TProduct> & ProductsDataProvider,
  ) {}
  list(options: TProductListOptions): Promise<TProduct[]> {

    const { limit, offset, ...query } = options;

    const filter = this.productsProvider.getFilterOptions(query);

    return this.productsProvider.search({
      query: {
        filter,
        paging: { limit, offset }
      },
      includeVariants: true,
      includeHiddenProducts: false,
      includeMerchantSpecificData: false
    }, { limit, offset });
  }

  single(id: string): Promise<TProduct> {
    return this.productsProvider.single(id);
  }

  async create(payload: TProduct): Promise<TProduct> {
    const newProduct = await this.productsProvider.create(payload);

    if(payload.media.mainMedia.image.url) {
      // @ts-ignore
      await this.productsProvider.addMedia(newProduct.product.id, [payload.media.mainMedia.image]);
      // @ts-ignore
      await this.productsProvider.update(newProduct.product.id, payload);
    }

    // @ts-ignore
    return this.single(newProduct.product.id);
  }

  async update(id: string, payload: Partial<TProduct>): Promise<TProduct> {


    if(payload.manageVariants) {
      //manageVariants cannot be true if there are no project options
      payload.productOptions = getProductOptions(payload.variants)
      //productOptions has to be reset if valiants already exist
      await this.productsProvider.resetVariants(id);
      await this.productsProvider.update(id, payload);
      await this.productsProvider.updateVariants(id, payload.variants);

      return this.single(id);
    }

    await this.productsProvider.update(id, payload);

    return this.single(id);
  }

  async delete(id: string): Promise<TProduct> {
    const product = await this.productsProvider.single(id);
    await this.productsProvider.delete(id);

    return product;
  }
}
