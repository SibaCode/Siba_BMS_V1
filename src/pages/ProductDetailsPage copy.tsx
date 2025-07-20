import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Store,
  Package,
  Truck,
  Shield,
} from "lucide-react";

type Variant = {
  id: string;
  color: string;
  size?: string;
  sellingPrice: number;
  images: string;
};

type Product = {
  id: string;
  productID?: string;
  name: string;
  price?: number;
  category?: string;
  productImage?: string;
  description?: string;
  status?: string;
  variants?: Variant[];
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem , itemCount} = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const fetchedProduct: Product = {
          id: docSnap.id,
          ...(data as Product),
        };
        setProduct(fetchedProduct);
console.log(fetchProduct)
        if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          setSelectedVariant(fetchedProduct.variants[0]);
        }
      } else {
        // Fallback mock data if no product found
        if (id === "67") {
          const fallbackProduct: Product = {
            id: "67",
            name: "Mock Product Title",
            description:
              "This is a fallback mock product used when no product is found.",
            price: 10.99,
            variants: [
              { id: "v1", color: "Red", size: "M", sellingPrice: 10.99, images: "" },
              { id: "v2", color: "Blue", size: "L", sellingPrice: 12.99, images: "" },
            ],
          };
          setProduct(fallbackProduct);
          setSelectedVariant(fallbackProduct.variants[0]);
        } else {
          console.warn(`No product found with ID: ${id}`);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const price = selectedVariant?.sellingPrice || product.price || 0;
    if (!selectedVariant) {
        toast({
          title: "Missing Selection",
          description: "Please select size and color before adding to cart.",
          variant: "destructive",
        });
        return;
      }
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: parseInt(product.id),
        name: product.name,
        price,
        category: product.category,
        image: product.productImage || selectedVariant?.images,
      });

    //   toast({
    //     title: "Added to Cart",
    //     description: `${product.name} (${selectedVariant.size} ${selectedVariant.color}) has been successfully added to your cart.`,
    //     variant: "destructive",
    //   });
    }

    // navigate("/store/cart");
  };

  const updateQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const images: string[] = [
    product?.productImage || "",
    ...(selectedVariant?.images ? [selectedVariant.images] : []),
    ...(product?.variants?.map((v) => v.images).filter(Boolean) || []),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/store">Back to Store</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {/* <div className="flex items-center space-x-4" >
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Your Store</h1>
            </div> */}
            <div className="flex items-center space-x-4">
              {/* <Button variant="outline" asChild>
                <Link to="/admin">Admin Panel</Link>
              </Button> */}
              {/* <Button asChild className="relative">
                <Link to="/store/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {itemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Store className="h-24 w-24 text-primary/50" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {/* <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8) • 124 reviews</span>
              </div> */}
              <div className="text-3xl font-bold text-primary mb-4">
                R{selectedVariant?.sellingPrice || product.price || 0}
              </div>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
  <>
    {/* Color Dropdown */}
    <div className="mb-4">
      <label className="text-sm font-medium mb-2 block">Select Color:</label>
      <Select
        value={selectedVariant?.color || ""}
        onValueChange={(color) => {
          const variant = product.variants.find((v) => v.color === color);
          setSelectedVariant(variant || null);
          setSelectedImage(0);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose a color" />
        </SelectTrigger>
        <SelectContent>
          {[...new Set(product.variants.map((v) => v.color))].map((color) => (
            <SelectItem key={color} value={color}>
              {color}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Size Dropdown */}
    {selectedVariant?.color && (
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Select Size:</label>
        <Select
          value={selectedVariant.size || ""}
          onValueChange={(size) => {
            const variant = product.variants.find(
              (v) => v.color === selectedVariant.color && v.size === size
            );
            setSelectedVariant(variant || selectedVariant);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a size" />
          </SelectTrigger>
          
          <SelectContent>
            {[...new Set(product.variants
              .filter((v) => v.color === selectedVariant.color)
              .map((v) => v.size)
            )].map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}
  </>
)}


            {/* Quantity Controls */}
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="outline" onClick={() => updateQuantity(-1)}>
                <Minus />
              </Button>
              <span className="text-xl font-medium">{quantity}</span>
              <Button variant="outline" onClick={() => updateQuantity(1)}>
                <Plus />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full flex items-center justify-center space-x-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart />
              <span>Add to Cart</span>
            </Button>

            {/* Additional Info */}
            {/* <div className="grid grid-cols-2 gap-4 mt-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Package />
                <span>Fast shipping on all orders</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield />
                <span>Secure payment and buyer protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck />
                <span>Reliable delivery services</span>
              </div>
              <div className="flex items-center space-x-2">
                <Store />
                <span>Trusted store with quality products</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <Card className="mt-12">
            <CardHeader>
              <h2 className="text-xl font-semibold">Product Details</h2>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
