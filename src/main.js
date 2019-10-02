import 'babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import { router } from './router'
import store from "./store"
import VueAxios from 'vue-axios'
import axiosApi from 'axios';
const axiosMap = axiosApi.create({
    baseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
});

//Use the window object to make it available globally.
window.axios = axiosMap;
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')


export const eventBus = new Vue();