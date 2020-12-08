import BaseComponent from "@/components/base/BaseComponent";
import { Prop, Component } from "vue-property-decorator";
import Code from "./Code";
import InfoBox from "./InfoBox";

export interface ErrorBoundaryProps {
  title: string;
}
@Component
class ErrorBoundary extends BaseComponent<ErrorBoundaryProps> {
  @Prop({ required: true }) title!: ErrorBoundaryProps["title"];

  error: Error | null = null;

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
    ) : (
      <div class="relative">{this.$slots.default}</div>
    );
  }
}
export default ErrorBoundary;
