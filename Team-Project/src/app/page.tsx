import ProductsCarousel from "./products/products";
import Hero from "./components/Hero";
import Header from "./navBar/navbar";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* <Header /> */}
      <Hero />
      <ProductsCarousel featuredOnly={true} title="Featured Products" />
    </div>
  );
}
