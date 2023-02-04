<script lang="ts" setup>


import {SubCategory} from "~/model/SubCategory";
import {firestore} from "~/stores/firestore";
import {useNuxtApp, useRouter} from "#app";
import {collection, deleteDoc, doc, updateDoc} from "@firebase/firestore";
import {id} from "postcss-selector-parser";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

const {$firestore} = useNuxtApp()

const fire_store = firestore()

const route = useRoute()
const route_id = route.path.split('/')[3]

watch(fire_store, store => {
  state.sub_categories = store.sub_categories.filter(value => state.id == value.main_cate_id)
  state.main_category_title = fire_store.main_categories.find((value) => value.id == route_id)?.title ?? 'unknow'
})


const state = reactive({
  id: route_id,
  main_category_title: fire_store.main_categories.find((value) => value.id == route_id)?.title ?? 'unknow',
  sub_categories: fire_store.sub_categories.filter(value => route_id == value.main_cate_id),
  edit_sub_category: SubCategory.newInstance(),
  edit_sub_origin_sort: 0
})

function click_edit_sub_category(item: SubCategory) {
  state.edit_sub_category = item
  state.edit_sub_origin_sort = item.sort
}

function edit_sub_category() {

  state.sub_categories
      .filter(value => state.edit_sub_category.sort == value.sort)
      .forEach(value => {
        updateDoc(doc($firestore, 'SubCate', value.id), {
          sort: state.edit_sub_origin_sort
        })
      })


  updateDoc(doc(collection($firestore, 'SubCate'), state.edit_sub_category.id), {
    'title': state.edit_sub_category.title,
    'desc': state.edit_sub_category.desc,
    'sort': state.edit_sub_category.sort,
    'enable': state.edit_sub_category.enable,
    'update_time': Timestamp.now()
  })
}

function delete_sub_category(item: SubCategory) {
  deleteDoc(doc(collection($firestore, 'SubCate'), item.id))
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

    <nuxt-link class="btn btn-outline btn-error my-2" :to="this.$route.path+`/create`">新增</nuxt-link>

    <div class="overflow-x-auto ">
      <table class="table w-full">

        <!-- head -->
        <thead>
        <tr>
          <th class="bg-gray-400"></th>
          <th class="bg-gray-400 text-white">系統編號</th>
          <th class="bg-gray-400 text-white">主標題</th>
          <th class="bg-gray-400 text-white">是否上架</th>
          <th class="bg-gray-400 text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item , index) in state.sub_categories">
          <th class="bg-gray-600 text-white text-sm">{{ item.sort }}</th>
          <th class="bg-gray-600 text-white text-sm">{{ item.id.substring(0, 5) }}</th>
          <td class="bg-gray-600 text-white">{{ item.title }}</td>
          <td class="bg-gray-600 text-red-300">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="bg-gray-600 text-white ">
            <!-- The button to open modal -->
            <label for="my-modal" class="badge badge-outline hover:bg-white hover:text-black"
                   @click="click_edit_sub_category(item)">編輯</label>
            <label class="badge badge-outline badge-error hover:bg-red-800 hover:text-white"
                   @click="delete_sub_category(item)">刪除</label>
          </td>
        </tr>

        </tbody>
      </table>
    </div>
    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="my-modal" class="modal-toggle"/>
    <div class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">系統編號：{{ state.edit_sub_category.id }}</h3>
        <form class="my-6">

          <div class="mb-6">
            <label for="email" class="block mb-2 text-white">副分類名稱</label>
            <input type="text" id="email" v-model="state.edit_sub_category.title" class="input text-white w-full"
                   placeholder="ex: 茶茗" required>
          </div>

          <div class="mb-6">
            <label for="email" class="block mb-2 text-white">描述</label>
            <input type="text" placeholder="簡單描述" class="input text-white w-full"
                   v-model="state.edit_sub_category.desc"/>
          </div>

          <div class="mb-6">
            <label for="sort" class="block mb-2 text-white">排序</label>
            <input type="number" min="1" max="200" placeholder="0" v-model="state.edit_sub_category.sort">
          </div>

          <div class="mb-6">
            <label for="url" class="block mb-2 text-white">主分類圖片</label>
            <input type="url" id="url" v-model="state.edit_sub_category.image_url"
                   class="input text-white w-full "
                   placeholder="google driver">
          </div>

          <div class="mb-6">
            <label for="url" class="block mb-2 text-white">啟用</label>
            <input type="checkbox" v-model="state.edit_sub_category.enable" class="checkbox"
                   placeholder="true"
            >
          </div>


        </form>
        <div class="modal-action">
          <label for="my-modal" class="btn btn-success w-full" @click="edit_sub_category">修改</label>
        </div>
        <div class="modal-action">
          <label for="my-modal" class="btn btn-outline btn-error my-6 w-full">Delete</label>
        </div>
        <div class="modal-action">
          <label for="my-modal" class="btn w-full">關閉</label>
        </div>
      </div>
    </div>
  </div>

</template>

