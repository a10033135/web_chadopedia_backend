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
                   class="btn btn-xs btn-outline btn-success hover:btn-success"
                   @click="onEditItemClick(item)">編輯</label>

            <label class="btn btn-xs btn-outline btn-error hover:btn-error"
                   @click="onRemoveItemClick(item)">刪除</label>
          </td>
        </tr>
        </tbody>

      </table>
    </div>

    <input type="checkbox" id="modal" class="modal-toggle">
    <div class="modal">
      <div class="modal-box bg-gray-800 w-11/12 max-w-5xl">
        <div>
          <form>
            <div class="mb-6">
              <label for="title" class="block mb-2 text-white">標題</label>
              <input class="input text-white w-full" placeholder="請填寫標題"
                     type="text" id="title" v-model="edit_matcha_content.title">
            </div>

            <div class="mb-6">
              <label for="desc" class="block mb-2 text-white">描述</label>
              <input class="input text-white w-full"
                     type="text" placeholder="簡單描述" v-model="edit_matcha_content.desc">
            </div>

            <div class="mb-6">
              <label for="image_url" class="block mb-2 text-white">主分類圖片</label>
              <input class="input text-white w-full"
                     type="url" id="image_url" v-model="edit_matcha_content.image_url">
            </div>

            <div class="p-4 w-full  bg-base-100">
              <ul v-for="item in main_categories" class="my-2">
                <li>
                  <input type="checkbox" class="checkbox checkbox-error"
                         :checked="edit_matcha_content.main_categories.find((value)=>value===item.id)"
                         @change="onMainCategoryCheckboxChange(item,$event.target.checked)"/>
                  <span class="label-text">{{ item.title }}</span>
                </li>
                <li v-for="subItem in getSelectedCategories(item.id,sub_categories)"
                    class="mx-8">
                  <input type="checkbox" class="checkbox checkbox-success"
                         :checked="edit_matcha_content.sub_categories.find((value)=>value===subItem.id)"
                         @change="onSubCategoryCheckboxChange(item,subItem,$event.target.checked)"/>
                  <span class="label-text">{{ subItem.title }}</span>
                </li>
              </ul>
            </div>

            <div class="p-4 w-full bg-base-100 my-5 h-100">
              <div
                class="text-white"
                v-for="(select_main_cate_id,index) in this.edit_matcha_content.main_categories">
                {{ getMainCategoryTitle(select_main_cate_id) }}
              </div>
              <div
                class="text-white"
                v-for="(select_sub_cate_id,index) in this.edit_matcha_content.sub_categories">
                {{ getSubCategoryMainTitle(select_sub_cate_id) }} => {{ getSubCategoryTitle(select_sub_cate_id) }}
              </div>

            </div>

            <div class="mb-6">
              <label for="enable" class="block mb-2 text-white">啟用</label>
              <input class="checkbox"
                     type="checkbox" v-model="edit_matcha_content.enable">
            </div>

            <button class="btn btn-success w-full" @click="onSubmitEditClick">Submit</button>
          </form>
        </div>
        <div class="modal-action  my-2">
          <label for="modal" class="btn btn-outline btn-error w-full" @click="onRemoveItemClick(edit_matcha_content)">Delete</label>
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
import {doc2MainCategory, MainCategory} from "~/model/MainCategory";
import {doc2SubCategory, SubCategory} from "~/model/SubCategory";
import firebase from "firebase/compat";

export default Vue.extend({
  data() {
    return {
      matcha_contents: [] as MatchaContent[],
      main_categories: [] as MainCategory[],
      sub_categories: [] as SubCategory[],
      edit_matcha_content: MatchaContent.newInstance(),
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

      this.$fire.firestore
        .collection('MainCate')
        .get()
        .then(querySnapShot => {
          this.main_categories = querySnapShot.docs.map(doc2MainCategory)
          console.log(this.main_categories)
        })

      this.$fire.firestore.collection('SubCate')
        .get()
        .then(querySnapShot => {
          this.sub_categories = querySnapShot.docs.map(doc2SubCategory)
          console.log(this.sub_categories)
        })
    },
    getSelectedCategories(main_category_id: string, sub_categories: SubCategory[]): SubCategory[] {
      return sub_categories.filter((value) => value.main_cate_id == main_category_id)
    },
    cancel() {
      this.$router.back()
    },
    onMainCategoryCheckboxChange(main_category: MainCategory, isChecked: boolean) {
      console.log(main_category.id, this.edit_matcha_content.main_categories)
      this.edit_matcha_content.main_categories = this.edit_matcha_content.main_categories.filter((value) => main_category.id != value)
      if (isChecked) {
        this.edit_matcha_content.main_categories.push(main_category.id)
      }
    },
    onSubCategoryCheckboxChange(main_category: MainCategory, sub_category: SubCategory, isChecked: boolean) {
      console.log(sub_category.id, this.edit_matcha_content.sub_categories)
      this.edit_matcha_content.sub_categories = this.edit_matcha_content.sub_categories.filter((value) => sub_category.id != value)
      if (isChecked) {
        this.edit_matcha_content.sub_categories.push(sub_category.id)
      }
    },
    getMainCategoryTitle(main_id: string): string {
      return this.main_categories.find((value) => value.id === main_id)?.title ?? ''
    },
    getSubCategoryMainTitle(sub_id: string): string {
      const main_id = this.sub_categories.find((value) => sub_id === value.id)?.main_cate_id ?? ''
      return this.main_categories.find((value) => value.id == main_id)?.title ?? ''
    },
    getSubCategoryTitle(sub_id: string): string {
      return this.sub_categories.find((value) => value.id === sub_id)?.title ?? ''
    },
    onSubmitEditClick() {
      this.$fire.firestore
        .collection('MatchaContent')
        .doc(this.edit_matcha_content.id)
        .set({
          'title': this.edit_matcha_content.title,
          'desc': this.edit_matcha_content.desc,
          'image_url': this.edit_matcha_content.image_url,
          'enable': this.edit_matcha_content.enable,
          'main_categories': firebase.firestore.FieldValue.arrayUnion(...this.edit_matcha_content.main_categories),
          'sub_categories': firebase.firestore.FieldValue.arrayUnion(...this.edit_matcha_content.sub_categories),
          'update_time': firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(result => {
          this.getData()
        })

    },
    onEditItemClick(item: MatchaContent) {
      this.edit_matcha_content = new MatchaContent(item.id, item.title, item.desc, item.enable, item.image_url, item.main_categories, item.sub_categories, item.create_time, item.update_time)
    },
    onRemoveItemClick(item: MatchaContent) {
      this.$fire.firestore.collection('MatchaContent').doc(item.id).delete().then((value) => {
        this.getData()
      })
    }
  }

})
</script>
