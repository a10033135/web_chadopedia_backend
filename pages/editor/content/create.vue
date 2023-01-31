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

      <div class="p-4 w-full  bg-base-100">
        <ul v-for="item in main_categories" class="my-2">
          <li>
            <input type="checkbox" class="checkbox checkbox-error"
                   @change="onMainCategoryCheckboxChange(item,$event.target.checked)"/>
            <span class="label-text">{{ item.title }}</span>
          </li>
          <li v-for="subItem in getSelectedCategories(item.id,sub_categories)"
              class="mx-8">
            <input type="checkbox" class="checkbox checkbox-success"
                   @change="onSubCategoryCheckboxChange(item,subItem,$event.target.checked)"/>
            <span class="label-text">{{ subItem.title }}</span>
          </li>
        </ul>
      </div>

      <div class="p-4 w-full bg-base-100 my-5 h-100">
        <div
          class="text-white"
          v-for="(select_main_category,index) in this.selected_main_categories">
          {{ select_main_category.title }}
        </div>
        <div
          class="text-white"
          v-for="(select_sub_category,index) in selected_sub_categories">
          {{ getMainCategoryTitle(select_sub_category.main_cate_id) }} => {{ select_sub_category.title }}
        </div>

      </div>

      <div class="mb-6">
        <label for="enable" class="block mb-2 text-white">啟用</label>
        <input class="checkbox"
               type="checkbox" v-model="enable">
      </div>

      <button class="btn btn-success w-full" @click="onSubmitClick">Submit</button>

    </form>

    <button class="btn" v-on:click="cancel">Cancel</button>

  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import {ContentCategory} from "~/model/MatchaContent";
import {doc2MainCategory, MainCategory} from "~/model/MainCategory";
import {doc2SubCategory, SubCategory} from "~/model/SubCategory";
import firebase from "firebase/compat";

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
      selected_main_categories: [] as MainCategory[],
      selected_sub_categories: [] as SubCategory[]
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
    getSelectedCategories(main_category_id: string, sub_categories: SubCategory[]): SubCategory[] {
      return sub_categories.filter((value) => value.main_cate_id == main_category_id)
    },
    cancel() {
      this.$router.back()
    },
    onMainCategoryCheckboxChange(main_category: MainCategory, isChecked: boolean) {
      console.log(main_category.id, isChecked)
      this.selected_main_categories = this.selected_main_categories.filter((value) => value != main_category)
      if (isChecked) {
        this.selected_main_categories.push(main_category)
      }
      this.selected_main_categories.sort((a, b) => a.id.localeCompare(b.id))
    },
    onSubCategoryCheckboxChange(main_category: MainCategory, sub_category: SubCategory, isChecked: boolean) {
      console.log(sub_category.id, isChecked)
      this.selected_sub_categories = this.selected_sub_categories.filter((value) => value != sub_category)
      if (isChecked) {
        this.selected_sub_categories.push(sub_category)
      }
      this.selected_sub_categories.sort((a, b) => a.main_cate_id.localeCompare(b.main_cate_id))
    },
    getMainCategoryTitle(main_id: string): string {
      return this.main_categories.find((value) => value.id == main_id)?.title ?? ''
    },
    onSubmitClick() {
      console.log('onSubmitClick')
      this.$fire.firestore
        .collection('MatchaContent')
        .add({
          'title': this.title,
          'desc': this.desc,
          'image_url': this.image_url,
          'enable': this.enable,
          'main_categories': firebase.firestore.FieldValue.arrayUnion(...this.selected_main_categories.map((value) => value.id)),
          'sub_categories': firebase.firestore.FieldValue.arrayUnion(...this.selected_sub_categories.map((value) => value.id)),
          'create_time': firebase.firestore.FieldValue.serverTimestamp(),
          'update_time': firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(reason => {
          console.log(reason)
        })
        .then(document => {
          this.$router.push('/editor/content')
        })
    }
  }


})
</script>
