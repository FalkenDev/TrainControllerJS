<script setup>
import Home from "./components/Home.vue";
import Header from "./components/Header.vue";
import AuthProvider from "./components/AuthProvider.vue";
import { ref } from "vue";

const showLogin = ref(false);
const displayLogin = () => {
  showLogin.value = true;
};

const hideLogin = () => {
  showLogin.value = false;
};
</script>

<template>
  <div class="max-h-screen h-screen w-screen flex flex-col overflow-hidden">
    <AuthProvider>
      <Header :displayLogin="displayLogin" />
      <Home :showAuth="showLogin" :hideLogin="hideLogin" />
    </AuthProvider>
  </div>
</template>
