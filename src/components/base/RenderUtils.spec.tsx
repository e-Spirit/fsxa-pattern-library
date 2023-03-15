import { shouldHideSection, ShouldHideSectionType } from "@/utils/misc";
import { PageBody, Section } from "fsxa-api";

describe("shouldHideSection", () => {
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

  it("should return true, only when sections have the displayed property set to false and all other conditions are met", async () => {
    const testParameters: ShouldHideSectionType = {
      content: hiddenDummySection,
      isEditMode: true,
      displayHiddenSections: false,
    };
    const shouldHideSectionResult = shouldHideSection(testParameters);
    expect(shouldHideSectionResult).toBe(true);
  });

  it("should return false, when sections have no displayed property, even when all other conditions are met", async () => {
    const testParameters: ShouldHideSectionType = {
      content: dummySectionWithoutDisplayedProperty,
      isEditMode: true,
      displayHiddenSections: false,
    };
    const shouldHideSectionResult = shouldHideSection(testParameters);
    expect(shouldHideSectionResult).toBe(false);
  });

  it("should return false, when sections the displayed property set to true, even when all other conditions are met", async () => {
    const testParameters: ShouldHideSectionType = {
      content: displayedDummySection,
      isEditMode: true,
      displayHiddenSections: false,
    };
    const shouldHideSectionResult = shouldHideSection(testParameters);
    expect(shouldHideSectionResult).toBe(false);
  });

  it("should return false (display all sections) when displayHiddenSectionsToggle is true", async () => {
    const pageBody = dummyContent;
    pageBody.children.forEach(pageBodyContent => {
      const testParameters: ShouldHideSectionType = {
        content: pageBodyContent,
        isEditMode: true,
        displayHiddenSections: true,
      };
      expect(shouldHideSection(testParameters)).toBe(false);
    });
  });

  it("should return false (display all sections) when editMode is false", async () => {
    const pageBody = dummyContent;
    pageBody.children.forEach(pageBodyContent => {
      const testParameters: ShouldHideSectionType = {
        content: pageBodyContent,
        isEditMode: false,
        displayHiddenSections: false,
      };
      expect(shouldHideSection(testParameters)).toBe(false);
    });
  });
});
