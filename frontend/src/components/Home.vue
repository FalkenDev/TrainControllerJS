<script setup>
import { ref } from "vue";
import TripList from "./TripList.vue";
import Map from "./Map.vue";

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <div class="w-full h-full flex flex-row justify-between">
    <div class="border-2 w-105">
      <TripList />
    </div>
    <div class="border-2 w-full">
      <Map />
    </div>
  </div>
</template>
