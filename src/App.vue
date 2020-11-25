<template>
  <fsxa-app
    defaultLocale="de_DE"
    devMode="true"
    :handleRouteChange="handleRouteChange"
    :currentPath="route"
    :components="components"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AppLayout from "./AppLayout.vue";
import FSXAApp from "./components/App";

Vue.component("app-layout", AppLayout);

@Component({
  name: "VueFSXAApp",
  components: {
    "fsxa-app": FSXAApp,
    layout: AppLayout,
  },
})
class App extends Vue {
  route = location.pathname;

  get components() {
    return {
      appLayout: AppLayout,
    };
  }

  handleRouteChange() {
    console.log("Route changed");
  }
}
export default App;
</script>
