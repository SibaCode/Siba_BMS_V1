
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  MapPin
} from "lucide-react";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  paymentMethod: string;
  termsAccepted: boolean;
  newsletter: boolean;
}

const Checkout = () => {
  const { items, subtotal,total, createOrder } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("yoco");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
            <Button asChild>
              <Link to="/store">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!data.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order
      const order = createOrder(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          province: data.province,
        },
        paymentMethod
      );

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${order.id} has been confirmed.`,
      });

      // Navigate to success page
      navigate("/store/success");
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/store/cart">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <CreditCard className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        {...register("firstName", { required: "First name is required" })}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        {...register("lastName", { required: "Last name is required" })}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="e.g., 078-123-4567" 
                        {...register("phone", { required: "Phone number is required" })}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        placeholder="123 Main Street" 
                        {...register("address", { required: "Address is required" })}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          placeholder="Cape Town" 
                          {...register("city", { required: "City is required" })}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input 
                          id="postalCode" 
                          placeholder="8001" 
                          {...register("postalCode", { required: "Postal code is required" })}
                        />
                        {errors.postalCode && (
                          <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select onValueChange={(value) => setValue("province", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="western-cape">Western Cape</SelectItem>
                          <SelectItem value="gauteng">Gauteng</SelectItem>
                          <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
                          <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                          <SelectItem value="free-state">Free State</SelectItem>
                          <SelectItem value="limpopo">Limpopo</SelectItem>
                          <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="northern-cape">Northern Cape</SelectItem>
                          <SelectItem value="north-west">North West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yoco" id="yoco" />
                      <Label htmlFor="yoco">Yoco (Card Payment)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="eft" id="eft" />
                      <Label htmlFor="eft">EFT (Bank Transfer)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="payfast" id="payfast" />
                      <Label htmlFor="payfast">PayFast</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paystack" id="paystack" />
                      <Label htmlFor="paystack">Paystack</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="font-semibold">
                          R{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>R{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      id="terms" 
                      onCheckedChange={(checked) => setValue("termsAccepted", !!checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox 
                      id="newsletter" 
                      onCheckedChange={(checked) => setValue("newsletter", !!checked)}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to our newsletter for updates and offers
                    </Label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : `Place Order - R${total.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
