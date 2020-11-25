import { Component, Prop, Inject } from "vue-property-decorator";
import Layouts from "./components";
import { FSXA_INJECT_KEY_LAYOUTS } from "@/constants";
import { DevInfo, Code } from "fsxa-ui";
import ErrorBoundary from "../ErrorBoundary";
import BaseComponent from "../BaseComponent";
import { PageBody } from "fsxa-api";

const getProgrammingHint = (type: string) => {
  return `<FSXAPage layouts={{ ${type}: Your_Layout_Component }} />`;
};

const getDevModeContent = (key: string, code: string) => {
  return `// ${key}
${code}`;
};

export interface LayoutProps {
  pageId: string;
  type: string;
  content: PageBody[];
  data: any;
  meta: any;
}
@Component({
  name: "Layout",
})
class Layout extends BaseComponent<LayoutProps> {
  @Inject({ from: FSXA_INJECT_KEY_LAYOUTS, default: {} }) layouts!: {};
  @Prop({ required: true })
  data!: LayoutProps["data"];
  @Prop({ required: true }) type!: LayoutProps["type"];
  @Prop({ required: true }) content!: LayoutProps["content"];
  @Prop({ required: true })
  meta!: LayoutProps["meta"];
  @Prop({ required: true }) pageId!: LayoutProps["pageId"];

  get mappedLayouts(): { [key: string]: any } {
    return {
      ...Layouts,
      ...(this.layouts || {}),
    };
  }

  renderDevInfo() {
    return (
      <div>
        The following Data, Meta and Content will be passed to it:
        <Code
          code={getDevModeContent(
            "data",
            JSON.stringify(this.data, undefined, 2),
          )}
          language="json"
        />
        <Code
          code={getDevModeContent(
            "meta",
            JSON.stringify(this.meta, undefined, 2),
          )}
          language="json"
        />
        <Code
          code={getDevModeContent(
            "content",
            JSON.stringify(this.content, undefined, 2),
          )}
          language="json"
        />
      </div>
    );
  }

  render() {
    const LayoutComponent = this.mappedLayouts[this.type];
    if (!LayoutComponent) {
      if (this.isDevMode) {
        console.log(`Could not find layout for given key: ${this.type}`);
        return (
          <DevInfo
            headline={`Could not find registered Layout: ${this.type}`}
            isOverlay={false}
            devModeHint="This information is only visible if DevMode is active"
          >
            You can easily register new Layouts by providing a key-Component map
            to your FSXAPage
            <Code code={getProgrammingHint(this.type)} language="typescript" />
            <br />
            {this.renderDevInfo()}
          </DevInfo>
        );
      }
      return null;
    }
    return (
      <ErrorBoundary
        title={`Error rendering Layout: ${Layout && Layout.name}`}
        additionalInfo={this.renderDevInfo()}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <LayoutComponent
            content={this.content}
            data={this.data}
            meta={this.meta}
            pageId={this.pageId}
          />
          {this.isDevMode && (
            <DevInfo
              headline={`Layout: ${this.type}`}
              isOverlay
              devModeHint="This information is only visible if DevMode is active"
            >
              {this.renderDevInfo()}
            </DevInfo>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}
export default Layout;
