import { BaseSectionProps } from "@/types/components";
import { Prop } from "vue-property-decorator";
import BaseComponent from "./BaseComponent";

class BaseSection<
  Payload = any,
  EventsWithOn = {},
  Slots = {
    content?: {};
  }
> extends BaseComponent<BaseSectionProps<Payload>, EventsWithOn, Slots> {
  /**
   * The payload that is passed to the section
   */
  @Prop({ required: true }) payload!: BaseSectionProps<Payload>["payload"];
  /**
   * The id of the section
   */
  @Prop() id: BaseSectionProps<Payload>["id"];

  render() {
    return <div>Please provide your own render method in your Section.</div>;
  }
}
export default BaseSection;
