import BaseComponent from "@/components/base/BaseComponent";
import { AddSectionButtonProps } from "@/types/components";
import { Component, Prop } from "vue-property-decorator";

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
        <div class="flex items-center justify-center text-white font-sans text-[25px] py-8">
          <div
            class="group cursor-pointer overflow-hidden whitespace-nowrap text-center transition-all duration-300 bg-[#3288c3] w-[3em] leading-[3em] rounded-[1.5em] hover:w-[10em] hover:bg-[#286894] hover:rounded-sm"
            onClick={() => this.createSection()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
              class="group-hover:hidden w-[2em] h-[2em] m-[0.5em]"
            >
              <path
                fill="currentColor"
                d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
              ></path>
            </svg>
            <div class="hidden group-hover:block">Add Content</div>
          </div>
        </div>
      );
    }
  }
}
export default AddSectionButton;
