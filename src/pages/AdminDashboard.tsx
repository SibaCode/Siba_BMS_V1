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

const AdminDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate dynamic stats
  const lowStockCategories = stockOverviewData.filter(item => item.isLowStock).length;
  const totalStockItems = stockOverviewData.reduce((sum, item) => sum + item.units, 0);
  const deliveredOrders = orderStatusData.find(item => item.status === 'Delivered')?.count || 0;
  const notDeliveredOrders = orderStatusData.find(item => item.status === 'Not Delivered')?.count || 0;
  const paidAmount = paymentStatusData.find(item => item.status === 'Paid')?.count || 0;
  
  const [businessInfo, setBusinessInfo] = useState<any[]>([]);
  console.log(businessInfo)
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
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const customersSnapshot = await getDocs(collection(db, "customers"));

        setTotalProducts(productsSnapshot.size);
        setTotalOrders(ordersSnapshot.size);
        setTotalCustomers(customersSnapshot.size);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Stock Items",
      value: loading ? "..." : totalStockItems,
      description: "Units in inventory",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      change: `${lowStockCategories} categories low`
    },
    {
      title: "Orders Delivered",
      value: loading ? "..." : deliveredOrders,
      description: "Successfully completed",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      change: `${notDeliveredOrders} pending delivery`
    },
    {
      title: "Payment Status",
      value: loading ? "..." : paidAmount,
      description: "Successful payments",
      icon: CreditCard,
      color: "from-purple-500 to-pink-600",
      change: "Latest transactions"
    },
    {
      title: "New Customers",
      value: loading ? "..." : recentCustomers.length,
      description: "Recently joined",
      icon: UserPlus,
      color: "from-amber-500 to-orange-600",
      change: "This week"
    }
  ];

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
          <h1 className="text-3xl font-bold text-gradient"> {businessInfo?.[0]?.name} , </h1>
          <p className="text-muted-foreground">  Here's what's happening with your business.</p>
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
    
      {/* Quick Actions */}
      <motion.div 
        className="flex flex-wrap gap-3"
        variants={cardVariants}
      >
        <Button asChild className="gradient-primary shadow-elegant">
          <Link to="/admin/inventory" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
        <Button asChild variant="outline" className="card-hover">
          <Link to="/admin/orders" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Orders
          </Link>
        </Button>
        <Button asChild variant="outline" className="card-hover">
          <Link to="/store">
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Store
          </Link>
        </Button>
        <Button asChild variant="outline" className="card-hover">
          <Link to="/admin/settings/business-info">
            <Users className="h-4 w-4 mr-2" />
            Business Info
          </Link>
        </Button>
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

      {/* Stock Overview & Order Summary */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Stock Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockOverviewData.map((item, index) => (
                  <motion.div 
                    key={item.category}
                    className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-card to-secondary/20 border transition-smooth hover:shadow-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.isLowStock ? 'bg-red-500' : 'bg-green-500'}`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{item.units} units</div>
                      {item.isLowStock && (
                        <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">{lowStockCategories} categories low in stock</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Order & Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Order Status */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Order Status
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {orderStatusData.map((item, index) => (
                      <motion.div 
                        key={item.status}
                        className="p-3 rounded-lg border bg-gradient-to-r from-card to-secondary/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {item.status === 'Delivered' ? 
                            <CheckCircle className="h-4 w-4 text-green-500" /> : 
                            <Clock className="h-4 w-4 text-amber-500" />
                          }
                          <span className="text-sm font-medium">{item.status}</span>
                        </div>
                        <div className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</div>
                      </motion.div>
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
                    {paymentStatusData.map((item, index) => (
                      <motion.div 
                        key={item.status}
                        className="p-3 rounded-lg border bg-gradient-to-r from-card to-secondary/10 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-lg font-bold" style={{ color: item.color }}>{item.count}</div>
                        <div className="text-xs text-muted-foreground">{item.status}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Customers & Recent Orders */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                <span>Recent Customers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer, index) => (
                  <motion.div 
                    key={customer.email}
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
                  <Link to="/admin/customers">
                    View All Customers
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                <span>Recent Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div 
                    key={order.id}
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
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.customer}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">R{order.amount}</div>
                      <div className="text-xs text-muted-foreground">{order.time}</div>
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
          </Card>
        </motion.div>
      </motion.div>

      {/* Full Inventory Overview */}
      <motion.div variants={cardVariants}>
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
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;