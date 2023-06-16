import { CreateStoreProxyOptions } from "@/types/fsxa-pattern-library";
import { initializeApi } from "@/utils";
import {
  FSXAContentMode,
  LogLevel,
  FSXAApiSingleton,
  FSXAProxyApi,
  FSXAApi,
} from "fsxa-api";

const API_URL = "http://fsxa.local";

const options: CreateStoreProxyOptions = {
  mode: "proxy",
  config: {
    contentMode: FSXAContentMode.PREVIEW,
    clientUrl: API_URL,
    serverUrl: API_URL,
    logLevel: LogLevel.NONE,
  },
};

describe("TestSharedContext", () => {
  it("should not be the same instance if another is instantiated", () => {
    const instanceOne = initializeApi(options);
    const instanceTwo = initializeApi(options);

    expect(FSXAApiSingleton.instance !== instanceOne).toBeTruthy();
    expect(instanceOne !== instanceTwo).toBeTruthy();
  });

  it("should verify single instance", () => {
    const instanceOne = initializeApi(options);

    expect(FSXAApiSingleton.instance === instanceOne).toBeTruthy();
  });
});
