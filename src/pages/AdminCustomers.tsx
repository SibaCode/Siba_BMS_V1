import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { collection, getDocs } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/firebase";

import {
  ArrowLeft,
  Search,
  Users,
  Eye,
  Phone,
  Mail
} from "lucide-react";

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomers(items);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const getSafeValue = (value: any) =>
    typeof value === "string" || typeof value === "number" ? value : "N/A";

  const filteredCustomers = customers.filter(customer => {
    const name = getSafeValue(customer.name).toString().toLowerCase();
    const phone = getSafeValue(customer.phone).toString();
    const email = getSafeValue(customer.email).toString().toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      phone.includes(search) ||
      email.includes(search)
    );
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "vip":
        return "default";
      case "active":
      case "new":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.status?.toLowerCase() === "vip").length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrdersCount = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

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
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <div className="text-sm text-muted-foreground">Total Customers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{vipCustomers}</div>
              <div className="text-sm text-muted-foreground">VIP Customers</div>
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
              <div className="text-2xl font-bold">R{avgOrderValue.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Avg Order Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">Loading customers...</div>
        )}

        {/* Customers Table */}
        {!loading && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{getSafeValue(customer.name)}</div>
                            <div className="text-sm text-muted-foreground">
                              Member since {getSafeValue(customer.joinDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{getSafeValue(customer.phone)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{getSafeValue(customer.email)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{customer.totalOrders || 0}</div>
                            <div className="text-xs text-muted-foreground">orders</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">R{(customer.totalSpent || 0).toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            Avg: R{(customer.totalOrders > 0
                              ? customer.totalSpent / customer.totalOrders
                              : 0
                            ).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{getSafeValue(customer.lastOrder)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(customer.status)}>
                            {getSafeValue(customer.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {filteredCustomers.length === 0 && (
              <Card className="py-12 mt-6">
                <CardContent className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Customers will appear here once they start making purchases"}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
