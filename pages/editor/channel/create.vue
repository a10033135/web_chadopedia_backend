<template>
  <div class="bg-gray-800 px-20 py-10">
    <form class="bg-gray-800 my-6" @submit.prevent="submitEditMainCat">

      <div class="mb-6">
        <label for="email" class="block mb-2 text-white">主分類名稱</label>
        <input type="text" id="email" v-model="title"
               class="input text-white w-full " placeholder="ex: 茶茗" required>
      </div>

      <div class="mb-6">
        <label for="email" class="block mb-2 text-white">描述</label>
        <input type="text" placeholder="簡單描述" v-model="desc" class="input text-white w-full"/>
      </div>

      <div class="mb-6">
        <label for="url" class="block mb-2 text-white">主分類圖片</label>
        <input type="url" id="url" v-model="image_url"
               class="input text-white w-full "
               placeholder="google driver">
      </div>

      <div class="mb-6">
        <label for="url" class="block mb-2 text-white">啟用</label>
        <input type="checkbox" v-bind:checked="enable" class="checkbox"
               placeholder="true"
        >
      </div>

      <button class="btn btn-success w-full">Submit</button>

    </form>

    <button class="btn" v-on:click="cancel">Cancel</button>
  </div>
</template>

<script lang="ts">

import Vue from "vue"
import {getFirestore} from "firebase/firestore";
import firebase from "firebase/compat";

export default Vue.extend({
  data() {
    return {
      title: '',
      desc: '',
      image_url: '',
      enable: true
    };
  },
  methods: {
    submitEditMainCat() {
      console.log('submitEditMainCat')
      this.$fire.firestore
        .collection('MainCate')
        .add({
          'title': this.title,
          'desc': this.desc,
          'image_url': this.image_url,
          'enable': this.enable,
          'create_time': firebase.firestore.FieldValue.serverTimestamp(),
          'update_time': firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(document => {
          this.$router.push('/editor/channel')
        })
    },
    cancel() {
      console.log('back')
      this.$router.back()
    }
  },
})
</script>
