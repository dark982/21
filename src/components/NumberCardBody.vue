<template>
  <div class="card-body-numbercard">
    <div v-for="i in count" :key="i">
      {{ icon }}
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: {
      icon: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        default: true,
      },
    },
  });
</script>

<style lang="scss">
  .card-body-numbercard {
    & > div {
      flex-grow: 0;
      height: auto;
      width: auto;
    }

    align-items: center;
    flex-wrap: wrap;

    justify-content: center;

    padding-left: 1.875rem;
    padding-right: 1.875rem;

    display: flex;

    font-size: 3rem;

    height: 100%;
    width: 100%;
  }
</style>
