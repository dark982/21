<template>
  <div class="card-container" :class="color">
    <div class="card-border">
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
            :count="cardtype.value"
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

        return false;
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

<style lang="scss">
  $size: 12rem;
  $border-radius: 0.5rem;

  .card-container {
    &,
    * {
      box-sizing: border-box;
    }

    width: $size;
    border: 1px solid #000;
    padding: 4px;
    position: relative;

    border-radius: $border-radius;

    &.card-hidden {
      .card-border {
        background-color: #000;
        color: #fff;
        font-size: 6rem;
        text-align: center;
      }
    }

    &.card-color-heart,
    &.card-color-tiles {
      &,
      * {
        color: #f00;
      }
    }

    &.card-color-clovers,
    &.card-color-pikes {
      &,
      * {
        color: #000;
      }
    }

    .card-border {
      border-radius: $border-radius;

      width: 100%;
      padding-top: 154.23%;

      border: 1px solid #000;
    }

    .card-main {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      padding: 4px;

      position: absolute;
    }

    .card-content {
      position: relative;
      width: 100%;
      height: 100%;

      .card-icon {
        padding: 0.1rem;
        line-height: 0.875;
        font-size: 2rem;
        position: absolute;
        border: 1px solid #000;
        background-color: #fff;

        border-left-color: #0000;
        border-top-color: #0000;

        border-bottom-right-radius: $border-radius;
        z-index: 2;

        $offset: -0.25px;

        top: $offset;
        left: $offset;

        & ~ .card-icon {
          transform: rotate(180deg);

          top: unset;
          left: unset;
          bottom: $offset;
          right: $offset;
        }
      }
    }
  }
</style>
