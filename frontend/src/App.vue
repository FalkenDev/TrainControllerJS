<script setup>
import Home from './components/Home.vue'
import Header from "./components/Header.vue";
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <Header/>
    <Home msg="Vår tåg App" />
  </div>
</template>
