import { importTPPSnapAPI } from "./tpp-snap";

describe("tpp snap lib", () => {
  it("load tpp from custom cdn", async () => {
    importTPPSnapAPI({ url: "custom-cdn-url" });
  });
});
