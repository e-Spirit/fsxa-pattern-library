import { Component, Prop } from "vue-property-decorator";
import { Component as TsxComponent } from "vue-tsx-support";

@Component
export class InfoIconBox extends TsxComponent<{}> {
  @Prop({ required: true }) left!: string;
  @Prop({ required: true }) top!: string;

  render() {
    return (
      <div
        style={`left: ${this.left}; top: ${this.top};`}
        class="pl-z-info pl-absolute pl-flex pl-w-6 pl-h-6 pl-items-center pl-justify-center pl-bg-gray-600 pl-text-gray-100 pl-rounded-full pl-cursor-pointer pl-hover:bg-gray-500"
        onMouseleave={event => event.stopPropagation()}
      >
        ?
      </div>
    );
  }
}

export default InfoIconBox;
