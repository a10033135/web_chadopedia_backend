// https://nuxt.com/docs/api/configuration/nuxt-config

import {defineNuxtModule} from "@nuxt/kit";

export default defineNuxtConfig({
    css: ['~/assets/css/tailwind.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: ['@pinia/nuxt'],
    ssr: true,
    nitro: {
        prerender: {
            routes: ['/**', '/editor/**', '/editor/channel/**', '/editor/content/**']
        }
    },
    runtimeConfig: {
        apiSecret: '123',
        'public': {
            'cloudinary': {
                'name': 'di0d7y9qa',
                'apiKey': '377943481171131',
                'apiSecret': 'xnDL2jegPU8DGP9A-vUKs-8MfuE'
            }
        }
    }

})


// import cloudinary from "cloudinary"
//
// export default defineNuxtPlugin((nuxtApp) => {
//     const cloudinaryConfig = {
//         cloud_name: "di0d7y9qa",
//         api_key: "377943481171131",
//         api_secret: "xnDL2jegPU8DGP9A-vUKs-8MfuE"
//     }
//     cloudinary.v2.config(cloudinaryConfig)
//
//     return {
//         provide: {
//             cloudinary:cloudinary.v2
//         }
//     }
// })