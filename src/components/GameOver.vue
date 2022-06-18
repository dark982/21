<template>
  <div class="container">
    Winner: {{ winner }}

    <button v-if="startgamebutton" @click="startGame">New game</button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "../store/MainStore";
  import { GameService } from "./../services/GameService";

  export default defineComponent({
    mounted() {},
    components: {},
    computed: {
      winner() {
        return store.getters["gamestore/winner"];
      },

      startgamebutton() {
        return store.getters["connection/established"] && store.getters.host;
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

<style lang="scss"></style>
