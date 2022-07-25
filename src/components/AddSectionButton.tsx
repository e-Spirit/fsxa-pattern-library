import BaseComponent from "@/components/base/BaseComponent";
import { AddSectionButtonProps } from "@/types/components";
import { Component, Prop } from "vue-property-decorator";
import "./AddSectionButton.css";

@Component({
  name: "AddSectionButton",
})
class AddSectionButton extends BaseComponent<AddSectionButtonProps> {
  @Prop() bodyName!: AddSectionButtonProps["bodyName"];

  async createSection() {
    const previewId = await this.tppSnap?.getPreviewElement();
    if (previewId)
      this.tppSnap.createSection(previewId, { body: this.bodyName });
  }

  render() {
    if (this.isEditMode && this.bodyName) {
      return (
        <div class="pl-add-content-container">
          <div
            class="pl-add-content-button"
            onClick={() => this.createSection()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
              ></path>
            </svg>
            <div class="pl-add-content-button-text">Add Content</div>
          </div>
        </div>
      );
    }
  }
}
export default AddSectionButton;
