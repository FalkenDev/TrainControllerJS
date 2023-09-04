<script setup>
const props = defineProps({
  trainData: Object,
  toggleSide: Function,
});
</script>

<template>
  <div class="bg-slate-700 bg-opacity-30 z-20 absolute w-full h-full">
    <div class="w-1/3 absolute bg-white h-full right-0 rounded-l-2xl p-2">
      <div class="flex justify-between">
        <h1 class="text-xl font-semibold">Detaljer</h1>
        <button @click="toggleSide">Close</button>
      </div>
      <div class="flex w-full flex-row text-xl">
        <p>Tåg:</p>
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
      <div class="border-t border-black mt-5">
        <button
          class="py-1 px-2 rounded-lg my-3 hover:bg-blue-600 transition-colors bg-blue-500 text-white font-semibold"
        >
          Lägg till ärenden
        </button>
      </div>
    </div>
  </div>
</template>
