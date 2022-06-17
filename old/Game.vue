<template>
  <div>
    <div class="user-deck">
      <!-- Opponent Cards -->
      <MainCard
        v-for="(card, index) in opponentCards"
        :key="index"
        :cardtype="card"
        :hidden="index == 0"
      ></MainCard>
    </div>
    <div>
      <div>
        <!-- Stack -->
        <MainCard
          :hidden="true"
          :showCount="cards.length"
          @click="drawCard()"
        ></MainCard>
      </div>
      <div>
        <!-- Specialcard pool -->
      </div>
    </div>
    <div class="user-deck">
      <!-- User Cards -->
      <MainCard
        v-for="(card, index) in userCards"
        :key="index"
        :cardtype="card"
      ></MainCard>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import MainCard from "./Card.vue";
  import { CardManager } from "../CardManager";
  import { Card } from "../CardTypes";

  export default defineComponent({
    name: "App",
    components: {
      MainCard,
    },
    methods: {
      drawCard() {
        const card = this.cards.pop();

        if (typeof card !== "undefined") {
          this.userCards.push(card);
          this.opponentCards.push(card);
        }
      },
    },
    data() {
      const manager = new CardManager();
      const cardlist = CardManager.shuffle(manager.createDeck());
      return {
        cards: cardlist,
        userCards: [] as Card[],
        opponentCards: [] as Card[],
      };
    },
  });
</script>

<style lang="scss"></style>
