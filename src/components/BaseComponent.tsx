import { Component as TsxComponent } from "vue-tsx-support";
import { Component, Inject } from "vue-property-decorator";
import { FSXA_INJECT_KEY_DEV_MODE } from "@/constants";
import { RequestRouteChangeParams } from "@/types/components";
import { FSXAGetters, FSXAActions, getFSXAConfiguration } from "@/store";
import { FSXAApi, FSXAContentMode, NavigationData } from "fsxa-api";
import { GCAPage } from "fsxa-api/dist/types";
import { extractLinkMarkup } from "@/utils/dom";

@Component
class BaseComponent<Props> extends TsxComponent<Props> {
  @Inject({ from: FSXA_INJECT_KEY_DEV_MODE, default: false })
  isDevMode!: boolean;
  @Inject({
    from: "requestRouteChange",
    default: () => (params: RequestRouteChangeParams) =>
      console.log(
        "Could not perform route change, since this component is not a child of an FSXAPage",
        params,
      ),
  })
  handleRouteChangeRequest!: (params: RequestRouteChangeParams) => void;

  getUrlByReferenceIdAndType(
    referenceId: string,
    referenceType: "PageRef",
  ): string | null {
    return this.$store.getters[FSXAGetters.getReferenceUrl](
      referenceId,
      referenceType,
    );
  }

  createLinksInRichText(
    text: string,
    handleLinkData?: (
      type: string,
      data: Record<string, string>,
    ) => {
      isInternalLink: boolean;
      linkAttributes: Record<string, any>;
    } | null,
  ): string {
    return extractLinkMarkup(text, (type, data) => {
      if (handleLinkData) {
        const result = handleLinkData(type, data);
        if (result) {
          return {
            "data-link-internal": result.isInternalLink ? "true" : null,
            ...result.linkAttributes,
          };
        }
      }
      switch (type) {
        case "internal_link":
          return {
            "data-link-internal": "true",
            href: this.getUrlByReferenceIdAndType(
              data.lt_link.value.identifier,
              data.lt_link.value.fsType,
            ),
          };
        case "external_link":
          return {
            href: data.lt_url.value || null,
            target: data.lt_link_behavior.value.identifier || null,
          };
        default:
          return {};
      }
    });
  }

  get isEditMode() {
    return this.$store.getters[FSXAGetters.mode] === "preview";
  }

  get locale() {
    return this.$store.state.fsxa.locale;
  }

  get navigationData(): NavigationData | null {
    return this.$store.state.fsxa.navigation;
  }

  get settings(): GCAPage | null {
    return this.$store.state.fsxa.settings;
  }

  get fsxaApi(): FSXAApi {
    return new FSXAApi(
      this.isEditMode ? FSXAContentMode.PREVIEW : FSXAContentMode.RELEASE,
      getFSXAConfiguration(this.$store.state.fsxa.configuration),
    );
  }

  getStoredItem(key: string) {
    return this.$store.getters[FSXAGetters.item](key);
  }

  setStoredItem(key: string, value: any) {
    this.$store.dispatch(FSXAActions.setStoredItem, { key, value });
  }

  render() {
    throw new Error("You have to specify your own render-method");
  }
}
export default BaseComponent;
