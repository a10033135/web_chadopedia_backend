<script lang="ts" setup>

import {ChadoContent} from "~/model/ChadoContent";
import {MainCategory} from "~/model/MainCategory";
import {SubCategory} from "~/model/SubCategory";
import {firestore} from "~/stores/firestore";
import {useNuxtApp, useRouter} from "#app";
import {addDoc, arrayUnion, collection, Timestamp, updateDoc} from "@firebase/firestore";
import 'vue-advanced-cropper/dist/style.css';
import {genChadoContentPath, uploadImage} from "~/utils/cloudinaryUtils";

const {$firestore} = useNuxtApp()

const fire_store = firestore()

const router = useRouter()


watch(fire_store, (store) => {
  state.main_categories = store.main_categories
  state.sub_categories = store.sub_categories
})

const state = reactive({
  title: '',
  desc: '',
  enable: false,
  main_categories: fire_store.main_categories,
  sub_categories: fire_store.sub_categories,
  selected_main_categories: [] as MainCategory[],
  selected_sub_categories: [] as SubCategory[],
  is_submit_loading: false,
})

const crop_image_state = reactive({
  has_image: false,
  cropped_image: '' as string | ArrayBuffer | null | undefined,
  upload_image: '' as string | ArrayBuffer | null | undefined
})

async function submit() {
  state.is_submit_loading = true

  const doc = await addDoc(collection($firestore, 'ChadoContent'), {
    'title': state.title,
    'desc': state.desc,
    'has_image': crop_image_state.has_image,
    'enable': state.enable,
    'main_categories': arrayUnion(...state.selected_main_categories.map(value => value.id)),
    'sub_categories': arrayUnion(...state.selected_sub_categories.map(value => value.id)),
    'create_time': Timestamp.now().seconds,
    'update_time': Timestamp.now().seconds
  })


  const is_need_upload = crop_image_state.cropped_image?.toString()?.length != 0

  if (is_need_upload) {
    await uploadImage(genChadoContentPath(doc.id), crop_image_state.cropped_image as string)
  }

  state.is_submit_loading = false

  await router.push('/editor/content')
}

function cancel() {
  console.log('cancel')
  router.push('/editor/content')
}

function get_selected_sub_categories(main_category_id: string, sub_categories: SubCategory[]): SubCategory[] {
  return sub_categories.filter(value => value.main_cate_id == main_category_id) ?? []
}

function change_main_cate_checkbox(main_category: MainCategory, isChecked: boolean) {
  console.log(main_category)
  state.selected_main_categories = state.selected_main_categories.filter((value) => value != main_category)
  if (isChecked) {
    state.selected_main_categories.push(main_category)
  }
}

function change_sub_cate_checkbox(main_category: MainCategory, sub_category: SubCategory, isChecked: boolean) {
  console.log(sub_category.id, isChecked)
  state.selected_sub_categories = state.selected_sub_categories.filter((value) => value != sub_category)
  if (isChecked) {
    state.selected_sub_categories.push(sub_category)
  }
  state.selected_sub_categories.sort((a, b) => a.main_cate_id.localeCompare(b.main_cate_id))
}

function get_main_category_by_sub(main_cate_id: string): string {
  return state.main_categories.find((value) => value.id == main_cate_id)?.title ?? ''
}

</script>

<template>
  <div class="bg-gray-800 px-20 py-10">
    <form class="bg-gray-800 my-6" @submit.prevent="submit">

      <div class="mb-6">
        <label for="title" class="block mb-2 text-white">標題</label>
        <input class="input input-success text-white w-full" placeholder="請填寫標題"
               type="text" id="title" v-model="state.title">
      </div>

      <div class="mb-6">
        <label for="desc" class="block mb-2 text-white">描述</label>
        <input class="input input-success text-white w-full"
               type="text" placeholder="簡單描述" v-model="state.desc">
      </div>

      <div class="mb-6">

        <cloudinary-upload v-model:has_image="crop_image_state.has_image"
                           v-model:crop_image="crop_image_state.cropped_image"
                           v-model:upload_image="crop_image_state.upload_image"/>

      </div>

      <div class="p-4 w-full  bg-base-100">
        <ul v-for="item in state.main_categories" class="my-2">
          <li>
            <input type="checkbox" class="checkbox checkbox-error"
                   @change="change_main_cate_checkbox(item,$event.target.checked)"/>
            <span class="text-white mx-2">{{ item.title }}</span>
          </li>
          <li v-for="subItem in get_selected_sub_categories(item.id,state.sub_categories)"
              class="mx-8">
            <input type="checkbox" class="checkbox checkbox-success"
                   @change="change_sub_cate_checkbox(item,subItem,$event.target.checked)"/>
            <span class="text-white mx-2 text-center">{{ subItem.title }}</span>
          </li>
        </ul>
      </div>

      <div class="p-4 w-full bg-base-100 my-5 h-100">
        <table class="table w-full">
          <thead>
          <tr>
            <th>主頻道</th>
            <th>副頻道</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(select_main_category,index) in state.selected_main_categories">
            <td class="bg-gray-600"> {{ select_main_category.title }}</td>
            <td class="bg-gray-200 text-black">無</td>
          </tr>

          <tr v-for="(select_sub_category,index) in state.selected_sub_categories">
            <td class="bg-gray-600">{{ get_main_category_by_sub(select_sub_category.main_cate_id) }}</td>
            <td class="bg-gray-200 text-black">{{ select_sub_category.title }}</td>
          </tr>

          </tbody>
        </table>

      </div>

      <div class="mb-6">
        <label for="enable" class="block mb-2 text-white">啟用</label>
        <input class="checkbox checkbox-success"
               type="checkbox" v-model="state.enable">
      </div>

      <button class="btn btn-success w-full"
              :class="{'loading':state.is_submit_loading }" @click="state.submit">Submit
      </button>

    </form>

    <button class="btn" v-on:click="cancel">Cancel</button>

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