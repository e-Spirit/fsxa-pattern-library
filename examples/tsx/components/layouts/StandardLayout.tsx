import Component from "vue-class-component";
import { FSXABaseLayout } from "fsxa-pattern-library";

@Component({
  name: "StandardLayout",
})
class StandardLayout extends FSXABaseLayout {
  render() {
    return (
      <div class="pl-w-full pl-h-full pl-flex pl-flex-col">
        <div class="pl-my-10">{this.renderContentByName("default")}</div>
        <div class="pl-my-10">
          {this.renderContentByName("content", {
            showAddSectionButtonInPreview: true,
          })}
        </div>
      </div>
    );
  }
}
export default StandardLayout;
