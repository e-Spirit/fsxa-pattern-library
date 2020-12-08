import Component from "vue-class-component";
import { FSXABaseSection } from "fsxa-pattern-library";

@Component({
  name: "ProductDetailSection",
})
class ProductDetailSection extends FSXABaseSection {
  render() {
    return (
      <div class="container mx-auto py-10">
        <span class="inline-block">{this.payload.tt_abstract}</span>
      </div>
    );
  }
}
export default ProductDetailSection;
