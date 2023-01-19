<template>
  <div>
    <h1>MainCategoryContent</h1>
    <label for="default-search"
           class="mb-2 text-sm font-medium text-gray-900 sr-only text-white">Search</label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 text-gray-400" fill="none"
             stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <form>

        <input type="search" id="default-search"
               class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
               placeholder="Search Mockups, Logos..." required>
        <button type="submit"
                class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
          Search
        </button>
      </form>

    </div>

    <p> - - - </p>

    <nuxt-link to="/EditorPage/EditMainCategoryContent">新增主分類</nuxt-link>

    <div class="overflow-x-auto ">
      <table class="table w-full">

        <!-- head -->
        <thead>
        <tr>
          <th></th>
          <th class="bg-blue-300 text-white">系統編號</th>
          <th class="bg-blue-300 text-white">主標題</th>
          <th class="bg-blue-300 text-white">是否上架</th>
          <th class="bg-blue-300 text-white">更新時間</th>
          <th class="bg-blue-300 text-white">描述</th>
          <th class="bg-blue-300 text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item , index) in main_categories">
          <th class="bg-blue-300 text-white">{{ index + 1 }}</th>
          <th class="bg-gray-400 text-white">{{ item.id }}</th>
          <td class="bg-gray-400 text-white">{{ item.title }}</td>
          <td class="bg-gray-400 text-red-300">{{ item.enable }}</td>
          <td class="bg-gray-400 text-white">{{ item.create_time }}</td>
          <td class="bg-gray-400 text-white">{{ item.desc }}</td>
          <td class="bg-gray-400 text-white ">
            <!-- The button to open modal -->
            <label for="my-modal" class="btn" v-on:click="clickEditMainCat(item)">編輯</label>

            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="my-modal" class="modal-toggle"/>
            <div class="modal">
              <div class="modal-box w-11/12 max-w-5xl">
                <h3 class="font-bold text-lg">系統編號：{{ edit_category.id }}</h3>
                <form class="my-6" @submit.prevent="submitEditMainCat">

                  <div class="mb-6">
                    <label for="email" class="block mb-2 text-white">主分類名稱</label>
                    <input type="text" id="email" v-model="edit_category.title"
                           class="input text-white w-full " placeholder="ex: 茶茗" required>
                  </div>

                  <div class="mb-6">
                    <label for="email" class="block mb-2 text-white">描述</label>
                    <input type="text" placeholder="簡單描述" v-model="edit_category.desc"
                           class="input text-white w-full"/>
                  </div>

                  <div class="mb-6">
                    <label for="url" class="block mb-2 text-white">主分類圖片</label>
                    <input type="url" id="url" v-model="edit_category.image_url"
                           class="input text-white w-full "
                           placeholder="google driver">
                  </div>

                  <div class="mb-6">
                    <label for="url" class="block mb-2 text-white">啟用</label>
                    <input type="checkbox" v-model:checked="edit_category.enable" class="checkbox"
                           placeholder="true"
                    >
                  </div>

                  <button class="btn btn-success w-full" v-model:onclick="submitEditMainCat">修改</button>

                </form>
                <div class="modal-action">
                  <label for="my-modal" class="btn">關閉</label>
                </div>
              </div>
            </div>
          </td>
        </tr>


        </tbody>
      </table>
    </div>

  </div>


</template>

<script lang="ts">
import Vue from 'vue';
import {doc2MainCategory, MainCategory} from "~/model/MainCategory";
import firebase from "firebase/compat";

export default Vue.extend({

  data() {
    return {
      main_categories: [] as MainCategory [],
      edit_category: new MainCategory('', '', '', false, '', 0, 0)
    };
  },
  created() {
    this.$fire.firestore
      .collection('MainCate')
      .get()
      .then(querySnapShot => {
        this.main_categories = querySnapShot.docs.map(doc2MainCategory)
        console.log(this.main_categories)
      })

  },
  methods: {
    clickEditMainCat(item: MainCategory) {
      this.edit_category = item
    },
    submitEditMainCat() {
      console.log('submitEditMainCat: ' + this.edit_category.title + this.edit_category.enable)
      this.$fire.firestore
        .collection('MainCate')
        .doc(this.edit_category.id)
        .update({
          'title': this.edit_category.title,
          'desc': this.edit_category.desc,
          'image_url': this.edit_category.image_url,
          'enable': this.edit_category.enable,
          'update_time': firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(result => {
        })

    }
  }


})

</script>
