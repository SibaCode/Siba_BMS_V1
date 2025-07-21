// CreateOrderFormWithCustomer.tsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);

  const selectedVariant = selectedProduct?.variants?.find((v: any) => v.variantID === selectedVariantId);

  useEffect(() => {
    async function fetchProducts() {
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    }

    async function fetchCustomers() {
      const snapshot = await getDocs(collection(db, "customers"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCustomers(list);
    }

    fetchProducts();
    fetchCustomers();
  }, []);

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

  const handleCustomerSelection = async (id: string) => {
    setSelectedCustomerId(id);
    if (id) {
      const docRef = doc(db, "customers", id);
      const snap = await getDoc(docRef);
      const data = snap.data();
      if (data) {
        setCustomerName(data.name);
        setCustomerEmail(data.email);
        setCustomerPhone(data.phone);
        setDeliveryAddress(data.address);
      }
    } else {
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDeliveryAddress("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedVariant || !customerName || !deliveryAddress) {
      alert("Please fill in all required fields.");
      return;
    }

    let customerId = selectedCustomerId;

    const customerData = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      address: deliveryAddress,
    };

    if (customerId) {
      // Update existing
      await updateDoc(doc(db, "customers", customerId), customerData);
    } else {
      // Add new
      const ref = await addDoc(collection(db, "customers"), customerData);
      customerId = ref.id;
    }

    const newOrder = {
      customerId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variant: selectedVariant,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "orders"), newOrder);
      alert("Order submitted!");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDeliveryAddress("");
      setSelectedProduct(null);
      setSelectedVariantId("");
      setSelectedCustomerId("");
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
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Existing Customer</label>
              <Select
                value={selectedCustomerId}
                onValueChange={(val) => handleCustomerSelection(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose existing customer or leave blank for new" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- New Customer --</SelectItem>
                  {customers.map((cust) => (
                    <SelectItem key={cust.id} value={cust.id}>
                      {cust.name} - {cust.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer Info Fields */}
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name" />
            <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Customer Email" />
            <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Customer Phone" />
            <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Delivery Address" />

            {/* Product & Variant */}
            <div>
              <label className="block text-sm font-medium mb-1">Select Product</label>
              <Select
                value={selectedProduct?.id || ""}
                onValueChange={(val) => {
                  const prod = products.find((p) => p.id === val);
                  setSelectedProduct(prod);
                  setSelectedVariantId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>{prod.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <Button type="submit" className="w-full">Submit Order</Button>
          </form>
        </CardContent>
      </Card>

      {/* Order Table same as before */}
      {/* ... Keep your orders table display here ... */}
    </div>
  );
};

export default CreateOrderForm;
