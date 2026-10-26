import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Smartphone, Watch, Headphones, Package, Shield, Truck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .eq("in_stock", true)
      .limit(6);
    
    setFeaturedProducts(data || []);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <img src={logo} alt="FAM's Apple Hub" className="h-20 w-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Trusted Source for Original Apple Products
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Premium iPhones, iPads, MacBooks, AirPods and more. All devices tested, verified, and guaranteed for quality.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button size="lg" variant="secondary" className="text-lg">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-4">Verified Original Devices</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-secondary" />
                    <span>Simple, Fast & Reliable</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-secondary" />
                    <span>Swap & Upgrade Options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-secondary" />
                    <span>Fast Delivery Available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-2 mb-12">
              <Star className="h-8 w-8 text-secondary fill-secondary" />
              <h2 className="text-3xl font-bold text-center">Featured Products</h2>
              <Star className="h-8 w-8 text-secondary fill-secondary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  storage={product.storage}
                  condition={product.condition}
                  image_url={product.image_urls?.[0] || ""}
                  in_stock={product.in_stock}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/shop">
                <Button size="lg" variant="secondary">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link to={`/shop?category=${category.name}`} key={category.name}>
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FAM's Apple Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full mx-auto flex items-center justify-center">
                <Shield className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">100% Original</h3>
              <p className="text-muted-foreground">
                All our devices are verified and tested for authenticity and quality.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full mx-auto flex items-center justify-center">
                <Package className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Swap & Upgrade</h3>
              <p className="text-muted-foreground">
                Trade in your old device and upgrade to the latest models easily.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full mx-auto flex items-center justify-center">
                <Truck className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and reliable delivery to your location across Ghana.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const categories = [
  {
    name: "iPhones",
    icon: <Smartphone className="h-8 w-8 text-primary" />,
  },
  {
    name: "iPads",
    icon: <Package className="h-8 w-8 text-primary" />,
  },
  {
    name: "MacBooks",
    icon: <Package className="h-8 w-8 text-primary" />,
  },
  {
    name: "Accessories",
    icon: <Headphones className="h-8 w-8 text-primary" />,
  },
];
