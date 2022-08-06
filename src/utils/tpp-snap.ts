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

const DEFAULT_CDN_FALLBACK =
  "https://cdn.jsdelivr.net/npm/fs-tpp-api@{version}/snap.js";

export const importTPPSnapAPI = (options: ImportTPPSnapAPIOptions = {}) =>
  new Promise(resolve => {
    if (isClient()) {
      // util: resolve the promise when `TPP_SNAP` is assigned to window and the message bus is connected
      const hasBeenLoaded = () => {
        const tppSnap = getTPPSnap();
        if (tppSnap !== null) {
          tppSnap.isConnected.then(() => resolve(tppSnap));
          return true;
        }
        return false;
      };

      // util: try (in a 100ms interval) if `TPP_SNAP` has bean loaded and resolve the promise subsequent
      const waitUntilLoaded = () => {
        if (!hasBeenLoaded()) {
          setTimeout(waitUntilLoaded, 100);
        }
      };

      // autodetect tpp version and the content-creator frame origin
      const autodetect = (timeout = 1000) =>
        Promise.race([
          new Promise<null>(r => setTimeout(() => r(null), timeout)),
          new Promise<{ version?: string; fsOrigin: string }>(resolve => {
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
                  fsOrigin: event.origin,
                });
              }
            }
            window.addEventListener("message", tppPong);
            window.top?.postMessage({ tpp: { ping: 1, _callbackId } }, "*");
          }),
        ]);

      // load snap.js from firstspirit
      const loadTppSnapFromFs = async (
        fsOrigin: string,
        projectId?: string | number,
      ): Promise<boolean> =>
        new Promise(resolve => {
          if (!hasBeenLoaded()) {
            if (document.querySelector('script[src$="/snap.js"]')) {
              waitUntilLoaded();
            } else {
              const scpt = document.createElement("script");
              Object.assign(scpt, { async: true, defer: true });
              scpt.onerror = () => {
                resolve(false);
              };
              scpt.onload = () => {
                waitUntilLoaded();
                return true;
              };
              scpt.src = `${fsOrigin}/fs5webedit${
                projectId ? `_${projectId}` : ""
              }/snap.js`;
              document.body.appendChild(scpt);
            }
          }
        });

      // load snap.js from cdn
      const loadTppSnapFromCdn = ({
        url = DEFAULT_CDN_FALLBACK,
        version = "",
      }) => {
        if (!hasBeenLoaded()) {
          const scpt = document.createElement("script");
          Object.assign(scpt, { async: true, defer: true });
          scpt.onload = () => waitUntilLoaded();
          scpt.src = url.replaceAll("{version}", version);
          document.body.appendChild(scpt);
        }
      };

      const loadTppSnap = async () => {
        const autoDetectedOptions = await autodetect(options.detectionTimeout);

        if (autoDetectedOptions !== null) {
          const loadedFromFs = await loadTppSnapFromFs(
            autoDetectedOptions.fsOrigin,
            options.projectId,
          );

          if (!loadedFromFs) {
            if (autoDetectedOptions?.version) {
              // if detection was successful, use the detected version
              options.version = autoDetectedOptions?.version;
            }

            loadTppSnapFromCdn(options);
          }
        }

        loadTppSnapFromCdn(options);
      };

      if (!hasBeenLoaded()) loadTppSnap();
    }
  });
