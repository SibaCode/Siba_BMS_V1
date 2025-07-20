
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { 
  ArrowLeft, 
  ShoppingCart as CartIcon, 
  Plus, 
  Minus, 
  Trash2,
  Store
} from "lucide-react";

const ShoppingCart = () => {
  const { items, updateQuantity, removeItem, subtotal, total, itemCount } = useCart();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/store">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <CartIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/store">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <CartIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
              <Button asChild>
                <Link to="/store">
                  <Store className="h-4 w-4 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({itemCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
  {item.image ? (
    <img
      src={item.image}
      alt={item.name}
      className="object-cover w-full h-full"
    />
  ) : (
    <Store className="h-8 w-8 text-muted-foreground" />
  )}
</div>

                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">R{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center"
                            min="0"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>R{subtotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>R{total}</span>
                    </div>
                    <Button className="w-full mt-6" asChild disabled={items.length === 0}>
                      <Link to="/store/checkout">
                        Proceed to Checkout
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Free shipping on orders over R200</p>
                    <p>• Standard delivery: 2-3 business days</p>
                    <p>• Express delivery: 1-2 business days (+R50)</p>
                    <p>• Collection available at store</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
