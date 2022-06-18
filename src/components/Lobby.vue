<template>
  <div style="display: flex; height: 100%; width: 100%">
    <div style="margin: auto">
      <div class="h1 mb-3">
        Lobby was created under the ID
        <span class="badge bg-success h3">{{ lobbyid }}</span>
      </div>
      <div class="text-center">
        Click
        <button class="btn btn-info btn-sm" @click="copyToClipboard()">
          Share
        </button>
        button to copy the link
      </div>
      <div class="text-center">
        <textarea
          v-model="link"
          ref="hiddencopyfield"
          class="hidden-copy-field"
        ></textarea>
      </div>
      <div class="text-center">
        <button v-if="startgamebutton" @click="startGame">Start</button>
        <template v-else-if="!isHost">
          Waiting for peer to start game
        </template>
      </div>
      <div class="text-center d-flex mt-5">
        <div class="flex-shrink-1 d-flex py-1 pe-3 mx-auto">
          <div class="spinner-border text-secondary m-1" role="status"></div>
          <div class="m-auto ms-3">Waiting for peer...</div>
        </div>
      </div>
    </div>
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
      copyToClipboard() {
        let element = this.$refs.hiddencopyfield as HTMLInputElement;
        element.focus();
        element.select();
        document.execCommand("copy");
        alert("text copied to clipboard, please use Ctrl-V to paste the data");
        element.blur();
      },
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
