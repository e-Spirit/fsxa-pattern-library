import {
  FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
  FSXA_INJECT_KEY_COMPONENTS,
} from "@/constants";
import { RichTextElement } from "fsxa-api/dist/types";
import Component from "vue-class-component";
import { AppComponents } from "@/types/components";
import { Inject, Prop, InjectReactive } from "vue-property-decorator";
import BaseComponent from "../base/BaseComponent";
import Code from "../internal/Code";
import InfoBox from "../internal/InfoBox";
import TabbedContent from "../internal/TabbedContent";

interface MissingRichTextComponentProps {
  element: RichTextElement;
}
@Component({
  name: "MissingRichTextComponent",
})
class MissingRichTextComponent extends BaseComponent<
  MissingRichTextComponentProps
> {
  @Prop({ required: true }) element!: MissingRichTextComponentProps["element"];
  @InjectReactive({ from: FSXA_INJECT_KEY_COMPONENTS })
  components!: AppComponents;
  @Inject({
    from: FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
    default: () => ({}),
  })
  setPortalContent!: (portalContent: any) => void;

  renderImportInformation() {
    const DevModeInfoComponent = this.components.devModeInfo || null;
    if (DevModeInfoComponent)
      return (
        <DevModeInfoComponent
          type="richtext"
          componentName={this.element.type}
        />
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
      "${this.element.type}": YourCustomRichTextComponent,
    }
  }}
/>`}
        </Code>
        If you are not using the fsxa-pattern-library directly make sure to
        check the documentation of your project specific integration.
      </div>
    );
  }

  renderDevInfoPortal() {
    this.setPortalContent(
      <InfoBox
        headline="Missing RichText-Component"
        type="info"
        isOverlay={true}
        handleClose={() => this.setPortalContent(null)}
        subheadline={
          <span>
            We were unable to find a mapped RichText-Component for the given
            key: <span class="pl-font-bold">{this.element.type}</span>
          </span>
        }
      >
        <div>
          {this.renderImportInformation()}
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
                    {JSON.stringify(this.element.data, null, 2)}
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
${JSON.stringify(this.element.content, null, 2)}
`}
                  </Code>
                ),
              },
            ]}
          />
        </div>
      </InfoBox>,
    );
  }

  render() {
    if (!this.isDevMode) return null;
    return (
      <span class="pl-block pl-my-2">
        <a
          href="#"
          class="group-r pl-inline-flex pl-pl-1 pl-py-1 pl-bg-blue-200 pl-rounded-lg group pl-border pl-border-blue-400 hover:pl-bg-blue-100 pl-text-sm pl-text-blue-900 pl-font-sans pl-items-center pl-justify-center"
          onClick={event => {
            event.preventDefault();
            this.renderDevInfoPortal();
          }}
        >
          <span class="pl-flex pl-w-6 pl-h-6 pl-items-center pl-justify-center pl-bg-blue-500 pl-text-gray-100 pl-rounded-full group-r-hover:pl-bg-blue-400">
            ?
          </span>
          <span class="pl-inline-block pl-text-xs pl-px-2">
            <span>Missing RichText-Component:</span>
            <strong class="pl-inline-block pl-ml-1">{this.element.type}</strong>
          </span>
        </a>
      </span>
    );
  }
}
export default MissingRichTextComponent;
