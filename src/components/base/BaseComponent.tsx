import { Component as TsxComponent } from "vue-tsx-support";
import { Component, Inject, InjectReactive } from "vue-property-decorator";
import { FSXAGetters, getFSXAConfiguration } from "@/store";
import { FSXAApi, FSXAContentMode, GCAPage, NavigationData } from "fsxa-api";
import {
  getStoredItem,
  setStoredItem,
  triggerRouteChange,
} from "@/utils/getters";
import { RequestRouteChangeParams } from "@/types/components";
import { FSXA_INJECT_KEY_DEV_MODE } from "@/constants";
import { findNavigationItemInNavigationData } from "@/utils/getters";
import { extractLinkMarkup } from "@/utils/dom";

@Component({
  name: "BaseComponent",
})
class BaseComponent<
  Props = {},
  EventsWithOn = {},
  Slots = {}
> extends TsxComponent<Props, EventsWithOn, Slots> {
  @InjectReactive({
    from: "currentPath",
  })
  private currentPath!: string;
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
  private handleRouteChangeRequest!: (newRoute: string | null) => void;

  /**
   * This method will trigger a route change request
   *
   * You can pass in a pageId, route or locale
   *
   * If a corresponding page is found the route change will be triggered
   *
   * Make sure that you always provide some kind of fallback since this route change will only be available when javascript is enabled
   */
  async triggerRouteChange(params: RequestRouteChangeParams) {
    this.handleRouteChangeRequest(
      await triggerRouteChange(
        this.$store,
        this.fsxaApi,
        {
          locale: params.locale,
          pageId: params.pageId,
          route: params.route
            ? params.route
            : params.pageId
            ? undefined
            : this.currentPath,
        },
        this.locale,
      ),
    );
  }

  /**
   * Get the corresponding route for a given pageId
   *
   * Will return null if no page was found
   */
  getUrlByPageId(pageId: string) {
    return (
      findNavigationItemInNavigationData(this.$store, {
        pageId,
      })?.seoRoute || null
    );
  }

  /**
   * The current RichText structure encapsulates linking logic. To make sure, that the contained links are clickable,
   * invoke this method. The links will then be transformed.
   */
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
            href: this.getUrlByPageId(data.lt_link.value.identifier),
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

  /**
   * Check if this app is delivering preview or released data
   *
   * If editMode is true, the TPP_SNAP utility will be injected as well
   */
  get isEditMode() {
    return this.$store.getters[FSXAGetters.mode] === "preview";
  }

  /**
   * get preconfigured and ready to use FSXAApi instance
   */
  get fsxaApi(): FSXAApi {
    return new FSXAApi(
      this.isEditMode ? FSXAContentMode.PREVIEW : FSXAContentMode.RELEASE,
      getFSXAConfiguration(this.$store.state.fsxa.configuration),
    );
  }

  /**
   * the current locale the content is displayed in
   */
  get locale(): string {
    return this.$store.getters[FSXAGetters.locale];
  }

  /**
   * the current navigation data state
   */
  get navigationData(): NavigationData | null {
    return this.$store.getters[FSXAGetters.navigationData];
  }

  /**
   * The content of your globally configured GCAPage.
   *
   * This will be null if no globalSettingsKey was passed to the FSXAApp or no corresponding GCAPage could be found
   */
  get globalSettings(): GCAPage | null {
    return this.$store.state.fsxa.settings || null;
  }

  /**
   * Access your stored data in the vuex store
   */
  getStoredItem<Value = any>(key: string) {
    return getStoredItem<Value>(this.$store, key);
  }

  /**
   * Save your data in the vuex-store
   *
   * You can use this to store your data from 3rd party services that were fetched in the Server Side Rendering process to access it later in on the client
   *
   * Specify a ttl that will determine how long the value will be valid
   */
  setStoredItem<Value = any>(key: string, value: Value, ttl = 300000) {
    return setStoredItem(this.$store, key, value, ttl);
  }

  render(): any {
    return <div>Please provide your own render method.</div>;
  }
}
export default BaseComponent;
