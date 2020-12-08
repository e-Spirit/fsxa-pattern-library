import { Component } from "vue-property-decorator";
import { FSXABaseAppLayout } from "fsxa-pattern-library";

@Component({
  name: "AppLayout",
})
class AppLayout extends FSXABaseAppLayout {
  render() {
    return (
      <div>
        <div class="bg-gray-200">
          <div class="w-full flex items-center justify-center px-4 md:px-6 lg:px-10 py-3">
            <div class="flex-shrink-0 font-bold">TSX App</div>
            <div class="flex-1 text-right">
              {this.navigationData && (
                <ul class="inline-block">
                  {this.navigationData.structure.map(item => (
                    <li class="inline-block px-2 text-sm">
                      <a
                        class="hover:underline"
                        href={this.navigationData!.idMap[item.id].seoRoute}
                        onClick={event => {
                          event.preventDefault();
                          this.triggerRouteChange({ pageId: item.id });
                        }}
                      >
                        {this.navigationData!.idMap[item.id].label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div class="flex-shrink-0 ml-3 text-xs space-x-2">
              <a
                href="#"
                class={`inline-block ${
                  this.locale === "en_GB" ? "underline" : ""
                }`}
                onClick={event => {
                  event.preventDefault();
                  this.triggerRouteChange({
                    locale: "en_GB",
                  });
                }}
              >
                en_GB
              </a>
              <a
                href="#"
                class={`inline-block ${
                  this.locale === "de_DE" ? "underline" : ""
                }`}
                onClick={event => {
                  event.preventDefault();
                  this.triggerRouteChange({
                    locale: "de_DE",
                  });
                }}
              >
                de_DE
              </a>
            </div>
          </div>
        </div>
        {this.$slots.default}
      </div>
    );
  }
}
export default AppLayout;
