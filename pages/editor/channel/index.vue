<script setup lang="ts">

import {useNuxtApp} from "#app";
import {firestore} from "~/stores/firestore";
import {MainCategory} from "~/model/MainCategory";
import {deleteDoc, doc, setDoc, Timestamp, updateDoc} from "@firebase/firestore";
import {
  chado_content_path,
  genChadoContentPath,
  genMainCategoryPath,
  main_category_path
} from "~/utils/cloudinaryUtils";
import {CloudinaryImage} from "@cloudinary/url-gen/assets/CloudinaryImage";
import {AdvancedImage} from "@cloudinary/vue";

const {$firestore} = useNuxtApp()
const fire_store = firestore()

const cloudinary_version = useCookie('cloudinary_version')

const {$cld} = useNuxtApp()

watch(fire_store, (store) => {
  state.main_cate_list = store.main_categories
})

const state = reactive({
  main_cate_list: fire_store.main_categories,
  edit_category: MainCategory.newInstance(),
  edit_sub_origin_sort: 0,
})

const modal_state = reactive({
  is_open: false,
  is_delete_loading: false,
  is_submit_loading: false
})

const crop_image_state = reactive({
  has_image: false,
  last_image: null as CloudinaryImage | null,
  cropped_image: null as string | ArrayBuffer | null | undefined,
  upload_image: null as string | ArrayBuffer | null | undefined
})

function click_edit_main_cate(item: MainCategory) {
  console.log('click_edit_main_cate', item)
  modal_state.is_open = true
  state.edit_category = new MainCategory(item.id, item.title, item.desc, item.has_image, item.sort, item.enable, item.create_time, item.update_time)
  state.edit_sub_origin_sort = item.sort
  crop_image_state.cropped_image = null
  crop_image_state.upload_image = null
  crop_image_state.last_image = $cld.image(genMainCategoryPath(item.id)).setVersion(cloudinary_version.value ?? '')
}

async function remove_main_cate(main_category: MainCategory) {
  console.log('remove_main_cate', main_category)
  modal_state.is_delete_loading = true
  await deleteDoc(doc($firestore, 'MainCate', main_category.id))
  modal_state.is_open = false
  modal_state.is_delete_loading = false
}

async function submit_edit_category() {
  console.log('submitEditMainCat: ' + state.edit_category.title + state.edit_category.enable)

  modal_state.is_submit_loading = true
  state.main_cate_list
      .filter(value => state.edit_category.id != value.id)
      .filter(value => state.edit_category.sort == value.sort)
      .forEach(value => {
        updateDoc(doc($firestore, 'SubCate', value.id), {
          sort: state.edit_sub_origin_sort
        })
      })

  await updateDoc(doc($firestore, 'MainCate', state.edit_category.id), {
    'title': state.edit_category.title,
    'desc': state.edit_category.desc,
    'has_image': crop_image_state.has_image,
    'sort': state.edit_sub_origin_sort,
    'enable': state.edit_category.enable,
    'update_time': Timestamp.now()
  })

  const is_need_upload = crop_image_state.cropped_image?.toString().length != 0

  if (is_need_upload) {
    const body = JSON.stringify({
      name: state.edit_category.id,
      path: main_category_path,
      file: crop_image_state.cropped_image
    });

    const {data} = await useFetch("/api/cloudinary/add", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body,
    });

    cloudinary_version.value = data.value?.versionCode?.toString() ?? ''
  }

  modal_state.is_open = false
  modal_state.is_submit_loading = false

}

</script>


<template>
  <div>
    <h1>MainCategoryContent</h1>
    <p> - - - </p>

    <nuxt-link class="btn btn-outline my-5" to="/editor/channel/create">新增</nuxt-link>

    <div class="overflow-x-auto ">
      <table class="table w-full">

        <!-- head -->
        <thead>
        <tr>
          <th class="bg-gray-400 text-white"></th>
          <th class="bg-gray-400 text-white">系統編號</th>
          <th class="bg-gray-400 text-white">主標題</th>
          <th class="bg-gray-400 text-white">是否上架</th>
          <th class="bg-gray-400 text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item , index) in state.main_cate_list" v-on:click="click_edit_main_cate(item)">
          <td class="text-sm bg-gray-600 text-white">{{ index + 1 }}</td>
          <td class="text-sm bg-gray-600 text-white">{{ item.id.substring(0, 5) }}</td>
          <td class="bg-gray-600 text-white">
            <nuxt-link v-bind:to="`/editor/channel/`+item.id" class="hover:text-red-200">{{ item.title }}</nuxt-link>
          </td>
          <td class="text-red-300 bg-gray-600">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="bg-gray-600">
            <!-- The button to open modal -->
            <label for="modal" class="badge badge-outline hover:bg-white hover:text-black"
                   v-on:click="click_edit_main_cate(item)">編輯</label>
            <label class="badge badge-outline badge-error hover:bg-red-800 hover:text-white"
                   v-on:click="remove_main_cate(item)">刪除</label>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Put this part before </body> tag -->
    <div class="modal" :class="{'modal-open':modal_state.is_open}">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">系統編號：{{ state.edit_category.id }}</h3>
        <form class="my-6" @submit.prevent="submit_edit_category">

          <div class="mb-6">
            <label for="email" class="block mb-2 text-white">主分類名稱</label>
            <input type="text" id="email" v-model="state.edit_category.title"
                   class="input text-white w-full " placeholder="ex: 茶茗" required>
          </div>

          <div class="mb-6">
            <label for="email" class="block mb-2 text-white">描述</label>
            <input type="text" placeholder="簡單描述" v-model="state.edit_category.desc"
                   class="input text-white w-full"/>
          </div>

          <!-- img -->
          <div>
            <cloudinary-upload
                v-model:has_image="crop_image_state.has_image"
                v-model:last_image="crop_image_state.last_image"
                v-model:crop_image="crop_image_state.cropped_image"
                v-model:upload_image="crop_image_state.upload_image"/>
          </div>


          <div class="mb-6">
            <label for="url" class="block mb-2 text-white">啟用</label>
            <input type="checkbox" class="checkbox" v-model="state.edit_category.enable"
                   placeholder="true">
          </div>

        </form>
        <div>
          <label for="modal" class="btn btn-success w-full"
                 :class="{'loading':modal_state.is_submit_loading}"
                 v-on:click="submit_edit_category">修改</label>
        </div>

        <div>
          <label for="modal" class="btn btn-outline btn-error my-6 w-full"
                 :class="{'loading':modal_state.is_delete_loading}"
                 v-on:click="remove_main_cate(state.edit_category)">Delete</label>
        </div>
        <div>
          <label for="modal" class="btn w-full"
                 @click="modal_state.is_open = false">關閉</label>
        </div>
      </div>
    </div>
  </div>
</template>

