import { React, useState, useEffect } from "react";
import { useParams, useNavigate ,Link } from "react-router-dom";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,addDoc,
} from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { Label } from "@/components/ui/label";

import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  User,
  Package,
  Trash2,
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
  id?:string;
  name: string;
  email: string;
  phone: string;
  location: string;
  notes: string;
  preferredContactMethod:string;
  referredBy:string;
  status: string;            
  joinDate: string;  
  totalOrders:number;
  totalSpent: number;

}
const AdminEditOrder = () => {
  const { id } = useParams(); // order ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchOrder();
      fetchCustomers();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setOrder(orderData);
        setNotes(orderData.notes || "");
        setPaymentMethod(orderData.paymentMethod || "");
        setPaymentStatus(orderData.paymentStatus || "");

        setDeliveryStatus(orderData.deliveryStatus || "");
      } else {
        toast({
          title: "Order not found",
          description: "No order found with this ID",
          variant: "destructive",
        });
        navigate("/admin/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error",
        description: "Failed to load order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllCustomers(customers);
    } catch (error) {
      console.error("Error loading customers", error);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, {
        notes,
        paymentMethod,
        deliveryStatus,
        paymentStatus,
      });

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      navigate("/admin/orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!order) return null;

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
              <h1 className="text-2xl font-bold text-foreground">Edit Order</h1>
            </div>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Customer Info */}
              <div>
                <Label>Customer Name</Label>
                <Input value={order.customerInfo?.name || ""} disabled className="mt-1" />
              </div>
  
              {/* Payment Method */}
              <div className="mb-4">
              <label className="block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <Label>Payment Status</Label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="partial">Partial Payment</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Delivery Status</label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Delivery Status</option>
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

  
              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes related to the order..."
                  rows={4}
                  className="mt-1"
                />
              </div>
  
              {/* Submit Button */}
              <div className="pt-4">
                <Button onClick={handleUpdateOrder} className="w-full">
                  Update Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
  
};

export default AdminEditOrder;
