<template>
  <div class="container mx-auto py-10">
    <span class="inline-block">{{ payload.tt_abstract }}</span>
  </div>
</template>

<script lang="ts">
import { FSXABaseSection } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({ name: "ProductDetailSection" })
class ProductDetailSection extends FSXABaseSection {
  handleLocaleChange(event: MouseEvent) {
    event.preventDefault();
    this.triggerRouteChange({
      locale: this.locale === "de_DE" ? "en_GB" : "de_DE",
    });
  }
}
export default ProductDetailSection;
</script>
