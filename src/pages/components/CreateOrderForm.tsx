import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust imports if needed

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
const statusColors: any = {
  Pending: "secondary",
  Processing: "warning",
  Shipped: "info",
  Delivered: "success",
};

const CreateOrderForm = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    }
    fetchProducts();
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    const snapshot = await getDocs(collection(db, "orders"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(list);
    setLoadingOrders(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const selectedVariant = selectedProduct?.variants?.find((v: any) => v.variantID === selectedVariantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedVariant || !customerName || !deliveryAddress) {
      alert("Please fill in all fields.");
      return;
    }

    const newOrder = {
      customerName,
      deliveryAddress,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variant: selectedVariant,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "orders"), newOrder);
      alert("Order submitted!");
      // Reset form
      setCustomerName("");
      setDeliveryAddress("");
      setSelectedProduct(null);
      setSelectedVariantId("");
      fetchOrders();
    } catch (err) {
      console.error("Error submitting order:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
    fetchOrders();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Order Form */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Selector */}
            <div>
              <label className="block text-sm font-medium mb-1">Select Product</label>
              <Select
                value={selectedProduct?.id || ""}
                onValueChange={(val) => {
                  const product = products.find((p) => p.id === val);
                  setSelectedProduct(product);
                  setSelectedVariantId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Variant Selector */}
            {selectedProduct && (
              <div>
                <label className="block text-sm font-medium mb-1">Select Variant</label>
                <Select
                  value={selectedVariantId}
                  onValueChange={(val) => setSelectedVariantId(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct.variants?.map((variant: any) => (
                      <SelectItem key={variant.variantID} value={variant.variantID}>
                        {variant.size || variant.name} - {variant.color} - R{variant.sellingPrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Customer Info */}
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <Input
                placeholder="e.g. Jane Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Address</label>
              <Input
                placeholder="e.g. 123 Main Street"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Submit Order
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <p className="text-center text-muted-foreground">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Variant</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                      <td className="p-3">{order.customerName}</td>
                      <td className="p-3">{order.productName}</td>
                      <td className="p-3">{order.variant?.size} / {order.variant?.color}</td>
                      <td className="p-3">{order.deliveryAddress}</td>
                      <td className="p-3">R{order.variant?.sellingPrice}</td>
                      <td className="p-3">
                        <Badge variant={statusColors[order.status] || "secondary"}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Select
                          value={order.status}
                          onValueChange={(val) => updateOrderStatus(order.id, val)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrderForm;
