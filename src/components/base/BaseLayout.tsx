import { Component, Prop } from "vue-property-decorator";
import { BaseLayoutProps, RenderingOptions } from "@/types/components";
import RenderUtils from "./RenderUtils";

/**
 * The FSXABaseLayout can be used to extend from
 *
 * It will already declare all properties that are passed to your custom Layout.
 *
 * Generics for Data and Meta are provided, so that you will have enhanced TypeScript support inside of your own component.
 */
@Component({
  name: "FSXABaseLayout",
})
class BaseLayout<
  Data = {},
  Meta = {},
  EventsWithOn = {},
  Slots = {}
> extends RenderUtils<BaseLayoutProps<Data, Meta>, EventsWithOn, Slots> {
  /**
   * the id of the page that was requested
   */
  @Prop({ required: true })
  pageId!: BaseLayoutProps<Data, Meta>["pageId"];
  /**
   * data that is relevant for your page and layout
   */
  @Prop({ required: true })
  data!: BaseLayoutProps<Data, Meta>["data"];
  /**
   * Meta data that is relevant for your page and layout
   */
  @Prop({ required: true }) meta!: BaseLayoutProps<Data, Meta>["meta"];

  /**
   * The prerendered sections are injected as slots into the component. You can access the slot directly through `this.$scopedSlots.contentName`
   * or by calling this method and passing in the name of the content section
   * @param name string
   * @param renderingOptions RenderingOptions
   */
  renderContentByName(name: string, renderingOptions: RenderingOptions = {}) {
    const contentRenderer = (this.$scopedSlots as any)[name];
    return contentRenderer ? contentRenderer(renderingOptions) : null;
  }

  render() {
    return <div>Please provide your own render method in your Layout.</div>;
  }
}
export default BaseLayout;
