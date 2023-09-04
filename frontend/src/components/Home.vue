<script setup>
import { onMounted, ref, toRaw } from "vue";
import TripList from "./TripList.vue";
import Map from "./Map.vue";
import TrainDetails from "./TrainDetails.vue";
import { train_api } from "../models/trains.js";
import { trainList } from "../mockData/data.js";
defineProps({
  msg: String,
});

const showDetails = ref(false);
const delayedTrains = ref([]);
const toggleDisplay = () => {
  showDetails.value = !showDetails.value;
};

onMounted(async () => {
  try {
    const res = await train_api.fetchDelayedTrains();
    delayedTrains.value = res.data;
  } catch (error) {
    console.log("Error:", error);
  }
});
</script>

<template>
  <TrainDetails v-if="showDetails" />
  <div class="w-full h-full flex flex-row justify-between">
    <div class="border-2 w-105">
      <TripList :trains="delayedTrains" :toggle-details="toggleDisplay" />
    </div>
    <div class="border-2 w-full">
      <Map />
    </div>
  </div>
</template>
