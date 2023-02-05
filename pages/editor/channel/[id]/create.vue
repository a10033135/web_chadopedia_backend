<script setup lang="ts">

import {firestore} from "~/stores/firestore";
import {useNuxtApp, useRoute, useRouter} from "#app";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from "@firebase/firestore";
import {async} from "@firebase/util";

const {$firestore} = useNuxtApp()

const fire_store = firestore()

const router = useRouter()

const state = reactive({
  main_id: useRoute().path.split('/')[3],
  title: '',
  desc: '',
  image_url: '',
  sort: 1,
  enable: false
})

async function submit() {
  console.log('submit')
  const sub_collection = collection($firestore, 'SubCate')

  const sub_categories = fire_store.sub_categories
      .filter(value => state.main_id == value.main_cate_id)

  sub_categories
      .filter(value => state.sort == value.sort)
      .forEach(value => {
        updateDoc(doc($firestore, 'SubCate', value.id), {
          sort: sub_categories.length + 1
        })
      })

  await addDoc(sub_collection, {
    'main_cate_id': state.main_id,
    'title': state.title,
    'desc': state.desc,
    'image_url': state.image_url,
    'enable': state.enable,
    'sort': state.sort,
    'create_time': Timestamp.now(),
    'update_time': Timestamp.now()
  })

  await router.back()
}

function cancel() {
  console.log('cancel')
  router.back()
}

</script>

<template>
  <div class="bg-gray-800 px-20 py-10">
    <h1>{{ state.main_id }}</h1>
    <form class="bg-gray-800 my-6" @submit.prevent="submit">

      <div class="mb-6">
        <label for="email" class="block mb-2 text-white">副分類名稱</label>
        <input type="text" id="email" v-model="state.title"
               class="input text-white w-full " placeholder="ex: 茶茗" required>
      </div>

      <div class="mb-6">
        <label for="email" class="block mb-2 text-white">描述</label>
        <input type="text" placeholder="簡單描述" v-model="state.desc" class="input text-white w-full"/>
      </div>

      <div class="mb-6">
        <label for="url" class="block mb-2 text-white">主分類圖片</label>
        <input type="url" id="url" v-model="state.image_url"
               class="input text-white w-full"
               placeholder="google driver">
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

      <button class="btn btn-success w-full">Submit</button>

    </form>

    <button class="btn" v-on:click="cancel">Cancel</button>
  </div>
</template>

