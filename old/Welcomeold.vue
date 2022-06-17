<template>
  <div>
    <div>Welcome</div>
    <div>
      <div>
        <button @click="openLobby()">Open Lobby</button>
      </div>
      <div v-if="hasLobby">
        <button @click="joinLobby()">Join Lobby</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  /*import { defineComponent } from "vue";
  import { Store } from "./../main";

  export default defineComponent({
    mounted() {},
    components: {},
    computed: {
      hasLobby() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.has("share")) {
          return true;
        }

        return false;
      },
    },
    methods: {
      offer(main: boolean) {
        const webTransfer = Store.getters[
          "connection/webtransfer"
        ] as WebTransfer;

        return webTransfer.createOffer().then((offer) => {
          Store.commit("connection/localoffer", offer);
          Store.commit("main", main);
        });
      },
      joinLobby() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (!urlParams.has("share")) {
          alert("No share code in url");
          return;
        }

        const code = urlParams.get("share") as string;

        let json = atob(code);
        let decoded = JSON.parse(json);

        Store.commit("connection/remoteoffer", decoded);

        this.offer(false)
          .then(() => {
            const webTransfer = Store.getters[
              "connection/webtransfer"
            ] as WebTransfer;

            const remoteOffer = Store.getters["connection/remoteoffer"];

            webTransfer.setRemoteOffer(remoteOffer);
          })
          .then(() => {
            this.$router.replace({
              name: "lobby",
            });
          });
      },
      openLobby() {
        const webTransfer = Store.getters[
          "connection/webtransfer"
        ] as WebTransfer;

        this.offer(true).then(() => {
          this.$router.replace({
            name: "lobby",
          });
        });
      },
    },
    data() {
      return {};
    },
  });*/
</script>

<style lang="scss"></style>
