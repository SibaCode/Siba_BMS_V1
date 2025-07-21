import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust this import to your actual Firebase setup
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Truck, ShoppingCart, CreditCard, CheckCircle, Clock } from "lucide-react";

const OrderPaymentSummaryCard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toLowerSafe = (value: any) =>
    typeof value === "string" ? value.trim().toLowerCase() : "unknown";

  const normalizedOrders = orders.map(order => ({
    deliveryStatus: toLowerSafe(order.status || order.deliveryStatus),
    paymentStatus: toLowerSafe(order.paymentStatus),
  }));

  const orderStatusData = [
    {
      status: "Processing",
      count: normalizedOrders.filter(o => o.deliveryStatus === "processing").length,
      color: "#f59e0b",
    },
    {
      status: "Delivered",
      count: normalizedOrders.filter(o => o.deliveryStatus === "delivered").length,
      color: "#10b981",
    },
    {
      status: "Not Delivered",
      count: normalizedOrders.filter(o => o.deliveryStatus === "not delivered").length,
      color: "#ef4444",
    },
  ];

  const paymentStatusData = [
    {
      status: "Paid",
      count: normalizedOrders.filter(o => o.paymentStatus === "paid").length,
      color: "#10b981",
    },
    {
      status: "Pending",
      count: normalizedOrders.filter(o => o.paymentStatus === "pending").length,
      color: "#f59e0b",
    },
    {
      status: "Failed",
      count: normalizedOrders.filter(o => o.paymentStatus === "failed").length,
      color: "#ef4444",
    },
  ];

  if (loading) return <div>Loading summary...</div>;

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Order & Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Status */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Order Status
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {orderStatusData.map(item => (
              <div
                key={item.status}
                className="p-3 rounded-lg border bg-muted/40 transition hover:shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  {item.status === "Delivered" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Status
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {paymentStatusData.map(item => (
              <div
                key={item.status}
                className="p-3 rounded-lg border bg-muted/40 text-center hover:shadow"
              >
                <div className="text-lg font-bold" style={{ color: item.color }}>
                  {item.count}
                </div>
                <div className="text-xs text-muted-foreground">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderPaymentSummaryCard;
