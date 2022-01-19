import "@testing-library/jest-dom";
import "cross-fetch/polyfill";
import { createLocalVue } from "@vue/test-utils";
import { render, waitFor } from "@testing-library/vue";
import App from "./App";
import { AppProps } from "@/types/components";
import Vuex, { Store } from "vuex";
import createStore, { FSXAActions, RootState } from "@/store";
import { FSXAContentMode, FSXAProxyRoutes, LogLevel } from "fsxa-api";
import nock from "nock";
import { getMockNavigationData } from "../../testing/getMockNavigationData";
import { VueConstructor } from "vue";

const API_URL = "http://fsxa.local";

const setup = () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = createStore({
    mode: "proxy",
    config: {
      contentMode: FSXAContentMode.PREVIEW,
      url: API_URL,
      logLevel: LogLevel.NONE,
    },
  });
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
});
