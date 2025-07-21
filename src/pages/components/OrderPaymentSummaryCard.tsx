import { React,useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  User,
  Package,
  Trash2,
} from "lucide-react";
// import React from "react";

interface Product {
  docId: string;
  productID: string;
  name: string;
  category: string;
  productImage: string;
  variants: Variant[];
}

interface Variant {
  type: string;
  color: string;
  size: string;
  sellingPrice: number;
  stockQuantity: number;
  description: string;
  images: string[];
}

interface OrderItem {
  productId: string;
  productName: string;
  variantIndex: number;
  variant: Variant;
  quantity: number;
  price: number;
  total: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const mockCustomers = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
];
const AdminCreateOrder = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("collect");
  const [courierDetails, setCourierDetails] = useState("");
  // const [customerInfo, setCustomerInfo] = useState({ name: "", id: "" });
  const [showCustomerList, setShowCustomerList] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...(doc.data() as Omit<Product, "docId">),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProductToOrder = (product: Product, variantIndex: number) => {
    const variant = product.variants[variantIndex];
    const existingItemIndex = orderItems.findIndex(
      (item) => item.productId === product.docId && item.variantIndex === variantIndex
    );

    if (existingItemIndex >= 0) {
      updateQuantity(existingItemIndex, orderItems[existingItemIndex].quantity + 1);
    } else {
      const newItem: OrderItem = {
        productId: product.docId,
        productName: product.name,
        variantIndex,
        variant,
        quantity: 1,
        price: variant.sellingPrice,
        total: variant.sellingPrice,
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemIndex);
      return;
    }

    const updatedItems = [...orderItems];
    updatedItems[itemIndex].quantity = newQuantity;
    updatedItems[itemIndex].total = updatedItems[itemIndex].price * newQuantity;
    setOrderItems(updatedItems);
  };

  const removeItem = (itemIndex: number) => {
    setOrderItems(orderItems.filter((_, index) => index !== itemIndex));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  const filteredCustomers = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(customerInfo.name.toLowerCase())
  );
  const validateForm = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Validation Error",
        description: "Customer name and phone are required",
        variant: "destructive",
      });
      return false;
    }

    if (orderItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one product to the order",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const orderData = {
        customerInfo,
        items: orderItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        paymentMethod,
        paymentStatus: paymentMethod === "cash" ? "paid" : "pending",
        deliveryStatus: "processing",
        notes,
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: "admin",
      };

      await addDoc(collection(db, "orders"), orderData);

      toast({
        title: "Success",
        description: "Order created successfully",
      });

      navigate("/admin/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/orders">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <ShoppingCart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Create New Order</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        placeholder="Customer full name"
                        className="mt-1"
                      />
                    </div>
                      {/* Customer Full Name */}
      <div className="relative">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={customerInfo.name}
          onChange={(e) => {
            setCustomerInfo({ id: "", name: e.target.value });
            setShowCustomerList(true);
          }}
          onFocus={() => setShowCustomerList(true)}
          placeholder="Customer full name"
          className="mt-1"
          autoComplete="off"
        />

        {/* Existing customers dropdown */}
        {showCustomerList && filteredCustomers.length > 0 && (
          <ul className="absolute bg-white border rounded w-full max-h-40 overflow-auto mt-1 z-10">
            {filteredCustomers.map((cust) => (
              <li
                key={cust.id}
                onClick={() => handleCustomerSelect(cust)}
                className="px-3 py-2 cursor-pointer hover:bg-orange-100"
              >
                {cust.name}
              </li>
            ))}
          </ul>
        )}
      </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        placeholder="+27 123 456 7890"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        placeholder="customer@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, city: e.target.value })
                        }
                        placeholder="Cape Town"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, address: e.target.value })
                        }
                        placeholder="Street address, P.O. box, company name, c/o"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={customerInfo.postalCode}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, postalCode: e.target.value })
                        }
                        placeholder="8001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Product List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Products</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <p>Loading products...</p>
                  ) : products.length === 0 ? (
                    <p>No products found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto">
                      {products.map((product) =>
                        product.variants.map((variant, index) => (
                          <motion.div
                            key={`${product.docId}-${index}`}
                            className="border rounded-lg p-4 bg-white cursor-pointer hover:shadow-lg transition-shadow flex flex-col justify-between"
                            onClick={() => addProductToOrder(product, index)}
                            whileHover={{ scale: 1.03 }}
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                src={variant.images[0] || product.productImage}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                              <div>
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Type: {variant.type}, Color: {variant.color}, Size: {variant.size}
                                </p>
                                <p className="text-orange-600 font-bold mt-1">
                                  R{variant.sellingPrice.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={variant.stockQuantity > 0 ? "default" : "destructive"}
                              className="mt-3 text-xs"
                            >
                              {variant.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="sticky top-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {orderItems.length === 0 ? (
                  <p>Your order is empty.</p>
                ) : (
                  <>
                    {orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded p-3 bg-gray-50 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-semibold">{item.productName}</div>
                          <div className="text-xs text-muted-foreground">
                            Type: {item.variant.type}, Color: {item.variant.color}, Size: {item.variant.size}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Price: R{item.price.toFixed(2)} x Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2 text-right">
                      <div>
                        Subtotal: <span className="font-semibold">R{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div>
                        VAT (15%): <span className="font-semibold">R{calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="text-lg font-bold">
                        Total: <span>R{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <select
                        id="paymentMethod"
                        className="w-full border rounded px-3 py-2"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="cash">Cash</option>
                        <option value="credit">Credit Card</option>
                        <option value="eft">EFT</option>
                      </select>

                      <Label htmlFor="notes">Order Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any special instructions or notes"
                        rows={3}
                      />

                      <Button
                        className="w-full"
                        onClick={createOrder}
                        disabled={submitting}
                      >
                        {submitting ? "Creating Order..." : "Create Order"}
                      </Button>
                    </div>
                    <div className="space-y-6">
      {/* Delivery Method */}
      <div>
        <Label>Delivery Method</Label>
        <div className="flex space-x-4 mt-1">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="deliveryMethod"
              value="collect"
              checked={deliveryMethod === "collect"}
              onChange={() => setDeliveryMethod("collect")}
              className="mr-2"
            />
            Collect
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="deliveryMethod"
              value="courier"
              checked={deliveryMethod === "courier"}
              onChange={() => setDeliveryMethod("courier")}
              className="mr-2"
            />
            Courier
          </label>
        </div>
      </div>

      {/* Courier Details only if courier */}
      {deliveryMethod === "courier" && (
        <div>
          <Label htmlFor="courierDetails">Courier Details</Label>
          <Textarea
            id="courierDetails"
            value={courierDetails}
            onChange={(e) => setCourierDetails(e.target.value)}
            placeholder="Enter courier info"
            className="mt-1"
          />
        </div>
      )}

    

      {/* Other inputs like phone, address etc can go here */}
    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateOrder;
Cannot find name 'handleCustomerSelect'.ts(2304)
