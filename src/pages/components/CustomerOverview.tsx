// hooks/useFetchCustomers.ts
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // adjust path based on your project

interface Customer {
  name: string;
  orderNumber: string;
  totalOrders: number;
  location: string;
  phone: string;
  email: string;
}

export function CustomerOverview() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
console.log(customers)
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        const items: Customer[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: data.name || "Unknown",
            orderNumber: data.orderNumber || "#0000",
            totalOrders: data.totalOrders || 0,
            location: data.location || "N/A",
            phone: data.phone || "-",
            email: data.email || "-",
          };
        });
        setCustomers(items);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return { customers, loading };
}
export default CustomerOverview;