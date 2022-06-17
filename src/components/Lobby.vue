<template>
  <div>
    {{ lobbyid }}

    <button v-if="startgamebutton">Start</button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "../store/MainStore";

  export default defineComponent({
    components: {},
    computed: {
      lobbyid() {
        return store.getters.lobby;
      },

      startgamebutton() {
        return (
          store.getters["connection/established"] && store.getters.lobbycreator
        );
      },
    },
    methods: {},
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
