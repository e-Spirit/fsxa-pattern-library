import { isClient } from ".";

export const getTPPSnap = (): any | null => {
  return (window && (window as any).TPP_SNAP) || null;
};

export type ImportTPPSnapAPIOptions = {
  /** @deprecated use `url` with a fully qualified URL to the _Snap Library_ instead */
  version?: string;
  url?: string | null;
};

const FALLBACK_CDN_URL = "https://cdn.jsdelivr.net/npm/fs-tpp-api/snap.js";

export const importTPPSnapAPI = (
  options: ImportTPPSnapAPIOptions = {},
): Promise<any> =>
  new Promise(resolve => {
    if (isClient()) {
      const tppSnap = getTPPSnap();
      if (tppSnap !== null) {
        // snap has been loaded - return it
        tppSnap.isConnected.then(() => resolve(tppSnap));
      } else {
        const retryAfter10ms = () =>
          setTimeout(
            () =>
              importTPPSnapAPI(options).then(tppSnap => {
                resolve(tppSnap);
              }),
            10,
          );

        // convert deprecated `version` to an URL
        if (!options.url && options.version) {
          console.warn(
            "Using %o in 'fsxa.config.ts' is deprecated, use `FSXA_SNAP_URL` instead, see https://github.com/e-Spirit/fsxa-pattern-library/#snap-url",
            "fsTppVersion",
          );
          options.url = `https://cdn.jsdelivr.net/npm/fs-tpp-api@${options.version}/snap.js`;
        }
        if (!options.url) {
          console.warn(
            "It is recommended to use `FSXA_SNAP_URL`, see https://github.com/e-Spirit/fsxa-pattern-library/#snap-url",
          );
          options.url = FALLBACK_CDN_URL;
        }

        if (
          document.querySelector(
            `script[src="${options.url}"],script[src$="/snap.js"]`,
          ) !== null
        ) {
          // script has alread been injected, but `TPP_SNAP` has not been assigned, yet - retry after 10ms
          retryAfter10ms();
        } else {
          // inject script and (re)try to resolve `TPP_SNAP` after 10ms
          const scpt = document.createElement("script");
          Object.assign(scpt, { async: true, defer: true });
          scpt.onload = () => retryAfter10ms();
          scpt.onerror = () => {
            console.error(
              "Unable to load `TPP_SNAP` from %o, so the 'LiveEdit' features are disabled. Please check the `FSXA_SNAP_URL` parameter (https://github.com/e-Spirit/fsxa-pattern-library/#snap-url) to resolve this issue.",
              options.url,
            );
          };
          scpt.src = options.url;
          document.body.appendChild(scpt);
        }
      }
    }
  });
