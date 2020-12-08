<template>
  <fsxa-app
    defaultLocale="de_DE"
    devMode="true"
    :handleRouteChange="changeRoute"
    :currentPath="route"
    :components="components"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AppLayout from "./components/AppLayout.vue";
import StandardLayout from "./components/layouts/StandardLayout.vue";
import { FSXAApp } from "fsxa-pattern-library";
import ProductDetailSection from "./components/sections/ProductDetailSection.vue";
import ProductListSection from "./components/sections/ProductListSection.vue";
import ProductOverview from "./components/sections/ProductOverview.vue";

@Component({
  name: "VueFSXAApp",
  components: {
    "fsxa-app": FSXAApp,
  },
})
class App extends Vue {
  route = location.pathname;

  mounted() {
    window.addEventListener("popstate", this.onRouteChange);
    window.addEventListener("pushstate", this.onRouteChange);
  }

  beforeDestroy() {
    window.removeEventListener("popstate", this.onRouteChange);
    window.removeEventListener("pushstate", this.onRouteChange);
  }

  onRouteChange() {
    this.route = location.pathname;
  }

  changeRoute(route: string) {
    history.pushState(null, "Title", route);
    this.route = route;
  }

  get components() {
    return {
      appLayout: AppLayout,
      layouts: {
        standard: StandardLayout,
      },
      sections: {
        "products.product": ProductDetailSection,
        "products.category_products": ProductListSection,
        product_overview: ProductOverview,
      },
    };
  }
}
export default App;
</script>
