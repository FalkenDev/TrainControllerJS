<script setup>
const emit = defineEmits(["update:canEdit"]);

import TrainCard from "./TrainCard.vue";
import { onUnmounted } from "vue";

const props = defineProps({
  setTrain: Function,
  trains: Array,
  toggleDetails: Function,
  socket: Object,
});

let beforeTrain = "";

props.socket.on("ticketHandling", (message) => {
  console.log(message);
  emit("update:canEdit", true);
});

props.socket.on("ticketHandlingFull", (message) => {
  console.log(message);
  emit("update:canEdit", false);
});

const socketTicketSelectedTrain = (trainNr) => {
  beforeTrain = trainNr.OperationalTrainNumber;
  props.socket.emit("ticketHandling", trainNr.OperationalTrainNumber);
};

const leaveTrainTicketRoom = () => {
  console.log("Leaving the room on train:", beforeTrain);
  props.socket.emit("ticketHandlingLeave", beforeTrain);
};

// Close the socket connection when the component is unmounted
onUnmounted(() => {
  props.socket.close();
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
          leaveTrainTicketRoom();
          socketTicketSelectedTrain(train);
        }
      "
      :key="train.OperationalTrainNumber"
      :trainData="train"
    />
  </div>
</template>
