import BaseComponent from "@/components/base/BaseComponent";
import { FSXA_INJECT_USE_ERROR_BOUNDARY_WRAPPER } from "@/constants";
import { Prop, Component, Inject } from "vue-property-decorator";
import Code from "./Code";
import InfoBox from "./InfoBox";

export interface ErrorBoundaryProps {
  title: string;
  previewId?: string;
}

/**
 * Add errorCaptured to slot in order to catch errors from child components.
 * Details: https://vuejs.org/api/options-lifecycle.html#errorcaptured
 */
@Component({
  name: "ErrorBoundary",
})
class ErrorBoundary extends BaseComponent<ErrorBoundaryProps> {
  @Prop({ required: true }) title!: ErrorBoundaryProps["title"];
  @Prop() previewId!: ErrorBoundaryProps["previewId"];

  error: Error | null = null;

  @Inject({
    from: FSXA_INJECT_USE_ERROR_BOUNDARY_WRAPPER,
    default: true,
  })
  useErrorBoundaryWrapper!: boolean;

  get defaultSlot() {
    return this.$slots?.default?.[0];
  }

  mounted() {
    if (
      this.defaultSlot?.context !== undefined &&
      this.previewId &&
      !this.useErrorBoundaryWrapper
    ) {
      this.defaultSlot.context.$attrs["data-preview-id"] = this.previewId;
    }
  }

  errorCaptured(error: Error) {
    this.error = error;
    return false;
  }

  renderError() {
    return (
      <InfoBox headline={this.title} type="error">
        <Code language="js">{this.error?.stack}</Code>
      </InfoBox>
    );
  }

  render() {
    if (this.error && !this.isDevMode) {
      return null;
    }

    return this.error ? (
      this.renderError()
    ) : this.useErrorBoundaryWrapper ? (
      // legacy wrapper that can be opted out via useErrorBoundaryWrapper
      <div
        class="group-l pl-relative pl-w-full pl-h-full"
        data-preview-id={this.previewId}
      >
        {this.$slots.default}
      </div>
    ) : (
      this.defaultSlot
    ); // renderContent of the slot will always return 1 element only.
  }
}
export default ErrorBoundary;
