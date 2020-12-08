<template>
  <div>Product-List Section<slot name="content" /></div>
</template>

<script lang="ts">
import { FSXABaseSection } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({ name: "ProductListSection" })
class ProductListSection extends FSXABaseSection {}
export default ProductListSection;
</script>
