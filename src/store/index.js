import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: ''
    },
    getters: {},
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            Cookies.set("token", token)
        },
        RESET_STATE(state) {
            state.token = '';
            Cookies.remove("token")
        }
    },
    actions: {},
    modules: {}
})