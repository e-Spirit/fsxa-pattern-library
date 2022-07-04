import {
  getPageRectanglePosition,
  areCoordinatesInRectangle,
} from "@/utils/rectHelper";
import { VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Component as TsxComponent } from "vue-tsx-support";
import InfoIcon from "./InfoIcon";

interface InfoToolTipProps {
  onClicked?: (event: Event) => unknown;
}

/**
 * Tooltip component that gets injected into vue root node
 * when mouse entered and gets removed when mouse leaves.
 */
@Component({
  name: "InfoToolTip",
})
export class InfoToolTip extends TsxComponent<InfoToolTipProps> {
  tooltip: Element | null = null;

  get defaultSlot(): VNode | undefined {
    return this.$slots?.default?.[0];
  }

  bindEvents() {
    this.defaultSlot?.elm?.addEventListener("mouseenter", this.addInfoIcon);
    this.defaultSlot?.elm?.addEventListener("mouseleave", this.removeInfoIcon);
  }

  unbindEvents() {
    this.defaultSlot?.elm?.removeEventListener("mouseenter", this.addInfoIcon);
    this.defaultSlot?.elm?.removeEventListener(
      "mouseleave",
      this.removeInfoIcon,
    );
  }

  handleClickOnToolTip(event: Event) {
    event.stopPropagation();
    this.$emit("clicked");
    this.destroyTooltip();
  }

  addInfoIcon(event: Event) {
    event.stopPropagation();
    if (this.tooltip) {
      return; // element already present
    }

    // get position of element that is hovered
    const mouseTarget = event.target as HTMLElement;
    const { top, right } = getPageRectanglePosition(mouseTarget);
    const propsData = {
      top: `${top + 20}px`,
      left: `${right - 48}px`,
    };

    // create infobox component
    this.tooltip = new InfoIcon({
      propsData,
    }).$mount().$el;

    // add click listener
    this.tooltip.addEventListener("click", this.handleClickOnToolTip);

    // add to root
    this.$root.$el.append(this.tooltip);
  }

  destroyTooltip() {
    this.tooltip?.removeEventListener("click", this.handleClickOnToolTip);
    this.tooltip?.remove();
    this.tooltip = null;
  }

  removeInfoIcon(event: Event) {
    event.stopPropagation();
    const node = event.target as HTMLElement;
    const rect = node.getBoundingClientRect();

    const isInside = areCoordinatesInRectangle(
      (event as MouseEvent).clientX,
      (event as MouseEvent).clientY,
      rect.left,
      rect.right,
      rect.top,
      rect.bottom,
    );

    if (!isInside) {
      this.destroyTooltip();
    }
  }

  mounted() {
    this.bindEvents();
  }

  destroyed() {
    this.destroyTooltip();
  }

  render() {
    return this.defaultSlot;
  }
}

export default InfoToolTip;
