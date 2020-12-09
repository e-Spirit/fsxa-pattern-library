import Component from "vue-class-component";
import { Component as TsxComponent } from "vue-tsx-support";
import { Fragment } from "vue-fragment";
import { Provide, Watch } from "vue-property-decorator";
import { FSXA_INJECT_KEY_SET_PORTAL_CONTENT } from "@/constants";

@Component({
  name: "PortalProvider",
})
class PortalProvider extends TsxComponent<{}> {
  portalContent: any | null = null;

  @Watch("portalContent")
  onPortalContentChange(portalContent: any) {
    if (portalContent) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }

  @Provide(FSXA_INJECT_KEY_SET_PORTAL_CONTENT)
  setPortalContent(portalContent: any | null) {
    this.portalContent = portalContent;
  }

  render() {
    return (
      <Fragment>
        {this.$slots.default}
        {this.portalContent && (
          <div class="fixed w-full h-screen top-0 left-0 flex items-start justify-center z-50">
            <div
              class="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 z-0"
              onClick={event => {
                event.preventDefault();
                this.setPortalContent(null);
              }}
            />
            <div class="relative h-screen w-full flex items-center justify-center pointer-events-none">
              {this.portalContent}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
export default PortalProvider;
