<template>
  <div>
    {{ lobbyid }}<br />

    <span>{{ link }}</span
    ><br />
    <button v-if="startgamebutton" @click="startGame">Start</button>
    <template v-else-if="!isHost"> Waiting for peer to start game </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "../store/MainStore";

  export default defineComponent({
    components: {},
    computed: {
      lobbyid(): string {
        return store.getters.lobby;
      },

      isHost() {
        return store.getters.host;
      },

      startgamebutton() {
        return store.getters["connection/established"] && store.getters.host;
      },

      link() {
        let url =
          window.location.protocol +
          "//" +
          window.location.host +
          import.meta.env.BASE_URL;

        return url + "?lobby=" + store.getters.lobby;
      },
    },
    methods: {
      startGame() {
        store.getters.gameservice.startGame();
      },
    },
    data() {
      return {};
    },
  });
</script>

<style lang="scss">
  .hidden-copy-field {
    position: absolute;
    top: -1000px;
    left: -1000px;
    width: 0;
    height: 0;
    opacity: 0;
  }
</style>
