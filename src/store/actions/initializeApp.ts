import { ActionContext } from "vuex";
import { FSXAApi } from "fsxa-api";
import { FSXAAppState, FSXAVuexState, RootState } from "@/store";
import { isNotFoundError } from "@/utils/isNotFoundError";

export interface InitializeAppPayload {
  defaultLocale: string;
  initialPath?: string;
}

export const initializeApp = (fsxaApi: FSXAApi) => async (
  { commit, state }: ActionContext<FSXAVuexState, RootState>,
  payload: InitializeAppPayload,
): Promise<void> => {
  const path = payload.initialPath ? decodeURI(payload.initialPath) : undefined;

  commit("setAppAsInitializing");
  try {
    let navigationData = await fsxaApi.fetchNavigation({
      initialPath: "/",
      locale: payload.defaultLocale,
      authData: state.auth,
    });
    if (!navigationData && path !== null) {
      navigationData = await fsxaApi
        .fetchNavigation({
          initialPath: path,
          locale: payload.defaultLocale,
          authData: state.auth,
        })
        .catch(reason => {
          if (isNotFoundError(reason)) return null;
          throw reason;
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
};
