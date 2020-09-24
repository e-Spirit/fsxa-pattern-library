import "vue-tsx-support/enable-check";
import "fsxa-ui/dist/fsxa-ui.css";
import Vue from "vue";
import App from "./App";
import createStore from "./store";
import { getFSXAConfigFromEnvFile } from "./utils/config";
Vue.config.productionTip = false;

const store = createStore(process.env.VUE_APP_MODE, {
  mode: "remote",
  config: getFSXAConfigFromEnvFile(),
});
new Vue({
  store,
  render: h => h(App),
}).$mount("#app");