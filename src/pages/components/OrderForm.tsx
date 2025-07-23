// components/OrderForm.tsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface OrderFormProps {
  initialData?: {
    paymentMethod: string;
    paymentStatus: string;
    deliveryStatus: string;
    customerName: string;
    // add more fields as needed
  };
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function OrderForm({ initialData, onSubmit, loading }: OrderFormProps) {
  const [form, setForm] = useState({
    paymentMethod: "",
    paymentStatus: "",
    deliveryStatus: "",
    customerName: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <Input
          value={form.customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
          placeholder="Customer Name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <Select value={form.paymentMethod} onValueChange={(val) => handleChange("paymentMethod", val)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="eft">EFT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Payment Status</label>
        <Select value={form.paymentStatus} onValueChange={(val) => handleChange("paymentStatus", val)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Delivery Status</label>
        <Select value={form.deliveryStatus} onValueChange={(val) => handleChange("deliveryStatus", val)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select delivery status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
