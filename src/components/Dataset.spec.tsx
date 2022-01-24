import { render } from "@testing-library/vue";
import Dataset from "./Dataset";
import { createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import createStore from "@/store";
import {
  FSXAApi,
  FSXAContentMode,
  FSXAProxyApi,
  LogLevel,
  ComparisonQueryOperatorEnum,
} from "fsxa-api";
import { DatasetProps } from "@/types/components";
import { VueConstructor } from "vue";
import { RootState } from "@/types/fsxa-pattern-library";

jest.mock("fsxa-api");

const setup = () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = createStore({
    mode: "proxy",
    config: {
      contentMode: FSXAContentMode.PREVIEW,
      url: "somewhere",
      logLevel: LogLevel.NONE,
    },
  });
  store.replaceState({
    ...store.state,
    fsxa: {
      ...store.state.fsxa,
      locale: "de",
    },
  });
  return { localVue, store };
};

describe("Dataset", () => {
  const renderDataset = (cfg: {
    api: FSXAApi;
    localVue: VueConstructor;
    store: Store<RootState>;
    props: DatasetProps;
  }) =>
    render(Dataset, {
      localVue: cfg.localVue,
      store: cfg.store,
      props: cfg.props,
      beforeCreate() {
        Object.defineProperty(this, "fsxaApi", {
          writable: false,
          value: cfg.api,
        });
      },
    });

  it("fetches page data when mounted and a pageId is given", async () => {
    const { store, localVue } = setup();
    const api = new FSXAProxyApi("proxy-url");
    api.fetchByFilter = jest.fn().mockResolvedValue({ items: [] });
    const datasetId = "test-dataset-id";
    const pageId = "test-page-id";
    renderDataset({ api, store, localVue, props: { id: datasetId, pageId } });
    expect(api.fetchElement).toHaveBeenCalledWith({
      id: pageId,
      locale: store.state.fsxa.locale,
    });
    api.fetchElement = jest.fn();
    renderDataset({
      api,
      store,
      localVue,
      props: { id: datasetId, pageId: undefined },
    });
    expect(api.fetchElement).not.toHaveBeenCalled();
  });

  it("fetches the dataset by id if specified", async () => {
    const { store, localVue } = setup();
    const api = new FSXAProxyApi("proxy-url");
    api.fetchByFilter = jest.fn().mockResolvedValue({ items: [] });
    const datasetId = "test-dataset-id";
    renderDataset({ api, store, localVue, props: { id: datasetId } });
    expect(api.fetchByFilter).toHaveBeenCalledWith({
      filters: expect.arrayContaining([
        expect.objectContaining({
          field: "identifier",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: datasetId,
        }),
      ]),
      locale: store.state.fsxa.locale,
    });
  });

  it("fetches the dataset by route if specified", async () => {
    const { store, localVue } = setup();
    const api = new FSXAProxyApi("proxy-url");
    api.fetchByFilter = jest.fn().mockResolvedValue({ items: [] });
    const route = "test-dataset-route";
    renderDataset({ api, store, localVue, props: { route } });
    expect(api.fetchByFilter).toHaveBeenCalledWith({
      filters: expect.arrayContaining([
        expect.objectContaining({
          field: "route",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: route,
        }),
      ]),
      locale: store.state.fsxa.locale,
    });
  });
});
