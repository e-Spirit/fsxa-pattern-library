import { NavigationData } from "fsxa-api";

/**
 * Returns a small sample of navigation data taken from a demo PWA
 */
export const getMockNavigationData = (): NavigationData => ({
  idMap: {
    "id-home": {
      id: "id-home",
      parentIds: [],
      label: "Home",
      contentReference: "https://e-spirit.local/id-home.de_DE",
      caasDocumentId: "caas-id-home",
      seoRoute: "/home/",
      seoRouteRegex: null,
      customData: null,
      permissions: null!,
    },
    "id-about": {
      id: "id-about",
      parentIds: [],
      label: "About",
      contentReference: "https://e-spirit.local/id-about.de_DE",
      caasDocumentId: "caas-id-about",
      seoRoute: "/about/",
      seoRouteRegex: null,
      customData: null,
      permissions: null!,
    },
    "9ffc3704-50f4-4e97-bfb4-3ac397e7784a": {
      id: "1d476c92-4d26-47f8-b4bc-88434d60dc89",
      parentIds: [],
      label: "CT Test",
      contentReference: "https://e-spirit.local/id-about.de_DE",
      caasDocumentId: "9ffc3704-50f4-4e97-bfb4-3ac397e7784a",
      seoRoute: "/Ueber-uns/CT-Test/9346ff4e-9a3f-4e65-ab60-bf00e50cf98b.html",
      seoRouteRegex: "/Produkte/Stick-Up-Cam-Sicherheitskamera-FST-35J.html",
      customData: null,
      permissions: null!,
    },
    "b1362730-4ee2-4473-bc02-529e47b08e95": {
      id: "7547b2ca-53e3-4dc2-9a32-bddd863da212",
      parentIds: [],
      label: "Stick up cam",
      contentReference: "https://e-spirit.local/id-about.de_DE",
      caasDocumentId: "b1362730-4ee2-4473-bc02-529e47b08e95",
      seoRoute: "/Produkte/Stick-Up-Cam-Sicherheitskamera-FST-35J.html/",
      seoRouteRegex: "/Produkte/Stick-Up-Cam-Sicherheitskamera-FST-35J.html",
      customData: null,
      permissions: null!,
    },
  },
  seoRouteMap: {
    "/home/": "id-home",
    "/about/": "id-about",
  },
  structure: [
    {
      id: "id-home",
      children: [],
    },
    {
      id: "id-about",
      children: [],
    },
  ],
  pages: {
    index: "/home/",
  },
  meta: {
    identifier: {
      tenantId: "enterprise-navigationservice",
      navigationId: "preview.navigation-id",
      languageId: "de_DE",
    },
  },
});
