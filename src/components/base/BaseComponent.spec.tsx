import createStore from "@/store";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { CreateStoreProxyOptions } from "@/types/fsxa-pattern-library";
import Vuex from "vuex";
import { FSXAContentMode, FSXAProxyRoutes, LogLevel } from "fsxa-api";
import nock from "nock";
import { getMockDatasetData } from "../../../testing/getMockDatasetData";
import { getMockNavigationData } from "../../../testing/getMockNavigationData";
import BaseComponent from "./BaseComponent";
import { initializeApi } from "@/utils";

const API_URL = "http://fsxa.local";

const options: CreateStoreProxyOptions = {
  mode: "proxy",
  config: {
    contentMode: FSXAContentMode.PREVIEW,
    clientUrl: API_URL,
    serverUrl: API_URL,
    logLevel: LogLevel.NONE,
  },
};

initializeApi(options);

const setup = () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = createStore(options);

  return { localVue, store };
};

describe("BaseComponent", () => {
  it("should get the proper current dataset for given path", async () => {
    const { store, localVue } = setup();
    const navigationData = getMockNavigationData();
    const datasetData = getMockDatasetData();
    // Provide current path
    const currentPath = "/Produkte/Stick-Up-Cam-Sicherheitskamera-FST-35J.html";
    const provide = {
      __reactiveInject__: {
        currentPath,
      },
    };

    await nock(API_URL)
      .post(FSXAProxyRoutes.FETCH_NAVIGATION_ROUTE)
      .reply(200, navigationData)
      .post(FSXAProxyRoutes.FETCH_BY_FILTER_ROUTE)
      .reply(200, datasetData);

    const wrapper = shallowMount(BaseComponent, {
      store,
      localVue,
      provide,
    });

    // Store the navigation data
    store.state.fsxa.navigation = navigationData;
    expect(wrapper.vm.navigationData).toEqual(navigationData);

    // store the dataset
    wrapper.vm.setStoredItem(currentPath, datasetData);

    // get the caasDocumentId from the dataset
    const pageRef = wrapper.vm.currentDataset?.routes.find(
      route => route.route === currentPath,
    )?.pageRef;

    // Check if dataset provided by caas match with navigation caas id document
    expect(wrapper.vm.currentPage?.caasDocumentId).toBe(pageRef);
  });
});
