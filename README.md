# FSXA-Pattern-library
The FSXA-Pattern-library manages the connection of the FSXA JavaScript Frontend
to the "outside world", meaning it handles the data coming from the FirstSpirit
[CaaS](https://docs.e-spirit.com/module/caas/CaaS_Product_Documentation_EN.html)
(via the [FSXA-API](https://github.com/e-Spirit/fsxa-api)) and the NavigationService.

### About the FSXA
The FirstSpirit Experience Accelerator (FSXA) is the hybrid solution of a digital
experience platform, combining a headless approach with enterprise capabilities.
If you are interested in the FSXA check this
[Overview](https://docs.e-spirit.com/module/fsxa/overview/benefits-hybrid/index.html). You can order
a demo [online](https://www.e-spirit.com/us/specialpages/forms/on-demand-demo/).

## Getting Started

This guide describes how to add the FSXA-Pattern-Library to your Vue.js or Nuxt.js project.

### Vue.js

Requirements:
- [Vue.js](https://vuejs.org/) version 2.6.12 or [Nuxt.js](https://nuxtjs.org/) version 2.14.12
- [Vuex](https://vuex.vuejs.org/) version 3.4.0

To use the FSXA-Pattern-Library in your Vue.js project, you must first install it.
You do this by entering the following command in your project in your console: `npm install fsxa-pattern-library`.

After it is installed, go to the `main.ts` file and import the styling there:
`import "fsxa-pattern-library/dist/fsxa-pattern-library.css";`

Before you can use the FSXA-Pattern-Library, the Vuex store must be filled.
This is done by creating the store in `store/index.ts` and then importing and using it in `main.ts`.

The basic structure of Vuex is as follows:

```typescript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});
```

To be able to work reasonably with TypeScript, an interface is added.

For this purpose the `FSXAVuexState` is imported:
<br />
`import { FSXAVuexState } from "fsxa-pattern-library";`

and the interface written:
```typescript
interface RootState {
    fsxa: FSXAVuexState
}
```

Afterwards the `state` can be typed

`state: {} as RootState`

Next, the FSXA-Pattern-Library is included as a module.

The mode should be set to `proxy`.
Theoretically, the mode `remote` is also possible. However, this is not recommended, since the API keys are visible in the client's browser.


```typescript
import Vue from "vue";
import Vuex from "vuex";
import { getFSXAModule, FSXAVuexState } from "fsxa-pattern-library";
import { FSXAContentMode } from "fsxa-api";

Vue.use(Vuex);

interface RootState {
    fsxa: FSXAVuexState;
}

export default new Vuex.Store({
  state: {} as RootState,
  mutations: {},
  actions: {},
  modules: {
    fsxa: {
      ...getFSXAModule(FSXAContentMode.PREVIEW, {
        mode: "proxy",
        baseUrl: {
            client: 'http://localhost:3001/api',
            server: 'http://localhost:3001/api'
        }
      })
    }
  }
});
```
In the App component, usually the `App.vue`, you import the `FSXAApp` component from the `fsxa-pattern-library` and register it:

```vue
<script>
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { FSXAApp } from "fsxa-pattern-library";

@Component({
  name: "VueFSXAApp",
  components: {
    "fsxa-app": FSXAApp
  }
})
export default class App extends Vue {}
</script>
```

Next, the FSXAApp can be used in the template, passing different parameters there:


| **Parameter**  | **Explanation**  |
|---|---|
| defaultLocale  |  Provide the locale your content should be displayed in, if no initial path is passed |
| devMode  | When activated, you will be shown useful information with which you can start developing your ui.  |
| useErrorBoundaryWrapper  | For new projects set to false is recommended. When set to true, adds a div around error boundary. |
| handleRouteChange  | Required callback that will be triggered, when the route should be changed  |
| currentPath  | You can specify the path of the page that should be displayed  |
| components  |  Mapping of the FirstSpirit components |

This is what the component looks like:

```vue
<template>
  <fsxa-app
      defaultLocale="de_DE"
      devMode="true"
      useErrorBoundaryWrapper="false"
      :handleRouteChange="changeRoute"
      :currentPath="route"
      :components="components"
  />
</template>

<script>
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { FSXAApp } from "fsxa-pattern-library";

@Component({
  name: "VueFSXAApp",
  components: {
    "fsxa-app": FSXAApp
  }
})
export default class App extends Vue {
  route = location.pathname;

  onRouteChange() {
    this.route = location.pathname;
  }

  changeRoute(route) {
    history.pushState(null, "Title", route);
    this.route = route;
  }

  get components() {
    return {};
  }
}
</script>
```

### Nuxt.js

To use the FSXA-Pattern-Library in a Nuxt project, the [FSXA-Nuxt-Module](https://github.com/e-Spirit/fsxa-nuxt-module) has to be installed with:
`npm install fsxa-nuxt-module`.

In the `nuxt.config.ts` file this module must be included.
```typescript
buildModules: [
    'fsxa-nuxt-module',
  ],
```

In addition, the CSS of the FSXA-Pattern-Library must be included in the `nuxt.config.ts` file:
```typescript
css: ['fsxa-pattern-library/dist/fsxa-pattern-library.css']
```

After that, the `.env` file must be created in the root of the project and the environment variables must be set there:
```dotenv
# APIKey used for authentication against the CaaS
FSXA_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# URL pointing to your CaaS Instance
FSXA_CAAS=https://url-to.your.caas
# ID of your project
FSXA_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# URL pointing to the NavigationService
FSXA_NAVIGATION_SERVICE=https://your.navigation-service.cloud/navigation
# Which mode should be used? (preview/release)
FSXA_MODE=preview
# KEY:VALUE map where semicolon is used as separator (key:uuid;key:uuid)
FSXA_REMOTES=en_EN
# This tenantId is required, when using caas-connect module 3.0.9 and above
FSXA_TENANT_ID=xxxxxxxxxxxxxxx
```

Next, the `fsxa.config.ts` must be created:
```typescript
export default {
  devMode: false,
  defaultLocale: 'de_DE'
}
```

In this file multiple settings can be specified
- devMode: boolean if the development mode is active or not
- useErrorBoundaryWrapper: boolean if the extra div is added or not
- defaultLocale: provided default language i.e. `'en_EN'`
- customRoutes: path to folder to define your own api
- component: object to define the paths to your components

To ensure that the components are all loaded without errors, you can either specify the paths to the components in the component object like this:

Example:
```typescript
components: {
    sections: '~/components/my-sections',
    layouts: '~/components/fsxa/src/fsxa-layouts',
    richtext: '~/components/src/richtext',
  },
```

Or you can follow the naming convention and create the appropriate folder structure.

If you specify the `layout`, `section` and `richtest` directory you can place and name the folders anywhere you like as long as the actual path is matching the path that is written in the component object.

The structure should look like this:

```
|-- components
|       |-- fsxa
|             |-- layouts
|             |-- richtext
|             |-- section
```


When the `devMode` is enabled. You will see information boxes at the address the server is running on.
There is described which component you have to implement and which information you will be getting.
For more information you will soon be able to visit our getting started guide of our [FSXA-PWA](https://github.com/e-Spirit/fsxa-pwa) project for more information.

A complete `fsxa.config.ts` file can look like this:

```typescript
export default {
  devMode: false,
  defaultLocale: 'de_DE',
  components: {
    sections: '~/components/fsxa/sections',
    layouts: '~/components/fsxa/layouts',
    richtext: '~/components/fsxa/richtext',
    appLayout: '~/components/fsxa/AppLayout',
    loader: '~/components/fsxa/Loader'
  },
  customRoutes: '~/customRoutes',
}
```

Finally, the Vuex store must be filled.
For this purpose, a file named `index.ts` must be created in the `store` folder.
There the function `nuxtServerInit` is called at server start and among other things the configuration, navigation data and project settings are loaded into the Vuex store.

```typescript
import { ActionTree } from 'vuex'
import { RootState, FSXAActions } from 'fsxa-pattern-library'

export interface State extends RootState {}
export const actions: ActionTree<State, State> = {
  nuxtServerInit(_, { store }) {
    this.dispatch(FSXAActions.hydrateClient, store.state.fsxa)
  },
}
```

To get started with the development of the individual components, we recommend following the [Getting-Started Guide](https://github.com/e-Spirit/fsxa-pwa#getting-started) of the FSXA-PWA.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Testing

Test files are co-located, meaning they are placed next to the unit they are primarily testing.
When running `npm run test:unit` all files ending with `*.spec.ts(x)` in the `src` folder are considered for the test
run. You may override this behavior by altering the `jest.config.js` in the repository root.
The library `@testing-library/vue` is used as an opinionated testing framework, adhering to its primary principle
> The more your tests resemble the way your software is used, the more confidence they can give you.

This framework is a thin wrapper around the default testing capabilities of the `@vue/test-utils`.
Refer to the [testing library documentation](https://testing-library.com/docs/vue-testing-library/intro) for more information.

## Legal Notices
FSXA-Pattern-library is a product of [e-Spirit AG](http://www.e-spirit.com), Dortmund, Germany.
The FSXA-Pattern-library is subject to the Apache-2.0 license.

## Disclaimer
This document is provided for information purposes only.
e-Spirit may change the contents hereof without notice.
This document is not warranted to be error-free, nor subject to any
other warranties or conditions, whether expressed orally or
implied in law, including implied warranties and conditions of
merchantability or fitness for a particular purpose. e-Spirit
specifically disclaims any liability with respect to this document
and no contractual obligations are formed either directly or
indirectly by this document. The technologies, functionality, services,
and processes described herein are subject to change without notice.
