<script>
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

export default {
  props: {
    trainData: Object,
  },

  data() {
    return {
      logos: {
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
      },
    };
  },

  computed: {
    currentLogo() {
      return (
        this.logos[this.trainData.TrainOwner] || {
          src: "",
        }
      );
    },
  },

  methods: {
    calcDelay(estimated, advertised) {
      const estTime = new Date(estimated);
      const advTime = new Date(advertised);
      return Math.ceil((estTime - advTime) / 60000);
    },

    formatTimes(time) {
      const formattedTime = new Date(time);
      const hours = formattedTime.getHours().toString().padStart(2, "0");
      const minutes = formattedTime.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },

    getTags() {
      return [
        {
          title: "Canceled",
          value: this.trainData.Canceled
            ? "Canceled"
            : `${this.calcDelay(
                this.trainData.EstimatedTimeAtLocation,
                this.trainData.AdvertisedTimeAtLocation
              )} min`,
        },
        {
          title: "Owner",
          value: this.trainData.TrainOwner,
        },
      ];
    },
  },
};
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
    <div class="w-full border-t self-center mt-2 pt-2 text-xs">
      <p>
        <span
          class="p-1 border border-red-500 rounded-lg mr-1 text-red-500"
          v-for="(item, index) in getTags()"
          :key="index"
          >{{ item.value }}</span
        >
      </p>
    </div>
  </div>
</template>
