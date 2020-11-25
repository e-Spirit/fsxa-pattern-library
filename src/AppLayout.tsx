import { Component } from "vue-property-decorator";
import BaseComponent from "./components/BaseComponent";

@Component({
  name: "TsxAppLayout",
})
class AppLayout extends BaseComponent<{}> {
  render() {
    return <div class="bg-green-400 p-10">{this.$slots.default}</div>;
  }
}
export default AppLayout;
