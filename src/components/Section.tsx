import {
  FSXA_INJECT_KEY_SECTIONS,
  FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
} from "@/constants";
import Component from "vue-class-component";
import { Inject, InjectReactive, Prop } from "vue-property-decorator";
import BaseComponent from "./base/BaseComponent";
import ErrorBoundary from "./internal/ErrorBoundary";
import Code from "./internal/Code";
import InfoBox from "./internal/InfoBox";
import TabbedContent from "./internal/TabbedContent";
import { Fragment } from "vue-fragment";

export interface SectionProps<Data> {
  type: string;
  data: Data;
  id?: string;
  previewId?: string;
  content: Array<JSX.Element | null> | JSX.Element[] | null;
}
@Component({
  name: "Section",
})
class Section<Data> extends BaseComponent<SectionProps<Data>> {
  @Prop() id: SectionProps<Data>["id"];
  @Prop() previewId: SectionProps<Data>["previewId"];
  @Prop({ required: true }) data!: SectionProps<Data>["data"];
  @Prop({ required: true }) content!: SectionProps<Data>["content"];
  @Prop({ required: true }) type!: SectionProps<Data>["type"];
  @InjectReactive({ from: FSXA_INJECT_KEY_SECTIONS }) sections!: Record<
    string,
    any
  >;

  @Inject({
    from: FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
    default: () => ({}),
  })
  setPortalContent!: (portalContent: any) => void;

  renderDevInfoPortal() {
    this.setPortalContent(this.renderDevInfo(true));
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
                <span class="font-bold">{this.mappedSection!.name}</span>
              ) : (
                <i>Component.name not defined</i>
              )}
            </span>
          ) : (
            <span>
              We were unable to find a mapped section component for the given
              key: <span class="font-bold">{this.type}</span>
            </span>
          )
        }
      >
        {!isOverlay && (
          <div>
            You can pass your own component by adding it to the{" "}
            <Code inline language="js">
              components
            </Code>{" "}
            map.
            <Code class="mt-4" language="tsx">
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
            <Code class="mx-1" inline language="tsx">
              FSXABaseSection
            </Code>
            to get access to many useful utility methods.
            <br />
            <br />
          </div>
        )}
        Your custom section will receive the following properties:
        <TabbedContent
          tabs={[
            {
              title: "payload",
              content: (
                <Code key="payload" language="json">
                  {JSON.stringify(this.data, null, 2)}
                </Code>
              ),
            },
            {
              title: "[Slot] content",
              content: (
                <Code key="content" language="tsx">
                  {`/**
* This slot contains the already prerendered content elements of the section ${this.content}.
* This is optional and will only be used, if the content section contains child sections.
**/

// Usage in Vue SFC:
<slot name="content" />

// Usage in Vue Tsx: 
{this.$scopedSlots.content({})}
`}
                </Code>
              ),
            },
          ]}
        />
      </InfoBox>
    );
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
          payload={this.data}
          scopedSlots={{
            content: () => this.content,
          }}
        />
      );
      return (
        <ErrorBoundary
          class="group"
          title={`Error rendering Section: ${MappedSection &&
            MappedSection.name}`}
        >
          <Fragment>
            {this.isEditMode ? (
              <div data-preview-id={this.previewId}>{content}</div>
            ) : (
              content
            )}
            {this.isDevMode ? (
              <a
                href="#"
                title={`Section: ${this.type}`}
                onClick={event => {
                  event.preventDefault();
                  this.renderDevInfoPortal();
                }}
                class="hidden group-hover:flex pointer-events-auto w-6 h-6 items-center justify-center bg-gray-900 text-gray-100 rounded-full absolute top-0 right-0 mr-5 mt-5 hover:bg-gray-700"
              >
                ?
              </a>
            ) : null}
          </Fragment>
        </ErrorBoundary>
      );
    }
    return this.isEditMode ? (
      <div data-preview-id={this.previewId}>
        {this.isDevMode ? this.renderDevInfo() : null}
      </div>
    ) : this.isDevMode ? (
      this.renderDevInfo()
    ) : null;
  }
}
export default Section;
