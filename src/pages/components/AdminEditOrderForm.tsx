import React, { useState, useEffect } from "react";

interface AdminEditOrderFormProps {
  mode: "edit" | "create";  // you can extend for create if needed
  initialData: any;         // shape of your order data from Firestore
  onSubmit: (data: any) => Promise<void> | void;
  submitting: boolean;
}

export default function AdminEditOrderForm({
  mode,
  initialData,
  onSubmit,
  submitting,
}: AdminEditOrderFormProps) {
  // You can type your form data more strictly based on your order fields
  const [formData, setFormData] = useState<any>({
    customerName: "",
    email: "",
    status: "",
    total: 0,
    // add other fields your order has
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerName: initialData.customerName || "",
        email: initialData.email || "",
        status: initialData.status || "",
        total: initialData.total || 0,
        // fill with other fields from initialData
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "total" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* Customer Name */}
      <div>
        <label htmlFor="customerName" className="block font-medium">
          Customer Name
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          disabled={submitting}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={submitting}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={submitting}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Total */}
      <div>
        <label htmlFor="total" className="block font-medium">
          Total Amount
        </label>
        <input
          type="number"
          id="total"
          name="total"
          value={formData.total}
          onChange={handleChange}
          disabled={submitting}
          min={0}
          step={0.01}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : mode === "edit" ? "Update Order" : "Create Order"}
      </button>
    </form>
  );
}
