import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import createStore, { FSXAActions } from "@/store";
import { FSXAContentMode, LogLevel } from "fsxa-api";
import { CreateStoreProxyOptions } from "@/types/fsxa-pattern-library";
import { getMockNavigationData } from "../../testing/getMockNavigationData";
import BaseComponent from "@/components/base/BaseComponent";

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

describe("dispatch actions", () => {
  let localVue: any;
  let store: any;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = createStore(options);
    store.replaceState({
      ...store.state,
      fsxa: {
        ...store.state.fsxa,
      },
    });
  });

  it("should dispatch 'fsxa/setNavigation' and change navigation data", () => {
    const provide = {
      __reactiveInject__: {
        currentPath: "/some/path",
      },
    };
    const wrapper = shallowMount(BaseComponent, { store, localVue, provide });
    const navigationData = getMockNavigationData();
    // Dispatch setNavigation
    store.dispatch(FSXAActions.setNavigation, navigationData);
    expect(wrapper.vm.navigationData).toEqual(navigationData);

    // Add new navigation data
    const newNavigationData = {
      ...navigationData,
      seoRouteMap: {
        "/home/": "id-home",
        "/about/": "id-about",
        "/product/": "id-product",
      },
    };
    store.dispatch(FSXAActions.setNavigation, newNavigationData);
    expect(wrapper.vm.navigationData).toEqual(newNavigationData);
  });
});
