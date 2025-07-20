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
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
  const [lowStockCount, setLowStockCount] = useState(6);
  const [todaySales] = useState(850);
  const [monthlyRevenue] = useState(12340);

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
      title: "Total Products",
      value: loading ? "..." : totalProducts,
      description: "Active in inventory",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      change: "+2 this week"
    },
    {
      title: "Low Stock Items",
      value: loading ? "..." : lowStockCount,
      description: "Need restocking",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600",
      change: "Urgent attention"
    },
    {
      title: "Sales Today",
      value: `R${todaySales}`,
      description: "Today's revenue",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      change: "+12% vs yesterday"
    },
    {
      title: "Revenue This Month",
      value: `R${monthlyRevenue}`,
      description: "Monthly earnings",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
      change: "+18% vs last month"
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
          <h1 className="text-3xl font-bold text-gradient">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
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

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(24 95% 53%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(24 95% 53%)", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Inventory by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="hsl(24 95% 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Activity & Alerts */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Low Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Premium Aprons", stock: 3, urgent: true },
                  { name: "Travel Umbrellas", stock: 2, urgent: true },
                  { name: "Limited Edition Mugs", stock: 1, urgent: true },
                  { name: "Custom T-Shirts", stock: 5, urgent: false }
                ].map((item, index) => (
                  <motion.div 
                    key={item.name}
                    className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 transition-smooth hover:bg-secondary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant={item.urgent ? "destructive" : "secondary"}>
                      {item.stock} left
                    </Badge>
                  </motion.div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full mt-3 card-hover">
                  <Link to="/admin/inventory">
                    View All Inventory
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
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Recent Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "#1234", time: "2 hours ago", amount: 450, status: "completed" },
                  { id: "#1235", time: "5 hours ago", amount: 230, status: "processing" },
                  { id: "#1236", time: "1 day ago", amount: 180, status: "completed" },
                  { id: "#1237", time: "1 day ago", amount: 320, status: "pending" }
                ].map((order, index) => (
                  <motion.div 
                    key={order.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 transition-smooth hover:bg-secondary"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <div className="text-sm font-medium">Order {order.id}</div>
                      <div className="text-xs text-muted-foreground">{order.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">R{order.amount}</div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {order.status}
                      </Badge>
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

      {/* Enhanced Inventory Table */}
      <motion.div variants={cardVariants}>
        <Card className="card-hover shadow-elegant">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Inventory Overview</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
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
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Custom T-Shirt", category: "Apparel", stock: 45, price: 120, status: "Active" },
                  { name: "Coffee Mug", category: "Drinkware", stock: 23, price: 65, status: "Active" },
                  { name: "Premium Apron", category: "Kitchen", stock: 3, price: 95, status: "Low Stock" },
                  { name: "Laptop Bag", category: "Accessories", stock: 18, price: 150, status: "Active" },
                  { name: "Water Bottle", category: "Drinkware", stock: 32, price: 45, status: "Active" }
                ].filter(product => 
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
                    <TableCell>{product.category}</TableCell>
                    <TableCell className={product.stock <= 5 ? "text-amber-600 font-medium" : ""}>
                      {product.stock}
                    </TableCell>
                    <TableCell>R{product.price}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.status === "Low Stock" ? "destructive" : "secondary"}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="card-hover">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing 5 of 24 products
              </p>
              <Button asChild variant="outline" className="card-hover">
                <Link to="/admin/inventory">
                  View Full Inventory
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