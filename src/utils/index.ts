import {
  CreateStoreProxyOptions,
  CreateStoreRemoteOptions,
} from "@/types/fsxa-pattern-library";
import { FSXAApiSingleton, FSXAProxyApi, FSXARemoteApi } from "fsxa-api";

export const isClient = () => typeof window !== "undefined";

export const getTPPSnap = (): any | null => {
  return (window && (window as any).TPP_SNAP) || null;
};

export const importTPPSnapAPI = async (
  version: string,
): Promise<any | null> => {
  const scriptTagId = "#fsxa-tpp-snap-import";
  // Ensure we only add the script Tag once and also only add it, if TPP_SNAP was not added by some other source
  if (!document.querySelector(scriptTagId) && !getTPPSnap()) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = scriptTagId;
      // We will wait for tpp to load until we resolve this promise
      script.onload = () => {
        resolve(getTPPSnap());
      };
      script.onerror = () => {
        reject();
      };
      script.src = `https://cdn.jsdelivr.net/npm/fs-tpp-api@${version}/snap.js`;
      document.head.appendChild(script);
    });
  }
};

export function initializeApi(
  options: CreateStoreProxyOptions | CreateStoreRemoteOptions,
) {
  if (options.mode === "remote") {
    FSXAApiSingleton.init(new FSXARemoteApi(options.config), {
      logLevel: options.config.logLevel,
      enableEventStream: options.config.enableEventStream,
    });
  } else {
    FSXAApiSingleton.init(
      new FSXAProxyApi(
        typeof window !== "undefined"
          ? options.config.clientUrl
          : options.config.serverUrl,
        options.config.logLevel,
      ),
      {
        logLevel: options.config.logLevel,
        enableEventStream: options.config.enableEventStream,
      },
    );
  }
}
