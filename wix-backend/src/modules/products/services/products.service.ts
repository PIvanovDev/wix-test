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
      includeVariants: false,
      includeHiddenProducts: false,
      includeMerchantSpecificData: false
    }, { limit, offset });
  }

  single(id: string): Promise<TProduct> {
    return this.productsProvider.single(id);
  }

  create(payload: TProduct): Promise<TProduct> {
    return this.productsProvider.create(payload);
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
}
