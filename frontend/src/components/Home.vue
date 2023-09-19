<script setup>
import { onMounted, ref, isRef, provide } from "vue";
import TripList from "./TripList.vue";
import Map from "./Map.vue";
import TrainDetails from "./TrainDetails.vue";
import { train_api } from "../models/trains.js";
import { io } from "socket.io-client";

const showDetails = ref(false);
const delayedTrains = ref([]);
const inspectTrain = ref({});
const codes = ref([]);

const canEditTrain = ref(false);
provide("canEditTrain", canEditTrain);

const displayTrue = () => {
  showDetails.value = true;
};

const displayFalse = () => {
  showDetails.value = false;
};

const setInspectTrain = (value) => {
  inspectTrain.value = value;
};

const updateCanEditTrain = (val) => {
  if (isRef(canEditTrain)) {
    canEditTrain.value = val;
  } else {
    console.error("canEditTrain is not a ref", val);
  }
};

const socket = io("https://jsramverk-editor-kafa21.azurewebsites.net/");

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
});
</script>
<template>
  <div class="w-full h-full flex flex-row justify-between">
    <div class="border-2 w-105">
      <TripList
        :setTrain="setInspectTrain"
        :trains="delayedTrains"
        :toggle-details="displayTrue"
        :socket="socket"
        @update:canEdit="updateCanEditTrain"
      />
    </div>
    <div class="border-2 w-full">
      <TrainDetails
        :trainData="inspectTrain"
        :toggleSide="displayFalse"
        :codes="codes"
        :socket="socket"
        :canEditTrain="canEditTrain.value"
        v-if="showDetails"
      />
      <Map :socket="socket" v-else />
    </div>
  </div>
</template>
