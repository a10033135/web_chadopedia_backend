<script setup lang="ts">

import {useNuxtApp} from "#app";
import {firestore} from "~/stores/firestore";
import {MainCategory} from "~/model/MainCategory";
import {deleteDoc, doc, setDoc, Timestamp, updateDoc} from "@firebase/firestore";

const {$firestore} = useNuxtApp()
const fire_store = firestore()

watch(fire_store, (store) => {
  state.main_cate_list = store.main_categories
})


const state = reactive({
  main_cate_list: fire_store.main_categories,
  edit_category: MainCategory.newInstance(),
  edit_sub_origin_sort: 0
})

function click_edit_main_cate(main_category: MainCategory) {
  console.log('click_edit_main_cate', main_category)
  state.edit_category = main_category
  state.edit_sub_origin_sort = main_category.sort
}

async function remove_main_cate(main_category: MainCategory) {
  console.log('remove_main_cate', main_category)
  await deleteDoc(doc($firestore, 'MainCate', main_category.id))
}

async function submit_edit_category() {
  console.log('submitEditMainCat: ' + state.edit_category.title + state.edit_category.enable)


  state.main_cate_list
      .filter(value => state.edit_category.sort == value.sort)
      .forEach(value => {
        updateDoc(doc($firestore, 'SubCate', value.id), {
          sort: state.edit_sub_origin_sort
        })
      })

  await updateDoc(doc($firestore, 'MainCate', state.edit_category.id), {
    'title': state.edit_category.title,
    'desc': state.edit_category.desc,
    'image_url': state.edit_category.image_url,
    'sort': state.edit_sub_origin_sort,
    'enable': state.edit_category.enable,
    'update_time': Timestamp.now()
  })
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
    <input type="checkbox" id="modal" class="modal-toggle"/>
    <div class="modal">
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

          <div class="mb-6">
            <label for="url" class="block mb-2 text-white">主分類圖片</label>
            <input type="url" id="url" v-model="state.edit_category.image_url"
                   class="input text-white w-full "
                   placeholder="google driver">
          </div>

          <div class="mb-6">
            <label for="url" class="block mb-2 text-white">啟用</label>
            <input type="checkbox" class="checkbox" v-model="state.edit_category.enable"
                   placeholder="true">
          </div>

        </form>
        <div class="modal-action">
          <label for="modal" class="btn btn-success w-full"
                 v-on:click="submit_edit_category">修改</label>
        </div>

        <div class="modal-action">
          <label for="modal" class="btn btn-outline btn-error my-6 w-full"
                 v-on:click="remove_main_cate(state.edit_category)">Delete</label>
        </div>
        <div class="modal-action">
          <label for="modal" class="btn w-full">關閉</label>
        </div>
      </div>
    </div>
  </div>
</template>

