<template>
  <!-- component -->
  <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
    <aside
      class="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-500">
      <Editoritem v-for="item in test" :name="item.name"></Editoritem>
    </aside>
    <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
      <div class="main-content flex flex-col flex-grow p-4">
        <h1 class="font-bold text-2xl text-gray-700">Dashboard</h1>

        <Nuxt class="flex flex-col flex-grow border-4 border-gray-400 border-dashed bg-white rounded mt-4"></Nuxt>
      </div>
    </main>
  </div>
</template>

<script lang="ts">

import Vue from "vue"
import Editoritem from "~/components/editoritem.vue";

export default Vue.extend({
  data() {
    return {
      user: null,
      isLoggedIn: false,
      test: [] = [
        { name: '主類別', link: '' },
        { name: '子類別', link: '' },
        { name: '小分類', link: '' }]
    };
  },
  created() {
  },
  methods: {
    to() {
      console.log("to");
      this.$router.push("/edtior/second");
    },
    auth() {
      const user = this.$store.state.user.uid;
      console.log(user);
    }
  },
  components: { Editoritem }
})
</script>