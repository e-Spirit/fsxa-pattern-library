import { FSXAActions, FSXAAppError, FSXAAppState, FSXAGetters } from "@/store";
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
  FSXA_INJECT_USE_ERROR_BOUNDARY_WRAPPER,
} from "@/constants";
import Page from "./Page";
import ErrorBoundary from "./internal/ErrorBoundary";
import InfoBox from "./internal/InfoBox";
import Code from "./internal/Code";
import { FSXAApi, FSXAApiSingleton } from "fsxa-api";
import { AppProps } from "@/types/components";
import PortalProvider from "./internal/PortalProvider";
import { importTPPSnapAPI } from "@/utils";
import {
  connectCaasEvents,
  DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
} from "@/utils/caas-events";
import { triggerRouteChange } from "@/utils/getters";

const CAAS_CHANGE_DELAY_MS = 300;

@Component({
  name: "FSXAApp",
})
class App extends TsxComponent<AppProps> {
  @Prop({ default: () => ({}) }) components!: AppProps["components"];
  @Prop() currentPath!: AppProps["currentPath"];
  @Prop({ default: false }) devMode!: AppProps["devMode"];
  @Prop({ required: true }) defaultLocale!: AppProps["defaultLocale"];
  @Prop({ required: true }) handleRouteChange!: AppProps["handleRouteChange"];
  @Prop({ required: true }) liveEditUrl!: AppProps["liveEditUrl"];
  @Prop() fsTppVersion: AppProps["fsTppVersion"];
  @Prop({ default: true })
  useErrorBoundaryWrapper!: AppProps["useErrorBoundaryWrapper"];
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

  @ProvideReactive(FSXA_INJECT_USE_ERROR_BOUNDARY_WRAPPER)
  injectedUseErrorBoundaryWrapper = this.useErrorBoundaryWrapper;

  @Watch("currentPath")
  onCurrentPathChange(nextPath: string) {
    this.path = nextPath;
  }

  @Watch("devMode")
  onDevModeChange(nextDevMode: boolean) {
    this.injectedDevMode = nextDevMode;
  }

  @Watch("useErrorBoundaryWrapper")
  onUseErrorBoundaryWrapperChange(nextUseErrorBoundaryWrapper: boolean) {
    this.injectedUseErrorBoundaryWrapper = nextUseErrorBoundaryWrapper;
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
    return this.fsTppVersion;
  }

  async mounted() {
    if (this.appState === FSXAAppState.not_initialized) await this.initialize();

    if (this.isEditMode) {
      const caasEvents = connectCaasEvents(this.fsxaApi);

      const routeToPreviewId = async (previewId: string) => {
        const [pageId, locale] = previewId.split(".");
        console.debug("Triggering route change", {
          params: {
            locale,
            pageId,
          },
          currentLocale: this.$store.getters[FSXAGetters.locale],
        });
        const newRoute = await triggerRouteChange(
          this.$store,
          this.fsxaApi,
          {
            locale,
            pageId,
          },
          this.$store.getters[FSXAGetters.locale],
          this.$store.getters[FSXAGetters.getGlobalSettingsKey],
        );
        if (newRoute != null) {
          this.handleRouteChange(newRoute);
        } else {
          console.warn("Unable to route to ", newRoute);
        }
      };

      importTPPSnapAPI({ version: this.tppVersion, url: this.tppApiUrl })
        .then(TPP_SNAP => {
          if (!TPP_SNAP) {
            throw new Error("Could not find global TPP_SNAP object.");
          }
          TPP_SNAP.onInit(async (success: boolean) => {
            if (!success) throw new Error("Could not initialize TPP");

            if (TPP_SNAP.fsxaHooksRegistered) {
              console.debug(
                "Hooks already registered, skipping registrations.",
              );
              return;
            }

            console.debug("Registering FSXA hooks");
            TPP_SNAP.onRequestPreviewElement(async (previewId: string) => {
              console.debug("onRequestPreviewElement triggered", previewId);
              await caasEvents.waitFor(previewId, {
                timeout: DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
              });
              await routeToPreviewId(previewId);
            });
            TPP_SNAP.onRerenderView(() => {
              console.debug("onRerenderView triggered");
              TPP_SNAP.getPreviewElement().then(async (previewId: string) => {
                if (caasEvents.isConnected()) {
                  await caasEvents.waitFor(previewId, {
                    timeout: DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
                    allowedEventTypes: ["replace"],
                  });
                } else {
                  // no realtime events, so just wait
                  await new Promise(resolve =>
                    setTimeout(resolve, CAAS_CHANGE_DELAY_MS),
                  );
                }
                await this.initialize(this.$store.getters[FSXAGetters.locale]);
              });
              return false;
            });
            TPP_SNAP.onNavigationChange(async () => {
              console.debug("onNavigationChange triggered");
              TPP_SNAP.getPreviewElement().then(async (previewId: string) => {
                if (caasEvents.isConnected()) {
                  await caasEvents.waitFor(previewId, {
                    timeout: DEFAULT_CAAS_EVENT_TIMEOUT_IN_MS,
                  });
                } else {
                  // no realtime events, so just wait
                  await new Promise(resolve =>
                    setTimeout(resolve, CAAS_CHANGE_DELAY_MS),
                  );
                }
                await this.initialize(this.$store.getters[FSXAGetters.locale]);
                if (previewId) await routeToPreviewId(previewId);
              });
            });
            TPP_SNAP.fsxaHooksRegistered = true;
          });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }

  initialize(locale?: string) {
    return this.$store.dispatch(FSXAActions.initializeApp, {
      defaultLocale: locale ? locale : this.defaultLocale,
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

  get fsxaApi(): FSXAApi {
    return FSXAApiSingleton.instance;
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
      } else if (currentNode && currentNode?.caasDocumentId) {
        return <Page id={currentNode.caasDocumentId} />;
      } else throw new Error(NAVIGATION_ERROR_404);
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
        console.error(error.message);
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
                <span role="alert">{this.appError?.message}</span>
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
      this.appState === FSXAAppState.ready ? this.renderContent() : null;
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
