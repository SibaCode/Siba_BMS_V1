// SeedCustomers.tsx
import { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

const seedCustomers = async () => {
  const customers = [
    {
      name: "Lerato Mokoena",
      email: "lerato@example.com",
      phone: "082-123-4567",
      address: "456 Umlazi Street, Durban",
      joinDate: "2024-12-10",
      status: "VIP",
      totalSpent: 5020.75,
      totalOrders: 15,
      lastOrder: "2025-07-10",
      birthday: "1990-09-05",
      preferredContactMethod: "WhatsApp",
      referredBy: "Instagram Ad",
      notes: "Loves eco-friendly packaging",
      loyaltyPoints: 150,
      location: "Durban",
      isBlocked: false
    }
    // Add more sample customers here
  ];

  for (const customer of customers) {
    await addDoc(collection(db, "customers"), customer);
  }

  console.log("Customer data seeded");
};

const SeedCustomers = () => {
  useEffect(() => {
    seedCustomers();
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold">Seeding customer data...</h1>
    </div>
  );
};

export default SeedCustomers;
