import "./tailwind.css";
import "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-okaidia.css";

export { default as FSXABaseAppLayout } from "./components/base/BaseAppLayout";
export { default as FSXABaseComponent } from "./components/base/BaseComponent";
export { default as FSXABaseLayout } from "./components/base/BaseLayout";
export { default as FSXABaseSection } from "./components/base/BaseSection";
export { default as FSXABaseRichTextElement } from "./components/base/BaseRichTextElement";
export { default as FSXAApp } from "./components/App";
export { default as FSXADataset } from "./components/Dataset";
export { default as FSXARichText } from "./components/RichText";
export { default as FSXAPage } from "./components/Page";
export { getFSXAModule, FSXAActions, FSXAGetters } from "./store";