<template>
  <div style="display: flex; height: 100%; width: 100%">
    <div style="margin: auto">
      <div class="h1 mb-3">Welcome to 21</div>
      <div class="text-center">
        <template v-if="room">Either </template>
        <button class="btn btn-success mx-auto btn-sm" @click="createLobby()">
          Create
        </button>
        a lobby
      </div>
      <template v-if="room">
        <div class="row text-center my-3">
          <div class="col"><hr /></div>
          <div class="col-auto">OR</div>
          <div class="col"><hr /></div>
        </div>
        <div class="text-center">
          <button class="btn btn-success mx-auto btn-sm" @click="joinLobby()">
            Join
          </button>
          given Lobby
        </div>
      </template>
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
