import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import {
  FSXAGetters,
  FSXAActions,
  FSXAAppState,
  CurrentPage,
  FSXAAppError,
} from "@/store";
import { Fragment } from "vue-fragment";
import {
  RequestRouteChangeParams,
  PageProps,
  AppLocale,
} from "@/types/components";
import {
  Navigation,
  Footer,
  FooterLink,
  DevInfoTarget,
  Page as UIPage,
  Loader,
  Dropdown,
  Option,
  DevInfo,
} from "fsxa-ui";
import BaseComponent from "@/components/BaseComponent";
import { NavigationData } from "fsxa-api";
import { isClient, mapStructureItemToNavigationItem } from "@/utils";
import Layout from "@/components/Layout";
import {
  FSXA_INJECT_KEY_LAYOUTS,
  FSXA_INJECT_KEY_SECTIONS,
  FSXA_INJECT_KEY_DEV_MODE,
} from "@/constants";

const getDropdownOptions = (locales: AppLocale[] = []): Option[] => {
  return locales.map(locale => {
    if (typeof locale === "string")
      return {
        key: locale,
        label: locale,
      };
    else {
      return {
        key: locale.value,
        label: locale.label,
      };
    }
  });
};

@Component({
  name: "Page",
})
class Page extends BaseComponent<PageProps> {
  @Prop() id: PageProps["id"];
  @Prop() currentPath: PageProps["currentPath"];
  @Prop() renderNavigation: PageProps["renderNavigation"];
  @Prop() handleRouteChange!: PageProps["handleRouteChange"];
  @Prop() renderLayout: PageProps["renderLayout"];
  @Prop() renderLoader: PageProps["renderLoader"];
  @Prop({ required: true }) defaultLocale!: PageProps["defaultLocale"];
  @Prop({ required: true }) locales!: PageProps["locales"];

  @Prop() appLayoutComponent: PageProps["appLayoutComponent"];
  @Prop() navigationComponent: PageProps["navigationComponent"];

  @Prop({ default: false }) devMode!: PageProps["devMode"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) layouts!: PageProps["layouts"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) sections!: PageProps["sections"];

  @Provide(FSXA_INJECT_KEY_LAYOUTS) injectedLayouts = this.layouts;
  @Provide(FSXA_INJECT_KEY_SECTIONS) injectedSections = this.sections;
  @Provide(FSXA_INJECT_KEY_DEV_MODE) injectedDevMode = this.devMode;

  serverPrefetch() {
    return this.initialize({
      locale: this.defaultLocale,
      path: this.currentPath,
      pageId: this.id,
      isClient: false,
    });
  }

  @Watch("currentPath", { immediate: true })
  onPathChange(nextPath: string) {
    this.$store.dispatch(FSXAActions.fetchPage, {
      path: nextPath,
      isClient: true,
    });
  }

  mounted() {
    // we will initialize the app if this was not happening on the server
    if (this.appState === FSXAAppState.not_initialized) {
      this.initialize({
        locale: this.locale || this.defaultLocale,
        path: this.currentPath,
        pageId: this.id,
        isClient: true,
      });
    }
    if (this.isEditMode) {
      // eslint-disable-next-line
      const TPP_SNAP = require("fs-tpp-api/snap");
      TPP_SNAP.onRequestPreviewElement((previewId: string) => {
        const pageId = previewId.split(".")[0];
        const nextPage = this.navigationData?.idMap[pageId];
        if (nextPage) this.requestRouteChange({ route: nextPage.seoRoute });
      });
      TPP_SNAP.onRerenderView(() => {
        window.setTimeout(
          () =>
            this.initialize({
              isClient: true,
              locale: this.locale,
              path: this.currentPath,
            }),
          300,
        );
        return false;
      });
    }
    window.addEventListener("click", event => {
      if (
        "linkInternal" in (event.target as HTMLElement).dataset &&
        (event.target as HTMLElement).dataset.linkInternal === "true"
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.handleRouteChange((event.target as any).pathname);
      }
    });
  }

  initialize({
    locale,
    path,
    pageId,
    isClient,
  }: {
    locale: string;
    path?: string;
    pageId?: string;
    isClient: boolean;
  }) {
    return this.$store.dispatch(FSXAActions.initialize, {
      locale,
      path,
      pageId,
      isClient,
    });
  }

  get appState(): FSXAAppState {
    return this.$store.getters[FSXAGetters.appState];
  }

  get appError(): FSXAAppError | null {
    return this.$store.getters[FSXAGetters.error];
  }

  get navigationData(): NavigationData | null {
    return this.$store.getters[FSXAGetters.navigationData];
  }

  @Provide("requestRouteChange")
  requestRouteChange({ pageId, route }: RequestRouteChangeParams): void {
    let nextPage = null;
    if (pageId && this.navigationData)
      nextPage = this.navigationData.idMap[pageId] || null;
    if (route && this.navigationData)
      nextPage =
        this.navigationData.idMap[this.navigationData.seoRouteMap[route]] ||
        null;
    if (nextPage) {
      if (isClient() && this.isEditMode) {
        // eslint-disable-next-line
        const TPP_SNAP = require("fs-tpp-api/snap");
        TPP_SNAP.setPreviewElement(`${nextPage.id}.${this.locale}`);
      }
      this.handleRouteChange(nextPage.seoRoute);
    }
  }

  async requestLocaleChange(locale: string) {
    const pageId = this.currentPage?.id || null;
    if (locale !== this.locale && pageId) {
      const nextPath = await this.initialize({
        locale,
        pageId,
        isClient: true,
      });
      if (nextPath) {
        this.handleRouteChange(nextPath);
      }
    }
  }

  get currentPage(): CurrentPage | null {
    return this.$store.getters[FSXAGetters.currentPage];
  }

  get locale() {
    return this.$store.getters[FSXAGetters.locale] || this.defaultLocale;
  }

  renderContent() {
    if (!this.currentPage || !this.currentPage.content) return null;
    const layout = (
      <Layout
        type={this.currentPage.content.layout}
        content={this.currentPage.content.children}
        data={this.currentPage.content.data}
        meta={this.currentPage.content.meta}
        pageId={this.currentPage.content.refId}
      />
    );
    return this.isEditMode ? (
      <div data-preview-id={this.currentPage.content.previewId}>{layout}</div>
    ) : (
      <Fragment>{layout}</Fragment>
    );
  }

  renderNav() {
    const NavigationComponent = this.navigationComponent;
    if (NavigationComponent) {
      return (
        <NavigationComponent
          locale={this.defaultLocale}
          locales={this.locales || []}
          handleLocaleChange={this.requestLocaleChange}
          activePageId={this.currentPage?.id || ""}
          activeSeoRoute={this.currentPath || ""}
        />
      );
    }
    if (this.renderNavigation) {
      return this.renderNavigation({
        locale: this.defaultLocale,
        locales: this.locales || [],
        handleLocaleChange: this.requestLocaleChange,
        activePageId: this.currentPage?.id || "",
        activeSeoRoute: this.currentPath || "",
      });
    }
    const navItems = [];
    const navigationData = this.navigationData;
    if (navigationData !== null) {
      navItems.push(
        ...navigationData.structure.map(structure =>
          mapStructureItemToNavigationItem(structure, navigationData),
        ),
      );
    }
    return (
      <Navigation
        items={navItems}
        isActiveItem={item =>
          Boolean(
            this.currentPage &&
              this.currentPage.content &&
              item.id === this.currentPage.content.refId,
          )
        }
        handleNavClick={({ id }) =>
          this.requestRouteChange({
            pageId: id,
          })
        }
      >
        {this.locales ? (
          <Dropdown
            value={this.locale}
            options={getDropdownOptions(this.locales)}
            handleChange={newLocale => this.requestLocaleChange(newLocale.key)}
          >
            <i class="fas fa-globe-europe" />
          </Dropdown>
        ) : null}
      </Navigation>
    );
  }

  renderFooter() {
    const handleLinkClick = (link: FooterLink) => {
      const nextPage = this.navigationData?.idMap[link.referenceId];
      if (nextPage) this.handleRouteChange(nextPage?.seoRoute);
    };
    const links: FooterLink[] =
      this.settings && this.settings.data.gc_footer_links
        ? this.settings.data.gc_footer_links.map((link: any) => ({
            isActive:
              link.data.lt_link.referenceType === "PageRef" &&
              link.data.lt_link.referenceId === this.currentPage?.id,
            label: link.data.lt_text,
            previewId: link.previewId,
            referenceId: link.data.lt_link.referenceId,
            referenceType:
              link.data.lt_link.referenceType === "PageRef"
                ? "page"
                : "fragment",
          }))
        : [];
    return this.settings ? (
      <Footer
        copyright={this.settings.data.gc_copyright as string}
        links={links}
        handleClick={handleLinkClick}
        data-preview-id={this.settings.id}
      >
        {this.settings && this.settings.data.gs_logo ? (
          <img src={this.settings.data.gs_logo.resolutions.ORIGINAL.url} />
        ) : null}
      </Footer>
    ) : null;
  }

  render() {
    const content =
      this.appState === FSXAAppState.fetching ? (
        <Loader renderLoader={this.renderLoader} />
      ) : (
        this.renderContent()
      );

    // leave rendering to consumer, when renderLayout or AppLayoutComponent is provided
    const AppLayoutComponent = this.appLayoutComponent;
    if (this.renderLayout || AppLayoutComponent) {
      const payload = {
        appState: this.appState,
        appError: this.appError,
        content,
        handleLocaleChange: this.requestLocaleChange,
        locale: this.locale || this.defaultLocale,
        locales: this.locales || [],
      };
      const layout = AppLayoutComponent ? (
        <AppLayoutComponent {...{ props: payload }} />
      ) : (
        // eslint-disable-next-line
        this.renderLayout!(payload)
      );
      return (
        <Fragment>
          {this.isDevMode && <DevInfoTarget />}
          {layout}
        </Fragment>
      );
    }
    if (this.appState === FSXAAppState.initializing) return null;
    if (this.appState === FSXAAppState.error) {
      return (
        <DevInfo
          class="h-full"
          devModeHint="This error message is always displayed"
          headline={
            this.appError ? this.appError.message : "Unknown error occured"
          }
        >
          {this.appError?.description}
        </DevInfo>
      );
    }
    return (
      <Fragment>
        {this.isDevMode && <DevInfoTarget />}
        <UIPage
          renderFooter={this.renderFooter}
          renderNavigation={this.renderNav}
        >
          {content}
        </UIPage>
      </Fragment>
    );
  }
}
export default Page;
