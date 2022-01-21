import Component from "vue-class-component";
import { FSXABaseSection } from "fsxa-pattern-library";
import { ComparisonQueryOperatorEnum } from "fsxa-api";

interface CategoryProductsProps {
  entityType: string;
  schema: string;
}

interface ProductProps {
  data: {
    tt_name: string;
  };
  route: string;
}

@Component({
  name: "CategoryProducts",
})
class CategoryProducts extends FSXABaseSection<CategoryProductsProps> {
  products: ProductProps[] | null = null;

  async mounted() {
    const { items } = await this.fsxaApi.fetchByFilter({
      filters: [
        {
          field: "entityType",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: this.payload.entityType,
        },
        {
          field: "schema",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: this.payload.schema,
        },
      ],
      locale: this.locale,
    });

    this.products = items as ProductProps[];
  }

  render() {
    return (
      <div class="pl-container pl-mx-auto pl-py-10">
        {this.products &&
          this.products.map((product: ProductProps) => {
            return product?.route && product?.data?.tt_name ? (
              <div>
                <a
                  class="pl-border-b pl-border-transparent hover:pl-border-green-600"
                  href={product.route}
                  onClick={e => {
                    e.preventDefault();
                    this.triggerRouteChange({ route: product.route });
                  }}
                >
                  {product.data.tt_name}
                </a>
              </div>
            ) : null;
          })}
      </div>
    );
  }
}
export default CategoryProducts;
