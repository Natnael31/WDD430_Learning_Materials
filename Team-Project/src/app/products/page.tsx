import ProductsCarousel from "./products";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f9e9] to-white">
      <ProductsCarousel featuredOnly={false} title="All Products" />
    </div>
  );
}
