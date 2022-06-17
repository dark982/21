<template>
  <div>
    <div v-if="main">
      <button @click="copyToClipboard()">Share</button>
      <textarea
        class="hidden-copy-field"
        ref="hiddencopyfield"
        v-model="sharecode"
      ></textarea>
      <textarea v-model="nonMainRemote"></textarea>
      <button @click="setRemoteDesc()">SetLocal</button>
    </div>
    <div v-else>
      <textarea v-model="remoteDesc"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
  /*import { defineComponent } from "vue";
  import store from "../store/MainStore";

  export default defineComponent({
    components: {},
    computed: {
      remoteDesc() {
        return btoa(JSON.stringify(store.getters["connection/localoffer"]));
      },
      main() {
        return store.getters.main;
      },
      sharecode() {
        let url =
          window.location.protocol +
          "//" +
          window.location.host +
          import.meta.env.BASE_URL;

        return (
          url +
          "?share=" +
          btoa(JSON.stringify(store.getters["connection/localoffer"]))
        );
      },
    },
    methods: {
      setRemoteDesc() {
        let json = atob(this.nonMainRemote);
        let decoded = JSON.parse(json);

        store.commit("connection/remoteoffer", decoded);

        const webTransfer = store.getters[
          "connection/webtransfer"
        ] as WebTransfer;

        const remoteOffer = store.getters["connection/remoteoffer"];

        webTransfer.setRemoteOffer(remoteOffer);
      },
      copyToClipboard() {
        let element = this.$refs.hiddencopyfield as HTMLInputElement;
        element.focus();
        element.select();
        document.execCommand("copy");
        alert("text copied to clipboard, please use Ctrl-V to paste the data");
        element.blur();
      },
    },
    data() {
      return {
        nonMainRemote: "",
      };
    },
  });*/
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
