<template>
  <fsxa-app
    defaultLocale="de_DE"
    devMode="true"
    :handleRouteChange="changeRoute"
    :currentPath="route"
    :components="components"
    globalSettingsKey="global_settings"
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
import QuoteSection from "./components/sections/QuoteSection.vue";
import Paragraph from "./components/richtext/Paragraph.vue";
import Text from "./components/richtext/Text.vue";
import List from "./components/richtext/List.vue";
import ListItem from "./components/richtext/ListItem.vue";

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
        text: QuoteSection,
        teaser: QuoteSection,
      },
      richtext: {
        paragraph: Paragraph,
        text: Text,
        list: List,
        listitem: ListItem,
      },
    };
  }
}
export default App;
</script>
