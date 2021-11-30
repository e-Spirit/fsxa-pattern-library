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
  FSXA_INJECT_KEY_COMPONENTS,
  FSXA_INJECT_KEY_TPP_VERSION,
  FSXA_INJECT_DEV_MODE_INFO,
} from "@/constants";
import Page from "./Page";
import ErrorBoundary from "./internal/ErrorBoundary";
import InfoBox from "./internal/InfoBox";
import Code from "./internal/Code";
import { FSXAContentMode, FSXAProxyApi } from "fsxa-api";
import { AppProps } from "@/types/components";
import PortalProvider from "./internal/PortalProvider";
import { getTPPSnap, importTPPSnapAPI } from "@/utils";

const DEFAULT_TPP_SNAP_VERSION = "2.2.1";
@Component({
  name: "FSXAApp",
})
class App extends TsxComponent<AppProps> {
  @Prop({ default: () => ({}) }) components!: AppProps["components"];
  @Prop() currentPath!: AppProps["currentPath"];
  @Prop({ default: false }) devMode!: AppProps["devMode"];
  @Prop({ required: true }) defaultLocale!: AppProps["defaultLocale"];
  @Prop({ required: true }) handleRouteChange!: AppProps["handleRouteChange"];
  @Prop() fsTppVersion: AppProps["fsTppVersion"];
  @ProvideReactive("currentPath") path = this.currentPath;
  @ProvideReactive(FSXA_INJECT_KEY_DEV_MODE) injectedDevMode = this.devMode;
  @ProvideReactive(FSXA_INJECT_KEY_COMPONENTS) injectedComponents = this
    .components;

  @ProvideReactive(FSXA_INJECT_KEY_LAYOUTS) injectedLayouts =
    this.components?.layouts || {};
  @ProvideReactive(FSXA_INJECT_KEY_SECTIONS) injectedSections =
    this.components?.sections || {};
  @ProvideReactive(FSXA_INJECT_KEY_LOADER) injectedLoader =
    this.components?.loader || null;
  @ProvideReactive(FSXA_INJECT_DEV_MODE_INFO) injectedInfoError =
    this.components?.devModeInfo || null;

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
    this.injectedComponents = nextComponents;
    this.injectedLayouts = nextComponents?.layouts || {};
    this.injectedSections = nextComponents?.sections || {};
  }

  serverPrefetch() {
    return this.initialize();
  }

  @ProvideReactive(FSXA_INJECT_KEY_TPP_VERSION)
  get tppVersion() {
    return this.fsTppVersion || DEFAULT_TPP_SNAP_VERSION;
  }

  mounted() {
    if (this.appState === FSXAAppState.not_initialized) this.initialize();
    // we will load tpp-snap, if we are in devMode
    if (this.isEditMode) {
      importTPPSnapAPI(this.tppVersion)
        .then(TPP_SNAP => {
          if (!TPP_SNAP) {
            throw new Error("Could not find global TPP_SNAP object.");
          }
          TPP_SNAP.onRequestPreviewElement(async (previewId: string) => {
            // This event handles the initial loading of the pwa in the ocm or after a site was created or section changed
            // Here we need to wait a few moments, so that the CaaS/Navigation-Service could be filled with the new information, before we initialize the app to get the new data.
            new Promise<void>(resolve => {
              const wait = setTimeout(() => {
                clearTimeout(wait);
                resolve();
              }, 2000);
            })
              .then(this.initialize)
              .then(() => {
                const pageId = previewId.split(".")[0];
                const nextPage = this.navigationData?.idMap[pageId];
                if (nextPage) this.requestRouteChange(nextPage.seoRoute);
              });
          });
          // Temporary solution to enable the cropping of images with multiple resolutions when using the data-tpp-context-image-resolution.
          // Should be removed after OCM-518 is done.
          TPP_SNAP.overrideDefaultButton("crop", {
            execute: async ({
              previewId,
              $node: {
                dataset: { tppContextImageResolution = "ORIGINAL" },
              },
            }: {
              previewId: string;
              $node: { dataset: { tppContextImageResolution: string } };
            }) => {
              const resolutions = tppContextImageResolution.split(",");
              TPP_SNAP.cropImage(previewId, resolutions);
            },
          });
          TPP_SNAP.onRerenderView(() => {
            window.setTimeout(() => this.initialize(), 300);
            return false;
          });
          TPP_SNAP.onNavigationChange(() => {
            window.setTimeout(() => this.initialize(), 300);
            return false;
          });
        })
        .catch(() => {
          console.error(
            `Could not load correct fs-tpp-api version: ${this.tppVersion}. Please make sure that it exists.`,
          );
        });
    }
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
      try {
        const currentRoute = determineCurrentRoute(
          this.navigationData,
          this.currentPath,
        );
        if (currentRoute) {
          getTPPSnap().setPreviewElement(`${currentRoute.id}.${this.locale}`);
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
    });
  }

  @ProvideReactive("requestRouteChange")
  async requestRouteChange(newRoute: string | null) {
    if (newRoute) this.handleRouteChange(newRoute);
  }

  get isEditMode() {
    return this.$store.getters[FSXAGetters.mode] === "preview";
  }

  get fsxaApi(): FSXAProxyApi {
    return new FSXAProxyApi(
      this.$store.state.fsxa.configuration.baseUrl.server,
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
      if (error instanceof Error) {
        if (error.message === NAVIGATION_ERROR_404) {
          if (this.components?.page404) {
            const Page404Layout = this.components.page404;
            return <Page404Layout currentPath={this.currentPath} />;
          }
          return null;
        }
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
            <div class="pl-text-gray-900">
              <h2 class="pl-text-lg pl-font-medium pl-text-gray-900">
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
