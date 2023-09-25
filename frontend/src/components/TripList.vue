<script setup>
const emit = defineEmits(["update:canEdit", "update:showPosition"]);

import TrainCard from "./TrainCard.vue";
import { onUnmounted, computed, ref } from "vue";

const props = defineProps({
  setTrain: Function,
  trains: Array,
  toggleDetails: Function,
  socket: Object,
});

const newTrainNr = ref({});

let beforeTrain = "";

props.socket.on("ticketHandling", () => {
  emit("update:canEdit", true);
});

props.socket.on("ticketHandlingFull", () => {
  emit("update:canEdit", false);
});

const socketTicketSelectedTrain = (trainNr) => {
  beforeTrain = trainNr.OperationalTrainNumber;
  props.socket.emit("ticketHandling", trainNr.OperationalTrainNumber);
};

const leaveTrainTicketRoom = () => {
  props.socket.emit("ticketHandlingLeave", beforeTrain);
};

const showPosition = (trainNr) => {
  newTrainNr.value = trainNr;
  emit("update:showPosition", trainNr);
};

// Close the socket connection when the component is unmounted
onUnmounted(() => {
  props.socket.close();
});

// Computed property for sorted trains
const sortedTrains = computed(() => {
  return props.trains.slice().sort((a, b) => {
    return (
      new Date(a.EstimatedTimeAtLocation) - new Date(b.EstimatedTimeAtLocation)
    );
  });
});
</script>

<template>
  <div class="h-full w-full p-3 overflow-y-scroll">
    <h1 class="text-2xl font-semibold border-b-2 pb-2 mb-4 border-gray-300">
      Försenade tåg
    </h1>
    <TrainCard
      v-for="train in sortedTrains"
      @click="
        () => {
          setTrain(train);
          toggleDetails();
          leaveTrainTicketRoom();
          socketTicketSelectedTrain(train);
        }
      "
      :key="train.OperationalTrainNumber"
      :trainData="train"
      :currentTrain="newTrainNr"
      @update:showPosition="showPosition"
    />
  </div>
</template>
