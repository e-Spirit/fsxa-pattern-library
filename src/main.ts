import "vue-tsx-support/enable-check";
import "fsxa-ui/dist/fsxa-ui.css";
import Vue from "vue";
import TsxApp from "./App";
import VueApp from "./App.vue";
import createStore from "./store";
import { getFSXAConfigFromEnvFile } from "./utils/config";
import { FSXAContentMode } from "fsxa-api";
Vue.config.productionTip = false;
import VuePrism from "vue-prism";
Vue.use(VuePrism);

import "prismjs/themes/prism.css";

const store = createStore(process.env.VUE_APP_MODE as FSXAContentMode, {
  mode: "remote",
  config: getFSXAConfigFromEnvFile(),
});
const store2 = createStore(process.env.VUE_APP_MODE as FSXAContentMode, {
  mode: "remote",
  config: getFSXAConfigFromEnvFile(),
});
new Vue({
  store,
  render: h => h(TsxApp),
}).$mount("#app");
new Vue({
  store: store2,
  render: h => h(VueApp),
}).$mount("#app2");
