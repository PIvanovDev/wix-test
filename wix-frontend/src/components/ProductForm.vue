<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductsStore, type TProduct } from '@/stores/products'

import { reactive } from 'vue'

const props = defineProps(['product', 'onClose', 'isNew'])
const productsStore = useProductsStore()

const form = reactive<TProduct>({...props.product})

const onSubmit = async () => {
  if(props.isNew) {
    await productsStore.createProduct({ ...form })
  } else {
    await productsStore.updateProduct({ ...form })
  }
  props.onClose(false)
}

const addVariant = () => {
  form.variants.push({ id: '', price: 0, choices: { Size: '', Color: '' }, variant: { priceData: { price: 0 } } })
}

const removeVariant = (index: number) => {
  if(index === -1) return

  form.variants.splice(index, 1)
}

</script>

<template>
  <div class="d-flex w-100">
    <el-form :model="form" label-width="auto" >
      <el-form-item label="Product name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Product price">
        <el-input type="number" v-model="form.priceData.price" />
      </el-form-item>
      <el-form-item label="Image URL">
        <el-input type="textarea" v-model="form.media.mainMedia.image.url" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item>
      <el-form-item label="Variants">
        <el-switch v-model="form.manageVariants" />
      </el-form-item>
      <div v-if="form.manageVariants">
        <div>
          <h6>Product variants</h6>
          <el-button type="primary" @click="addVariant">Add variant</el-button>
        </div>
        <div>
          <div v-for="(v, i) in form.variants">
            <el-form-item  label="Price">
              <el-input type="number" v-model="v.price" />
            </el-form-item>
            <el-form-item  label="Color">
              <el-input v-model="v.choices.Color" />
            </el-form-item>
            <el-form-item  label="Size">
              <el-input v-model="v.choices.Size" />
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="removeVariant(i)">Delete Variant</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
  <div>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
      <el-button @click="onClose(true)">Cancel</el-button>
    </el-form-item>
  </div>
</template>

<style scoped>



</style>
