import VueRouter from "vue-router"
import Vue from 'vue'
import Maps from '@/components/Maps'
import EditRoute from '@/components/EditRoute'
import Datatable from '@/components/DataTable'
import Settings from '@/components/Settings'
import EditSettings from '@/components/EditSettings'
import SignIn from '@/components/Login/SignIn'
import SignUp from '@/components/Login/SignUp'
import store from "./store"
import AuthGuard from './auth-guard'
Vue.use(VueRouter);
export const router = new VueRouter({
    routes: [{
            path: '/',
            beforeEnter: AuthGuard,
            component: Maps,
        },

        {
            path: '/kayitlar',
            beforeEnter: AuthGuard,
            component: Datatable
        },

        {
            path: '/kayitlar/:id',
            beforeEnter: AuthGuard,
            component: EditRoute
        },

        {
            path: '/giris',
            component: SignIn,
        },
        {
            path: '/kayitol',
            component: SignUp,
            beforeEnter: AuthGuard,
        },
        {
            path: '/ayarlar',
            beforeEnter: AuthGuard,
            component: Settings
        },
        // {
        //     path: '/ayarlar/:id',
        //     props: true,
        //     beforeEnter: AuthGuard,
        //     component: EditSettings
        // }
    ],
    mode: "history"
})