<template>

    <div class="h-screen w-screen bg-black flex content-center justify-center">

        <div class="p-6 bg-white my-auto w-10/12 h-4/6 rounded-xl shadow-lg ">
            <div class="bg-red-100 w-full h-full ">
                <div class="text-xl item-center font-medium text-black">請輸入帳號密碼</div>
                <div>
                    <label for="first_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">帳號</label>
                    <input type="text" id="first_name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your Account" required>
                </div>
                <div>
                    <label for="last_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">密碼</label>
                    <input type="text" id="last_name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your Password" required>
                </div>
                <button @click="signInUser()">button</button>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapState,mapMutations,mapActions } from 'vuex';
export default {
    methods: {
        async signInUser() {
            try {
               const user = await this.$fire.auth.signInWithEmailAndPassword( 'foo@foo.foo', 'testtesttest');
               
               console.log(user);
               this.$router.push("main")
            } catch (e) {
                console.log(e);
            }

        },


        async createUser() {
            try {
                await this.$fire.auth.createUserWithEmailAndPassword(
                    'foo@foo.foo', 'testtesttest'
                )

            } catch (e) {
                console.log(e);
            }
        }
    }

}
</script>