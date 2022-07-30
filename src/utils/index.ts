import {
  CreateStoreProxyOptions,
  CreateStoreRemoteOptions,
} from "@/types/fsxa-pattern-library";
import { FSXAApiSingleton, FSXAProxyApi, FSXARemoteApi } from "fsxa-api";

export const isClient = () => typeof window !== "undefined";

export const getTPPSnap = (): any | null => {
  return (window && (window as any).TPP_SNAP) || null;
};

export type ImportTPPSnapAPIOptions = {
  version?: string;
  url?: string;
  projectId?: number | string;
  detectionTimeout?: number;
};

export const importTPPSnapAPI = ({
  version = "latest",
  url = "https://cdn.jsdelivr.net/npm/fs-tpp-api@{version}/snap.js",
  projectId,
  detectionTimeout = 1000,
}: ImportTPPSnapAPIOptions = {}): Promise<any> =>
  new Promise(resolve => {
    if (isClient()) {
      const hasBeenLoaded = () => {
        if ("TPP_SNAP" in window) {
          // @ts-expect-error TPP_SNAP (types) do not exist on `window`
          window.TPP_SNAP.isConnected.then(() => resolve(window.TPP_SNAP));
          return true;
        }
        return false;
      };

      let _timer: ReturnType<typeof setTimeout>;
      const waitUntilLoaded = () => {
        clearTimeout(_timer);
        if (!hasBeenLoaded()) {
          _timer = setTimeout(waitUntilLoaded, 100);
        }
      };

      const appendScript = (src: string, onerror?: () => void) => {
        document.body.appendChild(
          Object.assign(document.createElement("script"), {
            async: true,
            defer: true,
            src,
            onerror,
            onload: waitUntilLoaded(),
          }),
        );
      };

      if (!hasBeenLoaded()) {
        Promise.race([
          new Promise<void>(r => setTimeout(() => r(), detectionTimeout)),
          new Promise<string>(resolve => {
            window.addEventListener("message", function tppPong({
              origin,
              data,
            }) {
              if (
                typeof data === "object" &&
                data.tpp?._callbackId &&
                data.tpp._callbackId === "version.detection"
              ) {
                window.removeEventListener("message", tppPong);
                version = data.tpp._response?.version || version;
                const path = "fs5webedit" + (projectId ? `_${projectId}` : "");
                resolve(`${origin}/${path}/snap.js`);
              }
            });
            window.top?.postMessage(
              { tpp: { ping: 1, _callbackId: "version.detection" } },
              "*",
            );
          }),
        ]).then(fsUrl => {
          const loadFromCdn = () => {
            if (!hasBeenLoaded()) {
              appendScript(url.replaceAll("{version}", version));
            }
          };

          if (document.querySelector('script[src$="/snap.js"]')) {
            waitUntilLoaded();
          } else {
            if (!fsUrl) {
              loadFromCdn();
            } else {
              if (!hasBeenLoaded()) {
                appendScript(fsUrl, () => loadFromCdn());
              }
            }
          }
        });
      }
    }
  });

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
