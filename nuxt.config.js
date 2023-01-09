export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'web_chadopedia_backend',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase', {
        config: {
          apiKey: 'AIzaSyAkcPGQJYUKayLiq92XSe21_e4JrMoGHsM',
          authDomain: 'chadopedia.firebaseapp.com',
          databaseURL: 'https://chadopedia-default-rtdb.firebaseio.com',
          projectId: 'chadopedia',
          storageBucket: 'chadopedia.appspot.com',
          messagingSenderId: '292955403698',
          appId: '1:292955403698:web:14afada992e74a6235a0ab',
          measurementId: 'G-GZ35JTJLRF'
        },
        services: {
          auth: {
            persistence: 'local', // default
            initialize: {
              onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
              onAuthStateChangedAction: 'onAuthStateChangedAction',
              subscribeManually: false
            },
            ssr: false, // default
            emulatorPort: 9099,
            emulatorHost: 'http://localhost/',
            disableEmulatorWarnings: false,
          },
          firestore: true,
          functions: true,
          storage: true,
          database: true,
          messaging: true,
          performance: true,
          analytics: true,
          remoteConfig: true
        }
      }
    ]
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
