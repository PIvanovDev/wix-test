import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'
import { buildQueryString } from '../utils'

export type TProductVariant = {
  id?: string;
  price: number;
  choices: Record<'Size' | 'Color', string>;
  variant: {
    priceData: {
      price: number;
    };
  };
}

export type TProduct = {
  id: string;
  name: string;
  priceData: {
    price: number;
  };
  productType: string;
  inventoryItemId: string;
  description: string;
  variants: TProductVariant[];
  manageVariants: boolean;
  media: {
    mainMedia: {
      image: {
        url: string
      }
    }
  },
};

type TProductResponse = {
  products: TProduct[]
  totalResults: number
}

type TPagination = {
  page: number
  pageSize: number
  total: number
}

type TProductFilters = {
  name?: string
  startPrice?: number
  endPrice?: number
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<TProduct[]>([])

  const filters = reactive<TProductFilters>({})

  const pagination = ref<TPagination>({
    page: 1,
    pageSize: 5,
    total: 0
  })

  function loadProducts(...args: any[]) {
    console.log('loadProducts', args)

    const offset = (pagination.value.page - 1) * pagination.value.pageSize
    const limit = pagination.value.pageSize 

    const qs = buildQueryString({ ...filters, offset, limit })

    return axios.get<TProductResponse>(`http://localhost:3000/products${qs}`)
      .then(response => {

        products.value = response.data.products.map(product => ({
          ...product,
          children: product.manageVariants ? product.variants.map(variant => ({
            ...product,
            name: `${product.name} - ${variant.choices.Color} - ${variant.choices.Size}`,
            priceData: variant.variant.priceData,
            children: void 0
          })) : []
        }));

        console.log(products.value)

        pagination.value.total = response.data.totalResults
      })
      .catch(error => {
        console.error(error)
      })
  }

  function updateProduct(product: TProduct) {
    console.log('updateProduct', product)

    return axios.patch(`http://localhost:3000/products/${product.id}`, product)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }

  function createProduct(product: TProduct) {
    console.log('createProduct', product)

    return axios.post(`http://localhost:3000/products`, product)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }

  function handlePageChange(page: number) {
    console.log('handlePageChange', page)
    pagination.value.page = page

    loadProducts()
  }

  function deleteProduct(product: TProduct) {
    console.log('deleteProduct', product)

    return axios.delete(`http://localhost:3000/products/${product.id}`)
      .then(response => {
        console.log(response)
        loadProducts()
      })
      .catch(error => {
        console.error(error)
      })
  }

  return { 
    products,
    pagination,
    filters,
    loadProducts, 
    updateProduct,
    createProduct,
    deleteProduct,
    handlePageChange
  }
})
