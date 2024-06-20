import { FilterQuery } from 'mongoose';
import { IDataProvider, IHttpClient, TPaginationOptions, TSearchOptions } from "src/utils/types";
import { TProduct, TProductVariant } from "../types";


const likeFields = [
  'description',
  'name',
];

const equalFields = [
  'id',
  'category',
  'price',
];

const betweenFields = [
  'startPrice',
  'endPrice'
];

const allFields = [
  ...likeFields,
  ...equalFields,
  ...betweenFields,
];

export type TFilterProductOptions = Partial<TProduct> & {
  startPrice?: number;
  endPrice?: number;
  price: number;
};


const pagitationDefaults = {
  offset: 0,
  limit: Number.MAX_SAFE_INTEGER
};

type TRequestOptions<T> = Omit<TSearchOptions<T>, 'query'> & {
  query: Partial<{
    filter: string
    sort: string
    paging: TPaginationOptions
  }>
}

export interface ProductsDataProvider {
  updateVariants(productId: string, variants: Partial<TProductVariant>[]): Promise<TProductVariant[]>;
  resetVariants(productId: string): Promise<unknown>;
}

export class ProductsProvider implements IDataProvider<TProduct> {
  constructor(private readonly httpClient: IHttpClient) {}


  getFilterOptions(options: TFilterProductOptions): FilterQuery<TProduct> {
    const filterOptions = {};

    Object.entries(options)
      .filter(([key, value]) => value)
      .forEach(([key, value]) => {
        if(allFields.includes(key)) {
          if (likeFields.includes(key)) return filterOptions[key] = { $contains: value };

          if (equalFields.includes(key)) {
            if(Array.isArray(value) && value.length) {
              if(value.length > 1) return filterOptions[key] = { $hasSome: value };
              return filterOptions[key] = value[0];
            } 
            return filterOptions[key] = value;
          }

          if(betweenFields.includes(key)) {
            return Object.assign(filterOptions, {
              price: { $gte: options.startPrice,  $lte: options.endPrice },
            });
          }
        }
      });

    return Object.entries(filterOptions)
      .filter(([k, v]) => v !== undefined)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  }

  create(product: TProduct): Promise<TProduct> {
    return this.httpClient.post<TProduct, { product:  Partial<TProduct>}>(`/stores/v1/products`, { product });
  }

  update(id: string, product: Partial<TProduct>): Promise<TProduct> {
    return this.httpClient.patch<TProduct, { product:  Partial<TProduct>}>(`/stores/v1/products/${id}`, { product });
  }

  updateVariants(productId: string, variants: Partial<TProductVariant>[]): Promise<TProductVariant[]> {
    console.log(`/stores/v1/products/${productId}/variants`)
    return this.httpClient.patch<TProductVariant[], { variants:  Partial<TProductVariant>[]}>(`/stores/v1/products/${productId}/variants`, { variants });
  }

  resetVariants(productId: string): Promise<unknown> {
    return this.httpClient.post(`/stores/v1/products/${productId}/variants/resetToDefault`, {});
  }

  delete(id: string): Promise<TProduct> {
    return this.httpClient.delete<TProduct>(`${id}`);
  }

  single(id: string): Promise<TProduct> {
    return this.httpClient.get<TProduct>(`/stores/v1/products/${id}`);
  }

  search(options: TSearchOptions<TProduct>, { limit, offset }: TPaginationOptions = pagitationDefaults): Promise<TProduct[]> {

    let qs = '';

    if(!('paging' in options.query)) {
      qs = this.httpClient.buildQueryString({
        limit, offset
      });
    }

    const payload = { 
      ...options,
      query: {
        filter: JSON.stringify(options.query.filter)
      }
    } 

    return this.httpClient.post<TProduct[], TRequestOptions<TProduct>>(`/stores-reader/v1/products/query${qs}`, payload);
  }

}