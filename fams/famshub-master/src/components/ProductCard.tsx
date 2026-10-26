import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  storage: string;
  condition: string;
  image_url: string;
  in_stock: boolean;
}

export const ProductCard = ({
  id,
  name,
  price,
  storage,
  condition,
  image_url,
  in_stock,
}: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({ id, name, price, storage, image_url });
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-elegant transition-shadow duration-300">
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/product/${id}`}>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <Badge variant={in_stock ? "default" : "secondary"}>
            {in_stock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{storage}</p>
        <p className="text-xs text-muted-foreground mb-3">{condition}</p>
        <p className="text-2xl font-bold text-primary">₵{price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 space-x-2">
        <Button
          onClick={handleAddToCart}
          disabled={!in_stock}
          className="flex-1"
          variant="default"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Link to={`/product/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
