import { PageBody, PageBodyContent } from "fsxa-api";
import Component from "vue-class-component";
import { Inject, InjectReactive, Prop } from "vue-property-decorator";

import {
  FSXA_INJECT_KEY_COMPONENTS,
  FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
} from "@/constants";

import ErrorBoundary from "./internal/ErrorBoundary";
import Code from "./internal/Code";
import InfoBox from "./internal/InfoBox";
import TabbedContent from "./internal/TabbedContent";
import RenderUtils from "./base/RenderUtils";
import { AppComponents } from "@/types/components";
import InfoToolTip from "./internal/InfoToolTip";

export interface LayoutProps<Data, Meta> {
  pageId: string;
  previewId: string;
  data: Data;
  meta: Meta;
  content: PageBody[];
  type: string;
}
@Component({
  name: "Layout",
})
class Layout<Data = {}, Meta = {}> extends RenderUtils<
  LayoutProps<Data, Meta>
> {
  @Prop({ required: true }) pageId!: LayoutProps<Data, Meta>["pageId"];
  @Prop({ required: true }) previewId!: LayoutProps<Data, Meta>["previewId"];
  @Prop({ required: true }) content!: LayoutProps<Data, Meta>["content"];
  @Prop({ required: true }) data!: LayoutProps<Data, Meta>["data"];
  @Prop({ required: true }) meta!: LayoutProps<Data, Meta>["meta"];
  @Prop({ required: true }) type!: LayoutProps<Data, Meta>["type"];
  @InjectReactive({ from: FSXA_INJECT_KEY_COMPONENTS })
  components!: AppComponents;

  @Inject({
    from: FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
    default: () => ({}),
  })
  setPortalContent!: (portalContent: any) => void;

  renderContentElements = (content: PageBodyContent[]) =>
    content.map(this.renderContentElement);

  renderContent(content: PageBody) {
    const sections = this.renderContentElements(content.children);
    return this.isDevMode ? (
      <div data-preview-id={content.previewId} class="pl-w-full pl-h-full">
        {sections}
      </div>
    ) : (
      sections
    );
  }

  renderDevInfoPortal() {
    this.setPortalContent(this.renderDevInfo(true));
  }

  renderDevModeInfo() {
    const DevModeInfoComponent = this.components.devModeInfo || null;
    if (DevModeInfoComponent)
      return <DevModeInfoComponent type="layout" componentName={this.type} />;
    return (
      <div>
        You can pass your own component by adding it to the{" "}
        <Code inline language="js">
          components.layouts
        </Code>{" "}
        map.
        <Code class="pl-mt-4" language="tsx">
          {`import YourCustomComponent from "...";

<FSXAApp
  components={{
    layouts: {
      "${this.type}": YourCustomComponent,
    }
  }}
/>`}
        </Code>
        If you are not using the fsxa-pattern-library directly make sure to
        check the documentation of your project specific integration.
        <br />
        <br />
        You can extend the
        <Code class="pl-mx-1" inline language="tsx">
          FSXABaseLayout
        </Code>
        to get access to many useful utility methods.
        <br />
        <br />
      </div>
    );
  }

  renderDevInfo(isOverlay = false) {
    return (
      <InfoBox
        type="info"
        headline={
          isOverlay ? (
            <span>
              Layout: <strong>{this.type}</strong>
            </span>
          ) : (
            "Missing Layout"
          )
        }
        isOverlay={isOverlay}
        handleClose={isOverlay ? () => this.setPortalContent(null) : undefined}
        subheadline={
          isOverlay ? (
            <span>
              The following component is loaded:{" "}
              {this.mappedLayout!.name ? (
                <span class="pl-font-bold">{this.mappedLayout!.name}</span>
              ) : (
                <i>Component.name not defined</i>
              )}
            </span>
          ) : (
            <span>
              We were unable to find a mapped layout component for the given
              key: <span class="pl-font-bold">{this.type}</span>
            </span>
          )
        }
      >
        {!isOverlay && this.renderDevModeInfo()}
        Your custom layout will receive the following properties:
        <TabbedContent
          tabs={[
            {
              title: "data",
              content: (
                <div>
                  <Code key="data" language="json">
                    {JSON.stringify(this.data, null, 2)}
                  </Code>
                </div>
              ),
            },
            {
              title: "meta",
              content: (
                <Code key="meta" language="json">
                  {JSON.stringify(this.meta, null, 2)}
                </Code>
              ),
            },
            ...this.content.map(content => ({
              title: `[Slot]: ${content.name}`,
              content: (
                <Code language="tsx">
                  {`/**
* This slot contains the already prerendered content elements of the section ${content.name}.
**/

// Usage in Vue SFC:
<slot name="${content.name}" />

// Usage in Vue JSX/TSX (if you extend FSXABaseLayout)
{this.renderContentByName("${content.name}")}

// Usage in Vue JSX/TSX (without extending FSXABaseLayout)
{this.$scopedSlots.${content.name}({})}
`}
                </Code>
              ),
            })),
          ]}
        />
      </InfoBox>
    );
  }

  get layouts() {
    return this.components.layouts || {};
  }

  get mappedLayout() {
    return this.layouts ? this.layouts[this.type] || null : null;
  }

  render() {
    let content = null;
    if (this.mappedLayout != null) {
      const MappedLayout = this.mappedLayout;
      const slots = this.content.reduce(
        (slots, content) => ({
          ...slots,
          [content.name]: () => this.renderContent(content),
        }),
        {},
      );
      content = (
        <MappedLayout
          pageId={this.pageId}
          data={this.data}
          meta={this.meta}
          scopedSlots={this.$slots.default ? {} : slots}
        >
          {this.$slots.default}
        </MappedLayout>
      );
    } else {
      content = this.renderDevInfo();
    }
    return (
      <ErrorBoundary
        previewId={this.isEditMode ? this.previewId : undefined}
        title={`Error rendering Layout: ${this.mappedLayout &&
          this.mappedLayout.name}`}
      >
        {this.isDevMode ? (
          <InfoToolTip
            onClicked={() => {
              this.renderDevInfoPortal();
            }}
          >
            {content}
          </InfoToolTip>
        ) : (
          content
        )}
      </ErrorBoundary>
    );
  }
}
export default Layout;
