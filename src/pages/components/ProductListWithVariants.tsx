import { useState } from "react";

export default function ProductListWithVariants({
  products,
  addProductToOrder,
  orderItems,
  updateQuantity,
  removeItem,
  createOrder,
  submitting,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  paymentMethod,
  setPaymentMethod,
  notes,
  setNotes,
  deliveryMethod,
  setDeliveryMethod,
  courierDetails,
  setCourierDetails,
}) {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const selectProduct = (productId) => {
    if (selectedProductId === productId) {
      setSelectedProductId(null);
      setSelectedVariantIndex(null);
      setQuantity(1);
    } else {
      setSelectedProductId(productId);
      setSelectedVariantIndex(null);
      setQuantity(1);
    }
  };

  const onAddToOrder = () => {
    if (selectedProductId !== null && selectedVariantIndex !== null && quantity > 0) {
      const product = products.find((p) => p.docId === selectedProductId);
      if (product) {
        addProductToOrder(product, selectedVariantIndex, quantity);
        // Reset selection
        setSelectedProductId(null);
        setSelectedVariantIndex(null);
        setQuantity(1);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Product List */}
      <section className="flex-1">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-orange-500">Products</h2>
        <ul className="divide-y divide-gray-300 max-h-[600px] overflow-y-auto bg-white rounded shadow">
          {products.length === 0 ? (
            <p className="p-4 text-gray-500">No products available.</p>
          ) : (
            products.map((product) => (
              <li
                key={product.docId}
                className={`p-3 cursor-pointer hover:bg-orange-50 ${
                  selectedProductId === product.docId ? "bg-orange-100" : ""
                }`}
                onClick={() => selectProduct(product.docId)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") selectProduct(product.docId);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{product.name}</span>
                  <span className="text-sm text-gray-600">
                    {product.variants.length} variant{product.variants.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Show variants if this product is selected */}
                {selectedProductId === product.docId && (
                  <div className="mt-3 border-t pt-3 space-y-3">
                    {product.variants.map((variant, index) => {
                      const isSelected = selectedVariantIndex === index;
                      const isOutOfStock = variant.stockQuantity === 0;
                      return (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-2 border rounded cursor-pointer
                            ${isSelected ? "bg-orange-200 border-orange-400" : "hover:bg-orange-50"}
                            ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          onClick={() => !isOutOfStock && setSelectedVariantIndex(index)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isOutOfStock) setSelectedVariantIndex(index);
                          }}
                        >
                          <div>
                            <p className="font-semibold">
                              {variant.type} | {variant.color} | {variant.size}
                            </p>
                            <p className="text-sm text-orange-700 font-bold">
                              R{variant.sellingPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            {isOutOfStock ? (
                              <span className="text-red-600 font-semibold">Out of Stock</span>
                            ) : isSelected ? (
                              <input
                                type="number"
                                min={1}
                                max={variant.stockQuantity}
                                value={quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val > 0 && val <= variant.stockQuantity) {
                                    setQuantity(val);
                                  }
                                }}
                                className="w-16 border border-gray-300 rounded text-center"
                                aria-label="Quantity"
                              />
                            ) : (
                              <button
                                className="text-orange-600 underline text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedVariantIndex(index);
                                }}
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Add to order button */}
                    <button
                      onClick={onAddToOrder}
                      disabled={selectedVariantIndex === null || quantity < 1}
                      className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded disabled:opacity-50"
                    >
                      Add to Order
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Order Summary */}
      <aside className="lg:w-96 sticky top-6 bg-white border border-gray-200 rounded-lg shadow p-5">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-orange-500">
          Order Summary
        </h2>
        {orderItems.length === 0 ? (
          <p className="text-gray-500">Your order is empty.</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border rounded p-3 bg-gray-50"
              >
                <div className="truncate max-w-[60%]">
                  <p className="font-semibold truncate">{item.productName}</p>
                  <p className="text-xs text-gray-600 truncate">
                    {item.variant.type} | {item.variant.color} | {item.variant.size}
                  </p>
                  <p className="text-xs text-gray-600">
                    Price: R{item.price.toFixed(2)} x Qty: {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="px-2 py-1 border rounded hover:bg-orange-100"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    aria-label="Increase quantity"
                    className="px-2 py-1 border rounded hover:bg-orange-100"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    aria-label="Remove item"
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        <div className="border-t mt-4 pt-4 space-y-1 text-right">
          <p>
            Subtotal: <span className="font-semibold">R{calculateSubtotal().toFixed(2)}</span>
          </p>
          <p>
            VAT (15%): <span className="font-semibold">R{calculateTax().toFixed(2)}</span>
          </p>
          <p className="text-xl font-bold">
            Total: <span>R{calculateTotal().toFixed(2)}</span>
          </p>
        </div>

        {/* Payment & Notes */}
        <div className="mt-6 space-y-4">
          <label htmlFor="paymentMethod" className="block font-medium">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
            <option value="eft">EFT</option>
          </select>

          <label htmlFor="notes" className="block font-medium">
            Order Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Add any special instructions or notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div>
            <span className="block font-medium mb-1">Delivery Method</span>
            <div className="flex space-x-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="collect"
                  checked={deliveryMethod === "collect"}
                  onChange={() => setDeliveryMethod("collect")}
                  className="form-radio text-orange-500"
                />
                <span className="ml-2">Collect</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="courier"
                  checked={deliveryMethod === "courier"}
                  onChange={() => setDeliveryMethod("courier")}
                  className="form-radio text-orange-500"
                />
                <span className="ml-2">Courier</span>
              </label>
            </div>
          </div>

          {deliveryMethod === "courier" && (
            <div>
              <label htmlFor="courierDetails" className="block font-medium">
                Courier Details
              </label>
              <textarea
                id="courierDetails"
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter courier info"
                value={courierDetails}
                onChange={(e) => setCourierDetails(e.target.value)}
              />
            </div>
          )}

          <button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded mt-4 disabled:opacity-50"
            onClick={createOrder}
            disabled
