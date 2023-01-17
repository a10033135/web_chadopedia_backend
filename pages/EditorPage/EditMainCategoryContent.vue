<template>
    <div class="dark:bg-gray-800 px-20 pt-20">
        <div class="mb-6 ">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">系統編號：</label>
        </div>

        <form class="dark:bg-gray-800" @submit.prevent="SubmitEvent">
            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">主分類名稱</label>
                <input type="text" id="email" v-model="cateName"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ex: 茶茗" required>
            </div>
            <div class="mb-6">
                <label for="url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">主分類圖片</label>
                <input type="text" id="url" v-model="imgUrl"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="google driver" required>
            </div>
            <button type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import { getFirestore } from "firebase/firestore";

export default Vue.extend({
    data() {
        return {
            cateName: '',
            imgUrl: '',
        };
    },
    methods: {
        SubmitEvent() {
            console.log(this.cateName);
            console.log(this.imgUrl);
        },
    },
})
</script>