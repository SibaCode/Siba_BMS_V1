import { useState } from "react";
import { Button } from "@/components/ui/button";
  import {
    Edit, 
    Trash2, 
    Plus, 

  } from "lucide-react";
function VariantsSection({ formData, setFormData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const openAddModal = () => {
    setCurrentVariant({
      type: "",
      color: "",
      size: "",
      sellingPrice: "",
      stockPrice: "",
      stockQuantity: "",
      description: "",
      images: [""],
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (variant, index) => {
    setCurrentVariant({ ...variant });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVariant(null);
    setEditingIndex(null);
  };

  const saveVariant = () => {
    if (editingIndex !== null) {
      // Update existing variant
      const newVariants = [...formData.variants];
      newVariants[editingIndex] = currentVariant;
      setFormData({ ...formData, variants: newVariants });
    } else {
      // Add new variant
      setFormData({ ...formData, variants: [...formData.variants, currentVariant] });
    }
    closeModal();
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleModalChange = (field, value) => {
    setCurrentVariant(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleAddProduct = () => {
    // ... logic to save the current product/variant(s) if needed
  
    // Clear variants so the table resets
    setFormData(prev => ({
      ...prev,
      variants: []
    }));
  
    // Also clear currentVariant modal form if needed
    setCurrentVariant({
      type: '',
      color: '',
      size: '',
      sellingPrice: '',
      images: [],
      stockQuantity: 0,
    });
  };
  
  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold text-lg mb-4">Variants</h4>
  {/* Add Variant Button */}
  <Button onClick={openAddModal}> <Plus className="h-4 w-4 mr-2" />Add new variant</Button>
     
      {/* Variants Table/List */}
      {/* {formData.variants.length > 0 ? ( */}
      <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Type</th>
                <th className="border border-gray-300 p-2 text-left">Color</th>
                <th className="border border-gray-300 p-2 text-left">Size</th>
                <th className="border border-gray-300 p-2 text-left">Selling Price (R)</th>
                <th className="border border-gray-300 p-2 text-left">Image</th>
                <th className="border border-gray-300 p-2 text-left">Stock Quantity</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
          {formData.variants.map((variant, index) => (
            <tr key={index} className="border-t">
              <td className="border border-gray-300 p-2">{variant.type}</td>
              <td className="border border-gray-300 p-2">{variant.color}</td>
              <td className="border border-gray-300 p-2">{variant.size}</td>
              <td className="border border-gray-300 p-2">{variant.sellingPrice}</td>
              <td className="border border-gray-300 p-2">
                {variant.images && variant.images[0] ? (
                    <img 
                    src={variant.images[0]} 
                    alt="Variant" 
                    className="max-h-20 object-contain"
                    />
                ) : (
                    <span>No image</span>
                )}
                </td>

              <td className="border border-gray-300 p-2">{variant.stockQuantity}</td>
              <td className="p-2 space-x-2">
                 <Button variant="outline" size="sm"  onClick={() => openEditModal(variant, index)} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button   onClick={() => removeVariant(index)} size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
          
          </table>

{/* ) : (
    <p className="text-sm text-gray-500 italic mb-4">No variants added yet.</p>
  )} */}
     
    
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <h5 className="text-lg font-semibold mb-4">
              {editingIndex !== null ? "Edit product ariant" : "Add new product ariant"}
            </h5>

            <div className="space-y-3">
              <div>
                <label htmlFor="modal-type" className="block font-medium">Type</label>
                <input
                  id="modal-type"
                  type="text"
                   placeholder="e.g. Basic, Deluxe"
                  value={currentVariant.type}
                  onChange={(e) => handleModalChange("type", e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label htmlFor="modal-color" className="block font-medium">Color</label>
                <input
                  id="modal-color"
                  type="text"
                  placeholder="Color"
                  value={currentVariant.color}
                  onChange={(e) => handleModalChange("color", e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label htmlFor="modal-size" className="block font-medium">Size</label>
                <input
                  id="modal-size"
                  type="text"
                   placeholder="Size"
                  value={currentVariant.size}
                  onChange={(e) => handleModalChange("size", e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label htmlFor="modal-sellingPrice" className="block font-medium">Selling Price (R)</label>
                <input
                  id="modal-sellingPrice"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={currentVariant.sellingPrice}
                  onChange={(e) => handleModalChange("sellingPrice", e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label htmlFor="modal-stockPrice" className="block font-medium">Stock Price (R)</label>
                <input
                  id="modal-stockPrice"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={currentVariant.stockPrice}
                  onChange={(e) => handleModalChange("stockPrice", e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label htmlFor="modal-stockQuantity" className="block font-medium">Stock Quantity</label>
                <input
                  id="modal-stockQuantity"
                  type="number"
                   placeholder="0"
                  value={currentVariant.stockQuantity}
                  onChange={(e) => handleModalChange("stockQuantity", e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label htmlFor="modal-description" className="block font-medium">Description</label>
                <textarea
                  id="modal-description"
                  rows={3}
                  placeholder="Description"
                  value={currentVariant.description}
                  onChange={(e) => handleModalChange("description", e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label htmlFor="modal-image" className="block font-medium">Image URL</label>
                <input
                    id="modal-image"
                    placeholder="https://example.com/image.jpg"
                    type="text"
                    value={currentVariant.images?.[0] || ""}
                    onChange={(e) =>
                    setCurrentVariant(prev => ({
                        ...prev,
                        images: [e.target.value],
                    }))
                    }
                    className="w-full border rounded p-1"
                />
                {/* Image preview */}
                {currentVariant.images?.[0] && (
                    <img
                    src={currentVariant.images[0]}
                    alt="Variant Preview"
                    className="mt-2 max-h-40 object-contain border rounded"
                    />
                )}
                </div>

            </div>

            <div className="mt-4 flex justify-end space-x-2">
           
              <Button variant="outline" size="sm"   onClick={closeModal} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={saveVariant} size="sm">
                   Save new variant
                  </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default VariantsSection;