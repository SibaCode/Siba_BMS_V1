import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  Truck,
  ShoppingCart,
  Clock,
  CheckCircle,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Variant {
  type: string;
  size?: string;
  color?: string;
  stockQuantity: number;
}

interface Product {
  docId: string;
  name: string;
  category: string;
  variants: Variant[];
}

export const InventoryOverview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lowStockThreshold = 8;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const fetched = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(fetched);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const items = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setOrders(items);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Count categories that are low in stock
  const lowStockCategories = products.filter(product => {
    const totalStock = product.variants?.reduce(
      (sum, v) => sum + (v.stockQuantity || 0),
      0
    );
    return totalStock <= lowStockThreshold;
  }).length;

  const orderStatusData = [
    { status: "Delivered", count: 1, color: "#16a34a" },
    { status: "Not Delivered", count: 3, color: "#f59e0b" }
  ];

  const paymentStatusData = [
    { status: "Paid", count: 4, color: "#16a34a" },
    { status: "Pending", count: 2, color: "#fbbf24" },
    { status: "Failed", count: 1, color: "#ef4444" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stock Overview */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Stock Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading stock...</p>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => {
                const totalStock = product.variants?.reduce(
                  (sum, v) => sum + (v.stockQuantity || 0),
                  0
                ) || 0;

                const isLowStock = totalStock <= lowStockThreshold;

                return (
                  <motion.div
                    key={product.docId}
                    className="flex justify-between items-center p-4 rounded-lg border bg-muted/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isLowStock ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <span className="font-medium capitalize">
                        {product.category}
                      </span>
                      <span className="font-medium capitalize">
                        {product.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{totalStock} units</div>
                      {isLowStock && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {lowStockCategories}{" "}
                    {lowStockCategories === 1 ? "category" : "categories"} low in stock
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order & Payment Summary */}
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
    </div>
  );
};

export default InventoryOverview;
