import "@testing-library/jest-dom";
import "cross-fetch/polyfill";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { render, waitFor } from "@testing-library/vue";
import App from "./App";
import { AppProps } from "@/types/components";
import Vuex, { Store } from "vuex";
import createStore, { FSXAActions, RootState } from "@/store";
import { FSXAContentMode, FSXAProxyRoutes, LogLevel } from "fsxa-api";
import nock from "nock";
import { getMockNavigationData } from "../../testing/getMockNavigationData";
import { CreateElement, RenderContext, VNode, VueConstructor } from "vue";
import { initializeApi } from "@/utils";
import { initializeApp } from "@/store/actions/initializeApp";
import { CreateStoreProxyOptions } from "@/types/fsxa-pattern-library";
import { getMockDatasetData } from "../../testing/getMockDatasetData";
import Dataset from "@/components/Dataset";
import BaseComponent from "@/components/base/BaseComponent";

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

describe("App", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  const renderApp = (cfg: {
    localVue: VueConstructor;
    store: Store<RootState>;
  }) =>
    render(App, {
      localVue: cfg.localVue,
      store: cfg.store,
      props: {
        defaultLocale: "de",
        handleRouteChange: () => undefined,
        currentPath: "/some/path",
      } as AppProps,
    });

  it("dispatches initializeApp on mount", async () => {
    const { store, localVue } = setup();
    store.dispatch = jest.fn();

    renderApp({ store, localVue });

    expect(store.dispatch).toHaveBeenCalledWith(FSXAActions.initializeApp, {
      defaultLocale: "de",
      initialPath: "/some/path",
    });
  });
  it("fetches navigation data", async () => {
    const { store, localVue } = setup();

    const srv = nock(API_URL)
      .post(FSXAProxyRoutes.FETCH_NAVIGATION_ROUTE)
      .reply(200, getMockNavigationData())
      .post(FSXAProxyRoutes.FETCH_PROPERTIES_ROUTE)
      .reply(200, []);

    renderApp({ store, localVue });

    // ensure all endpoints were called
    await waitFor(() => expect(srv.isDone()).toBe(true));
  });
  it("renders an app error if the navigation data failed to load", async () => {
    const { store, localVue } = setup();
    nock(API_URL)
      .post(FSXAProxyRoutes.FETCH_NAVIGATION_ROUTE)
      .reply(404)
      .persist();

    const app = renderApp({ store, localVue });
    await expect(app.findByRole("alert")).resolves.toHaveTextContent(
      "Could not fetch navigation-data from NavigationService",
    );
  });
  it("renders an app error if the project properties failed to load", async () => {
    const { store, localVue } = setup();
    nock(API_URL)
      .post(FSXAProxyRoutes.FETCH_NAVIGATION_ROUTE)
      .reply(200, getMockNavigationData())
      .post(FSXAProxyRoutes.FETCH_PROPERTIES_ROUTE)
      .reply(404);

    const app = renderApp({ store, localVue });
    return app.findByText("Resource could not be found", { exact: false });
  });

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
    await store.dispatch(FSXAActions.setNavigation, navigationData);
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
