<template>
                <button @click="auth()">button</button>
</template>

<script>

export default {
    data() {
        return {
            user: null,
            isLoggedIn: false
        }
    },
    methods:{
        auth(){
            const user = this.$store.getters.user_name
            console.log(user);
        }
    }
}
</script>