import { FSXAConfiguration } from "fsxa-api";

export const getFSXAConfigFromEnvFile = (): FSXAConfiguration => {
  return {
    apiKey: process.env.VUE_APP_API_KEY as string,
    caas: process.env.VUE_APP_CAAS as string,
    projectId: process.env.VUE_APP_PROJECT_ID as string,
    navigationService: process.env.VUE_APP_NAVIGATION_SERVICE as string,
    tenantId: process.env.VUE_APP_TENANT_ID as string,
  };
};
