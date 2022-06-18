<template>
  <div class="container">
    <div class="row">
      <div class="col d-flex">
        <button class="btn btn-primary mx-auto" @click="createLobby()">
          Create Lobby
        </button>
      </div>
      <div class="col d-flex">
        <input v-model="room" />
        <button class="btn btn-primary mx-auto" @click="joinLobby()">
          Join Lobby
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "../store/MainStore";
  import { GameService } from "./../services/GameService";

  export default defineComponent({
    mounted() {},
    components: {},
    computed: {},
    methods: {
      createLobby() {
        store.commit("host", true);
        GameService.CreateRoom().then(() => {
          console.log("go lobby");
          this.$router.push({ name: "lobby" });
        });
      },

      joinLobby() {
        GameService.JoinRoom(this.room).then(() => {
          console.log("go lobby");
          this.$router.push({ name: "lobby" });
        });
      },
    },
    data() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      return {
        room: urlParams.has("lobby") ? urlParams.get("lobby") : null,
      };
    },
  });
</script>

<style lang="scss"></style>
