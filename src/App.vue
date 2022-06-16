<template>
  <div>
    <div class="user-decks">
      <!-- Opponent Cards -->
      <MainCard
        :v-if="cards"
        v-for="card in opponentCards"
        :key="card"
        :cardtype="card"
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
    <div class="user-decks">
      <div>
        <!-- User Cards -->
        <MainCard
          :v-if="cards"
          v-for="card in userCards"
          :key="card"
          :cardtype="card"
        ></MainCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import MainCard from "./components/Card.vue";
  import { CardManager } from "./CardManager";
  import { Card } from "./CardTypes";

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

<style lang="scss">
  html {
    font-size: 10px;
  }

  .user-decks {
    & > div {
      display: flex;
    }
    overflow-x: scroll;
    overflow-y: hidden;
  }
</style>
