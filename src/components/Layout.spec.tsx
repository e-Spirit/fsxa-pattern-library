import { PageBody, Section } from "fsxa-api";
import { removeHiddenSections } from "@/utils/misc";

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

  it("filters hidden sections", async () => {
    const content = removeHiddenSections(dummyContent);
    expect(content.children.length).toBe(2);
    expect(content.children).toEqual(
      expect.arrayContaining([
        dummySectionWithoutDisplayedProperty,
        displayedDummySection,
      ]),
    );
  });
});
