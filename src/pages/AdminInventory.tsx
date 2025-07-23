import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust path based on your structure
import { Checkbox } from "@/components/ui/checkbox";
import VariantsSection from "./VariantsSection"
// import CategoriesSection from "./CategoriesSection"

import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Package,Boxes,DollarSign,Layers,AlertCircle
} from "lucide-react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  orderDate: string;
  deliveryDate: string | null;
};
const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productID: 0,       // string - unique product identifier, e.g. "apron"
    name: "",            // string
    category: "", 
    // categories: [],       // string
    supplier: "",        // string
    productImage:"",
    batchNumber: "",     // string
    status: "",          // string, e.g. "inStock" or "outOfStock"
    lastRestocked: "",   // string or Date (preferably Date)
    variants: [          // array of variant objects
      {
        type: "",           // string, e.g. "full" or "half"
        color: "",          // string
        size: "",           // string
        sellingPrice: "",   // number or string (if form input)
        stockPrice: "",     // number or string
        stockQuantity: "",  // number or string
        description: "",    // string
        images: [],         // array of strings (urls)
      }
    ],
  });
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Order by 'id' descending, limit 100 (adjust if needed)
      // const q = query(collection(db, "products"), orderBy("id", "desc"), limit(100));
      // const querySnapshot = await getDocs(q);
      // const items = querySnapshot.docs.map((doc) => ({
      //   docId: doc.id, // Firestore doc ID (string)
      //   ...doc.data(),
      // }));
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = querySnapshot.docs.map(doc => ({
      docId: doc.id,   // "apron", "mug", etc.
      ...doc.data()
    }));
      console.log(items)
      setProducts(items);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const resetForm = () => {
    setFormData({
      productID:0,      // string
      name: "",
      category: "",
      // categories: [],
      supplier: "",
      productImage:"",
      batchNumber: "",
      status: "",
      lastRestocked: "",
      variants: [],
    });
    setEditingProduct(null);
  };
  
  // Generate next numeric id by getting max id + 1
  const generateNextId = () => {
    if (products.length === 0) return 1;
    const maxId = Math.max(...products.map((p) => p.id || 0));
    return maxId + 1;
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      productID: product.productID || "",
      name: product.name || "",
      category: product.category || "",
      // categories: [],
      supplier: product.supplier || "",
      productImage: product.productImage || "",
      batchNumber: product.batchNumber || "",
      status: product.status || "",
      lastRestocked: product.lastRestocked || "",
      variants: product.variants?.length > 0
        ? product.variants.map((v: any) => ({
            type: v.type || "",
            color: v.color || "",
            size: v.size || "",
            sellingPrice: v.sellingPrice?.toString() || "",
            stockPrice: v.stockPrice?.toString() || "",
            stockQuantity: v.stockQuantity?.toString() || "",
            description: v.description || "",
            images: Array.isArray(v.images) ? v.images : [],
          }))
        : [
            {
              type: "",
              color: "",
              size: "",
              sellingPrice: "",
              stockPrice: "",
              stockQuantity: "",
              description: "",
              images: [],
            },
          ],
    });
    setIsModalOpen(true);
  };
  const addProduct = async () => {
    console.log(formData.variants)
    if (
      !formData.productID ||
      !formData.name ||
      !formData.category ||
      !formData.supplier ||
      !formData.productImage ||
      !formData.batchNumber ||
      !formData.status ||
      !formData.lastRestocked ||
      formData.variants.length === 0
    ) {
      alert("Please fill in all required main fields and add at least one variant.");
      return;
    }
  
    for (const v of formData.variants) {
      if (
        !v.type ||
        !v.color ||
        !v.size ||
        v.sellingPrice === undefined ||
        v.stockPrice === undefined ||
        v.stockQuantity === undefined
      ) {
        alert("Please fill in all required variant fields.");
        return;
      }
    }
  
    try {
      await addDoc(collection(db, "products"), {
        productID: formData.productID,
        name: formData.name,
        category: formData.category,
        supplier: formData.supplier,
        productImage: formData.productImage,
        batchNumber: formData.batchNumber,
        status: formData.status,
        lastRestocked: formData.lastRestocked,
        variants: formData.variants.map((v) => ({
          type: v.type,
          color: v.color,
          size: v.size,
          sellingPrice: parseFloat(v.sellingPrice),
          stockPrice: parseFloat(v.stockPrice),
          stockQuantity: parseInt(v.stockQuantity, 10),
          description: v.description,
          images: v.images,
        })),
      });
  
      await fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };
  
  
  const updateProduct = async () => {
    if (!editingProduct) return;
      if (
      !formData.productID ||
      !formData.name ||
      !formData.category ||
      !formData.supplier ||
      !formData.productImage ||
      !formData.batchNumber ||
      !formData.status ||
      !formData.lastRestocked ||
      formData.variants.length === 0
    ) {
      alert("Please fill in all required main fields and add at least one variant.");
      return;
    }
  
    for (const v of formData.variants) {
      if (
        !v.type ||
        !v.color ||
        !v.size ||
        !v.sellingPrice ||
        !v.stockPrice ||
        !v.stockQuantity
      ) {
        alert("Please fill in all required variant fields.");
        return;
      }
    }
  
    try {
      const productRef = doc(db, "products", editingProduct.docId);
      await updateDoc(productRef, {
        productID: formData.productID,
        name: formData.name,
        category: formData.category,
        supplier: formData.supplier,
        productImage: formData.productImage,
        batchNumber: formData.batchNumber,
        status: formData.status,
        lastRestocked: formData.lastRestocked,
        variants: formData.variants.map((v) => ({
          type: v.type,
          color: v.color,
          size: v.size,
          sellingPrice: parseFloat(v.sellingPrice),
          stockPrice: parseFloat(v.stockPrice),
          stockQuantity: parseInt(v.stockQuantity, 10),
          description: v.description,
          images: v.images,
        })),
      });
      await fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  const deleteProduct = async (product: any) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      await deleteDoc(doc(db, "products", product.docId));
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setFormData({ ...formData, variants: updatedVariants });
  };
  
  const handleVariantImageChange = (index: number, imageUrl: string) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      images: imageUrl ? [imageUrl] : [],
    };
    setFormData({ ...formData, variants: updatedVariants });
  };
  
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          type: "",
          color: "",
          size: "",
          sellingPrice: "",
          stockPrice: "",
          stockQuantity: "",
          description: "",
          images: [],
        },
      ],
    });
  };
  
  const removeVariant = (index: number) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };
  
  const lowStockCount = products.filter((p) => {
    const totalStock = p.variants?.reduce((sum: number, variant: any) => sum + (variant.stockQuantity || 0), 0) || 0;
    return totalStock < 5;
  }).length;

  const categories = ["all", "Aprons", "Mugs", "Umbrellas"];
// Calculate how many products have at least one low-stock variant
const productsWithLowStock = products.filter(product =>
  product.variants?.some((variant: any) => (variant.stockQuantity || 0) < 5)
).length;

const productsWithOutOfStockVariants = products.map(product => {
  const outOfStockVariantsCount = product.variants?.filter(v => (v.stockQuantity || 0) === 0).length || 0;
  return {
    productName: product.name || product.productName || 'Unnamed Product',
    outOfStockVariantsCount,
  };
}).filter(p => p.outOfStockVariantsCount > 0);

const totalOutOfStockVariants = productsWithOutOfStockVariants.reduce((sum, p) => sum + p.outOfStockVariantsCount, 0);
const totalProductsWithOutOfStockVariants = productsWithOutOfStockVariants.length;
const outOfStockProducts = products.filter(product =>
  product.variants?.some((v: any) => (v.stockQuantity || 0) === 0)
);
const lowStockProducts = products.filter(product =>
  product.variants?.some((v: any) => (v.stockQuantity || 0) < 5)
);

const totalStockValue = products.reduce((total, product) => {
  const productValue = product.variants?.reduce((sum: number, variant: any) => {
    return sum + ((variant.sellingPrice || 0) * (variant.stockQuantity || 0));
  }, 0) || 0;
  return total + productValue;
}, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            </div>

            <div className="flex items-center space-x-4">

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
                
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                  {/* Core Product Fields */}
                  <div>
                    <Label htmlFor="productID">Product ID *</Label>
                    <Input
                      id="productID"
                      type="text"
                      placeholder="e.g. PRD123"
                      value={formData.productID}
                      onChange={(e) => handleInputChange("productID", e.target.value)}
                      disabled={!!editingProduct}
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="Product name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                  <Label htmlFor="category">Category *</Label>
                  <input
                    id="category"
                    list="category-list"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                  <datalist id="category-list">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                  <div>
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Input
                      id="supplier"
                      placeholder="Supplier name"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange("supplier", e.target.value)}
                    />
                  </div>
                  <div>
              <Label htmlFor="productImage">Product Image *</Label>
              <Input
                id="productImage"
                placeholder="Product Image URL"
                value={formData.productImage}
                onChange={(e) => handleInputChange("productImage", e.target.value)}
              />
              {/* Image preview */}
              {formData.productImage && (
                <img
                  src={formData.productImage}
                  alt="Product Preview"
                  className="mt-2 max-h-40 object-contain border rounded"
                />
              )}
            </div>


                  <div>
                    <Label htmlFor="batchNumber">Batch Number *</Label>
                    <Input
                      id="batchNumber"
                      placeholder="Batch #"
                      value={formData.batchNumber}
                      onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Input
                      id="status"
                      placeholder="e.g. Active / Inactive"
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastRestocked">Last Restocked</Label>
                    <Input
                      id="lastRestocked"
                      type="date"
                      value={formData.lastRestocked}
                      onChange={(e) => handleInputChange("lastRestocked", e.target.value)}
                    />
                  </div>
                </div>


                <VariantsSection formData={formData} setFormData={setFormData} />


                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingProduct ? updateProduct : addProduct}>
                    {editingProduct ? "Update Product" : "Add new product"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
  
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
  <CardContent className="p-4 flex flex-col gap-2">
    <div className="flex items-center gap-3 mb-2">
      <Boxes className="text-purple-600 w-6 h-6" />
      <div className="text-sm font-semibold text-muted-foreground">Total Units Available</div>
    </div>
    <div className="space-y-1 text-sm">
      <div className="flex justify-between font-bold text-purple-600">
        <span>Total Units</span>
        <span>
          {products.reduce((total, product) =>
            total + (product.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0) || 0), 0)}
        </span>
      </div>

      {products.map((product: any, idx: number) => {
        const totalUnits = product.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0) || 0;
        return (
          <div
            key={idx}
            className="flex justify-between text-xs text-muted-foreground ml-8"
          >
            <span>{product.name}</span>
            <span className="text-purple-600 font-semibold">{totalUnits}</span>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-4 flex flex-col gap-2">
    <div className="flex items-center gap-3 mb-2">
      <AlertTriangle className="text-red-600 w-6 h-6" />
      <div className="text-sm font-semibold text-muted-foreground">Low Stock Products</div>
    </div>
    <div className="space-y-1 text-sm">
      <div className="flex justify-between font-bold text-red-600">
        <span>Low Stock</span>
        <span>
          {
            products.filter(product =>
              product.variants?.some((v: any) => (v.stockQuantity || 0) < 5)
            ).length
          }
        </span>
      </div>

      {products.filter(product =>
        product.variants?.some((v: any) => (v.stockQuantity || 0) < 5)
      ).map((product: any, idx: number) => {
        const lowVariantsCount = product.variants?.reduce((count: number, v: any) =>
          count + ((v.stockQuantity || 0) < 5 ? 1 : 0), 0) || 0;
        return (
          <div
            key={idx}
            className="flex justify-between text-xs text-muted-foreground ml-8"
          >
            <span>{product.name}</span>
            <span className="text-red-600 font-semibold">{lowVariantsCount} variant{lowVariantsCount > 1 ? "s" : ""}</span>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>
<Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="text-red-700 w-6 h-6" />
          <div className="text-sm font-semibold text-muted-foreground">Out of Stock Products</div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between font-bold text-red-700">
            <span>Out of Stock</span>
            <span>{outOfStockProducts.length}</span>
          </div>

          {outOfStockProducts.map((product: any, idx: number) => {
            const outOfStockVariantsCount = product.variants?.reduce((count: number, v: any) =>
              count + ((v.stockQuantity || 0) === 0 ? 1 : 0), 0) || 0;
            return (
              <div
                key={idx}
                className="flex justify-between text-xs text-muted-foreground ml-8"
              >
                <span>{product.name}</span>
                <span className="text-red-700 font-semibold">
                  {outOfStockVariantsCount} variant{outOfStockVariantsCount > 1 ? "s" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
    
<Card>
<Card className="max-w-md mx-auto bg-white shadow-md rounded-lg border border-gray-200">
  <CardContent className="p-5 flex flex-col gap-3">
    <div className="flex items-center gap-3 mb-3">
      <DollarSign className="text-green-600 w-7 h-7" />
      <h2 className="text-lg font-semibold text-gray-800">Total Stock Value</h2>
    </div>
    <div className="text-xl font-bold text-green-700 border-b border-green-200 pb-2">
      R{totalStockValue.toFixed(2)}
    </div>
    <p className="text-sm text-gray-600 mt-1">Value of all units in stock</p>
  </CardContent>
</Card>
</Card>
    {/* </div> */}

        {/* <Card>
    <CardContent className="p-4 flex items-start gap-4">
      <Package className="text-primary h-8 w-8 mt-1" />
      <div>
        <div className="text-xl font-bold">{products.length}</div>
        <div className="text-sm text-muted-foreground">Total Products</div>
        <p className="text-xs text-muted-foreground">All listed product types</p>
      </div>
    </CardContent>
  </Card>
  <Card>
  <CardContent className="p-4 flex items-start gap-4">
    <AlertCircle className="text-orange-500 h-8 w-8 mt-1" />
    <div>
      <div className="text-xl font-bold text-orange-600">{productsWithLowStock}</div>
      <div className="text-sm font-semibold text-orange-700">Products Affected</div>
      <p className="text-xs text-muted-foreground">Have at least 1 low-stock variant</p>
    </div>
  </CardContent>
</Card>

  <Card>
    <CardContent className="p-4 flex items-start gap-4">
      <AlertTriangle className="text-red-600 h-8 w-8 mt-1" />
      <div>
        <div className="text-xl font-bold text-red-600">{lowStockCount}</div>
        <div className="text-sm font-semibold text-red-700">Low Stock Alerts</div>
        <p className="text-xs text-muted-foreground">Items with &lt; 5 units left</p>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4 flex items-start gap-4">
      <Layers className="text-blue-600 h-8 w-8 mt-1" />
      <div>
        <div className="text-xl font-bold">{categories.length - 1}</div>
        <div className="text-sm text-muted-foreground">Product Categories</div>
        <p className="text-xs text-muted-foreground">Excludes default "All"</p>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4 flex items-start gap-4">
      <DollarSign className="text-green-600 h-8 w-8 mt-1" />
      <div>
        <div className="text-xl font-bold">
          R{products.reduce((sum, p) => {
            const productValue = p.variants?.reduce((variantSum: number, variant: any) =>
              variantSum + ((variant.sellingPrice || 0) * (variant.stockQuantity || 0)), 0
            ) || 0;
            return sum + productValue;
          }, 0).toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground">Total Stock Value</div>
        <p className="text-xs text-muted-foreground">Calculated from price × quantity</p>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4 flex items-start gap-4">
      <Boxes className="text-purple-600 h-8 w-8 mt-1" />
      <div>
        <div className="text-xl font-bold">
          {products.reduce((total, product) => {
            return total + (product.variants?.reduce((sum: number, v: any) =>
              sum + (v.stockQuantity || 0), 0) || 0);
          }, 0)}
        </div>
        <div className="text-sm text-muted-foreground">Total Units Available</div>
        <p className="text-xs text-muted-foreground">All units across all variants</p>
      </div>
    </CardContent>
  </Card> */}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Aprons">Aprons</SelectItem>
              <SelectItem value="Mugs">Mugs</SelectItem>
              <SelectItem value="Umbrellas">Umbrellas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const totalUnits = product.variants?.reduce(
              (sum: number, variant: any) => sum + (variant.stockQuantity || 0),
              0
            ) || 0;
            
            const lowStockVariants = product.variants?.filter(
              (variant: any) => (variant.stockQuantity || 0) < 5
            ) || [];
            
            const lowStockCount = lowStockVariants.length;
            
            const totalStock = product.variants?.reduce((sum: number, variant: any) => sum + (variant.stockQuantity || 0), 0) || 0;
            const isLowStock = totalStock < 5;
            const priceRange = product.variants?.length > 1 
              ? `R${Math.min(...product.variants.map((v: any) => v.sellingPrice || 0))} - R${Math.max(...product.variants.map((v: any) => v.sellingPrice || 0))}`
              : `R${product.variants?.[0]?.sellingPrice || 0}`;

            return (
              
              <Card key={product.productID} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.productImage ? (
                      <img
                        src={product.productImage}
                        alt={product.name}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    ) : (
                      <Package className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>

                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant={isLowStock ? "destructive" : "default"}>
                      {isLowStock && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {totalStock} total stock
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-4">
                  

                    {/* <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={product.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {product.status}
                      </Badge>
                    </div> */}

                    {/* Variants Preview */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Variant Details:</div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {product.variants.slice(0, 3).map((variant: any, index: number) => (
                            <div key={index} className="bg-muted/50 p-2 rounded text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {variant.color} {variant.size} {variant.type}
                                </span>
                                <Badge variant={variant.stockQuantity < 5 ? "destructive" : "outline"} className="text-xs">
                                  {variant.stockQuantity}
                                </Badge>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span>R{variant.sellingPrice}</span>
                                <span className="text-muted-foreground">Cost: R{variant.stockPrice}</span>
                              </div>
                            </div>
                          ))}
                          {product.variants.length > 3 && (
                            <div className="text-center text-xs text-muted-foreground py-1">
                              +{product.variants.length - 3} more variants
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditModal(product)} 
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      disabled
                      onClick={() => deleteProduct(product)} 
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first product to get started"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
};

export default AdminInventory;