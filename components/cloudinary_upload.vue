<script lang="ts" setup>
import {Coordinates, Cropper} from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const emit = defineEmits(['update:crop_image', 'update:has_image', 'update:upload_image'])

const param = defineProps(['crop_image', 'has_image', 'upload_image'])

const crop_config = {
  quality: 1,
  image_type: 'image/jpeg'
}

function fileSelected(file: File) {
  const reader = new FileReader()
  reader.addEventListener('load', (image) => {
    emit('update:upload_image', image.target?.result as string)
  })
  reader.readAsDataURL(file)
}


function crop_image(result: { image: string, visibleArea: string, coordinates: Coordinates; canvas: HTMLCanvasElement }) {
  emit('update:crop_image', result.canvas.toDataURL(crop_config.image_type, crop_config.quality))
}

function reset_crop_image(files: HTMLInputElement) {
  emit('update:crop_image', null)
  emit('update:upload_image', '')
  files.value = ''
}

</script>

<template>
  <div class="mb-6">

    <div class="flex my-3">
      <input type="checkbox" class="checkbox" :value="param.has_image"
             @input="$emit('update:has_image',$event.target.value)">
      <label class="mx-2">是否要顯示圖片</label>
    </div>

    <input type="file" ref="myFiles" accept="image/jpeg, image/png"
           @change="fileSelected($refs.myFiles.files.item(0))">

    <label v-if="param.upload_image" class="btn btn-accent btn-sm"
           @click="reset_crop_image($refs.myFiles)">取消</label>

    <cropper
        v-if="param.upload_image" class="cropper"
        :src="param.upload_image"
        :stencil-props="{aspectRatio: 1}"
        @change="crop_image"/>

    <label v-if="param.upload_image" class="my-2">編輯結果</label>

    <img v-if="param.upload_image" class="cropper" :src="param.crop_image" width="200" height="200"/>
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