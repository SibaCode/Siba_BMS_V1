import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/firebase"; // your Firebase config
import { collection, getDocs } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

import { 
  ArrowLeft, 
  Search, 
  Filter, 
  FileText, 
  Download,
  ShoppingCart,
  Eye
} from "lucide-react";

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // Mock data - in real app this would come from backend
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
        console.log(ordersData)
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  const handleEdit = (order: any) => {
    setEditingOrder(order);
    console.log(order)
  };
  

  const handleSaveChanges = async () => {
    if (!editingOrder?.id) return;
  
    try {
      const orderRef = doc(db, "orders", editingOrder.id);
  
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(orderRef, {
          paymentMethod: editingOrder.paymentMethod,
          paymentStatus: editingOrder.paymentStatus,
          deliveryStatus: editingOrder.deliveryStatus,
        });
      } else {
        // Document does not exist, create it or handle error
        await setDoc(orderRef, {
          paymentMethod: editingOrder.paymentMethod,
          paymentStatus: editingOrder.paymentStatus,
          deliveryStatus: editingOrder.deliveryStatus,
          // add other required fields here if needed
        });
      }
  
      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrder.id ? editingOrder : order
        )
      );
  
      setEditingOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };
  const handleExportCSV = () => {
    if (orders.length === 0) return;
  
    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "Items",
      "Total",
      "Payment Method",
      "Payment Status",
      "Delivery Status"
    ];
  
    const rows = orders.map(order => {
      const itemsString = order.items.map((item: any) => `${item.name} x${item.quantity}`).join(", ");
      return [
        order.orderId,
        `${order.customer.firstName} ${order.customer.lastName}`,
        order.customer.phone,
        itemsString,
        `R${order.total.toFixed(2)}`,
        order.paymentMethod,
        order.paymentStatus,
        order.deliveryStatus
      ];
    });
  
    const csvContent = [headers, ...rows]
      .map(e => e.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
 
  
  const filteredOrders = orders.filter(order => {
    // Compose a string for customer name
    const customerName = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
    
    const matchesSearch = customerName.includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.paymentStatus.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // const getStatusBadgeVariant = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "paid":
  //       return "default";
  //     case "pending":
  //       return "secondary";
  //     case "failed":
  //       return "destructive";
  //     default:
  //       return "secondary";
  //   }
  // };
  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return "secondary"; // or some default variant
  
    switch (status.toLowerCase()) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };
  const getDeliveryStatusBadgeVariant = (status?: string) => {
    if (!status) return "secondary"; // default variant if status missing
  
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "not delivered":
        return "destructive";
      case "processing":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.paymentStatus === "Pending").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <ShoppingCart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline"  onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
       
       
       
       
       
       
       
       
       
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary">{pendingOrders}</div>
              <div className="text-sm text-muted-foreground">Pending Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">R{totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">R{(totalRevenue / orders.length).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Average Order</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Date</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>
                      <div>
                        {/* <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.phone}</div> */}
                        <div className="font-medium">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer.phone}
                      </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">R{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.paymentMethod}</div>
                        <Badge variant={getStatusBadgeVariant(order.paymentStatus)} className="mt-1">
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.deliveryStatus && (
                      <Badge variant={getDeliveryStatusBadgeVariant(order.deliveryStatus)}>
                        {order.deliveryStatus}
                      </Badge>
                    )}
                    </TableCell>
                    {/* <TableCell className="text-sm">
                      <div>{order.orderDate}</div>
                      {order.deliveryDate && (
                        <div className="text-muted-foreground">Delivered: {order.deliveryDate}</div>
                      )}
                    </TableCell> */}
                    <TableCell>
                      <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(order)}>
                        Edit
                      </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/invoice/${order.id}`}>
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Order #{editingOrder?.orderId}</DialogTitle>
                </DialogHeader>
                {editingOrder && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    <Input
                      value={editingOrder.paymentMethod}
                      onChange={(e) =>
                        setEditingOrder({ ...editingOrder, paymentMethod: e.target.value })
                      }
                      placeholder="Payment Method"
                    />
                   <Select
                    value={editingOrder.paymentStatus}
                    onValueChange={(val) =>
                      setEditingOrder({ ...editingOrder, paymentStatus: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={editingOrder.deliveryStatus}
                    onValueChange={(val) =>
                      setEditingOrder({ ...editingOrder, deliveryStatus: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Delivery Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Not Delivered">Not Delivered</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>

                  </div>
                )}
                <DialogFooter className="flex gap-2">
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditingOrder(null)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


          </CardContent>
        </Card>

        {filteredOrders.length === 0 && (
          <Card className="py-12 mt-6">
            <CardContent className="text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here once customers start purchasing"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
