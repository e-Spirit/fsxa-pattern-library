import "cross-fetch/polyfill";
import { createLocalVue } from "@vue/test-utils";
import { render, waitFor } from "@testing-library/vue";
import App from "./App";
import { AppProps } from "@/types/components";
import Vuex from "vuex";
import createStore, { FSXAActions } from "@/store";
import { FSXAContentMode, FSXAProxyRoutes, LogLevel } from "fsxa-api";
import nock from "nock";
import { getMockNavigationData } from "../../testing/getMockNavigationData";

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
  it("dispatches initializeApp on mount", async () => {
    const { store, localVue } = setup();
    store.dispatch = jest.fn();

    render(App, {
      localVue,
      store,
      props: {
        defaultLocale: "de",
        handleRouteChange: () => void 0,
        currentPath: "/some/path",
      } as AppProps,
    });

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

    render(App, {
      localVue,
      store,
      props: {
        defaultLocale: "de",
        handleRouteChange: () => void 0,
        currentPath: "/some/path",
      } as AppProps,
    });

    await waitFor(() => expect(srv.isDone()).toBe(true));
  });
});
