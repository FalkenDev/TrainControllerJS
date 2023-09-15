<template>
  <div id="map" class="h-full z-0"></div>
</template>

<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import L from "leaflet";

onMounted(() => {
  const socket = io("https://jsramverk-editor-kafa21.azurewebsites.net");
  const map = L.map("map").setView([62.173276, 14.942265], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const markers = ref({});

  socket.on("message", (data) => {
    if (markers.value.hasOwnProperty(data.trainnumber)) {
      let marker = markers.value[data.trainnumber];
      marker.setLatLng(data.position);
    } else {
      markers.value[data.trainnumber] = L.marker(data.position)
        .bindPopup(data.trainnumber)
        .addTo(map);
    }
  });
});
</script>
