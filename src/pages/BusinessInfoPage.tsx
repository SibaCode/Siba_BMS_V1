import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  Edit3,
  Calendar,
  Globe,
  Hash,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const BusinessInfoPage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<any>({});
  // const [businessInfo, setBusinessInfo] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        const businessInfoCol = collection(db, "businessInfo");
        const snapshot = await getDocs(businessInfoCol);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          setBusinessInfo({
            id: docData.id,
            ...docData.data(),
          });
        }
      } catch (error) {
        console.error("Error fetching business info:", error);
      }
    }

    fetchBusinessInfo();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setBusinessInfo((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!businessInfo.id) return;

    setIsSaving(true);

    try {
      const businessDocRef = doc(db, "businessInfo", businessInfo.id);
      const { id, ...dataToUpdate } = businessInfo;
      await updateDoc(businessDocRef, dataToUpdate);

      toast({
        title: "Business information updated!",
        description: "Your changes have been saved successfully.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating business info:", error);
      toast({
        title: "Update failed",
        description: "There was an error saving the changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const InputField = ({
    icon: Icon,
    label,
    field,
    type = "text",
    placeholder,
    textarea = false,
  }: {
    icon: any;
    label: string;
    field: string;
    type?: string;
    placeholder?: string;
    textarea?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      {textarea ? (
        <Textarea
          value={businessInfo[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          disabled={!isEditing}
          className={`transition-all duration-300 ${
            isEditing
              ? "border-primary/50 focus:border-primary shadow-sm"
              : "border-muted bg-muted/50"
          }`}
          rows={4}
        />
      ) : (
        <Input
          type={type}
          value={businessInfo[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          disabled={!isEditing}
          className={`transition-all duration-300 ${
            isEditing
              ? "border-primary/50 focus:border-primary shadow-sm"
              : "border-muted bg-muted/50"
          }`}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <motion.div
        className="max-w-4xl mx-auto p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          variants={cardVariants}
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Business Information
            </h1>
            <p className="text-muted-foreground">
              Manage your business details and contact information
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gradient-primary shadow-elegant">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Info
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="card-hover"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gradient-primary shadow-elegant"
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 mr-2"
                    >
                      <Save className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Details */}
          <motion.div variants={cardVariants}>
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InputField icon={Building2} label="Business Name" field="businessName" placeholder="Enter business name" />
                <InputField icon={FileText} label="Industry Type" field="industryType" placeholder="Enter industry type" />
                <InputField icon={Hash} label="Registration Number" field="registrationNumber" placeholder="Enter registration number" />
                <InputField icon={Hash} label="VAT Number" field="vatNumber" placeholder="Enter VAT number" />
                <InputField icon={Calendar} label="Founded Year" field="foundedYear" placeholder="Enter founding year" />
                <InputField icon={User} label="Employee Count" field="employeeCount" placeholder="e.g., 15-25" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={cardVariants}>
            <Card className="card-hover shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-6 w-6 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InputField icon={Mail} label="Email Address" field="email" type="email" placeholder="Enter email" />
                <InputField icon={Phone} label="Phone Number" field="phone" type="tel" placeholder="Enter phone" />
                <InputField icon={Globe} label="Website" field="website" placeholder="Enter website URL" />
                <InputField icon={MapPin} label="Business Address" field="address" placeholder="Enter address" />
                <InputField icon={FileText} label="Business Description" field="description" placeholder="Describe business" textarea />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Management Info */}
        <motion.div variants={cardVariants}>
          <Card className="card-hover shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Management Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={User} label="Business Owner" field="ownerName" placeholder="Enter owner's name" />
                <InputField icon={User} label="General Manager" field="managerName" placeholder="Enter manager's name" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants}>
          {[
            {
              label: "Years in Business",
              value: businessInfo.foundedYear ? new Date().getFullYear() - parseInt(businessInfo.foundedYear) : "-",
              icon: Calendar,
            },
            {
              label: "Team Size",
              value: businessInfo.employeeCount || "-",
              icon: User,
            },
            {
              label: "Active Since",
              value: businessInfo.foundedYear || "-",
              icon: Building2,
            },
            {
              label: "Industry",
              value: businessInfo.industryType || "-",
              icon: FileText,
            },
          ].map((stat) => (
            <motion.div key={stat.label} variants={cardVariants}>
              <Card className="card-hover shadow-elegant text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BusinessInfoPage;
