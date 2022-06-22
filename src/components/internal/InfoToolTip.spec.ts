import { render } from "@testing-library/vue";
import { mount } from "@vue/test-utils";
import InfoToolTip from "./InfoToolTip";

describe("components/iternal/InfoToolTip", () => {
  it("renders passed content", () => {
    const content = "This is my test";
    const { getByText } = render(InfoToolTip, {
      slots: { default: content },
    });
    expect(getByText(content)).toBeTruthy();
  });

  it("renders tooltip on hover", () => {
    const wrapper = mount(InfoToolTip, {
      slots: { default: "<div class='test-slot'></div>" },
    });
    wrapper.find(".test-slot").trigger("mouseenter");
    const tooltip: HTMLElement = wrapper.vm.$data.tooltip;
    expect(tooltip.innerHTML).toContain("?");
  });

  it("deletes tooltip when leave hover", () => {
    const wrapper = mount(InfoToolTip, {
      slots: { default: "<div class='test-slot'></div>" },
    });
    wrapper.find(".test-slot").trigger("mouseenter");
    wrapper.find(".test-slot").trigger("mouseleave");
    const tooltip: HTMLElement = wrapper.vm.$data.tooltip;
    expect(tooltip).toBeNull();
  });
  it("emits clicked event and tooltip gets destroyed", () => {
    const wrapper = mount(InfoToolTip, {
      slots: { default: "<div class='test-slot'></div>" },
    });
    wrapper.find(".test-slot").trigger("mouseenter");
    wrapper.vm.$data.tooltip.click();
    expect(wrapper.emitted("clicked")).toBeTruthy();

    const toolTipAfterClick = wrapper.vm.$data.tooltip;
    expect(toolTipAfterClick).toBeNull();
  });
});
