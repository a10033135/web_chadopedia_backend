<script setup lang="ts">

import {ChadoContent} from "~/model/ChadoContent";
import {MainCategory} from "~/model/MainCategory";
import {SubCategory} from "~/model/SubCategory";
import {firestore} from "~/stores/firestore";
import {useNuxtApp} from "#app";
import {Timestamp, arrayUnion, deleteDoc, doc, setDoc} from "@firebase/firestore";
import {CloudinaryImage} from "@cloudinary/url-gen/assets/CloudinaryImage";
import {destroyImage, genChadoContentPath, uploadImage} from "~/utils/cloudinaryUtils";
import {defaultImage} from "@cloudinary/url-gen/actions/delivery";
import { integer } from "vscode-languageserver-types";


const {$firestore} = useNuxtApp()
const fire_store = firestore()

const {$cld} = useNuxtApp()

watch(fire_store, (store) => {
  state.main_categories = store.main_categories
  state.sub_categories = store.sub_categories
  state.chado_contents = store.chado_contents
})

const modal_state = reactive({
  is_open: false,
  is_submit_loading: false,
  is_delete_loading: false
})

const search_state = reactive({
  search_key: ''
})

watch(search_state, search => {
  if (search.search_key == '') {
    state.chado_contents = fire_store.chado_contents
  } else {
    const regex = `${search.search_key}+`
    state.chado_contents = fire_store.chado_contents.filter(value => value.title.match(regex))
  }
})

const state = reactive({
  chado_contents: fire_store.chado_contents,
  main_categories: fire_store.main_categories,
  sub_categories: fire_store.sub_categories,
  edit_chado_content: ChadoContent.newInstance(),
})

const crop_image_state = reactive({
  last_image: null as CloudinaryImage | null,
  edit_upload_img: null as string | ArrayBuffer | null | undefined,
  edit_crop_img: null as string | ArrayBuffer | null | undefined
})

function click_edit_item(item: ChadoContent) {
  const version = useCookie(cloudinary_version).value
  modal_state.is_open = true
  state.edit_chado_content = new ChadoContent(item.id, item.title, item.desc, item.enable, item.has_image, item.main_categories, item.sub_categories, item.create_time, item.update_time)
  crop_image_state.edit_upload_img = null // 被上傳的圖片
  crop_image_state.edit_crop_img = null // 被裁切的圖片
  crop_image_state.last_image = $cld.image(genChadoContentPath(item.id)).setVersion(version ?? '').delivery(defaultImage('placeholder.png'))
}

async function click_remove_item(item: ChadoContent) {
  console.log('click_remove_item')
  modal_state.is_delete_loading = true
  await deleteDoc(doc($firestore, 'ChadoContent', item.id))
  await destroyImage(genChadoContentPath(item.id))

  modal_state.is_delete_loading = false
  modal_state.is_open = false
}

async function click_edit_submit() {
  modal_state.is_submit_loading = true
  await setDoc(doc($firestore, 'ChadoContent', state.edit_chado_content.id), {
    'title': state.edit_chado_content.title,
    'desc': state.edit_chado_content.desc,
    'enable': state.edit_chado_content.enable,
    'has_image': state.edit_chado_content.has_image,
    'main_categories': arrayUnion(...state.edit_chado_content.main_categories),
    'sub_categories': arrayUnion(...state.edit_chado_content.sub_categories),
    'create_time': state.edit_chado_content.create_time,
    'update_time': Timestamp.now()
  })
  const is_need_upload = crop_image_state.edit_crop_img != null
  if (is_need_upload) {
    await uploadImage(genChadoContentPath(state.edit_chado_content.id), crop_image_state.edit_crop_img as string)
  }
  modal_state.is_open = false
  modal_state.is_submit_loading = false
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

function get_date_string(ts:integer):string{
  const date = new Date(ts*1000)  
  return date.toLocaleString()
}

</script>


<template>
  <div>
    <h1>ContentPage</h1>
    <p> - - - </p>
    <div class="form-control">
      <div class="input-group">
        <input type="text" placeholder="Search…" v-model="search_state.search_key" class="input input-bordered input-success w-1/2"/>
        <button class="btn btn-square btn-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
      </div>
    </div>

    <nuxt-link class="btn btn-outline btn-success my-2" to="/editor/content/create">新增內容</nuxt-link>

    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th class="bg-gray-400 text-white"></th>
          <th class="bg-gray-400 text-white">系統編號</th>
          <th class="bg-gray-400 text-white">主標題</th>
          <th class="bg-gray-400 text-white">更新時間</th>
          <th class="bg-gray-400 text-white">是否上架</th>
          <th class="bg-gray-400 text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item,index) in state.chado_contents">
          <td class="text-sm bg-gray-600 text-white">{{ index + 1 }}</td>
          <td class="text-sm bg-gray-600 text-white">{{ item.id.substring(0, 5) }}</td>
          <td class="bg-gray-600 text-white">{{ item.title }}</td>
          <td class="bg-gray-600 text-white">{{ get_date_string(item.update_time) }}</td>

          <td class="text-red-300 bg-gray-600">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="hover:text-blue-200 bg-gray-600">
            <!-- The button to open modal -->
            <label for="modal"
                   class="btn btn-xs btn-outline btn-success hover:btn-success"
                   @click="click_edit_item(item)">編輯</label>

            <label class="btn btn-xs btn-outline btn-error hover:btn-error"
                   :class="{'loading':modal_state.is_delete_loading}"
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
              <input class="input input-success text-white w-full" placeholder="請填寫標題"
                     type="text" id="title" v-model="state.edit_chado_content.title">
            </div>

            <div class="mb-6">
              <label for="desc" class="block mb-2 text-white">描述</label>
              <input class="input input-success text-white w-full"
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
                  v-model:is_show="modal_state.is_open"
                  v-model:last_image="crop_image_state.last_image"
                  v-model:crop_image="crop_image_state.edit_crop_img"
                  v-model:has_image="state.edit_chado_content.has_image"
                  v-model:upload_image="crop_image_state.edit_upload_img"/>

            </div>

            <div class="flex mb-6">

              <input class="checkbox checkbox-success"
                     type="checkbox" v-model="state.edit_chado_content.enable">
              <label for="enable" class="block mb-2 text-white">啟用</label>
            </div>

          </form>
        </div>
        <div class="my-2">
          <label class="btn btn-success w-full" :class="{'loading':modal_state.is_submit_loading}"
                 @click="click_edit_submit">Submit</label>
        </div>
        <div class="my-2">
          <label class="btn btn-outline btn-error w-full"
                 :class="{'loading':modal_state.is_delete_loading}"
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