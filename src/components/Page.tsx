import { Page as APIPage } from "fsxa-api";
import { Component, InjectReactive, Prop, Watch } from "vue-property-decorator";

import BaseComponent from "@/components/base/BaseComponent";
import { FSXA_INJECT_KEY_LOADER } from "@/constants";

import Layout from "./Layout";
import { getTPPSnap } from "@/utils";

export interface PageProps {
  id?: string;
  pageData?: APIPage;
}
@Component({
  name: "FSXAPage",
})
class Page extends BaseComponent<PageProps> {
  @InjectReactive({ from: FSXA_INJECT_KEY_LOADER }) loaderComponent: any | null;
  @Prop({ required: false }) id: PageProps["id"];
  @Prop({ required: false }) pageData: PageProps["pageData"];

  serverPrefetch() {
    return this.fetchPage();
  }

  @Watch("id")
  handleIdChange(id: string, prevId: string) {
    if (id !== prevId && id != null) {
      this.fetchPage();
    }
  }

  mounted() {
    if (!this.pageData && !this.loadedPage) {
      this.fetchPage();
    }
    const TPP_SNAP = getTPPSnap();
    if (this.isEditMode && this.page && TPP_SNAP) {
      TPP_SNAP.setPreviewElement(this.page.previewId);
    }
  }

  updated() {
    const TPP_SNAP = getTPPSnap();
    if (this.isEditMode && this.page && TPP_SNAP) {
      TPP_SNAP.setPreviewElement(this.page.previewId);
    }
  }

  async fetchPage() {
    if (this.pageData) return;
    if (!this.id)
      throw new Error(
        "You either have to pass already loaded pageData or the id of the page that should be loaded.",
      );
    try {
      const page = await this.fsxaApi.fetchElement({
        id: this.id,
        locale: this.locale,
      });
      this.setStoredItem(this.id, page);
    } catch (err) {
      this.setStoredItem(this.id, null);
    }
  }

  get loadedPage(): APIPage | null | undefined {
    return this.id ? this.getStoredItem(this.id) : undefined;
  }

  get page(): APIPage | null | undefined {
    return this.pageData || this.loadedPage;
  }

  render() {
    if (typeof this.page === "undefined") {
      const LoaderComponent = this.loaderComponent || "div";
      return <LoaderComponent />;
    }
    if (this.page === null) {
      throw new Error("Could not load page");
    }
    return this.page ? (
      <Layout
        pageId={this.id!}
        previewId={this.page.previewId}
        type={this.page.layout}
        content={this.page.children}
        data={this.page.data}
        meta={this.page.meta}
      >
        {this.$slots.default}
      </Layout>
    ) : null;
  }
}
export default Page;
