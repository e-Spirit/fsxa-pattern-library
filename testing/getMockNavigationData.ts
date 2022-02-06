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
