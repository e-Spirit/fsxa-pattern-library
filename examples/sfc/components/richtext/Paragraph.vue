<template
  ><p>
    <render-content /></p
></template>

<script lang="ts">
import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({
  name: "Paragraph",
})
class Paragraph extends FSXABaseRichTextElement {}
export default Paragraph;
</script>
