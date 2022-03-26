# [6.3.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v6.2.2...v6.3.0) (2022-03-24)


### Features

* **dependencies:** update fsxa-api version ([#52](https://github.com/e-Spirit/fsxa-pattern-library/issues/52)) ([0f12811](https://github.com/e-Spirit/fsxa-pattern-library/commit/0f12811a6bd0a906beab90dc2a427f66c6609b88))

## [6.2.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v6.2.1...v6.2.2) (2022-03-02)


### Bug Fixes

* **fsxa-api:** performance fix for fetch project properties ([#50](https://github.com/e-Spirit/fsxa-pattern-library/issues/50)) ([526b7f6](https://github.com/e-Spirit/fsxa-pattern-library/commit/526b7f67e88cda250f93fd66171551df062f41f4))

## [6.2.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v6.2.0...v6.2.1) (2022-02-22)


### Bug Fixes

* **fsxa-api dependency:** update fsxa-api dependency ([#45](https://github.com/e-Spirit/fsxa-pattern-library/issues/45)) ([24c316a](https://github.com/e-Spirit/fsxa-pattern-library/commit/24c316a552f7c6f4ce91df1d4e35fa2897991848))

# [6.2.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v6.1.0...v6.2.0) (2022-02-15)


### Features

* **change stream:** accessing the FSXA API EventSource ([#32](https://github.com/e-Spirit/fsxa-pattern-library/issues/32)) ([7840e7a](https://github.com/e-Spirit/fsxa-pattern-library/commit/7840e7a37e924a14b6e2c4956fe81049c4b3807d))

# [6.1.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v6.0.1...v6.1.0) (2022-02-11)


### Features

* **fsxa-api:** update fsxa-api for references to sections ([#42](https://github.com/e-Spirit/fsxa-pattern-library/issues/42)) ([9c463c7](https://github.com/e-Spirit/fsxa-pattern-library/commit/9c463c7a67775f8e33328f805477160ed182fe91))

## [6.0.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v6.0.0...v6.0.1) (2022-02-09)


### Bug Fixes

* **initializeApp:** fix handling of path on initital pageload ([#41](https://github.com/e-Spirit/fsxa-pattern-library/issues/41)) ([eef8e26](https://github.com/e-Spirit/fsxa-pattern-library/commit/eef8e26a4f6c2065ab0807962688a19b72c61509))

# [6.0.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v5.1.2...v6.0.0) (2022-02-08)


### Features

* **api-config:** update api and use api singleton ([#40](https://github.com/e-Spirit/fsxa-pattern-library/issues/40)) ([aac69b5](https://github.com/e-Spirit/fsxa-pattern-library/commit/aac69b5836292ef30040e46669d66c66b1c6db49))


### BREAKING CHANGES

* **api-config:** `App.tsx` and `BaseComponent.tsx` return a FSXAApiSingleton instead of new FSXAApi instances with each fsxaApi call.
We also updated the dependency to latest fsxa-api version, introducing new "type" attribute for public interfaces. This may cause your application to break. Details how to handle this can be found in the [Changelog of the fsxa-api](https://github.com/e-Spirit/fsxa-api/blob/master/CHANGELOG.md#breaking-changes).

## [5.1.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v5.1.1...v5.1.2) (2022-01-25)


### Bug Fixes

* **infrastructure:** test navigation initialization ([#35](https://github.com/e-Spirit/fsxa-pattern-library/issues/35)) ([0c77435](https://github.com/e-Spirit/fsxa-pattern-library/commit/0c7743574f93a2eb84463bb40bb0c98f29d5df7c))

## [5.1.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v5.1.0...v5.1.1) (2022-01-14)


### Bug Fixes

* **dependencies:** update fsxa-api ([#33](https://github.com/e-Spirit/fsxa-pattern-library/issues/33)) ([1f08b4e](https://github.com/e-Spirit/fsxa-pattern-library/commit/1f08b4e5176e3ce15400d405f708b8f107121da7))

# [5.1.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v5.0.0...v5.1.0) (2022-01-11)


### Features

* **InEdit:** add properties for InEdit([#26](https://github.com/e-Spirit/fsxa-pattern-library/issues/26)) ([9f4c5a5](https://github.com/e-Spirit/fsxa-pattern-library/commit/9f4c5a5e3e897e23b19d5020a446d1815604e3a3))

# [5.0.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v4.0.2...v5.0.0) (2022-01-11)


### Features

* update usage of fetchByFilter ([#31](https://github.com/e-Spirit/fsxa-pattern-library/issues/31)) ([263b085](https://github.com/e-Spirit/fsxa-pattern-library/commit/263b0856a6a04b77fef62a97be2c8ae0d7a88c93))


### BREAKING CHANGES

* fetchByFilter from fsxa-api now has an extended structure. Please read the fsxa-api/[CHANGELOG.md](https://github.com/e-Spirit/fsxa-api/blob/master/CHANGELOG.md#breaking-change) for more information.

## [4.0.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v4.0.1...v4.0.2) (2021-12-22)

### Bug Fixes

- **tpp-snap:** enable cropping for all resolutions ([#28](https://github.com/e-Spirit/fsxa-pattern-library/issues/28)) ([8f7d52a](https://github.com/e-Spirit/fsxa-pattern-library/commit/8f7d52aadaa552d939da7fee0dab8eb9ed6a08eb))

### Update Notice

The bug fix only works with a TPP_SNAP version >= 2.4.1

## [4.0.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v4.0.0...v4.0.1) (2021-12-21)

### Bug Fixes

- **store:** fix definition of state's mode property ([#29](https://github.com/e-Spirit/fsxa-pattern-library/issues/29)) ([7ff4955](https://github.com/e-Spirit/fsxa-pattern-library/commit/7ff49551ca5d8f5fcaac1f32dca6db1e3c48849f))

# [4.0.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.4.0...v4.0.0) (2021-12-07)

### Features

- add NavigationFilter ([#27](https://github.com/e-Spirit/fsxa-pattern-library/issues/27)) ([38973fd](https://github.com/e-Spirit/fsxa-pattern-library/commit/38973fdbac8ccacccc3e44f521b3d7859ba454df)), closes [#17](https://github.com/e-Spirit/fsxa-pattern-library/issues/17) [#18](https://github.com/e-Spirit/fsxa-pattern-library/issues/18)

### BREAKING CHANGES

- The original fsxa-api class was removed and the new ones FSXAProxyApi and
  FSXARemoteApi are used. Their have a slightly different, but better, method signatures. For
  more information, please read the [migration guide in the CHANGELOG of the FSXA-API](https://github.com/e-Spirit/fsxa-api/blob/master/CHANGELOG.md#migration-guide).

# [3.4.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.3.0...v3.4.0) (2021-11-25)

### Features

- **404 page:** identify and handle not-found ([#19](https://github.com/e-Spirit/fsxa-pattern-library/issues/19)) ([c389f94](https://github.com/e-Spirit/fsxa-pattern-library/commit/c389f9412137a081decd30ee6f0aefb15ffbc430))

# [3.3.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.2.4...v3.3.0) (2021-11-17)

### Features

- **tpp-snap:** provide tpp snap ([#21](https://github.com/e-Spirit/fsxa-pattern-library/issues/21)) ([5a67ea7](https://github.com/e-Spirit/fsxa-pattern-library/commit/5a67ea7f3e26bb889dff053999cbd453a4f49b51))

## [3.2.4](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.2.3...v3.2.4) (2021-08-16)

### Bug Fixes

- update dependencies ([#15](https://github.com/e-Spirit/fsxa-pattern-library/issues/15)) ([61d1610](https://github.com/e-Spirit/fsxa-pattern-library/commit/61d1610d2b9bd6a6bcd176d49a8c12612a75a807))

## [3.2.3](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.2.2...v3.2.3) (2021-07-19)

### Bug Fixes

- **tpp-snap cropping:** provide temporary fix for cropping multiple resolutions ([#13](https://github.com/e-Spirit/fsxa-pattern-library/issues/13)) ([eada971](https://github.com/e-Spirit/fsxa-pattern-library/commit/eada97172e37b705b34fd4f1f43a73b74ef25f94))

## [3.2.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.2.1...v3.2.2) (2021-06-01)

### Bug Fixes

- updated dependencies ([#12](https://github.com/e-Spirit/fsxa-pattern-library/issues/12)) ([8d67100](https://github.com/e-Spirit/fsxa-pattern-library/commit/8d6710044d25671cb738b73154ff4931d7beebd7))
- **section.tsx:** added missing prefix to avoid name clashing for group class ([#10](https://github.com/e-Spirit/fsxa-pattern-library/issues/10)) ([29eb01b](https://github.com/e-Spirit/fsxa-pattern-library/commit/29eb01bee718de7fa82b01b51b53b8970b681e0d))

## [3.2.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.2.0...v3.2.1) (2021-05-12)

### Bug Fixes

- added a timeout when a site is created in ocm ([2fa68c6](https://github.com/e-Spirit/fsxa-pattern-library/commit/2fa68c6c543503ec0f1c69a8456a3459f689454f))

# [3.2.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.1.0...v3.2.0) (2021-03-31)

### Features

- added support for richtext ([099d65d](https://github.com/e-Spirit/fsxa-pattern-library/commit/099d65da502aae69d4a11fca053eabe758a68262))
- **devmodeinfo:** added the possibility to display a custom component to declare missing components ([2c0d452](https://github.com/e-Spirit/fsxa-pattern-library/commit/2c0d452c1522b464d0d5332afc69f069751a60ad))

# [3.1.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v3.0.0...v3.1.0) (2021-03-09)

### Features

- **tpp-snap:** remove the bundled tpp-snap version and dynamically load specified version ([#6](https://github.com/e-Spirit/fsxa-pattern-library/issues/6)) ([8ef20e9](https://github.com/e-Spirit/fsxa-pattern-library/commit/8ef20e96b9ba1390e282a92f6fdcae09c194b6d6))

# [3.0.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.2.3...v3.0.0) (2021-02-26)

### Features

- **fetchprojectproperties:** updated fsxa-api and implemented fetchprojectproperties ([1251218](https://github.com/e-Spirit/fsxa-pattern-library/commit/1251218295108819d19aa5c4e4572a8011d2540a))

### BREAKING CHANGES

- **fetchprojectproperties:** This version only works with CaaSConnect module version 3.3.0 onwards.

## [2.2.3](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.2.2...v2.2.3) (2021-01-26)

### Bug Fixes

- **global settings:** fix error, where globalSettings would be lost after locale change ([a64c080](https://github.com/e-Spirit/fsxa-pattern-library/commit/a64c08076dad30a9dabc0933834f189e12cb492c))

## [2.2.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.2.1...v2.2.2) (2021-01-20)

### Bug Fixes

- **tpp-snap:** move setPreviewElement invocation to Page.tsx ([e3f0bc3](https://github.com/e-Spirit/fsxa-pattern-library/commit/e3f0bc315b8640ab7e36083f1b077ad36f9c07f6))

## [2.2.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.2.0...v2.2.1) (2021-01-14)

### Bug Fixes

- **tailwindcss:** add prefix to tailwindcss ([dc7556a](https://github.com/e-Spirit/fsxa-pattern-library/commit/dc7556a260533473b411a3c470a4e44d0233d5d0))

# [2.2.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.8...v2.2.0) (2021-01-14)

### Features

- **basecomponent:** add currentPage getter to BaseComponent ([918ea88](https://github.com/e-Spirit/fsxa-pattern-library/commit/918ea88a71040b60dedd8bc610eb18b3f62a7f69))

## [2.1.8](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.7...v2.1.8) (2020-12-23)

### Bug Fixes

- **fsxa-api:** fix wrong reference of external fsxa-api dependency ([4ae8cab](https://github.com/e-Spirit/fsxa-pattern-library/commit/4ae8cab55f1c5f0c4b9146973d4d7c58bd47864a))

## [2.1.7](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.6...v2.1.7) (2020-12-23)

### Bug Fixes

- **fsxa-api:** set fsxa-api as external dependency so it is not added to the bundle ([77ec92e](https://github.com/e-Spirit/fsxa-pattern-library/commit/77ec92e9c023de5e4d1b16f14f3f4155120d98f8))

## [2.1.6](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.5...v2.1.6) (2020-12-17)

### Bug Fixes

- **datasets:** fix display of dataset element in dynamic route ([aa20eea](https://github.com/e-Spirit/fsxa-pattern-library/commit/aa20eeac4ee0328b9fc4d33c08782daecfa28ffc))

## [2.1.5](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.4...v2.1.5) (2020-12-17)

### Bug Fixes

- **rendering:** reduced wrapper divs as much as possible and added styling to required ones ([9e5bc78](https://github.com/e-Spirit/fsxa-pattern-library/commit/9e5bc7853a8bce23d2905d2dfefcb08b785128aa))

## [2.1.4](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.3...v2.1.4) (2020-12-15)

### Bug Fixes

- **rendercontentelement:** we readded the renderContentElement method ([8ffebc9](https://github.com/e-Spirit/fsxa-pattern-library/commit/8ffebc915ecac81b8919294b63c92a40cfd43277))

## [2.1.3](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.2...v2.1.3) (2020-12-15)

### Bug Fixes

- **richtext:** switched back to easier syntax for rendering richtext-content ([ed782c0](https://github.com/e-Spirit/fsxa-pattern-library/commit/ed782c091f86d63c865f4e9840ce711a9f7aef52))

## [2.1.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.1...v2.1.2) (2020-12-15)

### Bug Fixes

- **fragments:** we've removed vue-fragment as dependency since this can break SSR ([04ceaf5](https://github.com/e-Spirit/fsxa-pattern-library/commit/04ceaf511c1976123b6ac9c8a90164602e770bd3))

## [2.1.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.0...v2.1.1) (2020-12-14)

### Bug Fixes

- **richtext:** change devMode appearance for RichText-Elements ([12bc7b4](https://github.com/e-Spirit/fsxa-pattern-library/commit/12bc7b4ba980f2b618f57ea8d8a4d02d02cba496))

# [2.1.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.0.0...v2.1.0) (2020-12-14)

### Features

- **richtext:** we upgraded the fsxa-api dependency and switched to the new RichText JSON structure ([e41bb9d](https://github.com/e-Spirit/fsxa-pattern-library/commit/e41bb9d9d89816074237a5f8ce3353b8f50ded04))

# [2.0.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.5.1...v2.0.0) (2020-12-09)

- Feature/refactor (#4) ([d100c6c](https://github.com/e-Spirit/fsxa-pattern-library/commit/d100c6c9d38c64252074c6d69ae32745d0f5ef4b)), closes [#4](https://github.com/e-Spirit/fsxa-pattern-library/issues/4)

### BREAKING CHANGES

- - We removed the default components. Every component must now be mapped in your
    project. (we've fully dropped fsxa-ui as dependency)

* You now have to use the FSXAApp as
  root-wrapper.
* The interface for providing your component map slightly changed. You now can pass
  all of your components through a single property.

## [1.5.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.5.0...v1.5.1) (2020-11-12)

### Bug Fixes

- **misc:** fix multiple errors ([41fccb3](https://github.com/e-Spirit/fsxa-pattern-library/commit/41fccb3ff076243a6fc987225cf9dcf8a46e75b3))

# [1.5.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.4.2...v1.5.0) (2020-10-30)

### Features

- **routing:** added util method to replace FS formatting in richtexts with working links ([#3](https://github.com/e-Spirit/fsxa-pattern-library/issues/3)) ([b68632e](https://github.com/e-Spirit/fsxa-pattern-library/commit/b68632ed5fffaeb31f05999ae2534f431ff8f4e8))

## [1.4.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.4.1...v1.4.2) (2020-10-28)

### Bug Fixes

- **deployment:** fix error where configuration and mode is "forgotten" in deployed pwas ([de08987](https://github.com/e-Spirit/fsxa-pattern-library/commit/de089870917d3bca89c35cb973f6e5de667a5e38))
- **deployment:** use correct content mode instead of api-mode ([d92394d](https://github.com/e-Spirit/fsxa-pattern-library/commit/d92394d52918099e9f1a02affa812229ab2b10aa))
- **typescript:** fix typescript typings and remove unused declarations from imports ([4fd6c43](https://github.com/e-Spirit/fsxa-pattern-library/commit/4fd6c43d071957508e38df15569b4e2fa6216197))

## [1.4.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.4.0...v1.4.1) (2020-10-28)

### Bug Fixes

- **datasets:** fix embedded datasets and add support for dynamic urls ([430e9bc](https://github.com/e-Spirit/fsxa-pattern-library/commit/430e9bcf2f9f28a83f46fed72fdff84c03911295))

# [1.4.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.3.0...v1.4.0) (2020-10-14)

### Features

- **misc:** expose preconfigured fsxaApi through basecomponent and add method to render child comps ([1022faa](https://github.com/e-Spirit/fsxa-pattern-library/commit/1022faafef2bb636487874b1ec73ac77a152fce7))

# [1.3.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.3...v1.3.0) (2020-10-14)

### Features

- **datasets:** add support for datasets ([5fceab3](https://github.com/e-Spirit/fsxa-pattern-library/commit/5fceab362e2b5f9f3ad4d19789844fa715a29294))

## [1.2.3](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.2...v1.2.3) (2020-09-24)

### Bug Fixes

- **i18n:** the page was not showing content on inital load ([17aa294](https://github.com/e-Spirit/fsxa-pattern-library/commit/17aa294e4aed7f6dbe0717196608175c9ae928c7))

## [1.2.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.1...v1.2.2) (2020-09-23)

### Bug Fixes

- **types:** remove wrong import in types ([c19d7d2](https://github.com/e-Spirit/fsxa-pattern-library/commit/c19d7d290324e0920efa3e8d69e966a2563ea903))

## [1.2.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.0...v1.2.1) (2020-09-18)

### Bug Fixes

- **multi-language:** fix error, where locale was not set correctly ([5bcd8c8](https://github.com/e-Spirit/fsxa-pattern-library/commit/5bcd8c8cff1e71130435ef9e46d67081e2155554))

# [1.2.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.1.2...v1.2.0) (2020-09-17)

### Features

- **i18n:** we now support multi-language projects ([50d8c83](https://github.com/e-Spirit/fsxa-pattern-library/commit/50d8c839089fb7f7a925dcfecad0409ebb493b2e))

## [1.1.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.1.1...v1.1.2) (2020-09-08)

### Bug Fixes

- **store:** we introduced new FSXAModuleParams to meet SSR requirements ([c09ad8d](https://github.com/e-Spirit/fsxa-pattern-library/commit/c09ad8d3c97ceb4043a31a0dc0403b57f75574a5))

## [1.1.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.1.0...v1.1.1) (2020-08-25)

### Bug Fixes

- **typescript:** extend FSXABaseComponent instead of Component ([8e72379](https://github.com/e-Spirit/fsxa-pattern-library/commit/8e72379b1c1935fab4c46addc8d1ee219a7ae2d6))

## [1.1.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.0.0...v1.1.0) (2020-08-25)

### Features

- **fsxapage:** extend FSXAPage-Interface to accept components in render-callbacks as well ([5380f1e](https://github.com/e-Spirit/fsxa-pattern-library/commit/5380f1edb21ca67c75a796c4bccd3fb964df128a))
- **fsxapage:** introduce new properties appLayoutComponent and navigationComponent ([968b740](https://github.com/e-Spirit/fsxa-pattern-library/commit/968b74003c0637eda90ea5ef8fdecfedb5fb98ca))

## [1.0.0](https://github.com/e-Spirit/fsxa-pattern-library/releases/tag/v1.0.0) (2020-08-17)

### Bug Fixes

- **introduce new fsxa-api version:** introduce new fsxa-api and refactor code to match new structure ([2fff5f1](https://github.com/e-Spirit/fsxa-pattern-library/commit/2fff5f16d40ce334f61e4c9ce146740169f171e2))

### BREAKING CHANGES

- **introduce new fsxa-api version:** the fsxa-api is now working with the native fetch api, which is not available on
  server side. if you are using the pattern-library make sure that you are polyfilling fetch through
  cross-fetch for example.

---

## 0.1.60

Breaking Changes:

- removed all CSS styling from project. This means that you do not have to import the `fsxa-pattern-library.css` into your project.
- fsxa-ui was transformed to a peer dependency. You have to install it yourself.

## 0.1.59

Breaking Changes:

- removed FSXAConfigProvider. All its properties can now directly be passed to the FSXAPage
