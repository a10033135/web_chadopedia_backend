<script setup lang="ts">

const state = reactive({
  img: '' as string | ArrayBuffer | null | undefined
})

function change_crop_image(img: string | ArrayBuffer | null | undefined) {
  console.log('change_crop_image')
  state.img = img
}
</script>

<template>
  <div>
    <cloudinary-upload @crop_image="change_crop_image">

    </cloudinary-upload>

    <img class="h-200 w-200" :src="state.img">
  </div>


</template>