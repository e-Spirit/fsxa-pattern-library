import { FSXAActions, FSXAAppState } from "@/store";
import {
  determineCurrentRoute,
  NAVIGATION_ERROR_404,
} from "@/utils/navigation";
import { VNode } from "vue";
import Component from "vue-class-component";
import { Prop, Provide } from "vue-property-decorator";
import Dataset from "./Dataset";
import BaseComponent from "./BaseComponent";
import {
  FSXA_INJECT_KEY_DEV_MODE,
  FSXA_INJECT_KEY_LAYOUTS,
  FSXA_INJECT_KEY_SECTIONS,
} from "@/constants";
import Page from "./Page";

export type ContentType =
  | {
      type: "Page";
      id: string;
    }
  | {
      type: "Dataset";
      route: string;
    };

/** TODO: Add specific typings for the components */
export interface AppProps {
  components?: {
    /**
     * Your component that will render the overall AppLayout.
     *
     * If no appLayout is passed the rendered content Layout + Sections is returned
     */
    appLayout?: any;
    /**
     * Pass a component that should get rendered, when no matching route was found
     *
     * If no 404 page is passed nothing will be rendered
     */
    page404?: any;
    /**
     * Pass your sections that will be mapped through the provided record key
     *
     * Nothing will be rendered, if no matching section was found and devMode is not active
     */
    sections?: Record<string, any>;
    /**
     * Pass your layouts that will be mapped through the provided record key
     *
     * Nothing will be rendered, if no matching layout was found and devMode is not active
     */
    layouts?: Record<string, any>;
  };
  currentPath?: string;
  defaultLocale: string;
  devMode?: boolean;
  globalSettingsKey?: string;
  handleRouteChange: (nextRoute: string) => void;
}
@Component({
  name: "FSXAApp",
})
class App extends BaseComponent<
  AppProps,
  {},
  {
    layout?: {
      content: JSX.Element | VNode | VNode[] | string | null;
    };
    page404?: {};
  }
> {
  @Prop() components!: AppProps["components"];
  @Prop() currentPath!: AppProps["currentPath"];
  @Prop({ default: false }) devMode!: AppProps["devMode"];
  @Prop({ required: true }) defaultLocale!: AppProps["defaultLocale"];
  @Prop() globalSettingsKey: AppProps["globalSettingsKey"];
  @Prop({ required: true }) handleRouteChange!: AppProps["handleRouteChange"];

  @Provide(FSXA_INJECT_KEY_DEV_MODE) injectedDevMode = this.devMode;
  @Provide(FSXA_INJECT_KEY_LAYOUTS) injectedLayouts =
    this.components?.layouts || {};
  @Provide(FSXA_INJECT_KEY_SECTIONS) injectedSections =
    this.components?.sections || {};

  // the following util methods will be provided through inject
  // handleRouteChangeRequest
  // currentPage

  // provide utility methods

  serverPrefetch() {
    return this.initialize();
  }

  mounted() {
    if (this.appState === FSXAAppState.not_initialized) this.initialize();
  }

  initialize() {
    return this.$store.dispatch(FSXAActions.initializeApp, {
      defaultLocale: this.defaultLocale,
      initialPath: this.currentPath,
      globalSettingsKey: this.globalSettingsKey,
    });
  }

  get appState(): FSXAAppState {
    return this.$store.state.fsxa.appState;
  }

  get navigationData() {
    return this.$store.state.fsxa.navigation;
  }

  renderContent() {
    if (this.$slots.default) return this.$slots.default || null;
    try {
      const currentNode = determineCurrentRoute(
        this.navigationData,
        this.currentPath,
      );
      console.log(
        "CurrentNode",
        currentNode,
        this.currentPath,
        this.navigationData,
      );
      if (currentNode && (currentNode as any).seoRouteRegex !== null) {
        // we want to render a dataset
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
      if (error.message === NAVIGATION_ERROR_404) {
        if (this.components?.page404) {
          const Page404Layout = this.components.page404;
          return (
            <Page404Layout
              currentPath={this.currentPath}
              locale={this.locale}
            />
          );
        }
        return null;
      }
    }
    return null;
  }

  render() {
    const content = this.renderContent();
    if (this.components?.appLayout) {
      const AppLayout = this.components.appLayout;
      return <AppLayout>{content}</AppLayout>;
    }
    return content;
  }
}
export default App;
