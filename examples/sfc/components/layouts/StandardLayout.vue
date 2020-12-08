<template>
  <div>
    <slot name="content" />
  </div>
</template>

<script lang="ts">
import { FSXABaseLayout } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({ name: "StandardLayout" })
class StandardLayout extends FSXABaseLayout {}
export default StandardLayout;
</script>
