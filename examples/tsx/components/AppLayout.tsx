import { Component } from "vue-property-decorator";
import { FSXABaseAppLayout } from "fsxa-pattern-library";

@Component({
  name: "AppLayout",
})
class AppLayout extends FSXABaseAppLayout {
  render() {
    return (
      <div>
        <div class="pl-bg-gray-200">
          <div class="pl-w-full pl-flex pl-items-center pl-justify-center pl-px-4 md:pl-px-6 lg:pl-px-10 pl-py-3">
            <div class="pl-flex-shrink-0 pl-font-bold">TSX App</div>
            <button
              onClick={() => {
                this.$store.dispatch("fsxa/login");
              }}
            >
              LOGIN
            </button>
            <div class="pl-flex-1 pl-text-right">
              {this.navigationData && (
                <ul class="pl-nline-block">
                  {this.navigationData.structure?.map(item => (
                    <li class="pl-inline-block pl-px-2 pl-text-sm">
                      <a
                        class="hover:pl-underline"
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
            <div class="pl-flex-shrink-0 pl-ml-3 pl-text-xs pl-space-x-2">
              <a
                href="#"
                class={`pl-inline-block ${
                  this.locale === "en_GB" ? "pl-underline" : ""
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
                class={`pl-inline-block ${
                  this.locale === "de_DE" ? "pl-underline" : ""
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
