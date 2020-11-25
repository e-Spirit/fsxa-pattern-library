import BaseComponent from "./BaseComponent";
import { Component, Prop } from "vue-property-decorator";
import { Page as APIPage } from "fsxa-api";
import Layout from "./Layout";

export interface PageProps {
  id?: string;
  pageData?: APIPage;
}
@Component({
  name: "FSXAPage",
})
class Page extends BaseComponent<PageProps> {
  @Prop({ required: false }) id: PageProps["id"];
  @Prop({ required: false }) pageData: PageProps["pageData"];

  loadedPage: APIPage | null = null;

  serverPrefetch() {
    return this.fetchPage();
  }

  mounted() {
    if (!this.pageData && !this.loadedPage) {
      this.fetchPage();
    }
  }

  async fetchPage() {
    if (this.pageData) return;
    if (!this.id)
      throw new Error(
        "You either have to pass already loaded pageData or the id of the page that should be loaded.",
      );
    const page = await this.fsxaApi.fetchPage(this.id, this.locale);
    this.setStoredItem(this.id, page);
  }

  get page(): APIPage | null {
    return this.pageData || this.loadedPage || null;
  }

  render() {
    return this.page ? (
      <Layout
        type={this.page.layout}
        data={this.page.data}
        meta={this.page.meta}
      />
    ) : null;
  }
}
export default Page;
