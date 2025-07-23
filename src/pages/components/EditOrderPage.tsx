import AdminCreateOrder from "@/pages//AdminCreateOrder";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";

export default function EditOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setOrder(docSnap.data());
    }
    fetchOrder();
  }, [orderId]);

  const updateOrder = async (formData: any) => {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, formData);
    toast({ title: "Order updated successfully!" });
    navigate("/admin/orders");
  };

  if (!order) return <p>Loading order...</p>;

  return <AdminCreateOrder initialData={order} onSubmit={updateOrder} />;
}
