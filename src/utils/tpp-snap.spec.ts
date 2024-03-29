import { importTPPSnapAPI } from "./tpp-snap";

declare interface Window {
  TPP_SNAP?: any;
}

describe("snap loading", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    Object.defineProperties(window, {
      TPP_SNAP: {
        value: undefined,
        writable: true,
      },
    });
  });

  it("Won't add tpp snap script tags, when the application is the top frame", async () => {
    importTPPSnapAPI();
    expect(document.body.innerHTML).toEqual("");
  });
});

describe("tpp snap lib", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    Object.defineProperties(window, {
      TPP_SNAP: {
        value: undefined,
        writable: true,
      },
      top: {
        value: "<CONTENT-CREATOR-FRAME>",
      },
    });
  });

  it("only version parameter set", async () => {
    importTPPSnapAPI({ version: "2.4.1" });
    expect(document.body.innerHTML).toEqual(
      '<script defer="" src="https://cdn.jsdelivr.net/npm/fs-tpp-api@2.4.1/snap.js"></script>',
    );
  });

  it("url and version parameter has been set", async () => {
    importTPPSnapAPI({ version: "2.4.1", url: "https://cdn.com/snap.js" });
    expect(document.body.innerHTML).toEqual(
      '<script defer="" src="https://cdn.com/snap.js"></script>',
    );
  });

  it("tpp snap has already been loaded", async () => {
    const TPP_SNAP = {
      get isConnected() {
        return Promise.resolve({});
      },
    };
    const isConnectedSpy = jest.spyOn(TPP_SNAP, "isConnected", "get");
    Object.assign(window, { TPP_SNAP });

    const promise = importTPPSnapAPI({
      version: "2.4.1",
      url: "https://cdn.com/snap.js",
    });
    expect(isConnectedSpy).toBeCalled();

    await promise;
    expect(document.body.innerHTML).toEqual("");
  });

  it("inject script tag only once", async () => {
    importTPPSnapAPI({ url: "https://cdn.com/snap.js" });
    importTPPSnapAPI({ version: "2.4.1" });
    importTPPSnapAPI({ url: "https://cdn.com/snap.js" });

    expect(document.getElementsByTagName("script")).toHaveLength(1);
  });

  it("inject script tag with fallback", async () => {
    importTPPSnapAPI({ url: null });

    expect(document.body.innerHTML).toEqual(
      '<script defer="" src="https://cdn.jsdelivr.net/npm/fs-tpp-api/snap.js"></script>',
    );
  });
});
