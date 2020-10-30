import { Component } from "vue-tsx-support";
import {
  Section,
  Dataset,
  FSXAApi,
  NavigationData,
  PageBody,
  PageBodyContent,
} from "fsxa-api";
import { FSXAAppState, FSXAAppError } from "./../store";
import { GCAPage } from "fsxa-api/dist/types";

export type AppLocale =
  | string
  | {
      value: string;
      label: string;
    };

export class FSXABaseComponent<Props> extends Component<Props> {
  /**
   * Check wether devMode is active
   */
  isDevMode: boolean;
  /**
   * Check if this app is delivering preview or released data
   */
  get isEditMode(): boolean;
  /**
   * the current locale the content is displayed in
   */
  get locale(): string;

  /**
   * The content of your globally configured GCAPage "global_settings"
   */
  get settings(): GCAPage | null;

  /**
   * get preconfigured and ready to use FSXAApi instance
   */
  get fsxaApi(): FSXAApi;

  /**
   * the current navigation data state
   */
  get navigationData(): NavigationData | null;
  /**
   * This method will trigger a route change request
   *
   * You can pass in a pageId or seoRoute
   *
   * If a corresponding page is found the route change will be triggered
   *
   * Make sure that you always provide some kind of fallback since this route change will only be available when javascript is enabled
   */
  handleRouteChangeRequest: (params: RequestRouteChangeParams) => void;

  /**
   * This method will return the mapped url for the given input parameters
   *
   * If no matching url could be found *null* is returned.
   */
  getUrlByReferenceIdAndType: (
    referenceId: string,
    referenceType: string,
  ) => string | null;

  /**
   * FirstSpirit will create special formats for link templates in the richtext-text
   *
   * You can pass in the richtext received from the api to create working application links
   *
   * An optional handler can be provided to override or extend the link template generation
   */
  createLinksInRichText: (
    /**
     * the richtext received through the api
     */
    text: string,
    /**
     * optional handler to override / extend link template generation
     */
    handleLinkData?: (
      type: string,
      data: Record<string, string>,
    ) => {
      /**
       * set this flag to true if this is an internal link
       */
      isInternalLink: boolean;
      linkAttributes: Record<string, any>;
    } | null,
  ) => string;
  /**
   * Access your stored data in the vuex store
   * @param key key of the stored item
   */
  getStoredItem<Type = any>(key: string): Type | null;
  /**
   * Save your data in the vuex-store
   *
   * You can use this to store your data from 3rd party services that was fetched in the Server Side Rendering process to access it later on on the client
   * @param key key of the stored item
   * @param data data that should be stored
   */
  setStoredItem<Type = any>(key: string, data: Type): void;
}

export interface BaseSectionProps<Payload> {
  payload: Payload;
  content: JSX.Element[];
  id?: string;
}
export class FSXABaseSection<Payload> extends FSXABaseComponent<
  BaseSectionProps<Payload>
> {
  id?: string;
  content: JSX.Element[];
  /**
   * This payload is automatically injected into your section and contains the mapped data from the CaaS
   */
  payload: Payload;

  /**
   * Hook child components into automatic render cycle
   */
  renderChildSection: (child: Section | Dataset) => JSX.Element;
}

export interface BaseLayoutProps<Data = {}, Meta = {}> {
  /**
   * id of the page
   */
  pageId: string;
  /**
   * The content elements of the layout
   */
  content: PageBody[];
  /**
   * data that is relevant for your page and layout
   */
  data: Data;
  /**
   * Meta data that is relevant for your page and layout
   */
  meta: Meta;
}
export class FSXABaseLayout<Data = {}, Meta = {}> extends FSXABaseComponent<
  BaseLayoutProps<Data, Meta>
> {
  /**
   * The id of the page
   */
  pageId: string;
  /**
   * Your content can be seperated into multiple sections that contain your sections created in FirstSpirit
   */
  content: PageBody[];
  /**
   * Data that is relevant for your page and layout
   */
  data: Data;
  /**
   * Meta data that is relevant for your page and layout
   */
  meta: Meta;
  /**
   * By calling this method your content section will be automatically rendered
   *
   * This includes that sections will be automatically be mapped and rendered via your sections - configuration
   * @param content a single content element that contains your added sections
   */
  renderContentElement(content: PageBodyContent): JSX.Element;
  /**
   * By calling this method all your content sections will be automatically rendered
   *
   * This includes that sections will be automatically be mapped and rendered via your sections - configuration
   * @param content a single content element that contains your added sections
   */
  renderContentElements(index: number): JSX.Element[];
}

export class FSXABaseAppLayout<Props = {}> extends FSXABaseComponent<
  RenderLayoutParams & Props
> {
  appState: RenderLayoutParams["appState"];
  appError: RenderLayoutParams["appError"];
  content: RenderLayoutParams["content"];
  locales: RenderLayoutParams["locales"];
  handleLocaleChange: RenderLayoutParams["handleLocaleChange"];
}

export class FSXABaseNavigation<Props = {}> extends FSXABaseComponent<
  RenderNavigationHookParams & Props
> {
  activePageId: RenderNavigationHookParams["activePageId"];
  activeSeoRoute: RenderNavigationHookParams["activeSeoRoute"];
  handleLocaleChange: RenderNavigationHookParams["handleLocaleChange"];
  locales: RenderNavigationHookParams["locales"];
}

export interface PageProps {
  /**
   * You can specify the id of the page that should be displayed
   *
   * **Attention**: You either have to specify the id or the path
   */
  id?: string;
  /**
   * You can specify the path of the page that should be displayed
   *
   * **Attention**: You either have to specify the id or the path
   */
  currentPath?: string;
  /**
   * The default locale in which the application should be displayed in
   */
  defaultLocale: string;
  /**
   * All available locales the application can be displayed in
   */
  locales?: AppLocale[];
  /**
   * You can render your own navigation through this callback and access useful information through the params attribute
   */
  renderNavigation?: RenderNavigationHook;
  /**
   * You can render your own navigation by passing your own Component that is extending the FSXABaseNavigation-Component.
   *
   * Useful information will be available through the properties of the FSXABaseNavigation.
   */
  navigationComponent?: typeof FSXABaseNavigation;
  /**
   * You can replace the whole application layout through this render prop. Useful information will be injected through the params attribute
   *
   * Make sure that your AppLayout-Component extends the FSXABaseComponent to access all the cool helpers we are providing for you
   */
  renderLayout?: (params: RenderLayoutParams) => JSX.Element | null;
  /**
   * You can replace the whole application layout by passing in your Component, that is extending the FSXABaseAppLayout-Component.
   *
   * Useful information will be available through the properties of the FSXABaseAppLayout.
   */
  appLayoutComponent?: typeof FSXABaseAppLayout;
  /**
   * You can replace the loading animation that will be displayed during page transitions
   *
   * If you do not want some kind of animation just return **null**
   */
  renderLoader?: () => JSX.Element | null;
  /**
   * Required callback that will be triggered, when the route should be changed
   *
   * Info: We do not know in which context you are using our pattern-library, so we decided that you should have the last word about routing.
   * You can use your own routing technology but can be sure that our library will do the heavy lifting for you.
   */
  handleRouteChange: (nextRoute: string) => void;
  /**
   * You can pass in your own sections configuration
   *
   * **Hint**: You are able to overwrite existing sections as well by providing your own component for the already used section
   *
   * Last one wins
   */
  sections?: {
    [key: string]: any;
  };
  /**
   * You can pass in your own layout configuration
   *
   * **Hint**: You are able to overwrite existing layouts as well by providing your own component for the already used section
   *
   * Last one wins
   */
  layouts?: {
    [key: string]: any;
  };
  /**
   * When activated, you will be shown useful information with which you can started developing your beautiful ui.
   *
   * We want to make the entry into frontend development with FirstSpirit as easy as possible. That's why we developed the DevMode.
   *
   * Basically, new content types (whether layouts or paragraphs) that cannot be assigned by the pattern library are skipped. This means that a paragraph that does not have a frontend component as a counterpart is simply not rendered.
   *
   * Thus, errors that could arise in this way are categorically excluded.
   *
   * Furthermore, each layout and paragraph is automatically wrapped with an ErrorBoundary. This prevents an error in a particular paragraph type from breaking the entire page.
   *
   * However, this feature brings other problems, because a frontend developer now lacks important information in the event of an error and it would be helpful to know the payload and key of a new content type as well.
   *
   * DevMode to the rescue!
   */
  devMode?: boolean;
}
export class FSXAPage extends FSXABaseComponent<PageProps> {}

export interface RenderNavigationHookParams {
  /**
   * Current set locale for the app
   */
  locale: string;
  /**
   * all configured and available locales
   */
  locales: AppLocale[];
  /**
   * Callback that can be triggered, to change the currently displayed locale
   */
  handleLocaleChange: (locale: string) => void;
  /**
   * The id of the currently active page
   */
  activePageId: string | null;
  /**
   * The seoRoute of the currently active page
   */
  activeSeoRoute: string;
}
export type RenderNavigationHook = (
  params: RenderNavigationHookParams,
) => JSX.Element;

export interface RequestRouteChangeParams {
  /**
   * The pageId the pattern-library should route to
   */
  pageId?: string;
  /**
   * the route the pattern-library should route to
   */
  route?: string;
}
export interface RenderLayoutParams {
  /**
   * The appState is telling you in which phase your app is
   *
   * Possible values are: *not_initialized*, *initializing*, *ready*, *fetching*, *fetching_error*, *error*
   *
   * Make sure that you render your layout corresponding to the appState
   *
   * **not_initialized**: The app should not be displayed since no navigation-data, global-settings and page is fetched yet. If you are using SSR this will be only available on the SSR. So you do not need to display anything at all.
   *
   * **initializing**: The pattern-library is fetching the navigation-data and global-settings. If you are using SSR this will be only available on the SSR. So you do not need to display anything at all.
   *
   * **error**: The pattern-library failed initializing itself. This can happen if your FirstSpirit is not containing a global settings page (see error message for details) or the navigation-service is not available. No content can be displayed since the initialization failed.
   *
   * **fetching**: The current page is fetched. You are able to display the navigation since the pattern-library is initialized. You could display a loader for your content section. This state will be visible on the client side after a route change request.
   *
   * **fetching_error**: Your requested page could not be loaded. This is happening if the CaaS is not available, you passed the wrong configuration or the user is trying to access a non-existent route. You should display a 404 or error component.
   */
  appState: FSXAAppState;
  /**
   * It is possible that the pattern-library will run into an error it could not recover from
   *
   * Make sure to display or log the error and fix it, when it occurs
   */
  appError: FSXAAppError | null;
  /**
   * This is the content that will be displayed inside of your AppLayout
   *
   * This already contains the automatically mapped layouts and sections so make sure that you embed it
   */
  content: JSX.Element | null;
  /**
   * The current locale the app is displayed in
   */
  locale: string;
  /**
   * All available locales the app can be displayed in. You can use this information to render your own language-switch inside your AppLayout.
   */
  locales: AppLocale[];
  /**
   * Callback that can be triggered with the new locale to switch to a new locale.
   *
   * **Info**: This will trigger a reinitialization of the pattern-library. It will fetch the new navigation-data and content and afterwards redirect to the current page in the new language.
   */
  handleLocaleChange: (locale: string) => void;
}

export type RenderLayoutHook<Settings = any> = (params: {
  /**
   * The stored navigation-data
   */
  navigationData: NavigationData;
  /**
   * The id of the currently displayed page
   *
   * You can use this to render your active navigation-items
   */
  currentPageId: string;
  /**
   * The route of the currently displayed page
   *
   * You can use this to render your active navigation-items
   */
  currentPageRoute: string;
  /**
   * the global settings that are provided by your FirstSpirit-Project
   */
  settings: Settings;
}) => JSX.Element;
