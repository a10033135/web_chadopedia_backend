<script setup lang="ts">
import {authStore} from "~/stores/auth";

const state = authStore()
const router = useRouter()

if (state.isSignUp) {
  router.push('/editor/content')
} else {
  router.push('/signup')
}

</script>

<template>
  <div class="h-screen w-screen bg-black flex content-center justify-center">
    <div class="p-6 bg-white my-auto w-10/12 h-4/6 rounded-xl shadow-lg">
      <div class="bg-red-100 w-full h-full">
        <div class="text-xl item-center font-medium text-black">抹茶筆記 後台</div>
      </div>
    </div>
  </div>
</template>

