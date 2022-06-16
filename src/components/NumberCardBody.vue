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

<style lang="scss"></style>
