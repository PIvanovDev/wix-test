<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useProductsStore, type TProduct } from '@/stores/products'
import { Edit, Delete } from '@element-plus/icons-vue';

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
  // productsStore.loadProducts()
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

</script>

<template>
  <div class="w-100">
    <div>
      <el-button type="primary" @click="createProduct">Submit</el-button>
    </div>
    <div>
      <el-table
        :data="productsStore.products"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column prop="name" label="Name" />
        <el-table-column  label="Media">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image v-show="scope.row.media" style="width: 100px; height: 100px" :src="scope.row.media.mainMedia.image.url" />
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
        <el-table-column prop="price.formatted.price" label="Price" />
        <el-table-column prop="description" label="Description" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon style="cursor: pointer;" :size="20" @click="openModal({...scope.row})">
                <Edit />
              </el-icon>
              <el-icon style="cursor: pointer;" :size="20">
                <Delete />
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination 
        background 
        layout="prev, pager, next"
        :total="12"
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

.w-100 {
  width: 100%;
}

</style>
