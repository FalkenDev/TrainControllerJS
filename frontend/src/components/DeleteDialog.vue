<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div
      v-if="canEdit || props.bypassSocket"
      class="bg-white rounded-lg shadow-lg w-64 p-4"
    >
      <h1 class="text-xl font-semibold mb-2">Radera</h1>
      <p class="text-gray-700 mb-4">Vill du radera detta ärendet?</p>
      <div class="flex justify-end space-x-2">
        <button
          @click="confirm"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Ja
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

const props = defineProps(["ticket", "socket", "bypassSocket"]);
const emit = defineEmits(["confirmDelete", "closeDelete"]);

const canEdit = ref(false);

const close = () => {
  if (!props.bypassSocket) {
    leaveTrainTicketRoom();
  }
  emit("closeDelete");
};

const confirm = async () => {
  await deleteTicket();
  emit("confirmDelete");
  close();
};

const deleteTicket = async () => {
  try {
    await train_api.deleteTicket(props.ticket._id);
  } catch (error) {
    console.error("Could not delete the ticket:", error);
  }
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
