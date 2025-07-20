
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Save } from "lucide-react";

const businessInfoSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(1, "Address is required"),
  website: z.string().url("Valid URL required").optional().or(z.literal("")),
  slogan: z.string().optional(),
  logo: z.string().url("Valid image URL required").optional().or(z.literal(""))
});

type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;

const AdminBusinessInfo = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      storeName: "",
      ownerName: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      slogan: "",
      logo: ""
    }
  });

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const docRef = doc(db, "businessInfo", "main");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        form.reset(data as BusinessInfoFormData);
      }
    } catch (error) {
      console.error("Error fetching business info:", error);
      toast({
        title: "Error",
        description: "Failed to load business information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BusinessInfoFormData) => {
    setSaving(true);
    try {
      const docRef = doc(db, "businessInfo", "main");
      await setDoc(docRef, data, { merge: true });
      
      toast({
        title: "Success",
        description: "Business information saved successfully"
      });
    } catch (error) {
      console.error("Error saving business info:", error);
      toast({
        title: "Error",
        description: "Failed to save business information",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading business information...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Business Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Store Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Owner's Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="+27 123 456 7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="info@yourstore.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourstore.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full business address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slogan</FormLabel>
                  <FormControl>
                    <Input placeholder="Your business slogan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo Preview */}
            {form.watch("logo") && (
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="border rounded-lg p-4 bg-muted">
                  <img
                    src={form.watch("logo")}
                    alt="Logo preview"
                    className="h-20 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={saving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Business Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminBusinessInfo;
