import "./tailwind.css";
import Vue from "vue";
import TsxApp from "./../examples/tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// import SFCApp from "./../examples/sfc/index.vue";
import createStore from "./store";
import {
  FSXAConfiguration,
  FSXAContentMode,
  FSXARemoteApiConfig,
  LogLevel,
} from "fsxa-api";
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

const getFSXAConfigFromEnvFile = (): FSXAConfiguration & {
  snapUrl?: string;
} => {
  return {
    apiKey: process.env.VUE_APP_API_KEY as string,
    caas: process.env.VUE_APP_CAAS as string,
    projectId: process.env.VUE_APP_PROJECT_ID as string,
    navigationService: process.env.VUE_APP_NAVIGATION_SERVICE as string,
    tenantId: process.env.VUE_APP_TENANT_ID as string,
    snapUrl: process.env.VUE_APP_SNAP_URL as string,
  };
};

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
  snapUrl: getFSXAConfigFromEnvFile().snapUrl,
};

initializeApi(options);

const store = createStore(options);
new Vue({
  store,
  render: h => h(TsxApp),
}).$mount("#app");

/*const store2 = createStore(remoteApi);
new Vue({
  store: store2,
  render: h => h(SFCApp),
}).$mount("#app2");*/
