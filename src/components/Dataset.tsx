import { Component, Prop } from "vue-property-decorator";
import {
  Page as APIPage,
  Dataset as APIDataset,
  ComparisonQueryOperatorEnum,
} from "fsxa-api";
import BaseComponent from "./BaseComponent";
import Page from "./Page";

export interface DatasetProps {
  route: string;
  pageId: string;
}
@Component({
  name: "FSXADataset",
})
class Dataset extends BaseComponent<DatasetProps> {
  @Prop({ required: true }) route!: DatasetProps["route"];
  @Prop({ required: true }) pageId!: DatasetProps["pageId"];

  serverPrefetch() {
    return this.fetchData();
  }

  mounted() {
    if (!this.page || !this.dataset) this.fetchData();
  }

  async fetchData() {
    const [page, dataset] = await Promise.all([
      this.fetchPage(),
      this.fetchDataset(),
    ]);
    if (page) this.setStoredItem(this.pageId, page);
    if (dataset) this.setStoredItem(this.route, dataset);
  }

  fetchPage() {
    return this.fsxaApi.fetchPage(this.pageId, this.locale);
  }

  async fetchDataset() {
    const response = await this.fsxaApi.fetchByFilter(
      [
        {
          field: "route",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: this.route,
        },
      ],
      this.locale,
    );
    return response.length ? response[0] : null;
  }

  get page(): APIPage | null {
    return this.getStoredItem(this.pageId) || null;
  }

  get dataset(): APIDataset | null {
    return this.getStoredItem(this.route) || null;
  }

  render() {
    console.log("Locale", this.page, this.dataset);
    if (this.page) {
      return <Page pageData={this.page}>Datensatz</Page>;
    }
  }
}
export default Dataset;
