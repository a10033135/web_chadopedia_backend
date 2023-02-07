import {Cloudinary} from '@cloudinary/url-gen'


export default defineNuxtPlugin((nuxtApp) => {
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'di0d7y9qa'
        }
    })

    return {
        provide: {
            cld: cld
        }
    }

})