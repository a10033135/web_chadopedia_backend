<template>
  <div>
    <h1>MainCategoryContent</h1>
    <p> - - - </p>

    <nuxt-link class="btn btn-outline btn-success w-1/5 my-5" to="/editor/channel/create">新增</nuxt-link>

    <div class="overflow-x-auto ">
      <table class="table w-full">

        <!-- head -->
        <thead>
        <tr>
          <th></th>
          <th class="bg-blue-300 text-white">系統編號</th>
          <th class="bg-blue-300 text-white">主標題</th>
          <th class="bg-blue-300 text-white">是否上架</th>
          <th class="bg-blue-300 text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item , index) in main_cate_list" v-on:click="clickEditMainCat(item)">
          <th class="bg-blue-300 text-white text-sm">{{ index + 1 }}</th>
          <th class="bg-gray-400 text-white text-sm">{{ item.id.substring(0, 5) }}</th>
          <td class="bg-gray-400 text-white">
            <nuxt-link v-bind:to="`/editor/channel/`+item.id" class="hover:text-red-200">{{ item.title }}</nuxt-link>
          </td>
          <td class="bg-gray-400 text-red-300">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="bg-gray-400 text-white ">
            <!-- The button to open modal -->
            <label for="my-modal" class="badge badge-outline hover:bg-white hover:text-black"
                   v-on:click="clickEditMainCat(item)">編輯</label>
            <label class="badge badge-outline badge-error hover:bg-red-800 hover:text-white"
                   v-on:click="removeMainCat(item)">刪除</label>

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
                  <label for="my-modal" class="btn btn-outline btn-error my-6 w-full"
                         v-on:click="removeMainCat(item)">Delete</label>
                </div>
                <div class="modal-action">
                  <label for="my-modal" class="btn w-full" v-on:click="getData">關閉</label>
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
      main_cate_list: [] as MainCategory [],
      edit_category: new MainCategory('', '', '', false, '', 0, 0)
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$fire.firestore
        .collection('MainCate')
        .get()
        .then(querySnapShot => {
          this.main_cate_list = querySnapShot.docs.map(doc2MainCategory)
          console.log(this.main_cate_list)
        })
    },
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
          this.getData()
        })
    },
    removeMainCat(item: MainCategory) {
      console.log('removeMainCat')
      this.$fire.firestore
        .collection('MainCate')
        .doc(item.id)
        .delete()
        .then(result => {
          this.getData()
        })
    }
  }


})

</script>
