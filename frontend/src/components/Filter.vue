<script setup>
import { ref } from "vue";
const emit = defineEmits(["update:ShowDelayed"]);
const toggleMap = () => {
  ShowDelayed.value = !ShowDelayed.value;
  toggleText();
  emit("update:ShowDelayed", ShowDelayed);
};

const toggleText = () => {
  if (!ShowDelayed.value) {
    ShowDelayedText.value = "Visa försenade tåg";
  } else {
    ShowDelayedText.value = "Visa alla tåg";
  }
};

let ShowDelayedText = ref("Visa försenade tåg");
let ShowDelayed = ref(false);
</script>

<template>
  <div class="border-b border-gray-200 h-28 p-2">
    <h1 class="text-2xl font-semibold">Inställningar</h1>
    <div class="pt2">
      <h1 class="pb-2">Kartan</h1>
      <label
        class="flex items-center relative w-max cursor-pointer select-none"
      >
        <input
          @click="toggleMap"
          type="checkbox"
          class="appearance-none transition-colors cursor-pointer w-28 h-7 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 border border-slate-500 focus:ring-blue-500 bg-orange-500"
        />
        <span
          class="absolute font-medium text-xs uppercase right-2.5 text-white"
          v-if="!ShowDelayed"
        >
          Försenade
        </span>
        <span
          class="absolute font-medium text-xs uppercase right-12 text-white"
          v-if="ShowDelayed"
        >
          Alla
        </span>
        <span
          class="w-7 h-7 right-21 absolute rounded-md transform transition-transform bg-slate-300 border border-slate-500"
        />
      </label>
    </div>
  </div>
</template>
<style scoped>
input:checked {
  background-color: rgb(59 130 246);
}

input:checked ~ span:last-child {
  --tw-translate-x: 5.3rem; /* translate-x-7 */
}
</style>
