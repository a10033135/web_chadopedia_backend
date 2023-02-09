<script setup lang="ts">
import {useNuxtApp, useRoute} from "#app";
import {firestore} from "~/stores/firestore";

const {$firestore} = useNuxtApp()
const fire_store = firestore()

fire_store.update_main_categories($firestore)
fire_store.update_sub_categories($firestore)
fire_store.update_chado_contents($firestore)

const route = useRoute()


const state = reactive({
  page_title: '',
  selected_categories: [] = [
    {main_id: '分類', link: '/editor/channel'},
    {main_id: '內容', link: '/editor/content'}
  ]
})

watch(route, (route) => {
  let routeArray = (route.name as string).split('-')
  state.page_title = getPageTitle(routeArray[1], routeArray[2], routeArray[3])
})

let routeArray = (route.name as string).split('-')
state.page_title = getPageTitle(routeArray[1], routeArray[2], routeArray[3])


function getPageTitle(route1: string, route2: string, route3: string): string {
  let result = ''
  switch (route1) {
    case 'content':
      result += '內容'
      break
    case 'channel':
      result += '主頻道'
      break
  }
  switch (route2) {
    case 'create':
      result += '/新增'
      break
    case 'id':
      result += '/子項目'
      break
  }
  switch (route3) {
    case 'create':
      result += '/新增'
      break
    case 'id':
      result += '/子項目'
      break
  }
  return result
}

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
      <div class="flex-2 text-center">{{ state.page_title }}
      </div>
    </div>
    <main class="main flex flex-col flex-grow  transition-all duration-150 ease-in">
      <div class="main-content flex flex-col flex-grow">
        <NuxtPage class="h-max flex flex-col flex-grow bg-gray-800 rounded p-8"></NuxtPage>
      </div>
    </main>
  </div>
</template>

