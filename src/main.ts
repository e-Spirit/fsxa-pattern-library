import "./tailwind.css";
import Vue from "vue";
import TsxApp from "./../examples/tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// import SFCApp from "./../examples/sfc/index.vue";
import createStore from "./store";
import { getFSXAConfigFromEnvFile } from "./utils/config";
import { FSXAContentMode, FSXARemoteApiConfig, LogLevel } from "fsxa-api";
Vue.config.productionTip = false;
import "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-okaidia.css";
import "setimmediate";
import { initializeApi } from "./utils";
import { CreateStoreRemoteOptions } from "./types/fsxa-pattern-library";

const remoteApiConfig: FSXARemoteApiConfig = {
  apikey: getFSXAConfigFromEnvFile().apiKey,
  caasURL: getFSXAConfigFromEnvFile().caas,
  contentMode: FSXAContentMode.PREVIEW,
  navigationServiceURL: getFSXAConfigFromEnvFile().navigationService,
  projectID: getFSXAConfigFromEnvFile().projectId,
  tenantID: getFSXAConfigFromEnvFile().tenantId,
  logLevel: LogLevel.INFO,
};

const options: CreateStoreRemoteOptions = {
  mode: "remote",
  config: remoteApiConfig,
};

initializeApi(options);

const store = createStore({ mode: "remote", config: remoteApiConfig });
new Vue({
  store,
  render: h => h(TsxApp),
}).$mount("#app");

/*const store2 = createStore(remoteApi);
new Vue({
  store: store2,
  render: h => h(SFCApp),
}).$mount("#app2");*/
