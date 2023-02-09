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
    ssr: false,

    routeRules: {
        '/signup': {
            ssr: false,
            static: true,
            prerender: true,
            headers: {
                title: 'route_title'
            }
        }
    },
    app: {
        head: {
            charset: 'utf-16',
            viewport: 'width=500, initial-scale=1',
            title: 'My App Nuxt Config',
            meta: [
                // <meta name="description" content="My amazing site">
                {name: 'description', content: 'My amazing site.'}
            ],
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