import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Customer {
  docId: string;
  name: string;
  email: string;
  orders: number;
  joinDate: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CustomerOverview = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          name: data.name || "Unknown",
          email: data.email || "-",
          orders: data.totalOrders || 0,
          joinDate: data.joinDate || "N/A", // fallback if not available
        };
      });
      console.log("Customers:", items);
      setCustomers(items);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const recentCustomers = customers.slice(0, 5); // Show only recent 5

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <Card className="card-hover shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            <span>Recent Customers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading customers...</p>
          ) : (
            <div className="space-y-4">
              {recentCustomers.map((customer, index) => (
                <motion.div
                  key={customer.docId}
                  className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-card to-secondary/20 border transition-smooth hover:shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{customer.orders} orders</div>
                    <div className="text-xs text-muted-foreground">{customer.joinDate}</div>
                  </div>
                </motion.div>
              ))}
              <Button asChild variant="outline" size="sm" className="w-full mt-3 card-hover">
                <Link to="/admin/customers">View All Customers</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerOverview;
