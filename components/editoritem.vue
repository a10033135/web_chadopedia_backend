<template>
    <div>
        <li class="my-px" v-on:click="a">
            <a href="#"
                class="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span class="flex items-center justify-center text-lg text-gray-400">
                    <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                        stroke="currentColor" class="h-6 w-6">
                        <path
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </span>
                <span class="ml-3">{{ name }}</span>
            </a>
        </li>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        name: String,
        link: String
    },
    methods: {
        a() {
            console.log('click: ' + this.link);
            this.$router.push('' + this.link)
        }
    }
})
</script>