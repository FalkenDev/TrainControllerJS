<script setup>
import { inject } from "vue";
const auth = inject("auth");
defineProps({
  displayLogin: Function,
});

const logout = () => {
  auth.logout();
  console.log("Logged out");
};
</script>

<template>
  <div
    class="w-full flex bg-slate-900 justify-between items-center max-h-screen"
  >
    <h1 class="text-3xl p-2 text-white flex items-center">
      <img
        src="../../public/train.svg"
        alt="TrainControllerJS Logo"
        class="mr-2 h-8 w-auto"
      />
      TrainControllerJS
    </h1>
    <div v-if="auth.isAuthenticated.value">
      <button
        class="text-white py-2 px-5 hover:bg-slate-800 mr-2 rounded-full"
        @click="logout"
      >
        Logout: {{ auth.user.email }}
      </button>
    </div>
    <div v-else>
      <button
        class="text-white py-2 px-5 hover:bg-slate-800 mr-2 rounded-full"
        @click="displayLogin"
      >
        Login
      </button>
    </div>
  </div>
</template>
