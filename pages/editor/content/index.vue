<script setup lang="ts">

import {ChadoContent} from "~/model/ChadoContent";
import {MainCategory} from "~/model/MainCategory";
import {SubCategory} from "~/model/SubCategory";
import {firestore} from "~/stores/firestore";
import {useNuxtApp} from "#app";
import {Timestamp, arrayUnion, deleteDoc, doc, updateDoc} from "@firebase/firestore";
import {CloudinaryImage} from "@cloudinary/url-gen/assets/CloudinaryImage";
import {chado_content_path, genChadoContentPath} from "~/utils/cloudinaryUtils";

const {$firestore} = useNuxtApp()
const fire_store = firestore()

const cloudinary_version = useCookie('cloudinary_version')

const {$cld} = useNuxtApp()

watch(fire_store, (store) => {
  state.main_categories = store.main_categories
  state.sub_categories = store.sub_categories
  state.chado_contents = store.chado_contents
})

const modal_state = reactive({
  is_open: false,
  submit_loading: false
})

const state = reactive({
  chado_contents: fire_store.chado_contents,
  main_categories: fire_store.main_categories,
  sub_categories: fire_store.sub_categories,
  edit_chado_content: ChadoContent.newInstance(),
  last_image: null as CloudinaryImage | null,
  edit_upload_img: null as string | ArrayBuffer | null | undefined,
  edit_crop_img: null as string | ArrayBuffer | null | undefined
})

function click_edit_item(item: ChadoContent) {
  console.log('click_edit_itme')
  modal_state.is_open = true
  state.edit_chado_content = new ChadoContent(item.id, item.title, item.desc, item.enable, item.has_image, item.main_categories, item.sub_categories, item.create_time, item.update_time)
  state.edit_upload_img = null // 被上傳的圖片
  state.edit_crop_img = null // 被裁切的圖片
  state.edit_img = $cld.image(genChadoContentPath(item.id))
}

function click_close_modal() {
  modal_state.is_open = false
}

async function click_remove_item(item: ChadoContent) {
  await deleteDoc(doc($firestore, 'ChadoContent', item.id))
  modal_state.is_open = false
}

async function click_edit_submit() {
  console.log('click_edit_submit')

  modal_state.submit_loading = true

  await updateDoc(doc($firestore, 'ChadoContent', state.edit_chado_content.id), {
    'title': state.edit_chado_content.title,
    'desc': state.edit_chado_content.desc,
    'enable': state.edit_chado_content.enable,
    'has_image': state.edit_chado_content.has_image,
    'main_categories': arrayUnion(...state.edit_chado_content.main_categories),
    'sub_categories': arrayUnion(...state.edit_chado_content.sub_categories),
    'update_time': Timestamp.now()
  })

  const is_need_upload = state.edit_crop_img?.toString().length != 0

  if (is_need_upload) {
    const body = JSON.stringify({
      name: state.edit_chado_content.id,
      path: chado_content_path,
      file: state.edit_crop_img
    });

    const {data} = await useFetch("/api/cloudinary/add", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body,
    });

    cloudinary_version.value = data.value?.versionCode?.toString() ?? ''
  }
  modal_state.is_open = false
  modal_state.submit_loading = false
}

function get_selected_categories(main_id: string, sub_categories: SubCategory[]): SubCategory[] {
  return sub_categories.filter(value => value.main_cate_id == main_id) ?? []
}

function change_main_category_checkbox(main_category: MainCategory, isChecked: boolean) {
  state.edit_chado_content.main_categories = state.edit_chado_content.main_categories.filter(value => value != main_category.id)
  if (isChecked) {
    state.edit_chado_content.main_categories.push(main_category.id)
  }
}

function change_sub_category_checkbox(main_category: MainCategory, sub_category: SubCategory, isChecked: boolean) {
  state.edit_chado_content.sub_categories = state.edit_chado_content.sub_categories.filter(value => value != sub_category.id)
  if (isChecked) {
    state.edit_chado_content.sub_categories.push(sub_category.id)
  }
}

function get_main_category_title(main_id: string): string {
  return state.main_categories.find(value => value.id == main_id)?.title ?? ''
}

function get_main_title_by_sub(main_id: string): string {
  const sub_category = state.sub_categories.find(value => value.id == main_id) ?? SubCategory.newInstance()
  const main_category = state.main_categories.find(value => value.id == sub_category.main_cate_id) ?? MainCategory.newInstance()
  return main_category.title
}

function get_sub_title(sub_id: string): string {
  return state.sub_categories.find(value => sub_id == value.id)?.title ?? ''
}

</script>


<template>
  <div>
    <h1>ContentPage</h1>
    <p> - - - </p>
    <nuxt-link class="btn btn-outline btn-success my-2" to="/editor/content/create">新增內容</nuxt-link>

    <div class="overflow-x-auto">
      <table class="table w-full">
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
        <tr v-for="(item,index) in state.chado_contents">
          <td class="text-sm bg-gray-600 text-white">{{ index + 1 }}</td>
          <td class="text-sm bg-gray-600 text-white">{{ item.id.substring(0, 5) }}</td>
          <td class="bg-gray-600 text-white">{{ item.title }}</td>
          <td class="text-red-300 bg-gray-600">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="hover:text-blue-200 bg-gray-600">
            <!-- The button to open modal -->
            <label for="modal"
                   class="btn btn-xs btn-outline btn-success hover:btn-success"
                   @click="click_edit_item(item)">編輯</label>

            <label class="btn btn-xs btn-outline btn-error hover:btn-error"
                   @click="click_remove_item(item)">刪除</label>
          </td>
        </tr>
        </tbody>

      </table>
    </div>

    <div class="modal" :class="{'modal-open':modal_state.is_open}">
      <div class="modal-box bg-gray-800 w-11/12 max-w-5xl">
        <div>
          <form>
            <div class="mb-6">
              <label for="title" class="block mb-2 text-white">標題</label>
              <input class="input text-white w-full" placeholder="請填寫標題"
                     type="text" id="title" v-model="state.edit_chado_content.title">
            </div>

            <div class="mb-6">
              <label for="desc" class="block mb-2 text-white">描述</label>
              <input class="input text-white w-full"
                     type="text" placeholder="簡單描述" v-model="state.edit_chado_content.desc">
            </div>

            <div class="p-4 w-full  bg-base-100">
              <ul v-for="item in state.main_categories" class="my-2">
                <li>
                  <input type="checkbox" class="checkbox checkbox-error"
                         :checked="state.edit_chado_content.main_categories.find((value)=>value===item.id)"
                         @change="change_main_category_checkbox(item,$event.target.checked)"/>
                  <span class="label-text">{{ item.title }}</span>
                </li>
                <li v-for="subItem in get_selected_categories(item.id,state.sub_categories)"
                    class="mx-8">
                  <input type="checkbox" class="checkbox checkbox-success"
                         :checked="state.edit_chado_content.sub_categories.find((value)=>value===subItem.id)"
                         @change="change_sub_category_checkbox(item,subItem,$event.target.checked)"/>
                  <span class="label-text">{{ subItem.title }}</span>
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
                <tr v-for="(select_main_category,index) in state.edit_chado_content.main_categories">
                  <td class="bg-gray-600"> {{ get_main_category_title(select_main_category) }}</td>
                  <td class="bg-gray-200 text-black">無</td>
                </tr>

                <tr v-for="(select_sub_category,index) in state.edit_chado_content.sub_categories">
                  <td class="bg-gray-600">{{ get_main_title_by_sub(select_sub_category) }}</td>
                  <td class="bg-gray-200 text-black">{{ get_sub_title(select_sub_category) }}</td>
                </tr>

                </tbody>
              </table>

            </div>

            <!-- img -->
            <div>
              <cloudinary-upload
                  v-model:last_image="state.edit_img"
                  v-model:crop_image="state.edit_crop_img"
                  v-model:has_image="state.edit_chado_content.has_image"
                  v-model:upload_image="state.edit_upload_img"/>

            </div>

            <div class="flex mb-6">

              <input class="checkbox"
                     type="checkbox" v-model="state.edit_chado_content.enable">
              <label for="enable" class="block mb-2 text-white">啟用</label>
            </div>

          </form>
        </div>
        <div class="my-2">
          <label class="btn btn-success w-full" :class="{'loading':modal_state.submit_loading}"
                 @click="click_edit_submit">Submit</label>
        </div>
        <div class="my-2">
          <label class="btn btn-outline btn-error w-full"
                 @click="click_remove_item(state.edit_chado_content)">Delete</label>
        </div>
        <div class="my-2">
          <label class="btn w-full" @click="modal_state.is_open = false">關閉</label>
        </div>
      </div>
    </div>
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