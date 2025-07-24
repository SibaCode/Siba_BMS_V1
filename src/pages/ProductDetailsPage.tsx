import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          setSelectedVariant(data.variants?.[0]); // default to first variant
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      id: selectedVariant.variantID,
      name: product.name,
      price: selectedVariant.sellingPrice,
      category: product.category,
      image: product.productImage,
      // variant: selectedVariant,
    });
  };

  if (!product) {
    return <div className="p-6 text-center text-muted-foreground">Loading product...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="flex-1">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {product.productImage ? (
              <img src={product.productImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-muted-foreground">No Image</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <Badge variant="secondary">{product.category}</Badge>
          <p className="text-muted-foreground text-sm">
            {product.description || "Premium quality product with multiple options"}
          </p>

          {/* Variant Selector */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Choose Variant:</label>
            <Select
              value={selectedVariant?.variantID}
              onValueChange={(val) =>
                setSelectedVariant(product.variants.find((v: any) => v.variantID === val))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {product.variants?.map((variant: any) => (
                  <SelectItem key={variant.variantID} value={variant.variantID}>
                    {variant.size || variant.name} - {variant.color} - R{variant.sellingPrice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price and Add to Cart */}
          <div className="mt-6 space-y-2">
            <div className="text-2xl font-bold text-primary">
              R{selectedVariant?.sellingPrice ?? "0.00"}
            </div>
            <Button onClick={handleAddToCart} disabled={!selectedVariant}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;


// export default ProductDetailsPage;
