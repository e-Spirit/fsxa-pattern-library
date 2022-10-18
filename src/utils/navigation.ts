import { Dataset, NavigationData, NavigationItem } from "fsxa-api";

export const NAVIGATION_ERROR_404 = "Could not find route with given path";

const getNavigationItem = (
  path: string,
  navigationData: NavigationData,
): NavigationItem | null => {
  return navigationData.idMap[navigationData.seoRouteMap[path]] || null;
};

const findPathInSeoRouteMap = (
  path: string,
  navigationData: NavigationData,
): NavigationItem | null => {
  let node: NavigationItem | null = getNavigationItem(path, navigationData);
  if (!node) {
    // if we cannot find a route we try finding one with or without a slash at the end dependent on the original path
    path = path.endsWith("/") ? path.slice(0, -1) : path.concat("/");
    node = getNavigationItem(path, navigationData);
  }
  return node;
};

export const determineCurrentRoute = (
  navigationData: NavigationData | null,
  currentPath?: string,
  currentDataset: Dataset?,
) => {
  if (!navigationData) return null;
  const path = decodeURIComponent(currentPath || "");
  // we will check if the path is set
  if (path && path !== "/") {
    let node = findPathInSeoRouteMap(path, navigationData);
    if(!node && !currentDataset) {
      // fetch das ding & Speichere es im Store
      currentDataset = ...
    }
    
    if (!node && currentDataset) {
      // the path is not mapped in the seoRouteMap
      // we will check for dynamic routes
      
      // caas Call by Route für Dataset --> Daraus PageRefId extrahieren
      const nodeId = currentDataset.routes.find((route) => route.route === currentPath)?.pageRef
      node = nodeId ? navigationData.idMap[nodeId] :
      
    }
    if (node) return node;
    // we will throw an error, when no route was found, so the callee can show an error page
    throw new Error(NAVIGATION_ERROR_404);
  }
  return navigationData.idMap[
    navigationData.seoRouteMap[navigationData.pages.index]
  ];
};
