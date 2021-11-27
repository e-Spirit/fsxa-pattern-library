import BaseComponent from "@/components/base/BaseComponent";
import { InEditProps } from "@/types/components";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "InEdit",
})
class InEdit extends BaseComponent<InEditProps> {
  @Prop({ required: true }) content!: InEditProps["content"];
  @Prop(String) editorName: InEditProps["editorName"];

  render() {
    if (this.isEditMode && this.editorName) {
      return (
        <span data-preview-id={"#" + this.editorName} data-inedit>
          {this.content}
        </span>
      );
    }
    return this.content;
  }
}
export default InEdit;
