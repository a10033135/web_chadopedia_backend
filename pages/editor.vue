<script setup lang="ts">
import {useNuxtApp} from "#app";
import {firestore} from "~/stores/firestore";

const {$firestore} = useNuxtApp()
const fire_store = firestore()

fire_store.update_main_categories($firestore)
fire_store.update_sub_categories($firestore)
fire_store.update_chado_contents($firestore)


const state = reactive({
  selected_categories: [] = [
    {main_id: '分類', link: '/editor/channel'},
    {main_id: '內容', link: '/editor/content'}
  ]
})

</script>

<template>
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
            <li v-for="item in state.selected_categories">
              <NuxtLink :to="item.link">{{ item.main_id }}</NuxtLink>
            </li>

          </ul>
        </div>
      </div>
      <div class="flex-1">
      </div>
    </div>
    <main class="main flex flex-col flex-grow  transition-all duration-150 ease-in">
      <div class="main-content flex flex-col flex-grow">
        <NuxtPage class="h-max flex flex-col flex-grow bg-gray-800 rounded p-8"></NuxtPage>
      </div>
    </main>
  </div>
</template>

