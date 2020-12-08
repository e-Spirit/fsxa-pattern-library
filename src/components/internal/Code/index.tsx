import BaseComponent from "@/components/base/BaseComponent";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./style.css";
import Prism from "vue-prism-component";

export interface CodeProps {
  inline?: boolean;
  language: string;
}
@Component({
  name: "Code",
})
class Code extends BaseComponent<CodeProps> {
  @Prop({ default: false }) inline!: CodeProps["inline"];
  @Prop({ required: true }) language!: CodeProps["language"];
  render() {
    return (
      <Prism class="Code" inline={this.inline} language={this.language}>
        {this.$slots.default}
      </Prism>
    );
  }
}
export default Code;
