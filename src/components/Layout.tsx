import { FSXA_INJECT_KEY_LAYOUTS } from "@/constants";
import Component from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
import BaseComponent from "./BaseComponent";

export interface LayoutProps<Data, Meta> {
  data: Data;
  meta: Meta;
  type: string;
}
@Component({
  name: "Layout",
})
class Layout<Data = {}, Meta = {}> extends BaseComponent<
  LayoutProps<Data, Meta>
> {
  @Prop({ required: true }) type!: LayoutProps<Data, Meta>["type"];
  @Inject({ from: FSXA_INJECT_KEY_LAYOUTS }) layouts!: Record<string, any>;

  renderContent() {
    if (this.$slots.default) return this.$slots.default;
  }

  render() {
    const content = this.renderContent();
    if (this.layouts[this.type] != null) {
      const MappedLayout = this.layouts[this.type];
      return <MappedLayout></MappedLayout>;
    }
  }
}
export default Layout;
