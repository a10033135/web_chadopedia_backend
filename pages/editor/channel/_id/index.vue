<template>
  <div class="text-sm breadcrumbs">
    <ul>
      <li>
        <nuxt-link to="/editor/channel">頻道</nuxt-link>
      </li>
      <li>{{ main_title }}</li>
    </ul>

    <nuxt-link class="btn btn-outline btn-error my-5" :to="this.$route.path+`/create`">新增</nuxt-link>

    <div class="overflow-x-auto ">
      <table class="table w-full">

        <!-- head -->
        <thead>
        <tr>
          <th></th>
          <th class=" text-white">系統編號</th>
          <th class=" text-white">主標題</th>
          <th class=" text-white">是否上架</th>
          <th class=" text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item , index) in sub_cate_list">
          <td class=" text-white text-sm">{{ index + 1 }}</td>
          <td class=" text-white text-sm">{{ item.id.substring(0, 5) }}</td>
          <td class=" text-white">{{ item.title }}</td>
          <td class=" text-red-300">{{ item.enable ? '上架' : '下架' }}</td>
          <td class=" text-white ">
            <!-- The button to open modal -->
            <label for="my-modal" class="badge badge-outline hover:bg-white hover:text-black"
                   @click="clickEditSubCate(item)">編輯</label>
            <label class="badge badge-outline badge-error hover:bg-red-800 hover:text-white"
                   @click="deleteSubCate(item)">刪除</label>

            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="my-modal" class="modal-toggle"/>
            <div class="modal">
              <div class="modal-box w-11/12 max-w-5xl">
                <h3 class="font-bold text-lg">系統編號：{{ edit_sub_cate.id }}</h3>
                <form class="my-6">

                  <div class="mb-6">
                    <label for="email" class="block mb-2 text-white">副分類名稱</label>
                    <input type="text" id="email" class="input text-white w-full" placeholder="ex: 茶茗" required>
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

                </form>
                <div class="modal-action">
                  <label for="my-modal" class="btn btn-success w-full" @click="clickSubmitEditCate">修改</label>
                </div>
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
import {doc2MainCategory, MainCategory} from "~/model/MainCategory";


export default Vue.extend({
  data() {
    return {
      id: '',
      main_title: '',
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
        .collection('MainCate')
        .doc(this.id)
        .get()
        .then(querySnapShot => {
          console.log(querySnapShot)
          const data = querySnapShot.data()
          if (data) {
            this.main_title = data['title'] ?? ''
          }
        })
      this.$fire.firestore
        .collection('SubCate')
        .where('main_cate_id', '==', this.id)
        .get()
        .then(querySnapShot => {
          this.sub_cate_list = querySnapShot.docs.map(doc2SubCategory)
          console.log(this.sub_cate_list)
        })
    },
    clickEditSubCate(item: SubCategory) {
      this.edit_sub_cate = new SubCategory(item.id, item.main_cate_id, item.title, item.desc, item.enable, item.image_url, item.create_time, item.update_time)
    },
    clickSubmitEditCate() {
      this.$fire.firestore
        .collection('SUbCate')
        .doc(this.edit_sub_cate.id)
        .set({
          title: this.edit_sub_cate.title,
          desc: this.edit_sub_cate.desc,
          image_url: this.edit_sub_cate.image_url,
          update_time: this.edit_sub_cate.update_time
        })
        .then(result => {
          this.getData()
        })
    },
    deleteSubCate(item: SubCategory) {
      this.$fire.firestore
        .collection('SubCate')
        .doc(item.id)
        .delete()
        .then(result => {
          this.getData()
        })
    }
  }

})

</script>
