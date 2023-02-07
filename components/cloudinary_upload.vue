<script lang="ts" setup>
import {Coordinates, Cropper} from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const emit = defineEmits(['crop_image', 'has_image'])

const param = defineProps(['has_image'])

const crop_config = {
  quality: 1,
  image_type: 'image/jpeg'
}

const state = reactive({
  show_image_upload: false,
  upload_image: '' as string | ArrayBuffer | null | undefined,
  cropped_image: '' as string | ArrayBuffer | null | undefined
})

function fileSelected(file: File) {
  const reader = new FileReader()
  reader.addEventListener('load', (image) => {
    state.upload_image = image.target?.result as string
  })
  reader.readAsDataURL(file)
}


function crop_image(result: { image: string, visibleArea: string, coordinates: Coordinates; canvas: HTMLCanvasElement }) {
  state.cropped_image = result.canvas.toDataURL(crop_config.image_type, crop_config.quality)
  emit('crop_image', state.cropped_image)
}

function reset_crop_image(files: HTMLInputElement) {
  state.cropped_image = ''
  state.upload_image = ''
  files.value = ''
  emit('crop_image', null)
}

</script>

<template>
  <div class="mb-6">

    <div class="flex my-3">
      <input type="checkbox" class="checkbox" v-model="param.has_image">
      <label class="mx-2">是否要顯示圖片</label>
    </div>

    <input type="file" ref="myFiles" accept="image/jpeg, image/png"
           @change="fileSelected($refs.myFiles.files.item(0))">

    <label v-if="state.upload_image" class="btn btn-accent btn-sm"
           @click="reset_crop_image($refs.myFiles)">取消</label>

    <cropper
        v-if="state.upload_image" class="cropper"
        :src="state.upload_image"
        :stencil-props="{aspectRatio: 1}"
        @change="crop_image"/>

    <label v-if="state.upload_image" class="my-2">編輯結果</label>

    <img v-if="state.upload_image" class="cropper" :src="state.cropped_image" width="200" height="200"/>
  </div>
</template>

<style scoped>

.cropper {
  margin-top: theme('space.2');
  margin-bottom: theme('space.2');
  width: theme('width.1/5');
  aspect-ratio: theme('aspectRatio.square');
  background: #DDD;
}
</style>