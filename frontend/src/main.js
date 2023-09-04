import { createApp } from "vue";
import "leaflet/dist/leaflet.css";
import "./style.css";
import "./index.css";
import App from "./App.vue";
import { OhVueIcon } from "oh-vue-icons";
const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
