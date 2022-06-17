
import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'
import Connection from './components/Lobby.vue'
import Welcome from './components/Welcome.vue'
import Lobby from './components/Lobby.vue'
import Game from './components/Game.vue'

const routes = [
    {
        path: "/",
        name: "index",
        component: Welcome
    },
    {
        path: "/lobby",
        name: "lobby",
        component: Lobby
    },
    {
        path: "/game",
        name: "game",
        component: Game
    },
];


const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export default router;