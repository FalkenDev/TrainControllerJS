<template>
  <div id="map" class="h-full"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import L from "leaflet";

onMounted(() => {
  // Define map and initialize it
  const map = L.map("map").setView([51.505, -0.09], 13);

  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Add a marker to the map
  L.marker([51.5, -0.09])
    .addTo(map)
    .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    .openPopup();
});
</script>
