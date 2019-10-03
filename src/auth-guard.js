import store from "./store"

export default (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next()
    } else {
        next('/giris')
    }
}
