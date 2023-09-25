<script setup>
import { onMounted, ref, isRef, provide } from "vue";
import TripList from "./TripList.vue";
import Map from "./Map.vue";
import TrainDetails from "./TrainDetails.vue";
import { train_api } from "../models/trains.js";
import { io } from "socket.io-client";
import Filter from "./Filter.vue";

const showDetails = ref(false);
const delayedTrains = ref([]);
const delayedTrainNumbers = ref([]);
const inspectTrain = ref({});
const codes = ref([]);

const canEditTrain = ref(false);
const ShowDelayed = ref(false);
provide("canEditTrain", canEditTrain);

const showPosition = ref({});
provide("showPosition", showPosition);

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

const updateShowPosition = (val) => {
  if (isRef(showPosition)) {
    showPosition.value = val;
  }
};

const updateShowDelayed = (val) => {
  if (isRef(canEditTrain)) {
    ShowDelayed.value = val;
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

async function getDelayedTrainNumbers() {
  const trainNumbers = delayedTrains.value
    .sort((a, b) => {
      return (
        new Date(a.EstimatedTimeAtLocation) -
        new Date(b.EstimatedTimeAtLocation)
      );
    })
    .map((train) => train.AdvertisedTrainIdent)
    .filter((train) => train !== undefined);

  delayedTrainNumbers.value = trainNumbers;
}

const socket = io("http://localhost:8393/");

onMounted(async () => {
  await fetchAndProcessDelayedTrains();
  getDelayedTrainNumbers();

  // Call the function every 60 seconds
  window.setInterval(fetchAndProcessDelayedTrains, 60000);

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
      <Filter @update:ShowDelayed="updateShowDelayed" />
      <TripList
        :setTrain="setInspectTrain"
        :trains="delayedTrains"
        :toggle-details="displayTrue"
        :socket="socket"
        @update:canEdit="updateCanEditTrain"
        @update:showPosition="updateShowPosition"
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
      <Map
        :delayedTrains="delayedTrainNumbers"
        :onlyShowDelayed="ShowDelayed"
        :socket="socket"
        :showSpecificTrain="showPosition"
        v-else
      />
    </div>
  </div>
</template>
