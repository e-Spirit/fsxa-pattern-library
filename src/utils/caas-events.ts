import { FSXAApi, FSXAProxyApi } from "fsxa-api";

export type CaaSEventType = "insert" | "replace" | "delete";

export const DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS = 2000;

type CaaSEvent = {
  operationType: CaaSEventType;
  documentKey: { _id: string };
};

interface ResolverRegistryItem {
  documentId: string;
  allowedEventTypes?: CaaSEventType[];
  resolve: () => void;
}

const resolverRegistry: ResolverRegistryItem[] = [];
let caasEventSource: EventSource | null = null;

const isConnected = (): boolean =>
  caasEventSource?.readyState === EventSource.OPEN;

export type WaitForOptions = {
  allowedEventTypes?: CaaSEventType[];
  timeout?: number;
};

const waitFor = (
  documentId: string,
  { allowedEventTypes, timeout }: WaitForOptions = {},
): Promise<void> => {
  console.log("waitFor", documentId);
  const promises: Promise<void>[] = [
    new Promise(resolve => {
      const resolver = { documentId, allowedEventTypes, resolve };
      resolverRegistry.push(resolver);
    }),
  ];
  if (timeout) {
    promises.push(new Promise(resolve => setTimeout(() => resolve(), timeout)));
  }
  return Promise.race(promises);
};

const _onMessage = ({ data }: MessageEvent) => {
  const message: CaaSEvent = JSON.parse(data);

  resolverRegistry
    .filter(resolver => {
      if (resolver.documentId === message.documentKey._id) {
        return (
          !resolver.allowedEventTypes ||
          resolver.allowedEventTypes.includes(message.operationType)
        );
      }
    })
    .forEach(resolver => {
      resolverRegistry.splice(resolverRegistry.indexOf(resolver), 1);
      resolver.resolve();
    });
};

export function connectCaasEvents(fsxaApi: FSXAApi) {
  if (
    caasEventSource === null &&
    fsxaApi.enableEventStream() &&
    fsxaApi instanceof FSXAProxyApi
  ) {
    caasEventSource = fsxaApi.connectEventStream();
    caasEventSource.addEventListener("message", _onMessage);
  }
  return { isConnected, waitFor, eventSource: caasEventSource };
}
