import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase"; // adjust your path
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card"; // your UI components
import { TrendingUp , CheckCircle , Clock,ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
console.log(orders)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const items = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setOrders(items);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes + " minutes ago";
    } else if (diffHours < 24) {
      return diffHours + " hours ago";
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return diffDays + " day" + (diffDays > 1 ? "s" : "") + " ago";
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="card-hover shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            <span>Recent Orders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
              <div className="space-y-4">
              {loading && <div>Loading orders...</div>}

            {!loading && orders.length === 0 && <div>No orders found.</div>}

            {!loading &&
              orders.slice(0, 4).map((order, index) => (
                  <motion.div 
                    key={order.docId}
                    className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-card to-secondary/20 border transition-smooth hover:shadow-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        {order.status === 'delivered' ? 
                          <CheckCircle className="h-5 w-5 text-green-600" /> :
                          <Clock className="h-5 w-5 text-amber-600" />
                        }
                      </div>
                      <div>
                        <div className="font-medium">{order.orderID}</div>
                        <div className="text-sm text-muted-foreground">{order.createdAt}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">R{order.total}</div>
                      <div className="text-xs text-muted-foreground">{order.docId}</div>
                    </div>
                  </motion.div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full mt-3 card-hover">
                  <Link to="/admin/orders">
                    View All Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
        {/* <CardContent>
          <div className="space-y-4">
            {loading && <div>Loading orders...</div>}

            {!loading && orders.length === 0 && <div>No orders found.</div>}

            {!loading &&
              orders.slice(0, 4).map((order, index) => (
                <motion.div
                  key={order.docId}
                  className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 transition-smooth hover:bg-secondary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <div className="text-sm font-medium">Order {order.orderID || order.orderId || order.docId}</div>
                    <div className="text-xs text-muted-foreground">{formatTimeAgo(order.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">R{order.total ?? 0}</div>
                    <Badge
                      variant={
                        order.paymentStatus?.toLowerCase() === "completed" ||
                        order.paymentStatus?.toLowerCase() === "paid"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {order.paymentStatus || "unknown"}
                    </Badge>
                  </div>
                </motion.div>
              ))}

            <Button asChild variant="outline" size="sm" className="w-full mt-3 card-hover">
              <Link to="/admin/orders">View All Orders</Link>
            </Button>
          </div>
        </CardContent> */}
      </Card>
    </motion.div>
  );
};

export default RecentOrders;
