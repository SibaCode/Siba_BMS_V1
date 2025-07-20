import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Settings, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Store className="h-16 w-16 text-primary mx-auto mb-8" />
            <h1 className="text-5xl font-bold mb-6 text-foreground">
              Complete Online Store System
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional e-commerce solution with inventory management, order tracking, 
              customer records, and a beautiful storefront - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/store">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Visit Store
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/admin">
                  <Settings className="h-5 w-5 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/storefront">
                  <Store className="h-5 w-5 mr-2" />
                  Business Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">
              A complete business management system built for small businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Admin Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-6 w-6 text-primary" />
                  <span>Inventory Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Product management by category</li>
                  <li>• Stock tracking & low stock alerts</li>
                  <li>• Product variants (size, color, type)</li>
                  <li>• Automatic stock updates</li>
                </ul>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/admin/inventory">View Inventory</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <span>Order Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Complete order tracking</li>
                  <li>• Multiple payment methods</li>
                  <li>• Delivery status tracking</li>
                  <li>• Printable invoices</li>
                </ul>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/admin/orders">View Orders</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span>Customer Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Customer profiles & history</li>
                  <li>• Purchase tracking</li>
                  <li>• Contact management</li>
                  <li>• Customer insights</li>
                </ul>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/admin/customers">View Customers</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Store Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-6 w-6 text-primary" />
                  <span>Online Storefront</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Beautiful product catalog</li>
                  <li>• Category filtering & search</li>
                  <li>• Mobile-responsive design</li>
                  <li>• Professional branding</li>
                </ul>
                <Button asChild className="w-full mt-4">
                  <Link to="/store">Visit Store</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <span>Shopping Cart</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Add to cart functionality</li>
                  <li>• Quantity adjustments</li>
                  <li>• Real-time calculations</li>
                  <li>• Seamless checkout</li>
                </ul>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/store/cart">View Cart</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <span>Business Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sales reporting</li>
                  <li>• Best-selling products</li>
                  <li>• Revenue tracking</li>
                  <li>• Customer insights</li>
                </ul>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/admin">View Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Payment Methods</h2>
            <p className="text-xl text-muted-foreground">
              Accept payments through multiple secure channels
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["Yoco", "EFT", "PayFast", "Paystack", "Cash"].map((method) => (
              <Badge key={method} variant="secondary" className="px-4 py-2 text-sm">
                {method}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            Complete e-commerce solution built with modern web technologies
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
