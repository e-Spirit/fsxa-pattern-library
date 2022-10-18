import { FSXAActions, FSXAGetters, RootState } from "@/store";
import {
  ComparisonQueryOperatorEnum,
  Dataset,
  FSXAApi,
  NavigationData,
  NavigationItem,
} from "fsxa-api";
import { Store } from "vuex";

export function getStoredItem<Value = any>(
  $store: Store<RootState>,
  key: string,
): Value | undefined {
  const storedItem = $store.getters[FSXAGetters.item](key);
  const currentTime = new Date().getTime();
  if (!storedItem || storedItem.fetchedAt + storedItem.ttl < currentTime)
    return undefined;
  return storedItem.value;
}

export function setStoredItem(
  $store: Store<RootState>,
  key: string,
  value: any,
  ttl: number,
) {
  $store.dispatch(FSXAActions.setStoredItem, {
    key,
    value,
    fetchedAt: new Date().getTime(),
    ttl,
  });
}

export function findNavigationItemInNavigationData(
  $store: Store<RootState>,
  params: {
    seoRoute?: string;
    pageId?: string;
  },
): NavigationItem | null {
  if (
    (!params.pageId && !params.seoRoute) ||
    (params.pageId && params.seoRoute)
  ) {
    return null;
  }
  const navigationData: NavigationData =
    $store.getters[FSXAGetters.navigationData];
  if (params.pageId) {
    return navigationData.idMap[params.pageId] || null;
  }
  if (params.seoRoute) {
    const pageId = navigationData.seoRouteMap[params.seoRoute];
    if (!pageId) return null;
    return navigationData.idMap[pageId] || null;
  }
  return null;
}


// Ist vllt ein Breaking Change? 
export type TriggerRouteChangeParams =
  | TriggerRouteChangeByRoute
  | TriggerRouteChangeByRoute
  | TriggerRouteChangeLanguageSwitch;

// wenn route übergeben -->
type TriggerRouteChangeByRoute = {
  route: string;
};

type TriggerRouteChangeById = {
  pageId: string;
  locale?: string;
};

type TriggerRouteChangeLanguageSwitch = {
  locale: string;
};

/**
 * Returns the route
 * @param $store fsxaStore, containing NavigationData
 * @param $fsxaApi fsxaApi to fetch Navigation
 * @param params params defining the target for our route
 * @param currentLocale currentLocale
 * @param globalSettingsKey globalSettingsKey --> WHY? ---> Deprecated?
 * @returns route to the target as Promise<string>
 *
 * Welcher Input generiert welchen Output?
 * params - currentLocale
 * 1 .Wenn locale gleich ist und params.route mitgegeben wurde --> return params.route
 *
 *
 * Meine Idee -> Wenn locale & Id übergeben, dann frag den CaaS der Route
 *  Fall 1: Dataset Detailseite:
 *      für Datasets gehts jetzt schon. Denn pageId ist in params.pageId, dataset ID ist in Store vorhanden
 *  Fall 2: Normale Page
 *      NavigationService/node/ --> params.pageId + locale
 *
 * für PageRefs CaaS-2048 umgesetzt werden
 *  --> bySeoRoute?
 */

export async function triggerRouteChange(
  $store: Store<RootState>,
  $fsxaApi: FSXAApi,
  params: TriggerRouteChangeParams,
  currentLocale: string,
  globalSettingsKey?: string,
): Promise<string | null> {
  if (!params.locale || params.locale === currentLocale) {
    if (params.route) return params.route;
    if (params.pageId)
      return (
        findNavigationItemInNavigationData($store, {
          pageId: params.pageId,
        })?.seoRoute || null
      );
  }
  // Locale change --> Trigger Full Refetch of Nav and reset PWA
  if (params.locale && params.locale !== currentLocale) {
    const currentDataset = params.route
      ? ($store.state.fsxa.stored[params.route]?.value as Dataset) || null
      : null;

    // we will store the possible old datasetId and pageRef,
    // so that we can fetch the translated one as well and redirect to the new seoRoute
    const currentDatasetId = currentDataset?.id || null;
    const currentPageId =
      findNavigationItemInNavigationData($store, {
        pageId: params.pageId,
        seoRoute: params.route,
      })?.id || null;

    let pageRef = "";
    if (currentDataset && params.route) {
      const routes = currentDataset.routes;
      pageRef = routes.find(el => el.route === params.route)?.pageRef || "";
    }
    // We throw away the old state and reinitialize the app with the new locale
    await $store.dispatch(FSXAActions.initializeApp, {
      defaultLocale: params.locale,
      globalSettingsKey,
    });

    if (currentDatasetId) {
      // we will load the new dataset from the caas
      const {
        items: [dataset],
      } = (await $fsxaApi.fetchByFilter({
        filters: [
          {
            operator: ComparisonQueryOperatorEnum.EQUALS,
            value: currentDatasetId,
            field: "identifier",
          },
        ],
        locale: params.locale,
      })) as { items: Dataset[] };
      if (dataset) {
        const route =
          dataset.route ||
          dataset.routes.find(el => el.pageRef === pageRef)?.route ||
          "";
        $store.dispatch(FSXAActions.setStoredItem, {
          key: route,
          value: dataset,
          ttl: 300000,
          fetchedAt: new Date().getTime(),
        });
        return route;
      }
    } else if (currentPageId) {
      return (
        findNavigationItemInNavigationData($store, {
          pageId: currentPageId,
        })?.seoRoute || null
      );
    }
  }
  return null;
}
