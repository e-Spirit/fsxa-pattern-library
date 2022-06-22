import {
  FSXA_INJECT_KEY_COMPONENTS,
  FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
} from "@/constants";
import Component from "vue-class-component";
import { Inject, InjectReactive, Prop } from "vue-property-decorator";
import BaseComponent from "./base/BaseComponent";
import ErrorBoundary from "./internal/ErrorBoundary";
import InfoToolTip from "./internal/InfoToolTip";
import Code from "./internal/Code";
import InfoBox from "./internal/InfoBox";
import TabbedContent, { TabbedContentItem } from "./internal/TabbedContent";
import { AppComponents } from "@/types/components";

export interface SectionProps<Data, Meta> {
  type: string;
  data: Data;
  meta: Meta;
  id?: string;
  previewId?: string;
  content: Array<JSX.Element | null> | JSX.Element[] | null;
}
@Component({
  name: "Section",
})
class Section<
  Data = Record<string, any>,
  Meta = Record<string, any>
> extends BaseComponent<SectionProps<Data, Meta>> {
  @Prop() id: SectionProps<Data, Meta>["id"];
  @Prop() previewId: SectionProps<Data, Meta>["previewId"];
  @Prop({ required: true }) data!: SectionProps<Data, Meta>["data"];
  @Prop({ required: true }) meta!: SectionProps<Data, Meta>["meta"];
  @Prop({ required: true }) content!: SectionProps<Data, Meta>["content"];
  @Prop({ required: true }) type!: SectionProps<Data, Meta>["type"];
  @InjectReactive({ from: FSXA_INJECT_KEY_COMPONENTS })
  components!: AppComponents;

  @Inject({
    from: FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
    default: () => ({}),
  })
  setPortalContent!: (portalContent: any) => void;

  renderDevInfoPortal() {
    this.setPortalContent(this.renderDevInfo(true));
  }

  renderImportInformation() {
    const DevModeInfoComponent = this.components.devModeInfo || null;
    if (DevModeInfoComponent)
      return <DevModeInfoComponent type="section" componentName={this.type} />;
    return (
      <div>
        You can pass your own component by adding it to the{" "}
        <Code inline language="js">
          components
        </Code>{" "}
        map.
        <Code class="pl-mt-4" language="tsx">
          {`import YourCustomComponent from "...";

<FSXAApp
  components={{
    sections: {
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
          FSXABaseSection
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
              Section: <strong>{this.type}</strong>
            </span>
          ) : (
            "Missing Section"
          )
        }
        isOverlay={isOverlay}
        handleClose={isOverlay ? () => this.setPortalContent(null) : undefined}
        subheadline={
          isOverlay ? (
            <span>
              The following component is loaded:{" "}
              {this.mappedSection!.name ? (
                <span class="pl-font-bold">{this.mappedSection!.name}</span>
              ) : (
                <i>Component.name not defined</i>
              )}
            </span>
          ) : (
            <span>
              We were unable to find a mapped section component for the given
              key: <span class="pl-font-bold">{this.type}</span>
            </span>
          )
        }
      >
        {!isOverlay && this.renderImportInformation()}
        Your custom section will receive the following properties:
        <TabbedContent
          tabs={
            [
              {
                title: "payload",
                content: (
                  <Code key="payload" language="json">
                    {JSON.stringify(this.data, null, 2)}
                  </Code>
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
              this.content && this.content.length > 0
                ? {
                    title: "[Slot] content",
                    content: (
                      <Code key="content" language="tsx">
                        {`/**
* This slot contains the already prerendered content elements of the section ${this.content}.
**/

// Usage in Vue SFC:
<slot name="content" />

// Usage in JSX/TSX:
{this.$scopedSlots.content({})}
`}
                      </Code>
                    ),
                  }
                : undefined,
            ].filter(Boolean) as TabbedContentItem[]
          }
        />
      </InfoBox>
    );
  }

  get sections() {
    return this.components.sections || {};
  }

  get mappedSection() {
    return this.sections[this.type] || null;
  }

  render() {
    if (this.mappedSection) {
      const MappedSection = this.mappedSection;
      const content = (
        <MappedSection
          id={this.id}
          data-preview-id={this.isEditMode ? this.previewId : undefined}
          meta={this.meta}
          payload={this.data}
          scopedSlots={
            this.content && this.content.length > 0
              ? {
                  content: () => this.content,
                }
              : {}
          }
        />
      );
      return (
        <ErrorBoundary
          class="pl-group"
          previewId={this.isEditMode ? this.previewId : undefined}
          title={`Error rendering Section: ${MappedSection &&
            MappedSection.name}`}
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
    return this.isEditMode && this.isDevMode ? this.renderDevInfo() : null;
  }
}
export default Section;
