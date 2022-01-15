import Component from "vue-class-component";
import { Inject, InjectReactive, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/base/BaseComponent";
import { AppComponents, RichTextProps } from "@/types/components";
import { RichTextElement } from "fsxa-api";
import {
  FSXA_INJECT_KEY_COMPONENTS,
  FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
} from "@/constants";
import InfoBox from "@/components/internal/InfoBox";
import Code from "@/components/internal/Code";
import TabbedContent from "@/components/internal/TabbedContent";

@Component({
  name: "FSXARichText",
})
class RichText extends BaseComponent<RichTextProps, {}, Record<string, any>> {
  @Prop({ required: true }) content!: RichTextProps["content"];
  @Prop(String) editorName: RichTextProps["editorName"];
  @InjectReactive({ from: FSXA_INJECT_KEY_COMPONENTS })
  components!: AppComponents;

  @Inject({
    from: FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
    default: () => ({}),
  })
  setPortalContent!: (portalContent: any) => void;

  get elements(): Record<string, any> {
    return this.components.richtext || {};
  }

  renderDevInfoPortal(element: RichTextElement) {
    this.setPortalContent(this.renderDevInfo(element));
  }

  renderImportInformation(element: RichTextElement) {
    const DevModeInfoComponent = this.components.devModeInfo || null;
    if (DevModeInfoComponent)
      return (
        <DevModeInfoComponent type="richtext" componentName={element.type} />
      );
    return (
      <div>
        You can pass your own component by adding it to the{" "}
        <Code inline language="js">
          components
        </Code>{" "}
        map.
        <Code class="pl-mt-4" language="tsx">
          {`import YourCustomRichTextComponent from "...";

<FSXAApp
  components={{
    richtext: {
      "${element.type}": YourCustomRichTextComponent,
    }
  }}
/>`}
        </Code>
        If you are not using the fsxa-pattern-library directly make sure to
        check the documentation of your project specific integration.
      </div>
    );
  }

  renderDevInfo(element: RichTextElement) {
    return (
      <InfoBox
        headline="Missing RichText-Component"
        type="info"
        isOverlay={true}
        handleClose={() => this.setPortalContent(null)}
        subheadline={
          <span>
            We were unable to find a mapped RichText-Component for the given
            key: <span class="pl-font-bold">{element.type}</span>
          </span>
        }
      >
        <div>
          {this.renderImportInformation(element)}
          You can extend the
          <Code class="pl-mx-1" inline language="tsx">
            FSXABaseRichTextElement
          </Code>
          to get access to provided properties.
          <br />
          <br />
          Your custom RichText-Component will receive the following properties:
          <TabbedContent
            tabs={[
              {
                title: "data",
                content: (
                  <Code key="data" language="json">
                    {JSON.stringify(element.data, null, 2)}
                  </Code>
                ),
              },
              {
                title: "content",
                content: (
                  <Code key="content" language="tsx">
                    {`/**
* This property contains the JSON for the RichText-elements children.
* You can render it via the following methods:
**/

/**
 * Vue SFC:
 * The content component is already injected for you and will render the content elements for you
 **/
<render-content />

/**
 * JSX/TSX:
 * You can use the renderContent method provided by the FSXABaseRichTextElement
 **/
{this.renderContent()}

/**
 * Content-JSON
 **/
${JSON.stringify(this.content, null, 2)}
`}
                  </Code>
                ),
              },
            ]}
          />
        </div>
      </InfoBox>
    );
  }

  renderElement(element: RichTextElement) {
    if (this.elements[element.type]) {
      const Element = this.elements[element.type];
      return <Element content={element.content} data={element.data} />;
    }
    if (this.isDevMode) {
      return (
        <span class="pl-block pl-my-2">
          <a
            href="#"
            class="group-r pl-inline-flex pl-pl-1 pl-py-1 pl-bg-blue-200 pl-rounded-lg group pl-border pl-border-blue-400 hover:pl-bg-blue-100 pl-text-sm pl-text-blue-900 pl-font-sans pl-items-center pl-justify-center"
            onClick={event => {
              event.preventDefault();
              this.renderDevInfoPortal(element);
            }}
          >
            <span class="pl-flex pl-w-6 pl-h-6 pl-items-center pl-justify-center pl-bg-blue-500 pl-text-gray-100 pl-rounded-full group-r-hover:pl-bg-blue-400">
              ?
            </span>
            <span class="pl-inline-block pl-text-xs pl-px-2">
              <span>Missing RichText-Component:</span>
              <strong class="pl-inline-block pl-ml-1">{element.type}</strong>
            </span>
          </a>
        </span>
      );
    }
    return null;
  }

  render() {
    if (this.isEditMode && this.editorName) {
      return (
        <div>
          <span data-preview-id={"#" + this.editorName} data-inedit>
            {this.content.map(this.renderElement)}
          </span>
        </div>
      );
    }
    return <div>{this.content.map(this.renderElement)}</div>;
  }
}
export default RichText;
