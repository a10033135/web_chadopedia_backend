<template>
  <div class="text-sm breadcrumbs">
    <ul>
      <li>
        <nuxt-link to="/editor/channel">頻道</nuxt-link>
      </li>
      <li>{{ id }}</li>
    </ul>

    <nuxt-link class="btn btn-outline btn-error w-1/5 my-5" :to="this.$route.path+`/create`">新增</nuxt-link>

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
        <tr v-for="(item , index) in sub_cate_list">
          <th class="bg-blue-300 text-white text-sm">{{ index + 1 }}</th>
          <th class="bg-gray-400 text-white text-sm">{{ item.id.substring(0, 5) }}</th>
          <td class="bg-gray-400 text-white">
            <nuxt-link v-bind:to="`/editor/channel/`+item.id" class="hover:text-red-200">{{ item.title }}</nuxt-link>
          </td>
          <td class="bg-gray-400 text-red-300">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="bg-gray-400 text-white ">
            <!-- The button to open modal -->
            <label for="my-modal" class="badge badge-outline hover:bg-white hover:text-black">編輯</label>
            <label class="badge badge-outline badge-error hover:bg-red-800 hover:text-white">刪除</label>

            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="my-modal" class="modal-toggle"/>
            <div class="modal">
              <div class="modal-box w-11/12 max-w-5xl">
                <h3 class="font-bold text-lg">系統編號：{{ edit_sub_cate.id }}</h3>
                <form class="my-6">

                  <div class="mb-6">
                    <label for="email" class="block mb-2 text-white">主分類名稱</label>
                    <input type="text" id="email" class="input text-white w-full " placeholder="ex: 茶茗" required>
                  </div>

                  <div class="mb-6">
                    <label for="email" class="block mb-2 text-white">描述</label>
                    <input type="text" placeholder="簡單描述" class="input text-white w-full"/>
                  </div>

                  <div class="mb-6">
                    <label for="url" class="block mb-2 text-white">主分類圖片</label>
                    <input type="url" id="url" v-model="edit_sub_cate.image_url"
                           class="input text-white w-full "
                           placeholder="google driver">
                  </div>

                  <div class="mb-6">
                    <label for="url" class="block mb-2 text-white">啟用</label>
                    <input type="checkbox" v-model:checked="edit_sub_cate.enable" class="checkbox"
                           placeholder="true"
                    >
                  </div>

                  <button class="btn btn-success w-full" >修改</button>
                </form>
                <div class="modal-action">
                  <label for="my-modal" class="btn btn-outline btn-error my-6 w-full">Delete</label>
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
import {SubCategory, doc2SubCategory} from "~/model/SubCategory";


export default Vue.extend({
  data() {
    return {
      id: '',
      sub_cate_list: [] as SubCategory[],
      edit_sub_cate: new SubCategory('', '', '', '', false, '', 0, 0)
    }
  },
  created() {
    const path = this.$route.path.split('/')
    this.id = path[path.length - 1]
    this.getData()
  },
  methods: {
    getData() {
      this.$fire.firestore
        .collection('SubCate')
        .where('main_cate_id', '==', this.id)
        .get()
        .then(querySnapShot => {
          this.sub_cate_list = querySnapShot.docs.map(doc2SubCategory)
          console.log(this.sub_cate_list)
        })
    }
  }

})

</script>
