"use client";

import { useState } from "react";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CreateOrderForm = () => {
  const router = useRouter();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [items, setItems] = useState([{ name: "", quantity: 1 }]);

  const [orderDetails, setOrderDetails] = useState({
    status: "Pending",
    deliveryMethod: "Pickup",
  });

  const handleAddItem = () => setItems([...items, { name: "", quantity: 1 }]);

  const handleItemChange = (index: number, key: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[key] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      customer,
      items,
      orderDetails,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "orders"), orderData);
    router.push("/orders");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Customer Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input placeholder="Name" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} required />
        <Input placeholder="Email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} required />
        <Input placeholder="Phone" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} required />
      </div>

      <h2 className="text-xl font-semibold">Order Items</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <Input
              placeholder="Item name"
              value={item.name}
              onChange={e => handleItemChange(index, "name", e.target.value)}
              required
            />
            <Input
              type="number"
              min={1}
              placeholder="Qty"
              value={item.quantity}
              onChange={e => handleItemChange(index, "quantity", Number(e.target.value))}
              required
            />
          </div>
        ))}
        <Button type="button" onClick={handleAddItem}>+ Add Item</Button>
      </div>

      <h2 className="text-xl font-semibold">Order Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <select className="border p-2 rounded" value={orderDetails.deliveryMethod} onChange={e => setOrderDetails({ ...orderDetails, deliveryMethod: e.target.value })}>
          <option value="Pickup">Pickup</option>
          <option value="Delivery">Delivery</option>
        </select>
        <select className="border p-2 rounded" value={orderDetails.status} onChange={e => setOrderDetails({ ...orderDetails, status: e.target.value })}>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <Button type="submit" className="mt-4">Submit Order</Button>
    </form>
  );
};

export default CreateOrderForm;
