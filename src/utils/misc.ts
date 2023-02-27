import { PageBody } from "fsxa-api";
import { getCircularReplacer } from "./json-stringify";

export const removeHiddenSections = (content: PageBody): PageBody => {
  // since objects are passed by reference we need to create a new object
  const filteredContent: PageBody = JSON.parse(
    JSON.stringify(content, getCircularReplacer(), 2),
  );
  // we filter either the children with displayed true or displayed is not set at all
  filteredContent.children = filteredContent.children.filter(
    section =>
      section.type === "Section" &&
      [true, undefined].includes(section.displayed),
  );
  return filteredContent;
};
