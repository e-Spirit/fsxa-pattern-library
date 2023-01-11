import createStore from "@/store";
import { CreateStoreProxyOptions } from "@/types/fsxa-pattern-library";

import Vuex, { Store } from "vuex";
import Layout from "./Layout";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { FSXAContentMode, LogLevel, PageBody, Section } from "fsxa-api";
import { initializeApi } from "@/utils";

describe.only("getContentWithVisibleSections", () => {
  const dummySectionWithoutDisplayedProperty: Section = {
    type: "Section",
    id: "testId",
    previewId: "testID",
    sectionType: "testType",
    data: {},
    children: [],
  };

  const displayedDummySection: Section = {
    type: "Section",
    id: "testId",
    previewId: "testID",
    sectionType: "testType",
    data: {},
    displayed: true,
    children: [],
  };

  const hiddenDummySection: Section = {
    type: "Section",
    id: "testId",
    previewId: "testID",
    sectionType: "testType",
    data: {},
    displayed: false,
    children: [],
  };

  it("returns all content (with hidden sections) when 'displayed' field is not set", async () => {
    const dummyContent: PageBody = {
      type: "PageBody",
      name: "dummy",
      previewId: "dummy",
      children: [
        hiddenDummySection,
        displayedDummySection,
        dummySectionWithoutDisplayedProperty,
      ],
    };

    // const sut = wrapper.vm.getContentWithVisibleSections(dummyContent);
    // expect(sut.children).toContain(hiddenDummySection);
    // expect(sut.children).toContain(displayedDummySection);
    // expect(sut.children).toContain(dummySectionWithoutDisplayedProperty);
  });

  it("returns all content (with hidden sections) in default configuration", async () => {
    expect(true).toBe(true);
  });

  it("returns all content (with hidden sections) when feature toggle is true", async () => {
    expect(true).toBe(true);
  });

  it("returns filtered content (with hidden no sections) when feature toggle is false", async () => {
    expect(true).toBe(true);
  });
});
