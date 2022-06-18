<template>
  <div class="card-wrapper col-auto">
    <div class="card-container" :class="color">
      <!--<div class="card-border">-->
      <div class="card-main">
        <div class="card-content" v-if="!hidden">
          <div class="card-icon">
            {{ icon }}
            <template v-if="colorIcon">
              <br />
              {{ colorIcon }}
            </template>
          </div>
          <NumberCardBody
            v-if="type == 'NumberCard'"
            :icon="colorIcon"
            :count="cardValue"
          ></NumberCardBody>
          <div class="card-icon">
            {{ icon }}
            <br />
            <template v-if="colorIcon">
              {{ colorIcon }}
            </template>
          </div>
        </div>
        <div v-else-if="showCount">
          {{ showCount }}
        </div>
      </div>
      <!--</div>-->
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { PropType } from "vue";
  import {
    Card,
    ColoredCard,
    ImageCard,
    NumberCard,
    NumberedCard,
  } from "../CardTypes";
  import NumberCardBody from "./NumberCardBody.vue";

  export default defineComponent({
    components: { NumberCardBody },
    name: "Card",
    props: {
      cardtype: {
        type: Object as PropType<Card>,
        default: {},
      },
      hidden: {
        type: Boolean,
        default: false,
      },
      showCount: {
        type: Number,
      },
    },
    computed: {
      cardValue() {
        return (this.cardtype as NumberedCard).value;
      },
      type() {
        return this.cardtype.type;
      },
      icon() {
        if (this.cardtype.type === "NumberCard") {
          return (this.cardtype as NumberedCard).value;
        } else if (this.cardtype.type === "ImageCard") {
          return (this.cardtype as ImageCard).icon;
        }
      },
      colorIcon() {
        if (["NumberCard", "ImageCard"].indexOf(this.cardtype.type) >= 0) {
          switch ((this.cardtype as NumberedCard).color) {
            case "heart":
              return "♥";
            case "tiles":
              return "♦";
            case "pikes":
              return "♠";
            case "clovers":
              return "♣";
          }
        }

        return "NA";
      },
      color() {
        if (this.hidden) {
          return "card-hidden";
        }

        if (["NumberCard", "ImageCard"].indexOf(this.cardtype.type) >= 0) {
          return "card-color-" + (this.cardtype as NumberedCard).color;
        }
      },
    },
  });
</script>

<style lang="scss"></style>
