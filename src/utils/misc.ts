import { PageBody } from "fsxa-api";

export const getContentWithVisibleSections = (
  content: PageBody,
  displayHiddenSections?: Boolean,
): PageBody => {
  if (displayHiddenSections) {
    // no need to filter the content for hidden sections when they all should be rendered
    return content;
  }
  // since objects are passed by reference we need to create a new object
  const filteredContent: PageBody = JSON.parse(JSON.stringify(content));
  // we filter either the children with displayed true or displayed is not set at all
  filteredContent.children = filteredContent.children.filter(
    section =>
      section.type === "Section" &&
      [true, undefined].includes(section.displayed),
  );
  return filteredContent;
};
