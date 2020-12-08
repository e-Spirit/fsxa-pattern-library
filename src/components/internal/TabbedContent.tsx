import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import BaseComponent from "@/components/base/BaseComponent";

export interface TabbedContentProps {
  initialTab?: number;
  tabs: Array<{
    title: string;
    content: JSX.Element;
  }>;
}
@Component({
  name: "TabbedContent",
})
class TabbedContent extends BaseComponent<TabbedContentProps> {
  @Prop({ required: true }) tabs!: TabbedContentProps["tabs"];
  @Prop() initialTab!: TabbedContentProps["initialTab"];

  activeTab: number = this.initialTab || 0;
  showDropdownMenu = false;

  renderDropdown() {
    return (
      <div class="sm:hidden">
        <div class="mt-1 relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-labelledby="listbox-label"
            class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onClick={event => {
              event.preventDefault();
              this.showDropdownMenu = !this.showDropdownMenu;
            }}
          >
            <span class="block truncate">
              {this.tabs[this.activeTab].title}
            </span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>
          {this.showDropdownMenu ? (
            <div class="absolute mt-1 w-full rounded-md bg-white shadow-lg">
              <ul
                tabindex={-1}
                role="listbox"
                aria-labelledby="listbox-label"
                aria-activedescendant="listbox-item-3"
                class="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {this.tabs.map((tab, index) => (
                  <li
                    id="listbox-option-0"
                    role="option"
                    class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                    onClick={event => {
                      event.preventDefault();
                      this.activeTab = index;
                      this.showDropdownMenu = false;
                    }}
                  >
                    <span class="font-normal block truncate text-xs">
                      {tab.title}
                    </span>
                    {this.activeTab === index ? (
                      <span class="text-blue-600 absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg
                          class="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="w-full mt-4 first-child:mt-0">
        {this.renderDropdown()}
        <div class="hidden sm:block">
          <nav class="flex space-x-4" aria-label="Tabs">
            {this.tabs.map((tab, index) => {
              const isActive = this.activeTab === index;
              return (
                <a
                  href="#"
                  class={`block px-2 py-1 text-sm rounded-md active:bg-transparent ${
                    isActive
                      ? "text-gray-700 bg-gray-300"
                      : "text-gray-900 hover:text-gray-700"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={event => {
                    event.preventDefault();
                    this.activeTab = index;
                  }}
                >
                  {tab.title}
                </a>
              );
            })}
          </nav>
        </div>
        <div class="w-full mt-2">{this.tabs[this.activeTab].content}</div>
      </div>
    );
  }
}
export default TabbedContent;
