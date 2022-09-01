import {
  CreateStoreProxyOptions,
  CreateStoreRemoteOptions,
} from "@/types/fsxa-pattern-library";
import { FSXAApiSingleton, FSXAProxyApi, FSXARemoteApi } from "fsxa-api";

export * from "./tpp-snap";

export const isClient = () => typeof window !== "undefined";

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
