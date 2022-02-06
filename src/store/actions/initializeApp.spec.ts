import { FSXAVuexState, RootState } from "@/store";
import { FSXAProxyApi, LogLevel } from "fsxa-api";
import { initializeApp } from "@/store/actions/initializeApp";
import { ActionContext } from "vuex";
import { getMockNavigationData } from "../../../testing/getMockNavigationData";

jest.mock("fsxa-api");

describe("initializeApp action", () => {
  const getMockContext = () =>
    (({
      commit: jest.fn(),
      getters: {},
      dispatch: jest.fn(),
      rootGetters: {},
      state: {
        auth: {},
      },
    } as unknown) as ActionContext<FSXAVuexState, RootState>);

  const setup = () => {
    const fsxaApi = new FSXAProxyApi("http://fsxa.local", LogLevel.NONE);
    const action = initializeApp(fsxaApi);
    return { fsxaApi, action };
  };

  it("fetches navigation data for the root path /", async () => {
    const { fsxaApi, action } = setup();
    const ctx = getMockContext();
    const navigationData = getMockNavigationData();
    fsxaApi.fetchNavigation = jest.fn().mockResolvedValue(navigationData);
    await action(ctx, { defaultLocale: "jp" });

    expect(fsxaApi.fetchNavigation).toHaveBeenCalledWith(
      expect.objectContaining({
        initialPath: "/",
        locale: "jp",
        authData: ctx.state.auth,
      }),
    );
    expect(ctx.commit).toHaveBeenCalledWith(
      "setAppAsInitialized",
      expect.objectContaining({ navigationData }),
    );
  });

  it("fetches navigation data for the given path if the api yielded no results for the root path", async () => {
    const { fsxaApi, action } = setup();
    const ctx = getMockContext();
    const navigationData = getMockNavigationData();

    // mock the api to return some data on the root path
    fsxaApi.fetchNavigation = jest.fn().mockResolvedValue(navigationData);
    await action(ctx, { defaultLocale: "jp", initialPath: "somewhere" });
    expect(fsxaApi.fetchNavigation).not.toHaveBeenCalledWith(
      expect.objectContaining({
        initialPath: "somewhere",
        locale: "jp",
        authData: ctx.state.auth,
      }),
    );
    // mock the api to return nothing on the root path
    fsxaApi.fetchNavigation = jest.fn().mockImplementation(async conf => {
      return conf.initialPath === "/" ? null : navigationData;
    });
    await action(ctx, { defaultLocale: "jp", initialPath: "somewhere" });
    expect(fsxaApi.fetchNavigation).toHaveBeenCalledWith(
      expect.objectContaining({
        initialPath: "somewhere",
        locale: "jp",
        authData: ctx.state.auth,
      }),
    );
    expect(ctx.commit).toHaveBeenCalledWith(
      "setAppAsInitialized",
      expect.objectContaining({ navigationData }),
    );
  });

  it("fetches project properties for the language provided by the language id metadata", async () => {
    const { fsxaApi, action } = setup();
    const ctx = getMockContext();
    const navData = getMockNavigationData();
    navData.meta.identifier.languageId = "langId";

    fsxaApi.fetchNavigation = jest.fn().mockResolvedValue(navData);
    await action(ctx, { defaultLocale: "jp", initialPath: "somewhere" });
    expect(fsxaApi.fetchProjectProperties).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "langId",
      }),
    );
    expect(ctx.commit).toHaveBeenCalledWith(
      "setAppAsInitialized",
      expect.objectContaining({
        locale: "langId",
      }),
    );
  });
});
