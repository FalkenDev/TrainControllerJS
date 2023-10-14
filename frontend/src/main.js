import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
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

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  cache,
  uri: "https://jsramverk-editor-kafa21.azurewebsites.net/graphql",
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app.component("v-icon", OhVueIcon);
app.mount("#app");
