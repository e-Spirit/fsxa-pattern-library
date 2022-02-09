import { ActionContext } from "vuex";
import { FSXAApi, FSXAApiErrors } from "fsxa-api";
import { FSXAAppState, FSXAVuexState, RootState } from "../";
import { Logger } from "fsxa-api/dist/types/modules";

export interface InitializeAppPayload {
  defaultLocale: string;
  initialPath?: string;
}

function isNotFoundError(errorLike: unknown) {
  return (
    errorLike &&
    typeof errorLike === "object" &&
    (errorLike as Record<string, unknown>).message === FSXAApiErrors.NOT_FOUND
  );
}

export const initializeApp = (fsxaApi: FSXAApi) => async (
  { commit, state }: ActionContext<FSXAVuexState, RootState>,
  payload: InitializeAppPayload,
): Promise<void> => {
  function fetchNavigationByPath(path: string) {
    return fsxaApi
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
  const path = payload.initialPath ? decodeURI(payload.initialPath) : "/";

  commit("setAppAsInitializing");
  try {
    let navigationData;
    navigationData = await fetchNavigationByPath(path);
    if (!navigationData) {
      // unable to find path in NavigationData. Fetch Nav for root
      navigationData = await fetchNavigationByPath("/");
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
