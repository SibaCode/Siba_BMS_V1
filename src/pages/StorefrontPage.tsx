import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink,
  ShoppingBag
} from "lucide-react";

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

const featuredProducts = [
  { name: "Premium Coffee Mug", price: 65, image: "/placeholder.svg", rating: 5 },
  { name: "Custom T-Shirt", price: 120, image: "/placeholder.svg", rating: 4.8 },
  { name: "Eco Tote Bag", price: 85, image: "/placeholder.svg", rating: 4.9 },
];

const StorefrontPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <motion.div 
        className="max-w-6xl mx-auto p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center py-16 relative overflow-hidden"
          variants={cardVariants}
        >
          <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl" />
          <motion.div 
            className="relative z-10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Store className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-4">CustomCraft Co.</h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Premium custom merchandise and branded products for businesses and individuals. 
              Quality craftsmanship meets creative design.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gradient-primary shadow-elegant">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Now
              </Button>
              <Button variant="outline" size="lg" className="card-hover">
                <ExternalLink className="h-5 w-5 mr-2" />
                View Catalog
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Business Info Card */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={cardVariants}
          >
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-6 w-6 text-primary" />
                  About Our Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Since 2018, CustomCraft Co. has been South Africa's premier destination for 
                  high-quality custom merchandise. We specialize in corporate branding, 
                  promotional products, and personalized gifts that make lasting impressions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our team of skilled artisans and designers work with cutting-edge technology 
                  to bring your vision to life. From concept to completion, we ensure every 
                  product meets our exacting standards for quality and creativity.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="secondary" className="px-3 py-1">Custom Printing</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Embroidery</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Corporate Gifts</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Eco-Friendly Options</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Featured Products */}
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredProducts.map((product, index) => (
                    <motion.div
                      key={product.name}
                      className="group cursor-pointer"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium mb-1">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold">R{product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact & Business Hours */}
          <motion.div 
            className="space-y-6"
            variants={cardVariants}
          >
            {/* Contact Info */}
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      123 Creative Street<br />
                      Cape Town, 8001<br />
                      South Africa
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+27 21 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">hello@customcraft.co.za</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    Extended hours available for urgent orders by appointment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="icon" className="card-hover">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="icon" className="card-hover">
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="icon" className="card-hover">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Stay updated with our latest products and behind-the-scenes content.
                </p>
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle>Find Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive Map</p>
                    <p className="text-xs text-muted-foreground">Google Maps integration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StorefrontPage;