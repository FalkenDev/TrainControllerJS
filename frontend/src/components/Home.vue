<script setup>
import { onMounted, ref, toRaw } from "vue";
import TripList from "./TripList.vue";
import Map from "./Map.vue";
import TrainDetails from "./TrainDetails.vue";
import { train_api } from "../models/trains.js";
import { trainList } from "../mockData/data.js";

const showDetails = ref(false);
const delayedTrains = ref([]);
const inspectTrain = ref({});
const codes = ref([]);
const tickets = ref([]);
const displayTrue = () => {
  showDetails.value = true;
};

const displayFalse = () => {
  showDetails.value = false;
};

const setInspectTrain = (value) => {
  inspectTrain.value = value;
};

onMounted(async () => {
  // fetch delayed trains
  try {
    const res = await train_api.fetchDelayedTrains();
    delayedTrains.value = res.data;
  } catch (error) {
    console.log("Error:", error);
  }
  // fetch codes
  try {
    const res = await train_api.fetchCodes();
    codes.value = res.data;
  } catch (error) {
    console.log("Error:", error);
  }
  // fetch tickets
  try {
    const res = await train_api.fetchAllTickets();
    console.log(res);
    tickets.value = res.data;
  } catch (error) {
    console.log("Error:", error);
  }
});
</script>
<template>
  <div class="w-full h-full flex flex-row justify-between">
    <div class="border-2 w-105">
      <TripList
        :setTrain="setInspectTrain"
        :trains="delayedTrains"
        :toggle-details="displayTrue"
      />
    </div>
    <div class="border-2 w-full">
      <TrainDetails
        :trainData="inspectTrain"
        :toggleSide="displayFalse"
        :codes="codes"
        :tickets="tickets"
        v-if="showDetails"
      />
      <Map v-else />
    </div>
  </div>
</template>
