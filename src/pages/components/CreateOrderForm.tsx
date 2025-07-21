import React, { useState } from 'react';

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  availableQty: number;
  selected?: boolean;
}

interface Props {
  products: Product[];
  onSave: (customer: CustomerData, selectedProducts: Product[]) => void;
}

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block font-semibold mb-1">
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
  />
);

const CreateOrderForm: React.FC<Props> = ({ products, onSave }) => {
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    createdAt: new Date().toISOString(),
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const handleChange = (field: keyof CustomerData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = () => {
    const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));
    onSave(customer, selectedProducts);
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Customer Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={customer.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="e.g. Sibahle"
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={customer.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="e.g. Mvubu"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={customer.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. mvubusiba@gmail.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={customer.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. 0711035654"
            />
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={customer.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. D1515 Ntaphuka Road"
            />
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={customer.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. Verulam"
            />
          </div>

          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={customer.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder="e.g. 4342"
            />
          </div>

          <div>
            <Label htmlFor="province">Province *</Label>
            <Input
              id="province"
              value={customer.province}
              onChange={(e) => handleChange('province', e.target.value)}
              placeholder="e.g. KwaZulu-Natal"
            />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Select Products</h2>
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Available Qty</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => handleProductToggle(product.id)}
                  />
                </td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">R{product.price.toFixed(2)}</td>
                <td className="p-2 border">{product.availableQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Save Order
        </button>
      </div>
    </div>
  );
};

export default CreateOrderForm;
