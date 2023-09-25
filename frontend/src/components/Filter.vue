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
    <div class="pt-2">
      <button
        @click="toggleMap"
        class="border border-gray-400 pr-2 pl-2 shadow-md rounded-md bg-blue-300 font-semibold"
      >
        {{ ShowDelayedText }}
      </button>
    </div>
  </div>
</template>
