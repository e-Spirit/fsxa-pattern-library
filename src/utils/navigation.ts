import { NavigationData, NavigationItem } from "fsxa-api";

export const NAVIGATION_ERROR_404 = "Could not find route with given path";
export const determineCurrentRoute = (
  navigationData: NavigationData | null,
  currentPath?: string,
): NavigationItem | null => {
  if (!navigationData) return null;
  const path = decodeURIComponent(currentPath || "");
  // we will check if the path is set
  if (path && path !== "/") {
    let node: NavigationItem | null =
      navigationData.idMap[navigationData.seoRouteMap[path]] || null;
    if (!node) {
      // the path is not mapped in the seoRouteMap
      // we will check for dynamic routes
      node =
        Object.values(navigationData.idMap)
          .filter((item: any) => item.seoRouteRegex)
          .find((item: any) => path.match(item.seoRouteRegex)) || null;
    }
    if (node) return node;
    // we will throw an error, when no route was found, so the callee can show an error page
    throw new Error(NAVIGATION_ERROR_404);
  }
  return navigationData.idMap[
    navigationData.seoRouteMap[navigationData.pages.index]
  ];
};
