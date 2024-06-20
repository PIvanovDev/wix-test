import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

export type TProductVariant = {
  id: string;
  price: number;
  choices: Record<'Size' | 'Color', string>;
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
  total: number
}

type TPagination = {
  page: number
  pageSize: number
  total: number
}

export const useProductsStore = defineStore('counter', () => {
  const products = ref<TProduct[]>([])

  const pagination = ref<TPagination>({
    page: 1,
    pageSize: 5,
    total: 0
  })

  function loadProducts(...args: any[]) {
    console.log('loadProducts', args)

    const offset = (pagination.value.page - 1) * pagination.value.pageSize
    const limit = pagination.value.pageSize 

    axios.get<TProductResponse>(`http://localhost:3000/products?offset=${offset}&limit=${limit}`)
      .then(response => {
        console.log(response)

        products.value = response.data.products
        pagination.value.total = response.data.total
      })
      .catch(error => {
        console.error(error)
      })
  }

  function updateProduct(product: TProduct) {
    console.log('updateProduct', product)

    axios.patch(`http://localhost:3000/products/${product.id}`, product)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }

  function createProduct(product: TProduct) {
    console.log('createProduct', product)

    axios.post(`http://localhost:3000/products`, product)
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

    axios.delete(`http://localhost:3000/products/${product.id}`)
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
    loadProducts, 
    updateProduct,
    createProduct,
    deleteProduct,
    handlePageChange
  }
})
