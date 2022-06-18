<template>
  <div class="container-fluid">
    <div class="row">
      <!--Opponent-->
      <Card
        v-for="(card, index) in opponentSpecialCards"
        :key="index"
        :cardtype="card"
        :hidden="true"
      ></Card>
    </div>
    <div class="row">
      <!--Opponent-->
      <Card
        v-for="(card, index) in opponentCards"
        :key="index"
        :cardtype="card"
        :hidden="index == 0"
      ></Card>
    </div>
    <div class="row">
      <!--Neutral-->
      <div v-if="yourturn">
        <button class="btn btn-primary" @click="draw()">Hit</button>
        <button class="btn btn-primary" @click="stay()">Stand</button>
      </div>
      <div v-else>Opponent Turn</div>
    </div>
    <div class="row">
      <!--Your-->
      <Card
        v-for="(card, index) in yourCards"
        :key="index"
        :cardtype="card"
      ></Card>
    </div>
    <div class="row">
      <!--Your-->
      <Card
        v-for="(card, index) in yourSpecialCards"
        :key="index"
        :cardtype="card"
      ></Card>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "../store/MainStore";
  import Card from "./Card.vue";

  export default defineComponent({
    components: {
      Card,
    },
    computed: {
      yourturn() {
        return store.getters["gamestore/yourturn"];
      },
      opponentCards() {
        if (store.getters.host) {
          return store.getters["gamestore/clientCards"];
        } else {
          return store.getters["gamestore/hostCards"];
        }
      },
      yourCards() {
        if (!store.getters.host) {
          return store.getters["gamestore/clientCards"];
        } else {
          return store.getters["gamestore/hostCards"];
        }
      },
      opponentSpecialCards() {
        if (store.getters.host) {
          return store.getters["gamestore/clientSpecialCards"];
        } else {
          return store.getters["gamestore/hostSpecialCards"];
        }
      },
      yourSpecialCards() {
        if (!store.getters.host) {
          return store.getters["gamestore/clientSpecialCards"];
        } else {
          return store.getters["gamestore/hostSpecialCards"];
        }
      },
    },
    methods: {
      draw() {
        store.getters.gameservice.draw();
      },
      stay() {
        store.getters.gameservice.stay();
      },
      playSpecialCard(id: string) {
        store.getters.gameservice.playSpecialCard(id);
      },
    },
    data() {
      return {};
    },
  });
</script>

<style lang="scss"></style>
