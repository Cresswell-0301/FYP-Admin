import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";
import Title from "@/components/Title";

export default function NewProduct() {
  return (
    <Layout>
      <Title>New Product</Title>
      <ProductForm/>
    </Layout>
  );
}