import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Loader2, Pill } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ["Antibiotics", "Pain Relief", "Cardiology", "Vitamins", "First Aid"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Antibiotics",
    stock: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name.trim() || !formData.description.trim() || !formData.image.trim() || !formData.price || !formData.stock) {
      toast.error("Please fill in all catalog parameters");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/product/add", {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });

      if (data.success) {
        toast.success("Medicine cataloged successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          image: "",
          category: "Antibiotics",
          stock: ""
        });
        navigate("/admin/list-products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to append medicine catalog item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-6">
        <PlusCircle className="h-6 w-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-gray-800">Add New Medicine Catalog</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medicine Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="e.g. Amoxicillin 500mg" 
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Therapeutic Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Retail Price ($)</label>
            <input 
              type="number" 
              name="price"
              step="0.01"
              placeholder="e.g. 19.99" 
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Initial Stock (Units)</label>
            <input 
              type="number" 
              name="stock"
              placeholder="e.g. 150" 
              value={formData.stock}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
            />
          </div>
        </div>

        {/* Image link */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Image URL</label>
          <input 
            type="url" 
            name="image"
            placeholder="e.g. https://images.unsplash.com/photo-... or custom SVG source" 
            value={formData.image}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description & Therapeutic Usage</label>
          <textarea 
            name="description"
            rows="4"
            placeholder="Provide detail on dosage, guidelines, indicators, and warnings..." 
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm leading-relaxed"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <>
                <Pill className="h-4 w-4" />
                Catalog Product
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
