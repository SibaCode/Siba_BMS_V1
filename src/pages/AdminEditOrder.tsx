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
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  User,
  Package,
  Trash2,
} from "lucide-react";
const AdminEditOrder = () => {
  const { id } = useParams(); // order ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");

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
              <h1 className="text-2xl font-bold text-foreground">Edit New </h1>
            </div>
          </div>
        </div>
      </div>

    </div>
    // <div className="max-w-3xl mx-auto mt-8 p-4 bg-white shadow rounded">
    //   <h2 className="text-xl font-semibold mb-4">Edit Order</h2>

    //   <div className="mb-4">
    //     <label className="block mb-1">Customer Name</label>
    //     <Input value={order.customerInfo?.name || ""} disabled />
    //   </div>

    //   <div className="mb-4">
    //     <label className="block mb-1">Payment Method</label>
    //     <Input
    //       value={paymentMethod}
    //       onChange={(e) => setPaymentMethod(e.target.value)}
    //     />
    //   </div>

    //   <div className="mb-4">
    //     <label className="block mb-1">Delivery Status</label>
    //     <Input
    //       value={deliveryStatus}
    //       onChange={(e) => setDeliveryStatus(e.target.value)}
    //     />
    //   </div>

    //   <div className="mb-4">
    //     <label className="block mb-1">Notes</label>
    //     <textarea
    //       className="w-full border rounded p-2"
    //       rows={4}
    //       value={notes}
    //       onChange={(e) => setNotes(e.target.value)}
    //     />
    //   </div>

    //   <Button onClick={handleUpdateOrder}>Update Order</Button>
    // </div>
  );
};

export default AdminEditOrder;
