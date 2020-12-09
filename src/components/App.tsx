import {
  FSXAActions,
  FSXAAppError,
  FSXAAppState,
  FSXAGetters,
  getFSXAConfiguration,
} from "@/store";
import {
  determineCurrentRoute,
  NAVIGATION_ERROR_404,
} from "@/utils/navigation";
import Component from "vue-class-component";
import { Prop, ProvideReactive, Watch } from "vue-property-decorator";
import Dataset from "./Dataset";
import { Component as TsxComponent } from "vue-tsx-support";
import {
  FSXA_INJECT_KEY_DEV_MODE,
  FSXA_INJECT_KEY_LAYOUTS,
  FSXA_INJECT_KEY_SECTIONS,
  FSXA_INJECT_KEY_LOADER,
} from "@/constants";
import Page from "./Page";
import ErrorBoundary from "./internal/ErrorBoundary";
import InfoBox from "./internal/InfoBox";
import Code from "./internal/Code";
import { FSXAApi, FSXAContentMode } from "fsxa-api";
import { AppProps } from "@/types/components";
import PortalProvider from "./internal/PortalProvider";
@Component({
  name: "FSXAApp",
})
class App extends TsxComponent<AppProps> {
  @Prop({ default: () => ({}) }) components!: AppProps["components"];
  @Prop() currentPath!: AppProps["currentPath"];
  @Prop({ default: false }) devMode!: AppProps["devMode"];
  @Prop({ required: true }) defaultLocale!: AppProps["defaultLocale"];
  @Prop() globalSettingsKey: AppProps["globalSettingsKey"];
  @Prop({ required: true }) handleRouteChange!: AppProps["handleRouteChange"];
  @ProvideReactive("currentPath") path = this.currentPath;
  @ProvideReactive(FSXA_INJECT_KEY_DEV_MODE) injectedDevMode = this.devMode;
  @ProvideReactive(FSXA_INJECT_KEY_LAYOUTS) injectedLayouts =
    this.components?.layouts || {};
  @ProvideReactive(FSXA_INJECT_KEY_SECTIONS) injectedSections =
    this.components?.sections || {};
  @ProvideReactive(FSXA_INJECT_KEY_LOADER) injectedLoader =
    this.components?.loader || null;

  @Watch("currentPath")
  onCurrentPathChange(nextPath: string) {
    this.path = nextPath;
  }

  @Watch("devMode")
  onDevModeChange(nextDevMode: boolean) {
    this.injectedDevMode = nextDevMode;
  }

  @Watch("components")
  onComponentsChange(nextComponents: AppProps["components"]) {
    this.injectedLayouts = nextComponents?.layouts || {};
    this.injectedSections = nextComponents?.sections || {};
  }

  serverPrefetch() {
    return this.initialize();
  }

  mounted() {
    if (this.appState === FSXAAppState.not_initialized) this.initialize();

    // we will load tpp-snap, if we are in devMode
    if (this.isEditMode) {
      // eslint-disable-next-line
      const TPP_SNAP = require("fs-tpp-api/snap");
      TPP_SNAP.onRequestPreviewElement((previewId: string) => {
        const pageId = previewId.split(".")[0];
        const nextPage = this.navigationData?.idMap[pageId];
        if (nextPage) this.requestRouteChange(nextPage.seoRoute);
      });
      TPP_SNAP.onRerenderView(() => {
        window.setTimeout(() => this.initialize(), 300);
        return false;
      });
      TPP_SNAP.onNavigationChange(() => {
        window.setTimeout(() => this.initialize(), 300);
        return false;
      });
    }
    window.addEventListener("click", this.handleInternalClick);
  }

  /**
   * We will watch the appState and set the preview-element in the OCM
   * if we are in editMode and we are on the client
   */
  @Watch("appState")
  onAppStateChange(nextAppState: FSXAAppState) {
    if (
      this.isEditMode &&
      nextAppState === FSXAAppState.ready &&
      typeof window !== "undefined"
    ) {
      // eslint-disable-next-line
      const TPP_SNAP = require("fs-tpp-api/snap");
      try {
        const currentRoute = determineCurrentRoute(
          this.navigationData,
          this.currentPath,
        );
        if (currentRoute) {
          TPP_SNAP.setPreviewElement(`${currentRoute.id}.${this.locale}`);
        }
        // eslint-disable-next-line
      } catch (err) {}
    }
  }

  beforeDestroy() {
    window.removeEventListener("click", this.handleInternalClick);
  }

  handleInternalClick(event: MouseEvent) {
    if (
      "linkInternal" in (event.target as HTMLElement).dataset &&
      (event.target as HTMLElement).dataset.linkInternal === "true"
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.requestRouteChange((event.target as any).pathname);
    }
  }

  initialize() {
    return this.$store.dispatch(FSXAActions.initializeApp, {
      defaultLocale: this.defaultLocale,
      initialPath: this.currentPath,
      globalSettingsKey: this.globalSettingsKey,
    });
  }

  @ProvideReactive("requestRouteChange")
  async requestRouteChange(newRoute: string | null) {
    if (this.isEditMode && newRoute) {
      // eslint-disable-next-line
      const TPP_SNAP = require("fs-tpp-api/snap");
      const currentRoute = determineCurrentRoute(this.navigationData, newRoute);
      if (currentRoute) {
        TPP_SNAP.setPreviewElement(`${currentRoute.id}.${this.locale}`);
      }
    }
    if (newRoute) this.handleRouteChange(newRoute);
  }

  get isEditMode() {
    return this.$store.getters[FSXAGetters.mode] === "preview";
  }

  get fsxaApi(): FSXAApi {
    return new FSXAApi(
      this.isEditMode ? FSXAContentMode.PREVIEW : FSXAContentMode.RELEASE,
      getFSXAConfiguration(this.$store.state.fsxa.configuration),
    );
  }

  get locale(): string {
    return this.$store.getters[FSXAGetters.locale];
  }

  get appState(): FSXAAppState {
    return this.$store.state.fsxa.appState;
  }

  get appError(): FSXAAppError {
    return this.$store.state.fsxa.error;
  }

  get navigationData() {
    return this.$store.state.fsxa.navigation;
  }

  renderContent() {
    if (this.$slots.default) return this.$slots.default || null;
    if (
      [FSXAAppState.not_initialized, FSXAAppState.initializing].includes(
        this.appState,
      )
    ) {
      if (this.components?.loader) {
        const Loader = this.components.loader;
        return <Loader />;
      }
      return null;
    }
    try {
      const currentNode = determineCurrentRoute(
        this.navigationData,
        this.currentPath,
      );
      if (currentNode && (currentNode as any).seoRouteRegex !== null) {
        return this.currentPath ? (
          <Dataset
            route={this.currentPath}
            pageId={currentNode.caasDocumentId}
          />
        ) : null;
      } else {
        return <Page id={currentNode?.caasDocumentId} />;
      }
    } catch (error) {
      // We will render a 404 page if this is passed as a component
      if (error.message === NAVIGATION_ERROR_404) {
        if (this.components?.page404) {
          const Page404Layout = this.components.page404;
          return <Page404Layout currentPath={this.currentPath} />;
        }
        return null;
      }
    }
    return null;
  }

  render() {
    const AppLayout = this.components?.appLayout;
    if (!AppLayout && this.appState === FSXAAppState.error) {
      return (
        <InfoBox
          type="error"
          headline="Encountered error while rendering the FSXAApp"
        >
          {this.appError.stacktrace ? (
            <Code language="js">{this.appError?.stacktrace}</Code>
          ) : (
            <div class="text-gray-900">
              <h2 class="text-lg font-medium text-gray-900">
                {this.appError?.message}
              </h2>
              {this.appError.description && (
                <h3>{this.appError?.description}</h3>
              )}
            </div>
          )}
        </InfoBox>
      );
    }
    // We only want to generate the content, when the app is correctly initialized
    const content =
      this.appState === FSXAAppState.ready ? this.renderContent() : [];
    if (AppLayout) {
      const appLayout = (
        <AppLayout appState={this.appState} appError={this.appError}>
          {content}
        </AppLayout>
      );
      return (
        <ErrorBoundary title="Error rendering custom AppLayout component">
          {this.devMode ? (
            <PortalProvider>{appLayout}</PortalProvider>
          ) : (
            appLayout
          )}
        </ErrorBoundary>
      );
    }
    return this.devMode ? <PortalProvider>{content}</PortalProvider> : content;
  }
}
export default App;
