import { PageBodyContent } from "fsxa-api";
import { Prop } from "vue-property-decorator";
import { Component } from "vue-property-decorator";
import RenderUtils from "./base/RenderUtils";

interface RenderContentElementProps {
  /**
   * PageBodyContent element that should be rendered
   */
  element?: PageBodyContent;
}

@Component({
  name: "RenderContentElement",
})
class RenderContentElement extends RenderUtils<RenderContentElementProps> {
  @Prop()
  element: RenderContentElementProps["element"];

  render() {
    return this.element && this.renderContentElement(this.element);
  }
}
export default RenderContentElement;
