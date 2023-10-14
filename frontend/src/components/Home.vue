<script setup>
import { onMounted, ref, isRef, provide } from "vue";
import TripList from "./TripList.vue";
import Map from "./Map.vue";
import TrainDetails from "./TrainDetails.vue";
import { train_api } from "../models/trains.js";
import { io } from "socket.io-client";
import Filter from "./Filter.vue";
import AuthModal from "./AuthModal.vue";

defineProps({
  showAuth: Boolean,
  hideLogin: Function,
});

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

    for (const train of res) {
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
      const mostRelevantTrainExtend = { ...mostRelevantTrain };
      mostRelevantTrainExtend.history = trains;
      displayedTrains.push(mostRelevantTrainExtend);
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

const socket = io("https://jsramverk-editor-kafa21.azurewebsites.net/");

onMounted(async () => {
  await fetchAndProcessDelayedTrains();
  getDelayedTrainNumbers();

  // Call the function every 60 seconds
  window.setInterval(fetchAndProcessDelayedTrains, 60000);

  // fetch codes
  try {
    const res = await train_api.fetchCodes();
    codes.value = res;
  } catch (error) {
    console.log("Error:", error);
  }
});
</script>
<template>
  <AuthModal v-if="showAuth" :hideLogin="hideLogin" />
  <div class="w-full h-full flex flex-row justify-between max-h-screen">
    <div class="border-2 w-105">
      <Filter @update:ShowDelayed="updateShowDelayed" />
      <TripList
        class="maxHeightWithFilter"
        :setTrain="setInspectTrain"
        :trains="delayedTrains"
        :toggle-details="displayTrue"
        :socket="socket"
        @update:canEdit="updateCanEditTrain"
        @update:showPosition="updateShowPosition"
      />
    </div>
    <div class="border-2 w-full max-h-screen maxHeight">
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
      />
    </div>
  </div>
</template>

<style scoped>
.maxHeight {
  max-height: calc(100vh - 50px) !important;
}
.maxHeightWithFilter {
  max-height: calc(100vh - 170px) !important;
}
</style>
