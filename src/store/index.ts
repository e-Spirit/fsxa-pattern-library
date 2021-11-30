import Vue from "vue";
import Vuex, { Module } from "vuex";
import {
  NavigationData,
  FSXAContentMode,
  GCAPage,
  FSXAApiErrors,
  FSXAProxyApi,
  FSXARemoteApi,
} from "fsxa-api";
import {
  CreateStoreProxyOptions,
  CreateStoreRemoteOptions,
} from "../types/fsxa-pattern-library";
export interface FSXAAppError {
  message: string;
  description?: string;
  stacktrace?: string;
}
export enum FSXAAppState {
  not_initialized = "not_initialized",
  initializing = "initializing",
  ready = "ready",
  error = "error",
}
export interface FSXAVuexState {
  locale: string | null;
  configuration: any;
  appState: FSXAAppState;
  navigation: NavigationData | null;
  settings: any | null;
  error: FSXAAppError | null;
  stored: {
    [key: string]: {
      ttl: number;
      fetchedAt: number;
      value: any;
    };
  };
  mode: "release" | "preview";
  auth: any;
}
export interface RootState {
  fsxa: FSXAVuexState;
}

Vue.use(Vuex);

const prefix = "fsxa";

const Actions = {
  initializeApp: "initializeApp",
  hydrateClient: "hydrateClient",
  setStoredItem: "setStoredItem",
};

const Getters = {
  appState: "appState",
  error: "error",
  currentPage: "currentPage",
};

export const FSXAActions = {
  initializeApp: `${prefix}/${Actions.initializeApp}`,
  hydrateClient: `${prefix}/${Actions.hydrateClient}`,
  setStoredItem: `${prefix}/${Actions.setStoredItem}`,
};

export const getFSXAConfiguration = (config: any): any => {
  if (config.mode === "remote") return config;
  return {
    mode: config.mode,
    baseUrl:
      typeof window !== "undefined"
        ? config.baseUrl.client
        : config.baseUrl.server,
  };
};

const GETTER_NAVIGATION_DATA = "navigationData";
const GETTER_CONFIGURATION = "configuration";
const GETTER_LOCALE = "locale";
const GETTER_ITEM = "item";
const GETTER_PAGE_BY_URL = "getPageIdByUrl";
const GETTER_MODE = "mode";
const GETTER_REFERENCE_URL = "getReferenceUrl";

export const FSXAGetters = {
  [Getters.appState]: `${prefix}/${Getters.appState}`,
  [Getters.error]: `${prefix}/${Getters.error}`,
  [GETTER_NAVIGATION_DATA]: `${prefix}/${GETTER_NAVIGATION_DATA}`,
  [GETTER_CONFIGURATION]: `${prefix}/${GETTER_CONFIGURATION}`,
  [GETTER_LOCALE]: `${prefix}/${GETTER_LOCALE}`,
  [GETTER_ITEM]: `${prefix}/${GETTER_ITEM}`,
  [GETTER_PAGE_BY_URL]: `${prefix}/${GETTER_PAGE_BY_URL}`,
  [GETTER_MODE]: `${prefix}/${GETTER_MODE}`,
  [GETTER_REFERENCE_URL]: `${prefix}/${GETTER_REFERENCE_URL}`,
};

const isNotFoundError = (errorLike: any) =>
  typeof errorLike === "object" &&
  errorLike.message === FSXAApiErrors.NOT_FOUND;

export function getFSXAModule<R extends RootState>(
  options: CreateStoreProxyOptions | CreateStoreRemoteOptions,
): Module<FSXAVuexState, R> {
  const fsxaApi =
    options.mode === "remote"
      ? new FSXARemoteApi(options.config)
      : new FSXAProxyApi(options.config.url, options.config.logLevel);

  return {
    namespaced: true,
    state: () => ({
      stored: {},
      locale: null,
      navigation: null,
      settings: null,
      appState: FSXAAppState.not_initialized,
      error: null,
      fsxaApiMode: options.mode,
      mode:
        options.mode === "remote"
          ? options.config.contentMode
          : ("remote" as any),
      configuration: options.config,
      auth: null,
    }),
    actions: {
      [Actions.initializeApp]: async function(
        { commit },
        payload: {
          defaultLocale: string;
          initialPath?: string;
        },
      ) {
        const path = payload.initialPath
          ? decodeURI(payload.initialPath)
          : undefined;

        commit("setAppAsInitializing");
        try {
          let navigationData = await fsxaApi.fetchNavigation({
            initialPath: "/",
            locale: payload.defaultLocale,
            authData: this.state.fsxa.auth,
          });
          if (!navigationData && path !== null) {
            navigationData = await fsxaApi.fetchNavigation({
              initialPath: path,
              locale: payload.defaultLocale,
              authData: this.state.fsxa.auth,
            });
          }
          if (!navigationData) {
            commit("setError", {
              message: "Could not fetch navigation-data from NavigationService",
              description:
                "Please make sure that the Navigation-Service is available and your config is correct. See the documentation for more information.",
            });
            return;
          }

          const settings = await fsxaApi.fetchProjectProperties({
            locale: navigationData.meta.identifier.languageId,
          });

          commit("setAppAsInitialized", {
            locale: navigationData.meta.identifier.languageId,
            navigationData,
            settings: settings && settings.length !== 0 ? settings[0] : null,
          });
        } catch (error) {
          if (error instanceof Error) {
            commit("setAppState", FSXAAppState.error);
            commit("setError", {
              message: error.message,
              stacktrace: error.stack,
            });
          }
          return;
        }
      },
      [Actions.hydrateClient]: function({ commit }, payload: FSXAVuexState) {
        commit("setInitialStateFromServer", payload);
      },
      [Actions.setStoredItem]: async function({ commit }, payload) {
        commit("setStoredItem", payload);
      },
    },
    mutations: {
      setNavigation(state, payload) {
        state.navigation = payload;
      },
      setAuth(state, payload) {
        state.auth = payload;
      },
      setAppAsInitializing(state) {
        state.appState = FSXAAppState.initializing;
        state.navigation = null;
        state.settings = null;
        state.stored = {};
        state.error = null;
      },
      setAppAsInitialized(
        state,
        payload: {
          locale: string;
          navigationData: NavigationData;
          settings: GCAPage | null;
        },
      ) {
        state.appState = FSXAAppState.ready;
        state.navigation = payload.navigationData;
        state.settings = payload.settings;
        state.locale = payload.locale;
      },
      setLocale(state, locale: string) {
        Vue.set(state, "locale", locale);
      },
      startInitialization(state) {
        Vue.set(state, "appState", FSXAAppState.initializing);
        // we reset all stored data
        Vue.set(state, "stored", {});
      },
      setGlobalData(
        state,
        payload: {
          navigationData: NavigationData;
          settings: any;
          locale: string;
        },
      ) {
        Vue.set(state, "locale", payload.locale);
        Vue.set(state, "navigation", payload.navigationData);
        Vue.set(state, "settings", payload.settings);
      },
      setStoredItem(state, { key, value, fetchedAt, ttl }) {
        Vue.set(state.stored, key, {
          value,
          fetchedAt,
          ttl,
        });
      },
      setInitialStateFromServer(state, initialStateFromServer: FSXAVuexState) {
        Vue.set(state, "configuration", initialStateFromServer.configuration);
        Vue.set(state, "locale", initialStateFromServer.locale);
        Vue.set(state, "navigation", initialStateFromServer.navigation);
        Vue.set(state, "settings", initialStateFromServer.settings);
        Vue.set(state, "appState", initialStateFromServer.appState);
        Vue.set(state, "error", initialStateFromServer.error);
        Vue.set(state, "stored", initialStateFromServer.stored);
      },
      setAppState(state, appState) {
        Vue.set(state, "appState", appState);
      },
      setError(state, payload: FSXAAppError) {
        state.appState = FSXAAppState.error;
        state.error = payload;
      },
    },
    getters: {
      [Getters.appState]: function(state): FSXAAppState {
        return state.appState;
      },
      [Getters.error]: function(state) {
        return state.error;
      },
      [GETTER_NAVIGATION_DATA]: function(state) {
        return state.navigation || null;
      },
      [GETTER_CONFIGURATION]: function(state) {
        return state.configuration || null;
      },
      [GETTER_LOCALE]: function(state) {
        return state.locale || null;
      },
      [GETTER_ITEM]: (state): any => (id: string) => state.stored[id] || null,
      [GETTER_PAGE_BY_URL]: (state, getters) => (url: string) => {
        const navigationData = getters[FSXAGetters[GETTER_NAVIGATION_DATA]];
        if (!navigationData) return null;
        return (navigationData as NavigationData).seoRouteMap[url] || null;
      },
      [GETTER_MODE]: (state): FSXAContentMode => state.mode as FSXAContentMode,
      [GETTER_REFERENCE_URL]: state => (
        referenceId: string,
        referenceType: "PageRef",
      ) => {
        const page =
          referenceType === "PageRef"
            ? state.navigation?.idMap[referenceId]
            : null;
        return page ? page.seoRoute : null;
      },
    },
  };
}

const createStore = (
  options: CreateStoreProxyOptions | CreateStoreRemoteOptions,
) => {
  const store = new Vuex.Store<RootState>({
    modules: {
      fsxa: {
        ...getFSXAModule<RootState>(options),
      },
    },
  });
  return store;
};
export default createStore;
