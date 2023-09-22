<script setup>
import { train_api } from "../models/trains.js";
import { ref, watch, computed, inject } from "vue";
import DeleteDialog from "./DeleteDialog.vue";
import EditDialog from "./EditDialog.vue";
const props = defineProps({
  trainData: Object,
  toggleSide: Function,
  codes: Array,
  socket: Object,
  canEditTrain: Boolean,
});

const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const ticketDialog = ref({});
const bypassDialogSocket = ref(false);

const canEditTrain = inject("canEditTrain");
const selectedRef = ref("ANA002");
const allTickets = ref([]);
const setSelectedRef = (val) => {
  selectedRef.value = val;
};

const openDeleteDialog = (val, ticket) => {
  showDeleteDialog.value = val;
  ticketDialog.value = ticket;
  if (ticket.trainNr == props.trainData.OperationalTrainNumber) {
    bypassDialogSocket.value = true;
  } else {
    bypassDialogSocket.value = false;
  }
};

const openEditDialog = (val, ticket) => {
  showEditDialog.value = val;
  ticketDialog.value = ticket;
  if (ticket.trainNr == props.trainData.OperationalTrainNumber) {
    bypassDialogSocket.value = true;
  } else {
    bypassDialogSocket.value = false;
  }
};

const fetchTickets = async () => {
  const res = await train_api.fetchAllTickets();
  allTickets.value = res.data;
};

const leaveTrainTicketRoom = () => {
  props.socket.emit(
    "ticketHandlingLeave",
    props.trainData.OperationalTrainNumber
  );
};

fetchTickets();
watch(selectedRef, fetchTickets, { deep: true });

const createAndFetchTickets = async () => {
  await train_api.createTicket(
    props.trainData.OperationalTrainNumber,
    selectedRef.value
  );
  await fetchTickets();
};

const formatTimes = (time) => {
  const formattedTime = new Date(time);
  const hours = formattedTime.getHours().toString().padStart(2, "0");
  const minutes = formattedTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const calcDelay = (estimated, advertised) => {
  const estTime = new Date(estimated);
  const advTime = new Date(advertised);
  return Math.ceil((estTime - advTime) / 60000);
};

const sortedTrainHistory = computed(() => {
  if (!props.trainData.history) {
    return [];
  }
  return props.trainData.history.sort((a, b) => {
    return (
      new Date(b.EstimatedTimeAtLocation) - new Date(a.EstimatedTimeAtLocation)
    );
  });
});

const filteredTickets = computed(() => {
  return allTickets.value.filter((ticket) => {
    return ticket.trainNr === props.trainData.OperationalTrainNumber;
  });
});
</script>

<template>
  <div class="w-full bg-white h-full right-0 p-2 z-20 overflow-y-scroll">
    <div class="flex justify-between">
      <h1 class="text-xl font-semibold">Detaljer</h1>
      <button
        @click="
          () => {
            toggleSide();
            leaveTrainTicketRoom(props.trainData.OperationalTrainNumber);
          }
        "
      >
        <v-icon name="io-close-outline" />
      </button>
    </div>
    <div class="flex w-full flex-row text-xl">
      <p><v-icon name="md-train-round" /></p>
      <p>{{ trainData.OperationalTrainNumber }}</p>
    </div>
    <div class="flex w-full flex-row text-xl">
      <p class="pr-2">Från:</p>
      <p>
        {{
          trainData.FromLocation
            ? trainData.FromLocation[0].LocationName
            : "N/A"
        }}
      </p>
    </div>
    <div class="flex w-full flex-row text-xl">
      <p class="pr-2">Till:</p>
      <p>
        {{
          trainData.ToLocation ? trainData.ToLocation[0].LocationName : "N/A"
        }}
      </p>
    </div>
    <div class="flex w-full flex-col text-xl">
      <p class="pr-2 pt-4 font-semibold pb-2">Försening historik</p>
      <table
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-11"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr class="text-white">
            <th>Plats</th>
            <th>Skulle komma</th>
            <th>Kommer</th>
            <th>Minuter försenad</th>
          </tr>
        </thead>
        <tbody v-if="sortedTrainHistory.length != 0">
          <tr
            v-for="data in sortedTrainHistory"
            :class="{
              'bg-green-200':
                data.LocationSignature === props.trainData.LocationSignature,
            }"
          >
            <td class="text-black font-semibold">
              {{ data.LocationSignature }}
            </td>
            <td class="text-red-500 line-through">
              {{ formatTimes(data.AdvertisedTimeAtLocation) }}
            </td>
            <td class="text-black ml-2">
              {{ formatTimes(data.EstimatedTimeAtLocation) }}
            </td>
            <td class="text-red-500">
              {{
                calcDelay(
                  data.EstimatedTimeAtLocation,
                  data.AdvertisedTimeAtLocation
                )
              }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <p>Ingen data</p>
        </tbody>
      </table>
    </div>

    <div class="border border-black p-8 mb-10 justify-center flex flex-col">
      <h1 class="text-lg font-semibold mb-5">Lägg till ett nytt ärende</h1>
      <div v-if="canEditTrain" class="justify-center flex flex-col">
        <label for="select-code" class="text-sm">Orsakskod</label>
        <select
          name="select-code"
          @change="setSelectedRef($event.target.value)"
          class="p-2 rounded-lg bg-gray-200 text-xs hover:bg-gray-300 cursor-pointer transition"
        >
          <option v-for="code in codes" :key="code.Code" :value="code.Code">
            {{ code.Code }} - {{ code.Level3Description }}
          </option>
        </select>
        <button
          @click="createAndFetchTickets"
          class="py-1 px-2 rounded-lg my-3 hover:bg-blue-600 transition-colors bg-blue-500 text-white"
        >
          Lägg till ärenden
        </button>
      </div>
      <div v-else class="border border-black p-2 mb-5">
        <h1 class="text-lg font-semibold text-red-400 text-center">
          Du kan tyvär inte hantera ärenden just nu för tåget
          {{ props.trainData.OperationalTrainNumber }} !
        </h1>
        <p class="text-center">
          Just nu är det en annan användare som hanterar ärenden för tåget
          {{ props.trainData.OperationalTrainNumber }}. Vänligen försöker igen
          om några minuter.
        </p>
      </div>
    </div>

    <div>
      <div>
        <h1 class="text-xl font-semibold pb-2">Tågets ärenden</h1>
      </div>
      <table
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-11"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr class="text-white">
            <th>Tåg Nr</th>
            <th>Statuskod</th>
            <th>Skapad</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody v-if="filteredTickets.length != 0">
          <tr v-for="ticket in filteredTickets">
            <td class="text-black">{{ ticket.trainNr }}</td>
            <td class="text-red-400">{{ ticket.code }}</td>
            <td class="text-green-600">
              {{ new Date(ticket.createdAt).toLocaleString() }}
            </td>
            <td v-if="canEditTrain">
              <button
                class="text-red-400 font-bold mr-2"
                @click="openDeleteDialog(true, ticket)"
              >
                Radera
              </button>
              <span class="pr-2">|</span>
              <button
                class="text-orange-400 font-bold mr-2"
                @click="openEditDialog(true, ticket)"
              >
                Ändra
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <p class="text-red-400 font-semibold text-base">
            Det finns inga ärenden för detta tåget!
          </p>
        </tbody>
      </table>
    </div>
    <div>
      <div>
        <h1 class="text-xl font-semibold pb-2">Alla befintliga ärenden</h1>
      </div>
      <table
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-11"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr class="text-white">
            <th>Tåg Nr</th>
            <th>Statuskod</th>
            <th>Skapad</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody v-if="allTickets.length != 0">
          <tr v-for="ticket in allTickets">
            <td class="text-black">{{ ticket.trainNr }}</td>
            <td class="text-red-400">{{ ticket.code }}</td>
            <td class="text-green-600">
              {{ new Date(ticket.createdAt).toLocaleString() }}
            </td>
            <td>
              <button
                class="text-red-400 font-bold mr-2"
                @click="openDeleteDialog(true, ticket)"
              >
                Radera
              </button>
              <span class="pr-2">|</span>
              <button
                class="text-orange-400 font-bold mr-2"
                @click="openEditDialog(true, ticket)"
              >
                Ändra
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <p class="text-red-400 font-semibold text-base">
            Det finns inga befintliga ärenden!
          </p>
        </tbody>
      </table>
    </div>
  </div>
  <DeleteDialog
    v-if="showDeleteDialog"
    @closeDelete="showDeleteDialog = false"
    @confirmDelete="fetchTickets()"
    :socket="props.socket"
    :ticket="ticketDialog"
    :bypassSocket="bypassDialogSocket"
  ></DeleteDialog>
  <EditDialog
    v-if="showEditDialog"
    @closeEdit="showEditDialog = false"
    @confirmEdit="fetchTickets()"
    :socket="props.socket"
    :ticket="ticketDialog"
    :codes="props.codes"
    :bypassSocket="bypassDialogSocket"
  ></EditDialog>
</template>
