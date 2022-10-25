import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import createStore from "@/store";
import { FSXAContentMode, FSXAProxyApi, LogLevel } from "fsxa-api";
import { CreateStoreProxyOptions } from "@/types/fsxa-pattern-library";
import { TriggerRouteChangeParams, triggerRouteChange } from "./getters";
import { getMockNavigationData } from "../../testing/getMockNavigationData";
import { getMockDatasetData } from "../../testing/getMockDatasetData";

jest.mock("fsxa-api");

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

const setup = () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = createStore(options);
  store.replaceState({
    ...store.state,
    fsxa: {
      ...store.state.fsxa,
    },
  });
  const fsxaApi = new FSXAProxyApi("http://fsxa.local", LogLevel.NONE);
  return { localVue, store, fsxaApi };
};

describe("triggerRouteChange", () => {
  it("return route from routes array on language change if targetDataset.route is empty", async () => {
    const { store, fsxaApi } = setup();
    const currentLocale = "de";
    const targetLocale = "en";
    const currentDataset = {
      id: "datasetId",
      route: "currentDSRoute2",
      routes: [
        { pageRef: "PRID1", route: "currentDSRoute1" },
        { pageRef: "PRID2", route: "currentDSRoute2" },
      ],
    };
    const targetDataset = {
      id: "datasetId",
      route: "",
      routes: [
        { pageRef: "PRID1", route: "targetDSRoute1" },
        { pageRef: "PRID2", route: "targetDSRoute2" },
      ],
    };
    // prepare store state
    store.state.fsxa.locale = currentLocale;
    store.state.fsxa.navigation = getMockNavigationData();
    store.state.fsxa.stored[currentDataset.route] = {
      ttl: 30000,
      fetchedAt: Date.now(),
      value: currentDataset,
    };
    // mocks
    fsxaApi.fetchByFilter = jest
      .fn()
      .mockResolvedValue({ items: [targetDataset] });

    // change language via triggerRouteChange
    const params: TriggerRouteChangeParams = {
      route: currentDataset.route,
      locale: targetLocale,
    };
    const targetRoute = await triggerRouteChange(
      store,
      fsxaApi,
      params,
      currentLocale,
    );
    expect(targetRoute).toEqual(targetDataset.routes[1].route);
  });

  it("don't fetch dataset if navigation data is complete", async () => {
    const { store, fsxaApi } = setup();
    const currentLocale = "de";
    const targetDataset = getMockDatasetData();
    const mockNavigationData = getMockNavigationData();
    // the target dataset does exist in the seoRouteMap of this NavigationData
    mockNavigationData.seoRouteMap[targetDataset.routes[0].route] =
      targetDataset.routes[0].pageRef;
    store.state.fsxa.navigation = mockNavigationData;
    // mocks
    fsxaApi.fetchByFilter = jest
      .fn()
      .mockResolvedValue({ items: [targetDataset] });
    const targetRoute = targetDataset.routes[0].route;
    const params: TriggerRouteChangeParams = {
      route: targetRoute,
    };
    const route = await triggerRouteChange(
      store,
      fsxaApi,
      params,
      currentLocale,
    );
    expect(fsxaApi.fetchByFilter).not.toHaveBeenCalledWith();
    expect(store.state.fsxa.stored[targetRoute]).toEqual(undefined);
    expect(route).toEqual(targetRoute);
  });

  it("fetch and cache dataset if navigation data is missing", async () => {
    const { store, fsxaApi } = setup();
    const currentLocale = "de";
    const targetDataset = getMockDatasetData();
    // the target dataset does not exist in the seoRouteMap of this NavigationData
    const mockNavigationData = getMockNavigationData();
    store.state.fsxa.navigation = mockNavigationData;
    // mocks
    fsxaApi.fetchByFilter = jest
      .fn()
      .mockResolvedValue({ items: [targetDataset] });
    const targetRoute = targetDataset.routes[0].route;
    const params: TriggerRouteChangeParams = {
      route: targetRoute,
    };
    const route = await triggerRouteChange(
      store,
      fsxaApi,
      params,
      currentLocale,
    );
    expect(fsxaApi.fetchByFilter).toHaveBeenCalledWith({
      filters: [{ field: "routes.route", operator: "$eq", value: targetRoute }],
      locale: currentLocale,
    });
    expect(store.state.fsxa.stored[targetRoute].value).toEqual(targetDataset);
    expect(route).toEqual(targetRoute);
  });
});
