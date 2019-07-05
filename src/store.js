import Vue from "vue"
import Vuex from "vuex"
import { router } from "./router"
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        parameters: {},
        user: {
            displayName : '',
            imageUrl:'',
            userGroup:'',

        },
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
            debugger;
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
            return axios.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCrQVg-ZAdCxSgaAvRfsXZUlt8wHz1nSrs",
                {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                }
            )
                .then(response => {
                    debugger;
                    dispatch("getUserProfiles", response.data.localId)
                    commit("setToken", response.data.idToken);
                    localStorage.setItem("token", response.data.idToken)
                    localStorage.setItem("expirationDate", new Date().getTime() + +response.data.expiresIn * 1000)
                    dispatch("setTimeLogOut", +response.data.expiresIn * 1000);
                })
                .catch(err => {
                });

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
        loadDistances({ commit }) {
            return axios
                .get("https://routes-75247.firebaseio.com/distance.json")
                .then(function (response) {
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
                .catch(function (error) {
                    // eslint-disable-line
                    // handle error
                })
                .finally(function () {
                    // always executed
                });
        },
        loadMapValues({ commit }) {
            return axios
                .get("https://routes-75247.firebaseio.com/umaroute.json")
                .then(function (response) {
                    let formValues = [];
                    let data = response.data;
                    for (let key in data) {
                        formValues.push(data[key]);
                    }
                    commit('setLoadedFormValues', formValues)
                })
                .catch(function (error) {
                    // eslint-disable-line
                    // handle error
                })
                .finally(function () {
                    // always executed
                });
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
                .put(`https://routes-75247.firebaseio.com/distance/${payload.id}.json`, updateObj)
                .then(function (response) {
                    commit('updateDistances', payload)
                })
                .catch(function (error) {
                    // eslint-disable-line
                    // handle error
                })
                .finally(function () {
                    // always executed
                });
        },
        getParameters({ commit }) {
            return axios
                .get("https://routes-75247.firebaseio.com/options.json")
                .then(function (response) {
                    let parameters = {};
                    parameters = response.data;
                    commit('setParameterValues', parameters)
                })
                .catch(function (error) {
                    // eslint-disable-line
                    // handle error
                })
                .finally(function () {
                    // always executed
                });
        },
        updateParameters({ commit }, updateObj) {
            return axios
                .put(`https://routes-75247.firebaseio.com/options.json`, updateObj)
                .then(function (response) {

                    console.log('update oldu')
                })
                .catch(function (error) {
                    // eslint-disable-line
                    // handle error
                })
                .finally(function () {
                    // always executed
                });
        },
        getUserProfiles({ commit }, payload) {
            return axios
                .get(`https://routes-75247.firebaseio.com/users/${payload}.json`)
                .then(function (response) {
                    let users = {};
                    debugger;
                    users = response.data;
                    var userObj = users[Object.keys(users)[0]];
                    localStorage.setItem("user", JSON.stringify(userObj));
                    debugger;
                    commit('setUserValues', userObj)
                })
                .catch(function (error) {
                    // eslint-disable-line
                    // handle error
                })
                .finally(function () {
                    // always executed
                });
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
            debugger;
            return state.user;
        },
        parameterValues(state) {
            return state.parameters;
        }
    },
})

export default store