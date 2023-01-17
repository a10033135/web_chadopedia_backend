<template>
  <div class="h-screen w-screen bg-black flex content-center justify-center">
    <div class="p-6 bg-white my-auto w-10/12 h-4/6 rounded-xl shadow-lg">
      <div class="bg-red-100 w-full h-full">
        <div class="text-xl item-center font-medium text-black">抹茶筆記 後台</div>

        <NuxtLink
          class="inline-block mx-20 w-2/5 mt-6 bg-blue-600 py-1 px-2 text-m font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          to="/signup">登入</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

console.log("test");

export default Vue.extend({
  name: "IndexPage",
  created() {
    const user = this.$store.getters.isAuthenticated;
    console.log(user);
    if (user) {
      this.$router.push('/EditorPage')
    } else {
      this.$router.push('/SignupPage')
    }
  },
});
</script>
