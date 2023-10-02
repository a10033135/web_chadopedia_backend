<script lang="ts" setup>


import {SubCategory} from "~/model/SubCategory";
import {firestore} from "~/stores/firestore";
import {useNuxtApp, useRouter} from "#app";
import {collection, deleteDoc, doc, Timestamp, updateDoc} from "@firebase/firestore";
import {CloudinaryImage} from "@cloudinary/url-gen/assets/CloudinaryImage";
import {destroyImage, genSubCategoryPath,} from "~/utils/cloudinaryUtils";
import {defaultImage} from "@cloudinary/url-gen/actions/delivery";
import { integer } from "vscode-languageserver-types";

const {$firestore} = useNuxtApp()

const fire_store = firestore()

const route = useRoute()
const route_id = route.path.split('/')[3]

const {$cld} = useNuxtApp()

watch(fire_store, store => {
  state.sub_categories = store.sub_categories.filter(value => state.id == value.main_cate_id)
  state.main_category_title = fire_store.main_categories.find((value) => value.id == route_id)?.title ?? 'unknow'
})

const search_state = reactive({
  search_key: ''
})

watch(search_state, search => {
  if (search.search_key == '') {
    state.sub_categories = fire_store.sub_categories.filter(value => route_id == value.main_cate_id)
  } else {
    const regex = `${search.search_key}+`
    state.sub_categories = fire_store.sub_categories.filter(value => route_id == value.main_cate_id).filter(value => value.title.match(regex))
  }
})


const state = reactive({
  id: route_id,
  main_category_title: fire_store.main_categories.find((value) => value.id == route_id)?.title ?? 'unknow',
  sub_categories: fire_store.sub_categories.filter(value => route_id == value.main_cate_id),
  edit_sub_category: SubCategory.newInstance(),
  edit_sub_origin_sort: 0
})

const modal_state = reactive({
  is_open: false,
  is_delete_loading: false,
  is_submit_loading: false
})

const crop_image_state = reactive({
  last_image: null as CloudinaryImage | null,
  cropped_image: null as string | ArrayBuffer | null | undefined,
  upload_image: null as string | ArrayBuffer | null | undefined
})

function click_edit_sub_category(item: SubCategory) {
  const cloudinary_version = useCookie('cloudinary_version')
  modal_state.is_open = true
  state.edit_sub_category = new SubCategory(item.id, item.main_cate_id, item.title, item.desc, item.enable, item.sort, item.has_image, item.create_time, item.update_time)
  state.edit_sub_origin_sort = item.sort
  crop_image_state.cropped_image = null
  crop_image_state.upload_image = null
  crop_image_state.last_image = $cld.image(genSubCategoryPath(item.id)).setVersion(cloudinary_version.value ?? '').delivery(defaultImage('placeholder.png'))
}

async function edit_sub_category() {
  modal_state.is_submit_loading = true
  state.sub_categories
      .filter(value => state.edit_sub_category.sort == value.sort)
      .forEach(value => {
        updateDoc(doc($firestore, 'SubCate', value.id), {
          sort: state.edit_sub_origin_sort
        })
      })

  await updateDoc(doc(collection($firestore, 'SubCate'), state.edit_sub_category.id), {
    'title': state.edit_sub_category.title,
    'desc': state.edit_sub_category.desc,
    'has_image': state.edit_sub_category.has_image,
    'sort': state.edit_sub_category.sort,
    'enable': state.edit_sub_category.enable,
    'update_time': Timestamp.now()
  })

  const is_need_upload = crop_image_state.cropped_image != null

  if (is_need_upload) {
    await uploadImage(genSubCategoryPath(state.edit_sub_category.id), crop_image_state.cropped_image as string)
  }

  modal_state.is_open = false
  modal_state.is_submit_loading = false

}

async function delete_sub_category(item: SubCategory) {
  await deleteDoc(doc(collection($firestore, 'SubCate'), item.id))
  await destroyImage(genSubCategoryPath(item.id))
}

function get_date_string(ts:integer):string{
  const date = new Date(ts*1000)  
  return date.toLocaleString()
}

</script>
<template>

  <div class="text-sm breadcrumbs">
    <ul>
      <li>
        <nuxt-link to="/editor/channel">頻道</nuxt-link>
      </li>
      <li>{{ state.main_category_title }}</li>
    </ul>

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

    <nuxt-link class="btn btn-outline btn-error my-2" :to="route.path+`/create`">新增</nuxt-link>

    <div class="overflow-x-auto ">
      <table class="table w-full">

        <!-- head -->
        <thead>
        <tr>
          <th class="bg-gray-400"></th>
          <th class="bg-gray-400 text-white">系統編號</th>
          <th class="bg-gray-400 text-white">主標題</th>
          <th class="bg-gray-400 text-white">更新時間</th>
          <th class="bg-gray-400 text-white">是否上架</th>
          <th class="bg-gray-400 text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item , index) in state.sub_categories">
          <th class="bg-gray-600 text-white text-sm">{{ item.sort }}</th>
          <th class="bg-gray-600 text-white text-sm">{{ item.id.substring(0, 5) }}</th>
          <td class="bg-gray-600 text-white">{{ item.title }}</td>
          <td class="bg-gray-600 text-white">{{ get_date_string(item.update_time) }}</td>
          <td class="bg-gray-600 text-red-300">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="bg-gray-600 text-white">
            <!-- The button to open modal -->
            <label for="my-modal" class="badge badge-outline hover:bg-white hover:text-black"
                   @click="click_edit_sub_category(item)">編輯</label>
            <label class="badge badge-outline badge-error hover:bg-red-800 hover:text-white"
                   :class="{'loading':modal_state.is_delete_loading}"
                   @click="delete_sub_category(item)">刪除</label>
          </td>
        </tr>

        </tbody>
      </table>
    </div>
    <!-- Put this part before </body> tag -->
    <div class="modal" :class="{'modal-open':modal_state.is_open}">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">系統編號：{{ state.edit_sub_category.id }}</h3>
        <form class="my-6">

          <div class="mb-6">
            <label for="email" class="block mb-2 text-white">副分類名稱</label>
            <input type="text" id="email" v-model="state.edit_sub_category.title"
                   class="input input-success text-white w-full"
                   placeholder="ex: 茶茗" required>
          </div>

          <div class="mb-6">
            <label for="email" class="block mb-2 text-white">描述</label>
            <input type="text" placeholder="簡單描述" class="input input-success text-white w-full"
                   v-model="state.edit_sub_category.desc"/>
          </div>

          <div class="mb-6">
            <label for="sort" class="block mb-2 text-white">排序</label>
            <input type="number" class="select select-success" min="1" max="200" placeholder="0"
                   v-model="state.edit_sub_category.sort">
          </div>

          <!-- img -->
          <div>
            <cloudinary-upload
                v-model:is_show="modal_state.is_open"
                v-model:has_image="state.edit_sub_category.has_image"
                v-model:last_image="crop_image_state.last_image"
                v-model:crop_image="crop_image_state.cropped_image"
                v-model:upload_image="crop_image_state.upload_image"/>
          </div>

          <div class="mb-6">
            <label for="url" class="block mb-2 text-white">啟用</label>
            <input type="checkbox" v-model="state.edit_sub_category.enable" class="checkbox checkbox-success"
                   placeholder="true">
          </div>


        </form>
        <div>
          <label class="btn btn-success w-full"
                 :class="{'loading':modal_state.is_submit_loading}"
                 @click="edit_sub_category">修改</label>
        </div>
        <div>
          <label class="btn btn-outline btn-error my-6 w-full"
                 :class="{'loading':modal_state.is_delete_loading}"
                 @click="delete_sub_category(state.edit_sub_category)">Delete</label>
        </div>
        <div>
          <label class="btn w-full" @click="modal_state.is_open = false">關閉</label>
        </div>
      </div>
    </div>
  </div>

</template>

