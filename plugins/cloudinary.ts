import {Cloudinary} from '@cloudinary/url-gen'


export default defineNuxtPlugin((nuxtApp) => {
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'di0d7y9qa',
            apiKey: "377943481171131",
            apiSecret: "xnDL2jegPU8DGP9A-vUKs-8MfuE",
        },
    })

    return {
        provide: {
            cld: cld
        }
    }

})