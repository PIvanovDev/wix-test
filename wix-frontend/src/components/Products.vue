<script setup lang="ts">

import { ref, onMounted, watch } from 'vue'
import { useProductsStore, type TProduct } from '@/stores/products'
import { Edit, Delete } from '@element-plus/icons-vue';
import { debounce } from 'lodash'

const productsStore = useProductsStore()

const modalOpened = ref(false)
const isNewProduct = ref(false)
const currentProduct = ref<Partial<TProduct> | null>(null)

function openModal(product: any) {
  currentProduct.value = product
  modalOpened.value = true
}

function handleCloseModal(canceled: boolean) {
  currentProduct.value = null
  modalOpened.value = false
  isNewProduct.value = false
}

function createProduct() {
  currentProduct.value = {
    name: '',
    description: '',
    productType: 'physical',
    inventoryItemId: '',
    variants: [],
    manageVariants: false,
    priceData: {
      price: 0
    },
    media: {
      mainMedia: {
        image: {
          url: ''
        }
      }
    },
  }

  modalOpened.value = true;
  isNewProduct.value = true;
}

onMounted(() => {
  productsStore.loadProducts()
})

watch(() => productsStore.filters.name, debounce(() => {
  productsStore.loadProducts()
}, 1000), { deep: true })

const priceRange = ref([0, 1000])

const handlePriceRangeChange = (values: number[]) => {
  productsStore.filters.startPrice = values[0]
  productsStore.filters.endPrice = values[1]
  productsStore.loadProducts()
}

</script>

<template>
  <div class="w-100" style="padding: 2rem;">
    <div class="w-100 d-flex row-reverse">
      <el-button type="primary" @click="createProduct">Create Product</el-button>
      <el-form-item class="mx-4" label="Product name">
        <el-input v-model="productsStore.filters.name" />
      </el-form-item>
      <span class="mx-4 w-100">
        <span class="demonstration">Price range</span>
        <el-slider v-model="priceRange" range :min="1" :max="1000" @change="handlePriceRangeChange"/>
      </span>
    </div>
    <div  class="mt-4">
      <el-table
        :data="productsStore.products"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
      >
        <el-table-column prop="name" label="Name" />
        <el-table-column  label="Media">
          <template #default="scope">
            <div v-if="scope.row.media.mainMedia" style="display: flex; align-items: center">
              <el-image style="width: 100px; height: 100px" :src="scope.row.media.mainMedia.image.url" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Description" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <!-- <el-icon><timer /></el-icon> -->
              <span v-html="scope.row.description"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="priceData.formatted.price" label="Price" />
        <el-table-column prop="description" label="Description" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon style="cursor: pointer;" :size="20" @click="openModal({...scope.row})">
                <Edit />
              </el-icon>
              <el-icon style="cursor: pointer;" :size="20" @click="productsStore.deleteProduct({ ...scope.row })">
                <Delete />
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="w-100 d-flex justify-content-center">
      <el-pagination 
        background 
        layout="prev, pager, next"
        :total="productsStore.pagination.total"
        v-model:current-page="productsStore.pagination.page"
        :page-size="5"
        @current-change="productsStore.handlePageChange"
      />
    </div>
    
    <el-dialog
      title="Edit Product"
      v-model="modalOpened"
      width="30%"
      :before-close="handleCloseModal">
      <template #footer>
        <ProductForm :product="currentProduct" :isNew="isNewProduct" :onClose="handleCloseModal"/>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

.d-flex {
  display: flex;
}

.mx-4 {
  margin-left: 2rem;
  margin-right: 2rem;
}

.mt-4 {
  margin-top: 2rem;
}

.row-reverse {
  flex-direction: row-reverse;
}

.justify-content-center {
  justify-content: center;
}

.w-100 {
  width: 100%;
}

</style>
