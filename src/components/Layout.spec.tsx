import { PageBody, Section } from "fsxa-api";
import { getContentWithVisibleSections } from "@/utils/misc";

describe("getContentWithVisibleSections", () => {
  const dummySectionWithoutDisplayedProperty: Section = {
    type: "Section",
    id: "dummySectionWithoutDisplayedProperty",
    previewId: "testID",
    sectionType: "testType",
    data: {},
    children: [],
  };

  const displayedDummySection: Section = {
    type: "Section",
    id: "displayedDummySection",
    previewId: "testID",
    sectionType: "testType",
    data: {},
    displayed: true,
    children: [],
  };

  const hiddenDummySection: Section = {
    type: "Section",
    id: "hiddenDummySection",
    previewId: "testID",
    sectionType: "testType",
    data: {},
    displayed: false,
    children: [],
  };

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

  it("returns all content (with hidden sections) when 'displayed' field is not set", async () => {
    const content = getContentWithVisibleSections(dummyContent);
    expect(content.children.length).toBe(2);
    expect(content.children).toEqual(
      expect.arrayContaining([
        dummySectionWithoutDisplayedProperty,
        displayedDummySection,
      ]),
    );
  });

  it("returns all content (with hidden sections) in default configuration or feature toggle is true", async () => {
    const content = getContentWithVisibleSections(dummyContent, true);
    expect(content.children.length).toBe(3);
    expect(content.children).toEqual(
      expect.arrayContaining([
        dummySectionWithoutDisplayedProperty,
        displayedDummySection,
        hiddenDummySection,
      ]),
    );
  });

  it("returns filtered content (with hidden no sections) when feature toggle is false", async () => {
    const content = getContentWithVisibleSections(dummyContent, false);
    expect(content.children.length).toBe(2);
    expect(content.children).toEqual(
      expect.arrayContaining([
        dummySectionWithoutDisplayedProperty,
        displayedDummySection,
      ]),
    );
  });
});
