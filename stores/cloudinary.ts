import {defineStore} from "pinia";

export const cloudinaryStore = defineStore('cloudinary', {
    state: () => {
        return {
            version: null as null | number | undefined
        }
    },
    getters: {
        versionCode(state) {
            return state.version
        }
    },
    actions: {
        updateVersionCode(versionNumber: number | null | undefined) {
            console.log('update_version_code', versionNumber)
            this.version = versionNumber
        }
    }

})