import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function CategoriesSection({ formData, setFormData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Save categories to DB
  const saveCategoriesToDatabase = async (categories: string[]) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });

      if (!res.ok) throw new Error("Failed to save categories");
    } catch (err) {
      console.error("Error saving categories:", err);
      alert("Failed to sync with database.");
    }
  };

  const openEdit = (category: string, index: number) => {
    setCurrentCategory(category);
    setEditingIndex(index);
  };

  const resetInput = () => {
    setCurrentCategory("");
    setEditingIndex(null);
  };

  const saveCategory = async () => {
    const trimmed = currentCategory.trim();
    if (!trimmed) return;

    setFormData(prev => {
      const categories = [...(prev.categories || [])];

      if (editingIndex !== null) {
        categories[editingIndex] = trimmed;
      } else {
        if (categories.includes(trimmed)) {
          alert("Category already exists!");
          return prev;
        }
        categories.push(trimmed);
      }

      // Save to DB
      saveCategoriesToDatabase(categories);

      return { ...prev, categories };
    });

    resetInput();
  };

  const removeCategory = async (index: number) => {
    const updated = formData.categories.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, categories: updated }));

    await saveCategoriesToDatabase(updated);

    resetInput();
  };

  return (
    <div className="mt-6 border-t pt-4">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <button>
            <Badge>Manage Categories</Badge>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>

          {/* Input */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={currentCategory}
              onChange={(e) => setCurrentCategory(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <Button onClick={saveCategory}>
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>

          {/* Category list */}
          {formData.categories.length > 0 ? (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-3 py-2 border">Category</th>
                  <th className="text-left px-3 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.categories.map((cat, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2 border">{cat}</td>
                    <td className="px-3 py-2 border space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(cat, i)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeCategory(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">No categories added yet.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoriesSection;
