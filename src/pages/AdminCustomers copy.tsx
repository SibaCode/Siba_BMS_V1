
import { useState, useEffect } from "react";
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
  Package,
} from "lucide-react";

const categories = ["Aprons", "Mugs", "Umbrellas"];

const AdminInventory2 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form state with your exact required fields
  const [formData, setFormData] = useState({
    id: 0, // number - for adding, will generate
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
    inStock: false,
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products ordered by numeric id descending
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Order by 'id' descending, limit 100 (adjust if needed)
      const q = query(collection(db, "products"), orderBy("id", "desc"), limit(100));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        docId: doc.id, // Firestore doc ID (string)
        ...doc.data(),
      }));
      setProducts(items);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form for add
  const resetForm = () => {
    setFormData({
      id: 0,
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
      inStock: false,
      stock: "",
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
      id: product.id || 0,
      name: product.name || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      image: product.image || "",
      description: product.description || "",
      inStock: product.inStock || false,
      stock: product.stock?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const addProduct = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock ||
      !formData.image
    ) {
      alert("Please fill in all required fields (Name, Category, Price, Stock, Image).");
      return;
    }

    try {
      const newId = generateNextId();
      await addDoc(collection(db, "products"), {
        id: newId,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description,
        inStock: formData.inStock,
        stock: parseInt(formData.stock),
      });
      await fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  // Update product
  const updateProduct = async () => {
    if (!editingProduct) return;

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock ||
      !formData.image
    ) {
      alert("Please fill in all required fields (Name, Category, Price, Stock, Image).");
      return;
    }

    try {
      const productRef = doc(db, "products", editingProduct.docId);
      await updateDoc(productRef, {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description,
        inStock: formData.inStock,
        stock: parseInt(formData.stock),
      });
      await fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  // Delete product
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

  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header and controls (search, filter, add) */}
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
              <h1 className="text-2xl font-bold text-foreground">
                Inventory Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="id">Product ID *</Label>
                      <Input
                        id="id"
                        type="number"
                        placeholder="Numeric ID"
                        value={formData.id || ""}
                        onChange={(e) =>
                          handleInputChange("id", parseInt(e.target.value))
                        }
                        disabled={!!editingProduct} // disable editing id
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Product name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price (R) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL *</Label>
                      <Input
                        id="image"
                        placeholder="/api/placeholder/300/300"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        checked={formData.inStock}
                        onCheckedChange={(checked) =>
                          handleInputChange("inStock", checked === true)
                        }
                        id="inStock"
                      />
                      <Label htmlFor="inStock" className="mb-0">
                        In Stock
                      </Label>
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setIsModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={editingProduct ? updateProduct : addProduct}
                    >
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Product table */}
      <Card className="max-w-7xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <div className="flex space-x-2 items-center">
            <Input
              placeholder="Search product by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Category</th>
                <th className="border border-gray-300 p-2 text-left">Price (R)</th>
                <th className="border border-gray-300 p-2 text-left">In Stock</th>
                <th className="border border-gray-300 p-2 text-left">Stock</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    No products found.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredProducts.map((product) => (
                  <tr key={product.docId} className="border-t border-gray-300">
                    <td className="border border-gray-300 p-2">{product.id}</td>
                    <td className="border border-gray-300 p-2">{product.name}</td>
                    <td className="border border-gray-300 p-2">{product.category}</td>
                    <td className="border border-gray-300 p-2">
                      {product.price?.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {product.inStock ? (
                        <Badge variant="default">Yes</Badge>
                      ) : (
                        <Badge variant="destructive">No</Badge>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">{product.stock}</td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProduct(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory2;
