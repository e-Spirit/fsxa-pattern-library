import { PageBodyContent } from "fsxa-api/dist/types";
import { Component } from "vue-property-decorator";
import Section from "../Section";
import BaseComponent from "./BaseComponent";

@Component({
  name: "RenderUtils",
})
class RenderUtils<
  Props = {},
  EventsWithOn = {},
  Slots = {}
> extends BaseComponent<Props, EventsWithOn, Slots> {
  renderContentElement(content: PageBodyContent) {
    switch (content.type) {
      case "Section":
        return (
          <Section
            type={content.sectionType}
            data={content.data}
            id={content.id}
            previewId={content.previewId}
            content={content.children.map(this.renderContentElement)}
          />
        );
      case "Content2Section":
        return (
          <Section
            type={content.sectionType}
            data={content.data}
            content={content.children.map(this.renderContentElement)}
          />
        );
      case "Dataset":
        return (
          <Section
            type={content.template}
            data={content.data}
            id={content.id}
            previewId={content.previewId}
            content={content.children.map(this.renderContentElement)}
          />
        );
      default:
        return null;
    }
  }
}
export default RenderUtils;
