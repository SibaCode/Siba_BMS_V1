import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { collection, getDocs } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/firebase";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Eye,
  Search,
  Filter,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  UserPlus,
  Truck
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { InventoryOverview } from "@/pages/components/InventoryOverview";
import RecentOrders from "./components/RecentOrders";
import CustomerOverview from "./components/CustomerOverview";



// Mock data for enhanced dashboard
const stockOverviewData = [
  { category: 'Aprons', units: 5, isLowStock: true },
  { category: 'Umbrellas', units: 10, isLowStock: false },
  { category: 'T-Shirts', units: 25, isLowStock: false },
  { category: 'Mugs', units: 3, isLowStock: true },
  { category: 'Bags', units: 18, isLowStock: false },
];

const orderStatusData = [
  { status: 'Delivered', count: 1, color: '#10b981' },
  { status: 'Not Delivered', count: 3, color: '#f59e0b' },
];

const paymentStatusData = [
  { status: 'Paid', count: 15, color: '#10b981' },
  { status: 'Pending', count: 8, color: '#f59e0b' },
  { status: 'Failed', count: 2, color: '#ef4444' },
];

const recentCustomers = [
  { name: 'Sarah Johnson', email: 'sarah@example.com', joinDate: '2 hours ago', orders: 3 },
  { name: 'Mike Chen', email: 'mike@example.com', joinDate: '5 hours ago', orders: 1 },
  { name: 'Emily Davis', email: 'emily@example.com', joinDate: '1 day ago', orders: 2 },
  { name: 'Alex Wilson', email: 'alex@example.com', joinDate: '2 days ago', orders: 4 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Johnson', amount: 450, status: 'delivered', time: '2 hours ago' },
  { id: 'ORD-002', customer: 'Mike Chen', amount: 230, status: 'processing', time: '5 hours ago' },
  { id: 'ORD-003', customer: 'Emily Davis', amount: 180, status: 'delivered', time: '1 day ago' },
  { id: 'ORD-004', customer: 'Alex Wilson', amount: 320, status: 'pending', time: '1 day ago' },
];

const inventoryOverview = [
  { name: "Custom Aprons", category: "Aprons", stock: 5, price: 95, status: "Low Stock" },
  { name: "Travel Umbrellas", category: "Umbrellas", stock: 10, price: 120, status: "Active" },
  { name: "Premium T-Shirts", category: "T-Shirts", stock: 25, price: 85, status: "Active" },
  { name: "Coffee Mugs", category: "Mugs", stock: 3, price: 45, status: "Low Stock" },
  { name: "Laptop Bags", category: "Bags", stock: 18, price: 150, status: "Active" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

// Mock data for charts
const salesData = [
  { name: 'Jan', sales: 4000, revenue: 24000 },
  { name: 'Feb', sales: 3000, revenue: 18000 },
  { name: 'Mar', sales: 5000, revenue: 30000 },
  { name: 'Apr', sales: 4500, revenue: 27000 },
  { name: 'May', sales: 6000, revenue: 36000 },
  { name: 'Jun', sales: 5500, revenue: 33000 },
];

const inventoryData = [
  { category: 'Apparel', stock: 45, lowStock: 3 },
  { category: 'Drinkware', stock: 23, lowStock: 2 },
  { category: 'Kitchen', stock: 18, lowStock: 1 },
  { category: 'Accessories', stock: 32, lowStock: 0 },
];



const AdminDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  // const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate dynamic stats
  const lowStockCategories = stockOverviewData.filter(item => item.isLowStock).length;
  const totalStockItems = stockOverviewData.reduce((sum, item) => sum + item.units, 0);
  // const deliveredOrders = orderStatusData.find(item => item.status === 'Delivered')?.count || 0;
  // const notDeliveredOrders = orderStatusData.find(item => item.status === 'Not Delivered')?.count || 0;
  const paidAmount = paymentStatusData.find(item => item.status === 'Paid')?.count || 0;
  const [businessInfo, setBusinessInfo] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        const businessInfoCol = collection(db, "businessInfo");  
        const businessInfoSnapshot = await getDocs(businessInfoCol);
        const businessInfoList = businessInfoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBusinessInfo(businessInfoList);
        console.log(businessInfoList)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchBusinessInfo();
  }, []);
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const productsSnapshot = await getDocs(collection(db, "products"));
  //       const ordersSnapshot = await getDocs(collection(db, "orders"));
  //       const customersSnapshot = await getDocs(collection(db, "customers"));

  //       setTotalProducts(productsSnapshot.size);
  //       setTotalOrders(ordersSnapshot.size);
  //       setTotalCustomers(customersSnapshot.size);
  //     } catch (err) {
  //       console.error("Error fetching stats", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStats();
  // }, []);


























































  const [todaySales] = useState(850);
  const [monthlyRevenue] = useState(12340);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  // const { customers } = CustomerOverview();


  
  // <CustomerOverview customers={customers} />
  
console.log(products)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const customersSnapshot = await getDocs(collection(db, "customers"));
        console.log(productsSnapshot)

        setTotalProducts(productsSnapshot.size);
        // setTotalOrders(ordersSnapshot.size);
        setTotalCustomers(customersSnapshot.size);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
 ;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = querySnapshot.docs.map(doc => ({
      docId: doc.id,   // "apron", "mug", etc.
      ...doc.data()
    }));
      console.log(items)
      setProducts(items);
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
        ...doc.data(),
      }));
      console.log("Orders:", items);
      setOrders(items);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const items = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data(),
      }));
      console.log("Customers:", items);
      setCustomers(items);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, [])
// Threshold for low stock alert per category
const lowStockThreshold = 10;

// Aggregate stock by category (object)
const categoryStock = products.reduce((acc, product) => {
  const totalStockForProduct = product.variants.reduce(
    (sum, variant) => sum + (variant.stockQuantity || 0),
    0
  );
  if (acc[product.category]) {
    acc[product.category] += totalStockForProduct;
  } else {
    acc[product.category] = totalStockForProduct;
  }
  return acc;
}, {} as Record<string, number>);

// Convert to array and add isLow flag
const categoryStockSummary = Object.entries(categoryStock).map(
  ([category, totalStock]: [string, number]) => ({
    category,
    totalStock,
    isLow: totalStock < lowStockThreshold,
  })
);
const totalStock = categoryStockSummary.reduce(
  (sum, { totalStock }) => sum + totalStock,
  0
);
const lowStockCount = categoryStockSummary.filter(c => c.isLow).length;
const totalOrders = orders.length;

const paidOrders = orders.filter(o => o.paymentStatus?.toLowerCase() === "paid");
const pendingPayments = orders.filter(o => o.paymentStatus?.toLowerCase() === "pending");
const failedPayments = orders.filter(o => o.paymentStatus?.toLowerCase() === "failed");
const processingPayments = orders.filter(o => o.paymentStatus?.toLowerCase() === "processing");
console.log(paidOrders)
const deliveredOrders = orders.filter(
  o =>
    o.deliveryStatus?.toLowerCase() === "delivered" ||
    o.status?.toLowerCase() === "delivered"
);
const notDeliveredOrders = orders.length - deliveredOrders.length;

const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0);


const newCustomers = customers.length
  // Flatten variants for the table
  const flattenedVariants = products.flatMap((product) =>
    product.variants.map((variant) => ({
      docId: product.docId,
      name: product.name,
      category: product.category,
      variantType: variant.type,
      size: variant.size,
      color: variant.color,
      stockQuantity: variant.stockQuantity,
      sellingPrice: variant.sellingPrice,
      productImage: product.productImage,
      status: variant.stockQuantity <= 5 ? "Low Stock" : product.status,
    }))
  );

  // Filter based on search input (checks name, category, variantType, color, size)
  const filteredVariants = flattenedVariants.filter((item) =>
    [
      item.name,
      item.category,
      item.variantType,
      item.color,
      item.size,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );































  // const statsCards = [
  //   {
  //     title: "Total Stock Items",
  //     // value:`${totalStock}units,
  //     value: `${totalStock} units`,
  //     description: "of inventory",
  //     icon: Package,
  //     color: "from-blue-500 to-blue-600",
  //     // change: `${lowStockCategories} categories low`
  //   },
  //   {
  //     title: "Total orders",
  //     value: `${orders.length} order `,
  //     description: "received",
  //     icon: CheckCircle,
  //     color: "from-green-500 to-emerald-600",
  //     // change: `${notDeliveredOrders} pending delivery`,
  //     // title: "Order Summary",
  //     // value: `${orders.length} orders`,
  //     // description: (
  //     //   <ul className="text-sm space-y-1">
  //     //     <li className="text-green-600">Delivered → {deliveredOrders.length}</li>
  //     //     <li className="text-gray-700">Not Delivered → {notDeliveredOrders}</li>
  //     //   </ul>
  //     // ),
  //     // icon: Truck,
  //     // color: "from-gray-500 to-gray-600",
  //     // change: notDeliveredOrders > 0
  //     //   ? `${notDeliveredOrders} pending`
  //     //   : "All delivered",
  //     // changeColor: notDeliveredOrders > 0 ? "text-yellow-600" : "text-green-600"
  //   },
  //   {
  //     title: "Payment Summary",
  // value: `${paidOrders} paid`,
  // description: (
  //   <ul className="text-sm space-y-1">
  //     {/* <li className="text-yellow-600">Pending → {pendingPayments.length}</li> */}
  //     <li className="text-red-600">Failed → {failedPayments.length}</li>
  //     <li className="text-blue-600">Processing → {processingPayments.length}</li>
  //   </ul>
  // ),
  // icon: CreditCard,
  // color: "from-yellow-500 to-yellow-600",
  // change: pendingPayments.length > 0
  //   ? `${pendingPayments.length} processing`
  //   : "No pending payments",
  // changeColor: pendingPayments.length > 0 ? "text-yellow-600" : "text-green-600"
  //   },
  //   {
  //     title: "New Customers",
  //     value: loading ? "..." : newCustomers,
  //     description: "Recently joined",
  //     icon: UserPlus,
  //     color: "from-amber-500 to-orange-600",
  //     change: "This week"
  //   }
  // ];
// Payment status counts

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={cardVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient">{businessInfo?.[0]?.name} , </h1>
          <p className="text-muted-foreground">Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </motion.div>


      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {statsCards.map((stat, index) => (
          <motion.div key={stat.title} variants={cardVariants}>
            <Card className="card-hover card-gradient border-0 shadow-elegant overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-3xl`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{stat.description}</div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <InventoryOverview />
      {/* <RecentOrders /> */}

      {/* Recent Customers & Recent Orders */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
       
       <CustomerOverview  />


        <RecentOrders />
      </motion.div>

      {/* Full Inventory Overview */}
      {/* <motion.div variants={cardVariants}>
        <Card className="card-hover shadow-elegant">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Complete Inventory Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm" className="card-hover">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryOverview.filter(product => 
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.category.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((product, index) => (
                  <motion.tr 
                    key={product.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary/50 transition-smooth"
                  >
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className={product.stock <= 5 ? "text-red-600 font-bold" : "font-medium"}>
                      {product.stock} units
                    </TableCell>
                    <TableCell className="font-medium">R{product.price}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.status === "Low Stock" ? "destructive" : "default"}
                        className={product.status === "Low Stock" ? "animate-pulse" : ""}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="card-hover">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button asChild variant="outline" size="sm" className="card-hover">
                          <Link to="/admin/inventory">
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {inventoryOverview.length} products • {stockOverviewData.reduce((sum, item) => sum + item.units, 0)} total units
              </p>
              <Button asChild className="gradient-primary shadow-elegant">
                <Link to="/admin/inventory">
                  Manage Full Inventory
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}
    </motion.div>
  );
};

export default AdminDashboard;