import type { FilterQuery } from "mongoose";

export interface IHttpClient {
  get: <T>(path: string) => Promise<T>;
  post: <T, K = T>(path: string, body: K) => Promise<T>;
  patch: <T, K = T>(path: string, body: K) => Promise<T>;
  delete: <T = unknown>(path: string) => Promise<T>;
  buildQueryString: (options: Record<string, any>) => string;
}

export type TSortOption = {
  fieldName: string;
  order: 'ASC' | 'DESC';
}

export type TPaginationOptions = {
  offset: number;
  limit: number;
}

export type TSearchOptions<T> = {
  query: Partial<{
    filter: FilterQuery<T>;
    sort: TSortOption[];
    paging: TPaginationOptions;
  }>,
  includeVariants: boolean;
  includeHiddenProducts: boolean;
  includeMerchantSpecificData: boolean;
};

export interface IDataProvider<T> {
  getFilterOptions(options: Record<string, any>): Record<string, any>;
  create(payload: T): Promise<T>;
  update(id: string, payload: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
  single(id: string): Promise<T>;
  search(options: TSearchOptions<T>, paginationOptions?: TPaginationOptions): Promise<T[]>;
}




