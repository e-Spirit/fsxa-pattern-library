import { FSXAApi } from "fsxa-api/dist/types";
import {
  connectCaasEvents,
  DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
} from "./caas-events";

const CAAS_CHANGE_DELAY_IN_MS = 300;

export type RegisterTppHooksOptions = {
  fsxaApi: FSXAApi;
  TPP_SNAP: any;
  forceUpdateStore: () => Promise<void>;
  routeToPreviewId: (previewId: string) => Promise<void>;
};

export const registerTppHooks = async ({
  fsxaApi,
  TPP_SNAP,
  forceUpdateStore,
  routeToPreviewId,
}: RegisterTppHooksOptions) => {
  console.log({ TPP_SNAP });
  if (!TPP_SNAP) throw new Error("Could not find global TPP_SNAP object.");

  TPP_SNAP.onInit(async (success: boolean) => {
    if (!success) throw new Error("Could not initialize TPP");

    if (TPP_SNAP.fsxaHooksRegistered) {
      console.debug("Hooks already registered, skipping registrations.");
      return;
    }
    TPP_SNAP.fsxaHooksRegistered = true;

    // using live events for better performance
    const caasEvents = connectCaasEvents(fsxaApi);

    console.debug("Registering FSXA TPP hooks");

    // https://docs.e-spirit.com/tpp/snap/index.html#tpp_snaponrequestpreviewelement
    TPP_SNAP.onRequestPreviewElement(async (previewId: string) => {
      console.debug("onRequestPreviewElement triggered", previewId);
      await caasEvents.waitFor(previewId, {
        timeout: DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
      });
      await routeToPreviewId(previewId);
    });

    // https://docs.e-spirit.com/tpp/snap/index.html#tpp_snaponcontentchange
    TPP_SNAP.onContentChange(
      ($node: HTMLElement, previewId: string, content: unknown) => {
        console.debug("onContentChange triggered", {
          $node,
          previewId,
          content,
        });

        // /^element-with-id-[0-9]+-not-found$/.test(previewId)
        if (content === null && $node === null) {
          // page or dataset has been deleted. update the store and
          forceUpdateStore();
          // return for now, the ContentCreator will request the Homepage as the next step
          return true;
        }

        // TODO update partial store content
        // TODO double check tpp-snap's fallback implementation {@see https://github.com/e-Spirit/ocm-snap/blob/main/snap/index.js#L282}

        // return nothing -> triggers onRerenderView
        return true;
      },
    );

    // https://docs.e-spirit.com/tpp/snap/index.html#tpp_snaponrerenderview
    TPP_SNAP.onRerenderView(() => {
      console.debug("onRerenderView triggered");
      TPP_SNAP.getPreviewElement().then(async (previewId: string) => {
        if (caasEvents.isConnected()) {
          await caasEvents.waitFor(previewId, {
            timeout: DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
            allowedEventTypes: ["replace"],
          });
        } else {
          // no realtime events, so just wait
          await new Promise(resolve =>
            setTimeout(resolve, CAAS_CHANGE_DELAY_IN_MS),
          );
        }
        await forceUpdateStore();
      });
      return false;
    });

    // https://docs.e-spirit.com/tpp/snap/index.html#tpp_snaponnavigationchange
    TPP_SNAP.onNavigationChange(async (newPagePreviewId: string | null) => {
      console.debug("onNavigationChange triggered", {
        newPagePreviewId,
      });
      if (!newPagePreviewId) {
        // if non previewId (for a just created page) is set, refresh the current page
        await TPP_SNAP.getPreviewElement().then(
          async (currentPreviewId: string) => {
            // rendered navigations may change, wait for it
            if (caasEvents.isConnected()) {
              await caasEvents.waitFor(currentPreviewId, {
                timeout: DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
              });
            } else {
              // no realtime events, so just wait
              await new Promise(resolve =>
                setTimeout(resolve, CAAS_CHANGE_DELAY_IN_MS),
              );
            }
          },
        );
        await forceUpdateStore();
        if (newPagePreviewId) {
          await routeToPreviewId(newPagePreviewId);
        }
      }
    });
  });
};
