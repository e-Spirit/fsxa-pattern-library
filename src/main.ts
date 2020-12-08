import "./tailwind.css";
import Vue from "vue";
import TsxApp from "./../examples/tsx";
// eslint-disable-next-line
// @ts-ignore
import SFCApp from "./../examples/sfc";
import createStore from "./store";
import { getFSXAConfigFromEnvFile } from "./utils/config";
import { FSXAContentMode } from "fsxa-api";
Vue.config.productionTip = false;
import "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-okaidia.css";

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
  render: h => h(SFCApp),
}).$mount("#app2");
