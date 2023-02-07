import {defineStore} from 'pinia'
import {User} from "@firebase/auth";

export const authStore = defineStore('auth', {
    state: () => {
        return {
            isSignUp: false,
            user: {

            } as User | null
        }
    },
    getters: {
        checkAuthUser(state) {
            return state.isSignUp
        }
    },
    actions: {
        isSignInSuccess(user: User) {
            try {
                this.user = user
                this.isSignUp = true
            } catch (error) {
                console.log(error)
            }
        },

    }
})