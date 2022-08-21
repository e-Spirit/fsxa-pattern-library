import { isClient } from ".";

export const getTPPSnap = (): any | null => {
  return (window && (window as any).TPP_SNAP) || null;
};

export type ImportTPPSnapAPIOptions = {
  version?: string;
  url?: string;
};

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
          options.url = `https://cdn.jsdelivr.net/npm/fs-tpp-api@${options.version}/snap.js`;
        }
        if (!options.url) {
          console.error(
            "Unable to load LiveEdit, so the feature is disabled. Please check the `liveEditUrl` parameter (https://github.com/e-Spirit/fsxa-pattern-library#liveedit) to resolve this issue.",
          );
        } else {
          if (document.querySelector(`script[src="${options.url}"]`) !== null) {
            // script has alread been injected, but `TPP_SNAP` has not been assigned, yet - retry after 10ms
            retryAfter10ms();
          } else {
            // inject script and (re)try to resolve `TPP_SNAP` after 10ms
            const scpt = document.createElement("script");
            Object.assign(scpt, { async: true, defer: true });
            scpt.onload = () => retryAfter10ms();
            scpt.onerror = () => {
              console.error(
                "Unable to load LiveEdit from %o, so the feature is disabled. Please check the `liveEditUrl` parameter (https://github.com/e-Spirit/fsxa-pattern-library#liveedit) to resolve this issue.",
                options.url,
              );
            };
            scpt.src = options.url;
            document.body.appendChild(scpt);
          }
        }
      }
    }
  });
