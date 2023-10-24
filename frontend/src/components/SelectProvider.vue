<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
import { ref, provide } from "vue";
export default {
  setup() {
    const selectedDelay = ref(null);

    const setSelectedDelay = (num) => {
      console.log(num);
      selectedDelay.value = num;
    };

    provide("selected", { setSelectedDelay, selectedDelay });
  },
};
</script>
