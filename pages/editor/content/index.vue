<template>
  <div>
    <h1>ContentPage</h1>
    <p> - - - </p>
    <nuxt-link class="btn btn-outline btn-success my-2" to="/editor/content/create">新增內容</nuxt-link>

    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th></th>
          <th class="text-white">系統編號</th>
          <th class="text-white">主標題</th>
          <th class="text-white">是否上架</th>
          <th class="text-white">編輯</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item,index) in matcha_contents">
          <td class="text-white text-sm">{{ index + 1 }}</td>
          <td class="text-white text-sm">{{ item.id.substring(0, 5) }}</td>
          <td class="text-white text-white">{{ item.title }}</td>
          <td class="text-red-300">{{ item.enable ? '上架' : '下架' }}</td>
          <td class="text-white hover:text-blue-200">
            <!-- The button to open modal -->
            <label for="modal"
                   class="btn btn-xs btn-outline btn-success hover:btn-success">編輯</label>

            <label
              class="btn btn-xs btn-outline btn-error hover:btn-error">刪除</label>

          </td>

        </tr>

        </tbody>

      </table>
    </div>

    <input type="checkbox" id="modal" class="modal-toggle">
    <div class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <div>

        </div>
        <div class="modal-action  my-2">
          <label for="modal" class="btn btn-outline btn-error w-full">Delete</label>
        </div>
        <div class="modal-action  my-2">
          <label for="modal" class="btn w-full">關閉</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {doc2ContentDetail, MatchaContent} from "~/model/MatchaContent";
import {MainCategory} from "~/model/MainCategory";
import {SubCategory} from "~/model/SubCategory";

export default Vue.extend({
  data() {
    return {
      matcha_contents: [] as MatchaContent[],
      main_categories: [] as MainCategory[],
      sub_categories: [] as SubCategory[],
      edit_matcha_content: MatchaContent.newInstance()
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$fire.firestore
        .collection('MatchaContent')
        .get()
        .then(querySnapShot => {
          this.matcha_contents = querySnapShot.docs.map(doc2ContentDetail)
          console.log(this.matcha_contents)
        })
    },
  }

})
</script>
