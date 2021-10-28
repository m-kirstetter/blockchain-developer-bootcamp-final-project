export default {
  target: "static",
  ssr: false,
  generate: {
    fallback: true,
    dir: "dist"
  },
  srcDir: "client/",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "nuxt-ts-truffle",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/css/main"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: "~/plugins/vuelidate" }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,
  components: [
    // Equivalent to { path: '~/components' }
    "~/components",
    { path: "~/components/modals", extensions: ["vue"] }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    "@nuxtjs/fontawesome",
    ["@nuxtjs/dotenv", { systemvars: true, path: "./" }]
  ],

  fontawesome: {
    icons: {
      solid: ["faWallet", "faPowerOff", "faCircleNotch"],
      regular: [],
      light: [],
      duotone: [],
      brands: []
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    "bootstrap-vue/nuxt",
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    // https://auth.nuxtjs.org/
    "@nuxtjs/auth-next"
  ],

  auth: {
    redirect: {
      login: "/",
      logout: "/",
      callback: "/login",
      home: "/gigs"
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: "/token", method: "post", propertyName: false },
          logout: false,
          user: { url: "/users/me", method: "get", propertyName: false }
        },
        autoLogout: false
      }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: "http://localhost:3001/v1" // Used as fallback if no runtime config is provided
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en"
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
