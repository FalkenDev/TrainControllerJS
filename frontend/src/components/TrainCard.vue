<script setup>
import { ref, defineEmits, provide, computed } from "vue";

import ÖTÅG from "../assets/trainLogos/otog.png";
import SJ from "../assets/trainLogos/sj.png";
import SKANE from "../assets/trainLogos/skanetrafiken.png";
import SLL from "../assets/trainLogos/SLL.png";
import togab from "../assets/trainLogos/togab.png";
import VY from "../assets/trainLogos/vy.png";
import malartag from "../assets/trainLogos/malab.png";
import blsrail from "../assets/trainLogos/blsrail.png";
import jlt from "../assets/trainLogos/jlt.png";
import mtab from "../assets/trainLogos/mtab.png";
import mtrx from "../assets/trainLogos/mtrx.png";
import nrail from "../assets/trainLogos/NRail.png";
import vast from "../assets/trainLogos/vast.png";

import marker from "../assets/marker.svg";

const emit = defineEmits(["update:showPosition"]);

const props = defineProps({
  trainData: Object,
  currentTrain: Object,
});

const logos = {
  "Ö-TÅG": { src: ÖTÅG },
  SJ: { src: SJ },
  SKANE: { src: SKANE },
  SLL: { src: SLL },
  TÅGAB: { src: togab },
  VY: { src: VY },
  MÄLAB: { src: malartag },
  BLSRAIL: { src: blsrail },
  JLT: { src: jlt },
  MTAB: { src: mtab },
  MTRN: { src: mtrx },
  NRAIL: { src: nrail },
  VASTTRAF: { src: vast },
};

const markerImg = marker;

const currentLogo = computed(
  () => logos[props.trainData.TrainOwner] || { src: "" },
);

const calcDelay = (estimated, advertised) => {
  const estTime = new Date(estimated);
  const advTime = new Date(advertised);
  return Math.ceil((estTime - advTime) / 60000);
};

const formatTimes = (time) => {
  const formattedTime = new Date(time);
  const hours = formattedTime.getHours().toString().padStart(2, "0");
  const minutes = formattedTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

let showPosition = ref("");

const togglePosition = (val) => {
  if (showPosition.value === val) {
    showPosition.value = undefined;
  } else {
    showPosition.value = val;
  }

  emit("update:showPosition", showPosition);
};

const getTags = () => [
  {
    title: "Canceled",
    value: props.trainData.Canceled
      ? "Canceled"
      : `${calcDelay(
          props.trainData.EstimatedTimeAtLocation,
          props.trainData.AdvertisedTimeAtLocation,
        )} min`,
  },
  {
    title: "Owner",
    value: props.trainData.TrainOwner,
  },
];
</script>

<template>
  <div class="p-2 shadow my-2 cursor-pointer">
    <div class="flex flex-row justify-between mb-2">
      <div class="flex">
        <img v-if="currentLogo.src" :src="currentLogo.src" class="w-8 mr-2" />

        <h1 class="text-base font-bold">
          Nr.{{ trainData.OperationalTrainNumber }}
        </h1>
      </div>
      <p
        class="p-1 flex items-center border font-semibold text-green-500 border-green-500 text-xs rounded-lg"
      >
        <v-icon name="co-location-pin" /> {{ trainData.LocationSignature }}
      </p>
    </div>
    <div class="flex flex-row justify-between text-sm">
      <div class="font-semibold">
        <p>
          {{
            trainData.FromLocation
              ? trainData.FromLocation[0].LocationName
              : "N/A"
          }}
        </p>
      </div>
      <div class="text-right font-semibold">
        <p>
          {{
            trainData.ToLocation ? trainData.ToLocation[0].LocationName : "N/A"
          }}
        </p>
        <div class="flex flex-row justify-end">
          <p class="text-red-500 line-through">
            {{ formatTimes(trainData.AdvertisedTimeAtLocation) }}
          </p>
          <p class="text-black ml-2">
            {{ formatTimes(trainData.EstimatedTimeAtLocation) }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="w-full border-t self-center mt-2 pt-2 text-xs flex items-center justify-between"
    >
      <div>
        <span
          class="p-1 border border-red-500 rounded-lg mr-1 text-red-500 pr-2 pl-2"
          v-for="(item, index) in getTags()"
          :key="index"
          >{{ item.value }}</span
        >
      </div>
      <button
        @click.stop="togglePosition(trainData.OperationalTrainNumber)"
        :class="{
          'text-red-600 font-bold':
            currentTrain.value === trainData.OperationalTrainNumber,
          'border-gray-200 text-black': currentTrain.value === undefined,
        }"
        class="py-1 pl-2 pr-3 text-black flex items-center border-l"
      >
        <v-icon name="co-location-pin" />Visa Position
      </button>
    </div>
  </div>
</template>
