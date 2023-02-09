<script setup lang="ts">

import {useNuxtApp, useRouter} from "#app";
import {firestore} from "~/stores/firestore";
import {addDoc, collection, doc, Timestamp, updateDoc} from "@firebase/firestore";
import {genMainCategoryPath, uploadImage} from "~/utils/cloudinaryUtils";

const {$firestore} = useNuxtApp()
const router = useRouter()
const fire_store = firestore()


const state = reactive({
  title: '',
  desc: '',
  sort: 1,
  enable: false,
  is_submit_loading: false
})

const crop_image_state = reactive({
  has_image: false,
  cropped_image: '' as string | ArrayBuffer | null | undefined,
  upload_image: '' as string | ArrayBuffer | null | undefined
})

async function submit() {
  state.is_submit_loading = true

  fire_store.main_categories
      .filter(value => state.sort == value.sort)
      .forEach(value => {
        updateDoc(doc($firestore, 'MainCate', value.id), {
          sort: fire_store.main_categories.length + 1
        })
      })

  const doc_uploaded = await addDoc(collection($firestore, 'MainCate'), {
    'title': state.title,
    'desc': state.desc,
    'has_image': crop_image_state.has_image,
    'enable': state.enable,
    'sort': state.sort,
    'create_time': Timestamp.now(),
    'update_time': Timestamp.now()
  })


  const is_need_upload = crop_image_state.cropped_image?.toString()?.length != 0
  if (is_need_upload) {
    await uploadImage(genMainCategoryPath(doc_uploaded.id), crop_image_state.cropped_image as string)
  }
  state.is_submit_loading = false
  await router.push('/editor/channel')
}

function cancel() {
  router.push('/editor/channel')
}

</script>

<template>
  <div class="bg-gray-800 px-20 py-10">
    <form class="bg-gray-800 my-6" @submit.prevent="submit">

      <div class="mb-6">
        <label for="email" class="block mb-2 text-white">主分類名稱</label>
        <input type="text" id="email" v-model="state.title"
               class="input text-white w-full " placeholder="ex: 茶茗" required>
      </div>

      <div class="mb-6">
        <label for="email" class="block mb-2 text-white">描述</label>
        <input type="text" placeholder="簡單描述" v-model="state.desc" class="input text-white w-full"/>
      </div>

      <div class="mb-6">
        <cloudinary-upload
            v-model:has_image="crop_image_state.has_image"
            v-model:crop_image="crop_image_state.cropped_image"
            v-model:upload_image="crop_image_state.upload_image"
        />
      </div>

      <div class="mb-6">
        <label for="sort">排序順位</label>
        <input type="number" id="sort" v-model="state.sort"
               class="input text-white w-full" min="1" max="100"
               placeholder="number">
      </div>

      <div class="mb-6">
        <label for="url" class="block mb-2 text-white">啟用</label>
        <input type="checkbox" v-bind:checked="state.enable" class="checkbox"
               placeholder="true"
        >
      </div>

      <button class="btn btn-success w-full" :class="{'loading':state.is_submit_loading}">
        Submit
      </button>

    </form>

    <button class="btn" v-on:click="cancel">Cancel</button>
  </div>
</template>