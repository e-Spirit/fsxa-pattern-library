<template>
  <div class="bg-blue-400 p-10"><slot /></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "VueAppLayout",
})
class AppLayout extends Vue {}
export default AppLayout;
</script>
