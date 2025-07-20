"use client";

import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import AdminOrders from "@/pages/AdminOrders";

const OrdersPage = () => {
  const router = useRouter();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button onClick={() => router.push("/orders/create")}>+ Create Order</Button>
      </div>

      <AdminOrders />
    </div>
  );
};

export default OrdersPage;
