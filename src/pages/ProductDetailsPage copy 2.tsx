import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  stock: number;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
  }>;
}


type Variant = {
  id: string;
  color: string;
  size?: string;
  sellingPrice: number;
  images: string;
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addItem } = useState([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
console.log(id)
console.log(product)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const q = query(
          collection(db, "products"),
          where("id", "==", parseInt(id))
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const productData = { id: doc.id, ...doc.data() } as Product;
          setProduct(productData);
          console.log(productData)
          // Set default variant if available
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const currentVariant = product.variants && selectedVariant
      ? product.variants.find(v => v.id === selectedVariant)
      : null;

    const itemToAdd = {
      id: parseInt(product.id),
      name: product.name,
      price: currentVariant?.price || product.price,
      category: product.category,
      image: product.image
    };

    addItem(itemToAdd);
    alert(`Added ${quantity} ${product.name}${currentVariant ? ` (${currentVariant.name})` : ''} to cart!`);
  };

  const incrementQuantity = () => {
    const maxStock = getMaxStock();
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getMaxStock = () => {
    if (!product) return 0;
    
    if (product.variants && selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      return variant?.stock || 0;
    }
    
    return product.stock || 0;
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    
    if (product.variants && selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      return variant?.price || product.price;
    }
    
    return product.price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button asChild>
            <Link to="/store">Back to Store</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isInStock = getMaxStock() > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/store">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
            </div>
            <Button asChild>
              <Link to="/store/cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">{product.category}</Badge>
                {isInStock ? (
                  <Badge variant="default">In Stock ({getMaxStock()})</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <div className="text-3xl font-bold text-primary">
              R{getCurrentPrice().toFixed(2)}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Variants</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant === variant.id ? "default" : "outline"}
                      onClick={() => setSelectedVariant(variant.id)}
                      className="h-auto p-3 flex flex-col items-start"
                    >
                      <span className="font-medium">{variant.name}</span>
                      <span className="text-sm">R{variant.price.toFixed(2)}</span>
                      <span className="text-xs opacity-70">Stock: {variant.stock}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={incrementQuantity}
                    disabled={quantity >= getMaxStock()}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInStock ? `Add to Cart - R${(getCurrentPrice() * quantity).toFixed(2)}` : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
