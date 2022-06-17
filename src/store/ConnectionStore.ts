import { StoreOptions } from "vuex"

export default {
    state() {
        return {
            established: false
        }
    },

    namespaced: true,

    getters: {
        established(state) {
            return state.established
        }
    },

    mutations: {
        established(state, connected: boolean) {
            state.established = connected;
        }
    }
} as StoreOptions<any>