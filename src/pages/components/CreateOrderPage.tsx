import AdminCreateOrder from "@/pages/AdminCreateOrder";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function CreateOrderPage() {
  const navigate = useNavigate();

  const createOrder = async (formData: any) => {
    const orderData = {
      ...formData,
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      paymentStatus: formData.paymentMethod === "cash" ? "paid" : "pending",
      deliveryStatus: "processing",
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: "admin",
    };

    await addDoc(collection(db, "orders"), orderData);
    toast({ title: "Order created successfully!" });
    navigate("/admin/orders");
  };

  return <AdminCreateOrder onSubmit={createOrder} />;
}
