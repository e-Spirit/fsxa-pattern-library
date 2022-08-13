import { isClient } from ".";

export const getTPPSnap = (): any | null => {
  return (window && (window as any).TPP_SNAP) || null;
};

export type ImportTPPSnapAPIOptions = {
  version?: string;
  url?: string;
  projectId?: number | string;
  detectionTimeout?: number;
};

// private methods

// util: resolve the promise when `TPP_SNAP` is assigned to window and the message bus is connected
const hasBeenLoaded = (resolve?: (tppSnap: any) => void) => {
  const tppSnap = getTPPSnap();
  if (tppSnap !== null) {
    tppSnap.isConnected.then(() => resolve?.(tppSnap));
    return true;
  }
  if (document.querySelector('script[src$="/snap.js"]')) {
    waitUntilLoaded(resolve);
    return true;
  }
  return false;
};

// util: try (in a 100ms interval) if `TPP_SNAP` has bean loaded and resolve the promise subsequent
const waitUntilLoaded = (resolve?: (tppSnap: any) => void) => {
  if (!hasBeenLoaded(resolve)) {
    setTimeout(waitUntilLoaded, 100);
  }
};

// util: inject <script> and handle load events as a `Promise`
const loadScript = (url: string) =>
  new Promise<void>((resolve, reject) => {
    const scpt = document.createElement("script");
    Object.assign(scpt, { async: true, defer: true });
    scpt.onload = () => resolve();
    scpt.onerror = () => reject();
    scpt.src = url;
    document.body.appendChild(scpt);
  });

const detectSnap = (timeout = 1000) =>
  Promise.race([
    new Promise<null>(r => setTimeout(() => r(null), timeout)),
    new Promise<{ version?: string; origin: string }>(resolve => {
      const _callbackId = "version.detection";
      function tppPong(event: MessageEvent) {
        if (
          typeof event.data === "object" &&
          event.data.tpp?._callbackId &&
          event.data.tpp._callbackId === _callbackId
        ) {
          window.removeEventListener("message", tppPong);
          resolve({
            version: event.data.tpp._response?.version,
            origin: event.origin,
          });
        }
      }
      window.addEventListener("message", tppPong);
      window.top?.postMessage({ tpp: { ping: 1, _callbackId } }, "*");
    }),
  ]);

export const importTPPSnapAPI = (
  options: ImportTPPSnapAPIOptions = {},
): Promise<any> =>
  new Promise(resolve => {
    if (isClient()) {
      // check if already loaded (on any async step)
      if (!hasBeenLoaded(resolve)) {
        // convert deprecated `version` to an URL
        if (!options.url && options.version) {
          options.url = `https://cdn.jsdelivr.net/npm/fs-tpp-api@${options.version}/snap.js`;
        }

        if (options.url) {
          // load snap from given URL
          loadScript(options.url)
            .then(() => waitUntilLoaded(resolve))
            .catch(() =>
              console.error(
                "Unable to load snap.js from %o. The InEdit features are disabled. You may remove the `%s` from fsxa.config.ts to resolve this issue.",
                options.url,
                options.version ? "fsTppVersion" : "fsTppUrl",
              ),
            );
        } else {
          // detect top frame origin and snap version
          detectSnap(options.detectionTimeout).then(detectionResult => {
            if (!hasBeenLoaded(resolve)) {
              if (detectionResult === null) {
                console.error(
                  "Unable to load snap.js. The InEdit features are disabled. You may add `fsTppApiUrl` to the fsxa.config.ts to resolve this issue. A valid value could be %o.",
                  "https://cdn.jsdelivr.net/npm/fs-tpp-api/snap.js",
                );
              } else {
                // load snap from ContentCreator webapp
                const webapp = options.projectId
                  ? `fs5webedit_${options.projectId}`
                  : "fs5webedit";
                loadScript(`${detectionResult.origin}/${webapp}/snap.js`)
                  .then(() => waitUntilLoaded(resolve))
                  .catch(() =>
                    console.error(
                      "Unable to load snap.js. The InEdit features are disabled. You may add `fsTppApiUrl` to the fsxa.config.ts to resolve this issue. A valid value could be %o.",
                      detectionResult.version
                        ? `https://cdn.jsdelivr.net/npm/fs-tpp-api@${detectionResult.version}/snap.js`
                        : "https://cdn.jsdelivr.net/npm/fs-tpp-api/snap.js",
                    ),
                  );
              }
            }
          });
        }
      }
    }
  });
