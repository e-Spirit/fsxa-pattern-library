import { BaseLayoutProps } from "@/types/components";
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "./BaseComponent";

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
> extends BaseComponent<BaseLayoutProps<Data, Meta>, EventsWithOn, Slots> {
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
   */
  renderContentByName(name: string) {
    const contentRenderer = (this.$scopedSlots as any)[name];
    return contentRenderer ? contentRenderer({}) : null;
  }

  render() {
    return <div>Please provide your own render method in your Layout.</div>;
  }
}
export default BaseLayout;
