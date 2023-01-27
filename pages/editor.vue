<template>
  <!-- component -->
  <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
    <aside
      class="sidebar w-32 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-500">
      <Editoritem v-for="item in test" :name="item.main_id" :link="item.link"></Editoritem>
    </aside>
    <main class="main flex flex-col flex-grow -ml-32 md:ml-0 transition-all duration-150 ease-in">
      <div class="main-content flex flex-col flex-grow">
        <Nuxt class="flex flex-col flex-grow bg-white rounded p-8"></Nuxt>
      </div>
    </main>
  </div>
</template>

<script lang="ts">

import Vue from "vue"
import Editoritem from "~/components/editoritem.vue";

import { getFirestore } from "firebase/firestore";

export default Vue.extend({
  data() {
    return {
      user: null,
      isLoggedIn: false,
      test: [] = [
        { main_id: '分類', link: '/editor/channel' },
        { main_id: '內容', link: '/editor/content' }]
    };
  },
  async created() {

  },
  methods: {
    auth() {
      const user = this.$store.state.user.uid;
      console.log(user);
    }
  },
  components: { Editoritem }
})
</script>
