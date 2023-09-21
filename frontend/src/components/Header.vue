<script setup>
defineProps({
  displayLogin: Function,
});
</script>

<template>
  <div class="w-full flex bg-slate-900 justify-between items-center">
    <h1 class="text-3xl p-2 text-white">TrainControllerJS</h1>
    <div>
      <button
        class="text-white py-2 px-5 hover:bg-slate-800 mr-2 rounded-full"
        @click="displayLogin"
      >
        Login
      </button>
    </div>
  </div>
</template>
