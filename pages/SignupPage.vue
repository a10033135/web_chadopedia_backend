<template>
    <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account
                </h2>
            </div>
            <div class="space-y-4">
                <div class="-space-y-px rounded-md shadow-sm">
                    <div>
                        <label for="email-address" class="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" autocomplete="email" required=""
                            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Email address" v-model="email" />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" name="password" type="password" autocomplete="current-password" required=""
                            class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Password" v-model="password" />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                    </div>
                </div>

                <div>
                    <button type="submit" v-on:click="signIn"
                        class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Sign in
                    </button>
                    <p>--</p>
                    <button type="submit" v-on:click="createUser"
                        class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async signIn() {
            console.log(this.email);
            console.log(this.password);

            try {
                const user = await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password);
                this.$router.push("editor")
            } catch (e) {
                console.log(e);
            }
        },
        async signInUser() {
            try {
                const user = await this.$fire.auth.signInWithEmailAndPassword('foo@foo.foo', 'testtesttest');
                console.log("user" + user);
                this.$router.push("editor")
            } catch (e) {
                console.log(e);
            }

        },


        async createUser() {
            try {
                await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)

            } catch (e) {
                console.log(e);
            }
        },
        async signUp() {
            try {
                await this.$fire.auth.signOut();
            } catch (e) {
                console.log(e);
            }
        }
    }

}
</script>