<script setup>
import { ref } from "vue";
import TripList from "./TripList.vue";
import Map from "./Map.vue";
import TrainDetails from "./TrainDetails.vue";
import { trainList } from "../mockData/data.js";
defineProps({
  msg: String,
});

const showDetails = ref(false);

const toggleDisplay = () => {
  showDetails.value = !showDetails.value;
};
</script>

<template>
  <TrainDetails v-if="showDetails" />
  <div class="w-full h-full flex flex-row justify-between">
    <div class="border-2 w-105">
      <TripList :trains="trainList" :toggle-details="toggleDisplay" />
    </div>
    <div class="border-2 w-full">
      <Map />
    </div>
  </div>
</template>
