<script setup>
import { computed } from "vue";
const props = defineProps({
  trainData: Object,
});

const delayedEndTime = computed(() => {
  if (props.trainData.delay <= 0) {
    return;
  }
  const [hours, minutes] = props.trainData.endTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + props.trainData.delay;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMinutes
    .toString()
    .padStart(2, "0")}`;
});
</script>

<template>
  <div class="p-2 shadow my-2 cursor-pointer">
    <div class="flex flex-row justify-between mb-2">
      <h1 class="text-base font-bold">Nr.{{ trainData.trainNr }}</h1>
      <p
        class="p-1 border font-semibold text-green-500 border-green-500 text-xs rounded-lg"
      >
        {{ trainData.activeLocation }}
      </p>
    </div>
    <div class="flex flex-row justify-between text-sm">
      <div class="font-semibold">
        <p>{{ trainData.from }}</p>
        <p>{{ trainData.startTime }}</p>
      </div>
      <div class="text-right font-semibold">
        <p>{{ trainData.to }}</p>
        <div class="flex flex-row justify-end">
          <p
            :class="{
              'text-red-500 line-through': trainData.status === 'Delayed',
            }"
          >
            {{ trainData.endTime }}
          </p>
          <p
            v-if="trainData.status === 'Delayed'"
            :class="{ 'text-red-500 ml-2': trainData.status === 'Delayed' }"
          >
            {{ delayedEndTime }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
