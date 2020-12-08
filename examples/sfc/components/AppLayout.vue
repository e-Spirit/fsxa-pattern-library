<template>
  <div>
    <div class="bg-gray-200">
      <div
        class="w-full flex items-center justify-center px-4 md:px-6 lg:px-10 py-3"
        v-if="navigationData"
      >
        <div class="flex-shrink-0 font-bold">SFC App</div>
        <div class="flex-1 text-right">
          <ul class="inline-block">
            <li
              class="inline-block px-2 text-sm"
              v-for="item in navigationData.structure"
              :key="item.id"
            >
              <a
                class="hover:underline"
                :href="navigationData.idMap[item.id].seoRoute"
                @click.prevent="
                  triggerRouteChange({
                    pageId: item.id,
                  })
                "
              >
                {{ navigationData.idMap[item.id].label }}</a
              >
            </li>
          </ul>
        </div>
        <div class="flex-shrink-0 ml-3 text-xs space-x-2">
          <a
            href="#"
            :class="[
              isActiveLocale('en_GB') ? 'underline' : '',
              'inline-block',
            ]"
            @click.prevent="
              triggerRouteChange({
                locale: 'en_GB',
              })
            "
          >
            en_GB
          </a>
          <a
            href="#"
            :class="[
              isActiveLocale('de_DE') ? 'underline' : '',
              'inline-block',
            ]"
            @click.prevent="
              triggerRouteChange({
                locale: 'de_DE',
              })
            "
          >
            de_DE
          </a>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { FSXABaseAppLayout } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({
  name: "VueAppLayout",
})
class AppLayout extends FSXABaseAppLayout {
  isActiveLocale(locale: string) {
    return this.locale === locale;
  }
}
export default AppLayout;
</script>
