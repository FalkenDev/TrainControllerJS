<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div
      v-if="canEdit || props.bypassSocket"
      class="bg-white rounded-lg shadow-lg w-1/3 p-4"
    >
      <h1 class="text-xl font-semibold mb-2">
        Ändra ärende för tåget {{ props.ticket.trainNr }}
      </h1>
      <label for="select-code" class="text-sm">Orsakskod</label>
      <select
        name="select-code"
        @change="setSelectedRef($event.target.value)"
        class="p-2 rounded-lg bg-gray-200 text-xs hover:bg-gray-300 cursor-pointer transition w-full"
      >
        <option
          v-for="code in codes"
          :key="code.Code"
          :value="code.Code"
          :selected="code.Code === selectedRef"
        >
          {{ code.Code }} - {{ code.Level3Description }}
        </option>
      </select>
      <div class="flex justify-end space-x-2 pt-5">
        <button
          @click="confirm"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Uppdatera ärendet
        </button>
        <button
          @click="close"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Nej
        </button>
      </div>
    </div>
    <div v-else class="bg-white rounded-lg shadow-lg w-1/3 p-4">
      <h1 class="text-xl font-semibold mb-2">
        Du kan inte radera detta ärende just nu!
      </h1>
      <p class="text-gray-700 mb-4">
        Just nu är det en annan användare som hanterar ärenden för tåget
        {{ props.ticket.trainNr }}. Vänligen försök igen om några minuter.
      </p>
      <div class="flex justify-end space-x-2">
        <button
          @click="close"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Stäng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, defineEmits } from "vue";
import { train_api } from "../models/trains.js";

const props = defineProps(["ticket", "socket", "codes", "bypassSocket"]);
const emit = defineEmits(["confirmEdit", "closeEdit"]);
const selectedRef = ref(props.ticket.code);
const canEdit = ref(false);

const close = () => {
  if (!props.bypassSocket) {
    leaveTrainTicketRoom();
  }
  emit("closeEdit");
};

const confirm = async () => {
  await editTicket();
  emit("confirmEdit");
  close();
};

const editTicket = async () => {
  try {
    await train_api.editTicket(props.ticket.id, selectedRef.value);
  } catch (error) {
    console.error("Could not edit the ticket:", error);
  }
};

const setSelectedRef = (val) => {
  selectedRef.value = val;
};

const socketTicketSelectedTrain = () => {
  props.socket.emit("ticketHandling", props.ticket.trainNr);
};

const leaveTrainTicketRoom = () => {
  props.socket.emit("ticketHandlingLeave", props.ticket.trainNr);
};

props.socket.on("ticketHandling", () => {
  canEdit.value = true;
});

props.socket.on("ticketHandlingFull", () => {
  canEdit.value = false;
});

onMounted(() => {
  if (!props.bypassSocket) {
    socketTicketSelectedTrain(props.ticket.trainNr);
  }
});
</script>
