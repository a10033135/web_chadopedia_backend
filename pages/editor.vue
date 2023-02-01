<template>
  <!-- component -->
  <div>
    <div class="navbar bg-base-100">
      <div class="flex-none">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
          </label>
          <ul tabindex="0"
              class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li v-for="item in selected_categories">
              <NuxtLink :to="item.link">{{ item.main_id }}</NuxtLink>
            </li>

          </ul>
        </div>
      </div>
      <div class="flex-1">
        <a class="mx-5 normal-case text-xl">{{ this.$route.name}}</a>
      </div>
    </div>
    <main class="main flex flex-col flex-grow -ml-32 md:ml-0 transition-all duration-150 ease-in">
      <div class="main-content flex flex-col flex-grow">
        <Nuxt class="h-max flex flex-col flex-grow bg-gray-800 rounded p-8"></Nuxt>
      </div>
    </main>
  </div>
</template>

<script lang="ts">

import Vue from "vue"
import Editoritem from "~/components/editoritem.vue";

import {getFirestore} from "firebase/firestore";
import editoritem from "~/components/editoritem.vue";

export default Vue.extend({
  data() {
    return {
      user: null,
      isLoggedIn: false,
      selected_categories: [] = [
        {main_id: '分類', link: '/editor/channel'},
        {main_id: '內容', link: '/editor/content'}
      ]
    };
  },
  methods: {
    auth() {
      const user = this.$store.state.user.uid;
      console.log(user);
    }
  },
  components: {editoritem}
})
</script>
