<script setup>
import TrainCard from "./TrainCard.vue";

defineProps({
  setTrain: Function,
  trains: Array,
  toggleDetails: Function,
});
</script>

<template>
  <div class="h-full w-full p-3 overflow-y-scroll">
    <TrainCard
      v-for="train in trains"
      @click="
        () => {
          setTrain(train);
          toggleDetails();
        }
      "
      :key="train.trainNr"
      :trainData="train"
    />
  </div>
</template>
