import { PageBodyContent } from "fsxa-api";

export interface ShouldHideSectionType {
  content: PageBodyContent;
  isEditMode: boolean;
  displayHiddenSections: boolean;
}

export function shouldHideSection({
  content,
  isEditMode,
  displayHiddenSections,
}: ShouldHideSectionType): boolean {
  return (
    isEditMode &&
    !displayHiddenSections &&
    content.type === "Section" &&
    content.displayed === false
  );
}
