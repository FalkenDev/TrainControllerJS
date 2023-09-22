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
  }
};

async function fetchAndProcessDelayedTrains() {
  try {
    const res = await train_api.fetchDelayedTrains();

    const currentTime = new Date();
    const trainMap = {};

    for (const train of res.data) {
      if (!trainMap[train.OperationalTrainNumber]) {
        trainMap[train.OperationalTrainNumber] = [];
      }
      trainMap[train.OperationalTrainNumber].push(train);
    }

    const displayedTrains = [];

    for (const trainNumber in trainMap) {
      const trains = trainMap[trainNumber];
      trains.sort((a, b) => {
        const timeA = new Date(a.EstimatedTimeAtLocation);
        const timeB = new Date(b.EstimatedTimeAtLocation);

        const diffA = timeA - currentTime;
        const diffB = timeB - currentTime;

        if ((diffA >= 0 && diffB >= 0) || (diffA < 0 && diffB < 0)) {
          return Math.abs(diffA) - Math.abs(diffB);
        }

        return diffA - diffB;
      });

      const mostRelevantTrain = trains[0];
      mostRelevantTrain.history = trains;

      displayedTrains.push(mostRelevantTrain);
    }
    delayedTrains.value = displayedTrains;
  } catch (error) {
    console.log("Error:", error);
  }
}

const socket = io("http://localhost:8393/");

onMounted(async () => {
  // Define the function to fetch and process delayed trains

  // Call the function immediately
  fetchAndProcessDelayedTrains();

  // Set up the interval to call the function every 100 seconds
  window.setInterval(fetchAndProcessDelayedTrains, 100000);

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
