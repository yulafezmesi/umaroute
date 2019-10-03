import Vue from "vue"
import Vuex from "vuex"
import { router } from "./router"
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        parameters: {},
        user: {
            displayName: '',
            imageUrl: '',
            userGroup: '',

        },
        isGuest: false,
        token: "",
        loadedDistances: [],
        loadedFormValues: [],
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        clearToken(state, token) {
            state.token = "";
        },
        setLoadedDistances(state, payload) {
            state.loadedDistances = payload;
        },
        setLoadedFormValues(state, payload) {
            state.loadedFormValues = payload;
        },
        setParameterValues(state, payload) {
            state.parameters = payload;
        },
        setUserValues(state, paylaod) {
            state.user = paylaod;
        },

        updateDistances(state, payload) {
            const formValues = state.loadedDistances.find(value => {
                return value.id === payload.id
            })
            if (payload.il) {
                formValues.il = payload.il
            }
            if (payload.km) {
                formValues.km = payload.km
            }
            if (payload.fiyat) {
                formValues.fiyat = payload.fiyat
            }
        },
    },
    actions: {
        initAuth({ dispatch, commit, state }) {
            let token = localStorage.getItem("token");
            let user = localStorage.getItem('user');
            commit('setUserValues', JSON.parse(user));
            if (token) {
                let expirationDate = localStorage.getItem("expirationDate");
                let time = new Date().getTime();

                if (time >= +expirationDate) {
                    dispatch("logout")
                } else {
                    commit("setToken", token)
                    let timerSecond = +expirationDate - time;
                    dispatch("setTimeLogOut", timerSecond)
                    router.go(-1);
                }

            } else {
                router.push("/");
                return false
            }
        },
        login({ commit, dispatch, state }, authData) {
            return axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.VUE_APP_FIREBASE_API_KEY}`, {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                })
                .then(response => {
                    dispatch("getUserProfiles", response.data.localId)
                    commit("setToken", response.data.idToken);
                    localStorage.setItem("token", response.data.idToken)
                    localStorage.setItem("expirationDate", new Date().getTime() + +response.data.expiresIn * 1000)
                    dispatch("setTimeLogOut", +response.data.expiresIn * 1000);
                })

        },
        logout({ commit, dispatch, state }) {
            commit("clearToken");
            router.replace("/giris")
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        setTimeLogOut({ dispatch }, expiresIn) {
            setTimeout(() => {
                dispatch("logout")
            }, expiresIn);
        },
        postFormValues({ commit, dispatch, state }, formValues) {
            return axios.post(`/umaroute.json`, {
                ...formValues
            }).then(response => {
                return response
            })

        },
        loadDistances({ commit }) {
            return axios
                .get("/distance.json")
                .then(function(response) {
                    let distanceValues = [];
                    let data = response.data;
                    for (let key in data) {
                        distanceValues.push({
                            id: key,
                            il: data[key].il,
                            km: data[key].km,
                            fiyat: data[key].fiyat,
                            plaka: data[key].id
                        });
                    }

                    commit('setLoadedDistances', distanceValues)
                })
        },
        loadMapValues({ commit }) {
            return axios
                .get("/umaroute.json")
                .then(function(response) {

                    let formValues = [];
                    let data = response.data;
                    for (let key in data) {
                        data[key].id = key;
                        formValues.push(data[key]);
                    }
                    commit('setLoadedFormValues', formValues)
                })
        },
        disabledElements({ commit, state }) {
            if (state.user.userGroup == "Guest") {
                var inputs = document.getElementsByTagName("input");
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = true;
                }
                var selects = document.getElementsByTagName("select");
                for (var i = 0; i < selects.length; i++) {
                    selects[i].disabled = true;
                }
                var textareas = document.getElementsByTagName("textarea");
                for (var i = 0; i < textareas.length; i++) {
                    textareas[i].disabled = true;
                }

            }
        },
        updateDistancesData({ commit }, payload) {
            const updateObj = {};
            if (payload.il) {
                updateObj.il = payload.il
            }
            if (payload.km) {
                updateObj.km = payload.km
            }
            if (payload.fiyat) {
                updateObj.fiyat = payload.fiyat
            }
            if (payload.plaka) {
                updateObj.id = payload.plaka
            }
            return axios
                .put(`/distance/${payload.id}.json`, updateObj)
                .then(function(response) {
                    commit('updateDistances', payload)
                })
        },
        getParameters({ commit }) {
            return axios
                .get("/options.json")
                .then(function(response) {
                    let parameters = {};
                    parameters = response.data;
                    commit('setParameterValues', parameters)
                })
        },
        updateParameters({ commit }, updateObj) {
            return axios
                .put(`/options.json`, updateObj)
        },
        updateFormValues({ commit }, updateObj) {
            let id = updateObj.id;
            delete updateObj.id;
            return axios
                .patch(`/umaroute/${id}.json`, updateObj)
                .then(function(response) {

                    console.log('update oldu')
                })
        },
        getUserProfiles({ commit }, payload) {
            return axios
                .get(`/users/${payload}.json`)
                .then(function(response) {
                    let users = {};
                    users = response.data;
                    var userObj = users[Object.keys(users)[0]];
                    localStorage.setItem("user", JSON.stringify(userObj));
                    commit('setUserValues', userObj)
                })
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.token !== "";
        },
        distances(state) {
            return state.loadedDistances;
        },
        formValues(state) {

            return state.loadedFormValues.reverse();
        },
        userValues(state) {
            return state.user;
        },
        parameterValues(state) {
            return state.parameters;
        },
        isGuest(state) {
            if (state.user.userGroup == "Guest") {
                return false
            } else {
                return true
            }

        }
    },
})

export default store