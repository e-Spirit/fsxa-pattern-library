import { BaseAppLayoutProps } from "@/types/components";
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "./BaseComponent";

@Component({
  name: "BaseAppLayout",
})
class BaseAppLayout extends BaseComponent<BaseAppLayoutProps> {
  /**
   * The appState is telling you in which phase your app is
   *
   * Possible values are: *not_initialized*, *initializing*, *ready*, *error*
   *
   * Make sure that you render your layout corresponding to the appState
   *
   * **not_initialized**: The app should not be displayed since no navigation-data, global-settings and page is fetched yet. If you are using SSR this will be only available on the SSR. So you do not need to display anything at all.
   *
   * **initializing**: The pattern-library is fetching the navigation-data and global-settings. If you are using SSR this will be only available on the SSR. So you do not need to display anything at all.
   *
   * **error**: The pattern-library failed initializing itself. This can happen if the navigation-service is not available. The default slot will be always empty since the initialization failed.
   */
  @Prop({ required: true }) appState!: BaseAppLayoutProps["appState"];
  /**
   * It is possible that the pattern-library will run into an error it could not recover from
   *
   * Make sure to display or log the error and fix it, when it occurs
   */
  @Prop({ required: true }) appError!: BaseAppLayoutProps["appError"];

  render() {
    return <div>Please provide your own render method in your AppLayout.</div>;
  }
}
export default BaseAppLayout;
