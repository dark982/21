import { createStore } from 'vuex'
import ConnectionStore from './ConnectionStore'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            lobby: null as null | string,
            lobbycreator: false,
        }
    },

    mutations: {
        lobby(state, val) {
            state.lobby = val;
        },
        lobbycreator(state, val) {
            state.lobbycreator = val;
        }
    },

    getters: {
        lobby(state) {
            return state.lobby
        },
        lobbycreator(state) {
            return state.lobbycreator
        }
    },

    actions: {
    },

    modules: {
        connection: ConnectionStore
    }
})

export default store;