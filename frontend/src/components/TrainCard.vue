<script setup>
const props = defineProps({
  trainData: Object,
});

// console.log(props.trainData);

const calcDelay = (estimated, advertised) => {
  const estTime = new Date(estimated);
  const advTime = new Date(advertised);
  const diffInMilliseconds = estTime - advTime;
  return Math.ceil(diffInMilliseconds / 60000);
};

const companyLogo = (TrainOwner) => {
  console.log("companyLogo");
  console.log(TrainOwner);
  const logos = {
    "Ö-TÅG": { src: ÖTÅG, width: "7", height: "6" },
    SJ: { src: SJ, width: "9", height: "6" },
    SKANE: { src: SKANE, width: "7", height: "6" },
    SLL: { src: SLL, width: "7", height: "6" },
    TÅGAB: { src: togab, width: "7", height: "6" },
    VY: { src: VY, width: "10", height: "6" },
    MÄLAB: { src: malartag, width: "9", height: "6" },
    BLSRAIL: { src: blsrail, width: "8", height: "10" },
    JLT: { src: jlt, width: "7", height: "6" },
    MTAB: { src: mtab, width: "7", height: "6" },
    MTRN: { src: mtrx, width: "11", height: "6" },
    NRAIL: { src: nrail, width: "10", height: "10" },
    VASTTRAF: { src: vast, width: "7", height: "7" },
  };

  return logos[TrainOwner] || { src: "", width: "0", height: "0" };
};

const formatTimes = (time) => {
  const formattedTime = new Date(time);
  const hours = formattedTime.getHours().toString().padStart(2, "0");
  const minutes = formattedTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getTags = () => {
  return [
    {
      title: "Canceled",
      value: props.trainData.Canceled
        ? "Canceled"
        : `${calcDelay(
            props.trainData.EstimatedTimeAtLocation,
            props.trainData.AdvertisedTimeAtLocation
          )} min`,
    },
    {
      title: "Owner",
      value: props.trainData.TrainOwner,
    },
  ];
};
</script>

<template>
  <div class="p-2 shadow my-2 cursor-pointer">
    <div class="flex flex-row justify-between mb-2">
      <div class="flex">
        <img
          v-if="companyLogo(trainData.TrainOwner).src"
          :src="companyLogo(trainData.TrainOwner).src"
          :class="`w-${companyLogo(trainData.TrainOwner).width} h-${
            companyLogo(trainData.TrainOwner).height
          } mr-2`"
        />
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
