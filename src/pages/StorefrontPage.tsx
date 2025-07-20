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
import { useState,useEffect } from "react";
// import { useCart } from "@/contexts/CartContext";
import { collection, getDocs } from "firebase/firestore";
// import { useToast } from "@/hooks/use-toast";
import { db } from "@/firebase"; 
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

const StorefrontPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [businessInfo, setBusinessInfo] = useState<any[]>([]);


  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsCol = collection(db, "products");  
        const productsSnapshot = await getDocs(productsCol);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        console.log(productsList)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);
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
  // useEffect(() => {
  //   async function fetchBusinessInfo() {
  //     try {
  //       const businessInfoCol = collection(db, "businessInfo");
  //       const snapshot = await getDocs(businessInfoCol);
  //       if (!snapshot.empty) {
  //         const doc = snapshot.docs[0]; // or filter by ID if needed
  //         setBusinessInfo({ id: doc.id, ...doc.data() });
  //       }
  //       console.log
  //     } catch (error) {
  //       console.error("Error fetching business info:", error);
  //     }
  //   }
  
  //   fetchBusinessInfo();
  // }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <motion.div 
        className="max-w-6xl mx-auto p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
     {/* Hero Section */}
     {businessInfo.map((info) => (
  <motion.div 
    key={info.id}
    className="text-center py-16 relative overflow-hidden"
    variants={cardVariants}
  >
    <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl" />
    <motion.div 
      className="relative z-10"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-glow">
        {info.logo ? (
          <img src={info.logo} alt="Business Logo" className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gradient-primary w-full h-full flex items-center justify-center">
            <Store className="h-12 w-12 text-white" />
          </div>
        )}
      </div>
      <h1 className="text-5xl font-bold text-gradient mb-4">
        {info.name}
      </h1>
      <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        {info.description}
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
))}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Business Info Card */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={cardVariants}
          >
           {businessInfo.length > 0 ? (
              businessInfo.map((info, idx) => (
                <Card key={info.id || idx} className="card-hover shadow-elegant mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-6 w-6 text-primary" />
                      About {info.name || "Our Business"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {info.description1 || info.description || "No description available."}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {info.description2 || ""}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-4">
                    {(info.badges || []).map((badge: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-1">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">Loading business information...</p>
            )}



            {/* Featured Products */}
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              

                {products.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow group">
                              <CardHeader className="pb-4">
                              <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                  {product.productImage ? (
                                    <img src={product.productImage} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                      <Store className="h-16 w-16 text-primary/50" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">R{product.variants?.[0]?.sellingPrice }</div>
                                  
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                Available in variety of colours
                                </p>

                                {/* <Button onClick={() => handleProductClick(product.id)}>
                                  View Product 
                                </Button> */}


                              </CardContent>
                            </Card>
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
            {businessInfo?.[0]?.address || "Address not available"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Phone className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">Phone</p>
          <p className="text-sm text-muted-foreground">
            {businessInfo?.[0]?.phone || "Phone number not available"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Mail className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">Email</p>
          <p className="text-sm text-muted-foreground">
            {businessInfo?.[0]?.email || "Email not available"}
          </p>
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
        {/* Replace with your actual social links */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="icon" className="card-hover">
            <Instagram className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="icon" className="card-hover">
            <Facebook className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
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