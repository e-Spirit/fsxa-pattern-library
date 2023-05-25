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

describe("TestContext", () => {
  it("should not be the same instance if another is instantiated", () => {
    const instanceOne = initializeApi(options);
    const instanceTwo = initializeApi(options);

    expect(FSXAApiSingleton.instance !== instanceOne).toBeTruthy();
    expect(instanceOne !== instanceTwo).toBeTruthy();
  });

  it("should be the same instance if no other instances", () => {
    const instanceOne = initializeApi(options);

    expect(FSXAApiSingleton.instance === instanceOne).toBeTruthy();
  });

  it("should be the same instance if another is instantiated with the same options(old implementation)", () => {
    let _api: FSXAApi;

    const fsxasingletone = jest
      .fn(FSXAApiSingleton.init)
      .mockImplementation(api => {
        if (!_api) {
          _api = api;
        }

        return _api;
      });

    const instanceOne = fsxasingletone(new FSXAProxyApi(API_URL), {});
    const instanceTwo = fsxasingletone(new FSXAProxyApi(API_URL), {});

    expect(instanceOne === instanceTwo).toBeTruthy();
  });
});
