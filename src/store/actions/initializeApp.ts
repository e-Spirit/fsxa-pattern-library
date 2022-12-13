import { ActionContext } from "vuex";
import {
  Dataset,
  FetchNavigationParams,
  FSXAApi,
  FSXAApiErrors,
  NavigationData,
} from "fsxa-api";
import { createDatasetRouteFilters } from "@/utils/navigation";
import { FSXAVuexState, RootState } from "../";

function isNotFoundError(errorLike: unknown) {
  return (
    errorLike &&
    typeof errorLike === "object" &&
    (errorLike as Record<string, unknown>).message === FSXAApiErrors.NOT_FOUND
  );
}

async function fetchNavigationOrNull(
  fsxaApi: FSXAApi,
  params: FetchNavigationParams,
) {
  try {
    return await fsxaApi.fetchNavigation(params);
  } catch (reason) {
    if (isNotFoundError(reason)) return null;
    throw reason;
  }
}

export async function fetchDatasetByRoute(fsxaApi: FSXAApi, route: string) {
  const { items } = await fsxaApi.fetchByFilter({
    filters: createDatasetRouteFilters(route),
  });
  return items[0] as Dataset;
}

export interface InitializeAppPayload {
  locale: string;
  initialPath?: string;
  useExactDatasetRouting?: boolean;
}
export const createAppInitialization = (fsxaApi: FSXAApi) => async (
  { commit }: ActionContext<FSXAVuexState, RootState>,
  payload: InitializeAppPayload,
): Promise<void> => {
  console.debug("Initializing app", { payload });
  const route = payload.initialPath ? decodeURI(payload.initialPath) : "/";

  // reset store
  commit("setAppAsInitializing");
  try {
    let navigationData: NavigationData | null = null;
    if (payload.useExactDatasetRouting) {
      const dataset = await fetchDatasetByRoute(fsxaApi, route);
      if (dataset) {
        console.debug(`Storing dataset ${dataset.id} for route ${route}.`);
        commit("setStoredItem", {
          key: payload.initialPath,
          value: dataset,
          fetchedAt: new Date().getTime(),
          ttl: 300000,
        });
        navigationData = await fetchNavigationOrNull(fsxaApi, {
          locale: dataset.locale,
        });
      }
    }
    if (!navigationData) {
      navigationData = await fetchNavigationOrNull(fsxaApi, {
        locale: payload.locale,
        initialPath: route,
      });
      if (!navigationData) {
        // unable to find path in NavigationData. Fetch Nav for root
        navigationData = await fetchNavigationOrNull(fsxaApi, {
          locale: payload.locale,
          initialPath: "/",
        });
      }
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
      settings,
    });
  } catch (error) {
    if (error instanceof Error) {
      commit("setError", {
        message: error.message,
        stacktrace: error.stack,
      });
    } else {
      commit("setError", {
        message: (error as any)?.message || "Unknown error occurred.",
      });
    }
    console.error(error);
  }
};
