import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import BaseComponent from "./../base/BaseComponent";

export interface InfoBoxProps {
  type: "info" | "error";
  headline: JSX.Element | string;
  isOverlay?: boolean;
  subheadline?: JSX.Element | string | null;
  handleClose?: () => void;
}
@Component({
  name: "InfoBox",
})
class InfoBox extends BaseComponent<InfoBoxProps> {
  @Prop({ required: true }) type!: InfoBoxProps["type"];
  @Prop({ required: true }) headline!: InfoBoxProps["headline"];
  @Prop() subheadline: InfoBoxProps["subheadline"];
  @Prop({ default: false }) isOverlay: InfoBoxProps["isOverlay"];
  @Prop() handleClose: InfoBoxProps["handleClose"];

  collapsed = false;

  render() {
    return (
      <div
        class={`w-full ${
          this.isOverlay ? "h-full w-full lg:w-12/12 xl:w-3/4" : "bg-gray-100"
        } p-4 md:p-6 lg:p-10`}
      >
        <div
          class={`pointer-events-auto w-full max-h-full rounded-lg shadow-md bg-white border flex flex-col items-center justify-start overflow-hidden ${
            this.type === "info" ? "border-blue-400" : "border-red-400"
          }`}
        >
          <div
            class={`w-full flex items-center justify-center px-4 lg:px-6 py-3 lg:py-5 ${
              this.collapsed ? "" : "border-b"
            } ${
              this.type === "info"
                ? "border-blue-400 bg-blue-200 text-blue-900"
                : "border-red-400 bg-red-200 text-red-900"
            } rounded-t-md`}
          >
            <div class="flex-grow">
              <h3>{this.headline}</h3>
              <p class="text-xs mt-1">{this.subheadline}</p>
            </div>
            <div class="flex-shrink-0 ml-4">
              <a
                href="#"
                class={`flex items-center justify-center w-10 h-10 hover:bg-gray-200 rounded-full duration-200 transition-transform transform ${
                  this.collapsed ? "-rotate-90" : ""
                }`}
                onClick={event => {
                  event.preventDefault();
                  if (this.isOverlay && this.handleClose) {
                    this.handleClose();
                  } else {
                    this.collapsed = !this.collapsed;
                  }
                }}
              >
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {this.isOverlay ? (
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  ) : (
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  )}
                </svg>
              </a>
            </div>
          </div>
          {!this.collapsed && (
            <div
              class={`w-full px-4 lg:px-6 py-3 lg:py-5 text-sm ${
                this.isOverlay ? "overflow-x-auto flex-grow" : ""
              }`}
            >
              {this.$slots.default}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default InfoBox;
