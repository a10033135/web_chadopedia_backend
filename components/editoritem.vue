<template>
    <div>
            <a v-on:click="a"
              href="#"
                class="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span class="ml-3">{{ name }}</span>
            </a>
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
