import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import { router } from './router'
import store from "./store"
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')


export const eventBus = new Vue();