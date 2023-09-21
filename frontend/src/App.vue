<script setup>
import Home from "./components/Home.vue";
import Header from "./components/Header.vue";
import { ref } from "vue";

const showLogin = ref(false);
const displayLogin = () => {
  showLogin.value = true;
};
</script>

<template>
  <div class="max-h-screen h-screen w-screen flex flex-col overflow-hidden">
    <Header :displayLogin="displayLogin" />
    <Home :showAuth="showLogin" />
  </div>
</template>
