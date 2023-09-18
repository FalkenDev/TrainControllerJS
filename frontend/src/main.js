import { createApp } from "vue";
import "leaflet/dist/leaflet.css";
import "./style.css";
import "./index.css";
import App from "./App.vue";
import {
  IoCloseOutline,
  MdTrainRound,
  CoClock,
  CoLocationPin,
} from "oh-vue-icons/icons";
import { OhVueIcon, addIcons } from "oh-vue-icons";
addIcons(IoCloseOutline, MdTrainRound, CoClock, CoLocationPin);
const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
