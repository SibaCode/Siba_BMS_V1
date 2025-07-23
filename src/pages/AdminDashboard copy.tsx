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
  CreditCard,
  Truck,User,
  Plus,
  Eye,
  Search,
  Filter,
  Calendar,
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import RecentOrders from "./components/RecentOrders";
import CustomerOverview from "./components/CustomerOverview";

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
  // const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [lowStockCount, setLowStockCount] = useState(6);
  const [todaySales] = useState(850);
  const [monthlyRevenue] = useState(12340);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const { customers } = CustomerOverview();


  
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
  useEffect(() => {
    fetchProducts();
    fetchOrders();
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
const processingPayments = orders.filter(o => o.paymentStatus?.toLowerCase() === "sibaPending");

const deliveredOrders = orders.filter(
  o =>
    o.deliveryStatus?.toLowerCase() === "delivered" ||
    o.status?.toLowerCase() === "delivered"
);
const notDeliveredOrders = orders.length - deliveredOrders.length;

const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0);



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
// Count low stock categories
  const statsCards = [
 
    {
      title: "Stock Overview",
      value: `${totalStock} units `, // or total products count if desired
      description: (
        <ul className="text-sm max-h-28 overflow-y-auto space-y-1">
          {categoryStockSummary.map(({ category, totalStock, isLow }) => (
            <li
              key={category}
              className={isLow ? "text-red-600 font-semibold" : "text-gray-700"}
              title={isLow ? "Low stock alert" : ""}
            >
              {category} → {totalStock} units
            </li>
          ))}
        </ul>
      ),
      icon: Package,
      color: "from-orange-500 to-orange-600",
      change: lowStockCount > 0
        ? `${lowStockCount} categor${lowStockCount > 1 ? "ies" : "y"} low in stock`
        : "Stock levels are healthy",
      changeColor: lowStockCount > 0 ? "text-red-600" : "text-green-600",
    }
    ,    
    {
  title: "Order Summary",
  value: `${orders.length} orders`,
  description: (
    <ul className="text-sm space-y-1">
      <li className="text-green-600">Delivered → {deliveredOrders.length}</li>
      <li className="text-gray-700">Not Delivered → {notDeliveredOrders}</li>
    </ul>
  ),
  icon: Truck,
  color: "from-gray-500 to-gray-600",
  change: notDeliveredOrders > 0
    ? `${notDeliveredOrders} pending`
    : "All delivered",
  changeColor: notDeliveredOrders > 0 ? "text-yellow-600" : "text-green-600"
},
{
  title: "Payment Summary",
  value: `${paidOrders} invoices`,
  description: (
    <ul className="text-sm space-y-1">
      <li className="text-yellow-600">Pending → {pendingPayments.length}</li>
      <li className="text-red-600">Failed → {failedPayments.length}</li>
      <li className="text-blue-600">Processing → {processingPayments.length}</li>
    </ul>
  ),
  icon: CreditCard,
  color: "from-yellow-500 to-yellow-600",
  change: pendingPayments.length > 0
    ? `${pendingPayments.length} need action`
    : "No pending payments",
  changeColor: pendingPayments.length > 0 ? "text-yellow-600" : "text-green-600"
}


    // {
    //   title: "Total Products",
    //   value: loading ? "..." : totalProducts,
    //   description: "Active in inventory",
    //   icon: Package,
    //   color: "from-blue-500 to-blue-600",
    //   change: "+2 this week"
    // },
    // {
    //   title: "Low Stock Items",
    //   value: loading ? "..." : lowStockCount,
    //   description: "Need restocking",
    //   icon: AlertTriangle,
    //   color: "from-amber-500 to-orange-600",
    //   change: "Urgent attention"
    // },
    // {
    //   title: "Sales Today",
    //   value: `R${todaySales}`,
    //   description: "Today's revenue",
    //   icon: DollarSign,
    //   color: "from-green-500 to-emerald-600",
    //   change: "+12% vs yesterday"
    // },
    // {
    //   title: "Revenue This Month",
    //   value: `R${monthlyRevenue}`,
    //   description: "Monthly earnings",
    //   icon: TrendingUp,
    //   color: "from-purple-500 to-pink-600",
    //   change: "+18% vs last month"
    // }
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
          {/* <h1 className="text-3xl font-bold text-gradient">Dashboard Overview</h1> */}
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
      {/* <motion.div 
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
      </motion.div> */}

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
      {/* <motion.div 
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
      </motion.div> */}

      {/* Recent Activity & Alerts */}
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
              <TableHead>Variant</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price (R)</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVariants.map((item, index) => (
              <motion.tr
                key={`${item.docId}-${item.variantType}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-secondary/50 transition-smooth"
              >
                <TableCell className="font-medium flex items-center gap-2">
                  {/* Optional: Small product image */}
                  <img
                    src={item.productImage}
                    alt={item.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  {item.name}
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.variantType}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell
                  className={
                    item.stockQuantity <= 5 ? "text-amber-600 font-medium" : ""
                  }
                >
                  {item.stockQuantity}
                </TableCell>
                <TableCell>{item.sellingPrice}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "Low Stock" ? "destructive" : "secondary"}>
                    {item.status}
                  </Badge>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredVariants.length} of {flattenedVariants.length} variants
          </p>
          <Button asChild variant="outline" className="card-hover">
            <a href="/admin/inventory">View Full Inventory</a>
          </Button>
          
        </div>
        
      </CardContent>
    </Card>
      </motion.div>
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
              <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-500" /> 
                <span>Recent Customers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
              {loading ? (
                <p className="text-muted-foreground text-center">Loading...</p>
              ) : customers.length === 0 ? (
                <p className="text-muted-foreground text-center">No customers found.</p>
              ) : (
                customers.map((customer, index) => (
                  <motion.div
                    key={customer.orderNumber}
                    className="flex flex-col sm:flex-row sm:justify-between p-3 rounded-lg bg-secondary/50 transition-smooth hover:bg-secondary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm font-medium">
                      <span>{customer.name}</span>
                      <span className="text-muted-foreground">{customer.orderNumber}</span>
                      <Badge variant="default" className="self-start sm:self-center">
                        {customer.totalOrders} orders
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 text-xs text-muted-foreground mt-2 sm:mt-0">
                      <span>{customer.location}</span>
                      <span>{customer.phone}</span>
                      <span>{customer.email}</span>
                    </div>
                  </motion.div>
                 ))
                )}
               
              </div>
              <div className="mt-4 flex justify-between items-center">
          
          <Button asChild variant="outline" size="sm" className="w-full mt-3 card-hover">
                  <Link to="/admin/customers">
                    View All Customers
                  </Link>
                </Button>
        </div>
            </CardContent>
          </Card>
        </motion.div>


        <RecentOrders />

      </motion.div>

     
    </motion.div>
  );
};

export default AdminDashboard;