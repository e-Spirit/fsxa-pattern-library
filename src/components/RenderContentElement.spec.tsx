import { Store } from "vuex";
import { mount } from "@vue/test-utils";
import { PageBodyContent } from "fsxa-api/dist/types";
import RenderContentElement from "./RenderContentElement";
import { AppComponents } from "@/types/fsxa-pattern-library";
import { FSXA_INJECT_KEY_COMPONENTS } from "@/constants";

describe("RenderContentElement", () => {
  const store = new Store({});

  const provide = {
    __reactiveInject__: {
      [FSXA_INJECT_KEY_COMPONENTS]: {
        sections: {
          ["some-section"]: {
            render: () => <div>Test</div>,
          },
        },
      } as AppComponents,
    },
  };

  it("Renders the given element", () => {
    const wrapper = mount(RenderContentElement, {
      propsData: {
        element: {
          id: "some-id",
          previewId: "some-id",
          type: "Section",
          sectionType: "some-section",
          data: {},
          children: [],
        } as PageBodyContent,
      },

      store,

      provide,
    });

    expect(wrapper.find("div").exists()).toBe(true);
  });

  it("Renders nothing if element is undefined", () => {
    const wrapper = mount(RenderContentElement, {
      store,
      provide,
    });

    expect(wrapper.find("div").exists()).toBe(false);
  });
});
