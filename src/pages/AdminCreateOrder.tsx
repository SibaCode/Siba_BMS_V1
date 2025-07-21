import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  CreditCard,
  Trash2
} from "lucide-react";

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
    postalCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProductToOrder = (product: Product, variantIndex: number) => {
    const variant = product.variants[variantIndex];
    const existingItemIndex = orderItems.findIndex(
      item => item.productId === product.docId && item.variantIndex === variantIndex
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
        total: variant.sellingPrice
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

  const validateForm = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Validation Error",
        description: "Customer name and phone are required",
        variant: "destructive"
      });
      return false;
    }

    if (orderItems.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please add at least one product to the order",
        variant: "destructive"
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
        createdBy: "admin"
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
        variant: "destructive"
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
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Customer full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
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
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="customer@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="Customer address"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Product Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Product Selection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading products...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <div key={product.docId} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <img
                            src={product.productImage}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                          <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
                          <Badge variant="secondary" className="mb-3">{product.category}</Badge>
                          
                          <div className="space-y-2">
                            {product.variants?.map((variant, variantIndex) => (
                              <div key={variantIndex} className="border rounded p-2 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-xs">
                                    <div><strong>Type:</strong> {variant.type}</div>
                                    <div><strong>Color:</strong> {variant.color}</div>
                                    <div><strong>Size:</strong> {variant.size}</div>
                                    <div><strong>Stock:</strong> {variant.stockQuantity}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-primary">R{variant.sellingPrice}</div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() => addProductToOrder(product, variantIndex)}
                                  disabled={variant.stockQuantity <= 0}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add to Order
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm sticky top-6">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {orderItems.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No items added yet</p>
                    ) : (
                      orderItems.map((item, index) => (
                        <div key={index} className="border rounded p-3 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{item.productName}</h5>
                              <p className="text-xs text-muted-foreground">
                                {item.variant.type} • {item.variant.color} • {item.variant.size}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-bold text-primary">R{item.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))
                    )}

                    {orderItems.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>R{calculateSubtotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VAT (15%):</span>
                            <span>R{calculateTax().toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-primary">R{calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit">Store Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes">Order Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Special instructions or notes..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={createOrder}
                      disabled={submitting || orderItems.length === 0}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Order...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Create Order
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateOrder;