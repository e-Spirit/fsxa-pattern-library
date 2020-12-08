import { Component, Prop } from "vue-property-decorator";
import {
  Page as APIPage,
  Dataset as APIDataset,
  ComparisonQueryOperatorEnum,
} from "fsxa-api";
import Page from "./Page";
import Section from "./Section";
import RenderUtils from "./base/RenderUtils";
import { DatasetProps } from "@/types/components";

@Component({
  name: "FSXADataset",
})
class Dataset extends RenderUtils<DatasetProps> {
  @Prop() id: DatasetProps["id"];
  @Prop() route!: DatasetProps["route"];
  @Prop() pageId!: DatasetProps["pageId"];

  serverPrefetch() {
    return this.fetchData();
  }

  mounted() {
    if (!this.page || !this.dataset) this.fetchData();
  }

  async fetchData() {
    if (!this.locale) return;
    const [page, dataset] = await Promise.all([
      this.fetchPage(),
      this.fetchDataset(),
    ]);
    if (page) this.setStoredItem(this.pageId!, page);
    if (dataset) this.setStoredItem(this.id ? this.id : this.route!, dataset);
  }

  fetchPage() {
    if (!this.pageId) return null;
    return this.fsxaApi.fetchPage(this.pageId, this.locale);
  }

  async fetchDataset() {
    if (!this.id && !this.route) {
      throw new Error(
        "You either have to provide an id or the route of a dataset",
      );
    }
    const response = await this.fsxaApi.fetchByFilter(
      [
        {
          field: this.id ? "identifier" : "route",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: this.id ? this.id : this.route!,
        },
      ],
      this.locale,
    );
    return response.length ? response[0] : null;
  }

  get page(): APIPage | undefined {
    return this.pageId ? this.getStoredItem(this.pageId) : undefined;
  }

  get identifier(): string | null {
    return this.id || this.route || null;
  }

  get dataset(): APIDataset | undefined {
    return this.identifier ? this.getStoredItem(this.identifier) : undefined;
  }

  render() {
    if (this.page && this.dataset) {
      return (
        <Page
          pageData={{
            ...this.page,
            children: [
              {
                ...this.page.children[0],
                // replace children of content with dataset
                children: [this.dataset],
              },
            ],
          }}
        />
      );
    } else if (!this.pageId && this.dataset) {
      return (
        <Section
          type={this.dataset.template}
          data={this.dataset.data}
          id={this.dataset.id}
          previewId={this.dataset.previewId}
          content={this.dataset.children.map(this.renderContentElement)}
        />
      );
    }
  }
}
export default Dataset;
