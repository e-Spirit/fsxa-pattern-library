import Component from "vue-class-component";
import { FSXABaseLayout } from "fsxa-pattern-library";

@Component({
  name: "StandardLayout",
})
class StandardLayout extends FSXABaseLayout {
  render() {
    return (
      <div>
        {this.renderContentByName("default")}
        {this.renderContentByName("content")}
      </div>
    );
  }
}
export default StandardLayout;
