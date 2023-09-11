<script setup>
import { train_api } from "../models/trains.js";
import { ref, watch } from "vue";
const props = defineProps({
  trainData: Object,
  toggleSide: Function,
  codes: Array,
});

const selectedRef = ref("ANA002");
const allTickets = ref([]);
const setSelectedRef = (val) => {
  console.log(val);
  selectedRef.value = val;
};

const fetchTickets = async () => {
  const res = await train_api.fetchAllTickets();
  allTickets.value = res.data;
};

fetchTickets();
watch(selectedRef, fetchTickets);

const createAndFetchTickets = async () => {
  await train_api.createTicket(
    props.trainData.OperationalTrainNumber,
    selectedRef.value,
  );
  await fetchTickets();
};

const deleteAndFetchTickets = async (ticketId) => {
  try {
    await train_api.deleteTicket(ticketId);
    await fetchTickets();
  } catch (error) {
    console.error("Could not delete the ticket:", error);
  }
};
</script>

<template>
  <div class="w-full bg-white h-full right-0 p-2 z-20 overflow-y-scroll">
    <div class="flex justify-between">
      <h1 class="text-xl font-semibold">Detaljer</h1>
      <button @click="toggleSide">
        <v-icon name="io-close-outline" />
      </button>
    </div>
    <div class="flex w-full flex-row text-xl">
      <p><v-icon name="md-train-round" /></p>
      <p>{{ trainData.OperationalTrainNumber }}</p>
    </div>
    <div class="flex w-full flex-row text-xl">
      <p>Från:</p>
      <p>
        {{
          trainData.FromLocation
            ? trainData.FromLocation[0].LocationName
            : "N/A"
        }}
      </p>
    </div>
    <div class="flex w-full flex-row text-xl">
      <p>To:</p>
      <p>
        {{
          trainData.ToLocation ? trainData.ToLocation[0].LocationName : "N/A"
        }}
      </p>
    </div>
    <div class="border-t border-black my-5 justify-center flex flex-col">
      <h1 class="text-lg font-semibold mb-5">Lägg till ett nytta ärende</h1>
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

      <div>
        <h1>Befintliga ärenden</h1>
      </div>
      <table
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-11"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th>Train Nr</th>
            <th>Code</th>
            <th>Skapad</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in allTickets">
            <td>{{ ticket.trainNr }}</td>
            <td>{{ ticket.code }}</td>
            <td>{{ new Date(ticket.createdAt).toLocaleString() }}</td>
            <td>
              <button
                @click="() => deleteAndFetchTickets(ticket._id)"
                class="text-black"
              >
                Radera
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
