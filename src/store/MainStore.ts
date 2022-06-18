import { createStore } from 'vuex'
import { GameService } from '../services/GameService';
import ConnectionStore from './ConnectionStore'
import GameStore from './GameStore'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            lobby: null as null | string,
            host: false,
            gameservice: null as null | GameService
        }
    },

    mutations: {
        lobby(state, val) {
            state.lobby = val;
        },
        host(state, val) {
            state.host = val;
        },
        gameservice(state, service) {
            state.gameservice = service
        }
    },

    getters: {
        lobby(state) {
            return state.lobby
        },
        host(state) {
            return state.host
        },
        gameservice(state, service) {
            return state.gameservice
        }
    },

    actions: {
    },

    modules: {
        connection: ConnectionStore,
        gamestore: GameStore,
    }
})

export default store;