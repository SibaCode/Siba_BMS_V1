
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart, Order } from "@/contexts/CartContext";
import { 
  CheckCircle, 
  Package, 
  Store, 
  Download,
  Mail,
  ArrowRight
} from "lucide-react";

const OrderSuccess = () => {
  const { lastOrder } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (lastOrder) {
      setOrder(lastOrder);
    } else {
      // Try to get the most recent order from localStorage
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        if (orders.length > 0) {
          setOrder(orders[orders.length - 1]);
        }
      }
    }
  }, [lastOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No order found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find your order details.</p>
            <Button asChild>
              <Link to="/store">Return to Store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 3); // 3 days for delivery
    return deliveryDate.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Order Confirmation</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Thank you for your order. Your order #{order.id} has been confirmed.
              </p>
              <div className="flex justify-center space-x-4 mb-6">
                <Badge variant="secondary" className="px-4 py-2">
                  <Mail className="h-4 w-4 mr-2" />
                  Confirmation details saved
                </Badge>
                <Badge 
                  variant={order.status === 'confirmed' ? 'default' : 'secondary'} 
                  className="px-4 py-2"
                >
                  Status: {order.status}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/store">
                    <Store className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/admin/orders">
                    <Package className="h-4 w-4 mr-2" />
                    View in Admin
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span className="font-medium">{getEstimatedDelivery()}</span>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Items Ordered:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground text-sm ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="font-semibold">
                          R{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>R{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <div className="font-medium">{order.customer.firstName} {order.customer.lastName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <div className="font-medium">{order.customer.email}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <div className="font-medium">{order.customer.phone}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Shipping Address:</span>
                  <div className="font-medium">
                    {order.customer.address}<br />
                    {order.customer.city}, {order.customer.postalCode}<br />
                    {order.customer.province}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Order Confirmation</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order has been confirmed and saved to our system.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team will prepare your order for shipment.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Shipping & Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order will be shipped and delivered by {getEstimatedDelivery()}.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button asChild size="lg">
              <Link to="/store">
                <Store className="h-4 w-4 mr-2" />
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
