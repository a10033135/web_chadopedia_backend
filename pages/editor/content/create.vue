<template>

  <div class="bg-gray-800 px-20 py-10">
    <form class="bg-gray-800 my-6" @submit.prevent="createContent">

      <div class="mb-6">
        <label for="title" class="block mb-2 text-white">標題</label>
        <input class="input text-white w-full" placeholder="請填寫標題"
               type="text" id="title" v-model="title">
      </div>

      <div class="mb-6">
        <label for="desc" class="block mb-2 text-white">描述</label>
        <input class="input text-white w-full"
               type="text" placeholder="簡單描述" v-model="desc">
      </div>

      <div class="mb-6">
        <label for="image_url" class="block mb-2 text-white">主分類圖片</label>
        <input class="input text-white w-full"
               type="url" id="image_url" v-model="image_url">
      </div>

      <div>
        <div class="p-4 w-80  bg-base-100">
          <ul v-for="item in main_categories" class="my-2">
            <li>
              <input type="checkbox" checked="checked"
                     class="checkbox checkbox-error"
                     @change="onMainCategoryCheckboxChange(item,$event.target.checked)"/>
              <span class="label-text">{{ item.title }}</span>
            </li>
            <li v-for="subItem in getSelectedCategories(item.id)"
                class="mx-8">
              <input type="checkbox" checked="checked"
                     class="checkbox checkbox-success"
                     @change="onSubCategoryCheckboxChange(item,subItem,$event.target.checked)"/>
              <span class="label-text">{{ subItem.title }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="p-4 w-80 bg-base-100 my-5">

      </div>

      <div class="mb-6">
        <label for="enable" class="block mb-2 text-white">啟用</label>
        <input class="checkbox"
               type="checkbox" v-model="enable">
      </div>

      <button class="btn btn-success w-full">Submit</button>

    </form>

    <button class="btn" v-on:click="cancel">Cancel</button>

  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import {ContentCategory} from "~/model/MatchaContent";
import {doc2MainCategory, MainCategory} from "~/model/MainCategory";
import {doc2SubCategory, SubCategory} from "~/model/SubCategory";

export default Vue.extend({
  data() {
    return {
      title: '',
      desc: '',
      image_url: '',
      enable: true,
      categories: [] as ContentCategory[],
      main_categories: [] as MainCategory[],
      sub_categories: [] as SubCategory[],
      select_main_id: '請選擇',
      select_sub_categories: [] as SubCategory[],
      select_sub_id: '請選擇'
      // select_main_category: new MainCategory('', '', '', false, '', 0, 0),
      // select_sub_category: new SubCategory('', '', '', '', false, '', 0, 0)
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    getCategories() {
      const firestore = this.$fire.firestore
      firestore
        .collection('MainCate')
        .get()
        .then(querySnapShot => {
          this.main_categories = querySnapShot.docs.map(doc2MainCategory)
          console.log(this.main_categories)
        })

      firestore
        .collection('SubCate')
        .get()
        .then(querySnapShot => {
          this.sub_categories = querySnapShot.docs.map(doc2SubCategory)
          console.log(this.sub_categories)
        })
    },
    createContent() {

    },
    getSelectedCategories(main_id: string): SubCategory[] {
      return this.sub_categories.filter((value, index, array) => {
        return value.main_cate_id == main_id
      })

    },
    cancel() {
      this.$router.back()
    },
    onMainCategoryCheckboxChange(main_category: MainCategory, isChecked: boolean) {
      console.log(main_category.title, isChecked)
    },
    onSubCategoryCheckboxChange(main_category: MainCategory, sub_category: SubCategory, isChecked: boolean) {
      console.log(main_category.title + sub_category.title, isChecked)
    }
  }


})
</script>

<style scoped>

</style>
