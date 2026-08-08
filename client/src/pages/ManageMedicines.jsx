import { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Edit2, Trash2, X, Upload, ImageIcon, Check } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const CATEGORIES = [
  'Over-the-Counter (OTC)',
  'Prescription Drugs',
  'Vitamins & Supplements',
  'Medical Devices',
  'Personal Care',
];

const emptyForm = {
  name: '', category: 'Over-the-Counter (OTC)',
  price: '', stock: '', minThreshold: '10',
  dosage: '', description: '', ingredients: '', warnings: '',
  image: '',          // URL string or base64 data-URL
};

const ManageMedicines = () => {
  const { medicines, addMedicine, updateMedicine, deleteMedicine } = useContext(AppContext);

  /* ── panel state: 'list' | 'add' | 'edit' ── */
  const [panel, setPanel] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const fileInputRef = useRef(null);

  /* ── Helpers ── */
  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImagePreview('');
    setError(''); setSuccess('');
    setPanel('add');
  };

  const openEdit = (med) => {
    setEditingId(med.id);
    setFormData({
      name: med.name, category: med.category,
      price: med.price.toString(), stock: med.stock.toString(),
      minThreshold: med.minThreshold.toString(),
      dosage: med.dosage, description: med.description,
      ingredients: med.ingredients, warnings: med.warnings,
      image: med.image || '',
    });
    setImagePreview(med.image || '');
    setError(''); setSuccess('');
    setPanel('edit');
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── Image file picker → base64 ── */
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setFormData(prev => ({ ...prev, image: dataUrl }));
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  /* ── Save ── */
  const handleSave = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { name, price, stock, minThreshold, dosage, description, ingredients, warnings } = formData;
    if (!name || !price || !stock || !minThreshold || !dosage || !description || !ingredients || !warnings) {
      setError('Please fill in all required fields (marked with *).');
      return;
    }
    try {
      if (editingId) {
        updateMedicine(editingId, {
          name, category: formData.category,
          price: parseFloat(price), stock: parseInt(stock),
          minThreshold: parseInt(minThreshold),
          dosage, description, ingredients, warnings,
          image: formData.image,
        });
        setSuccess(`"${name}" updated successfully!`);
      } else {
        addMedicine({
          name, category: formData.category,
          price: parseFloat(price), stock: parseInt(stock),
          minThreshold: parseInt(minThreshold),
          dosage, description, ingredients, warnings,
          image: formData.image,
        });
        setSuccess(`"${name}" added to catalog!`);
        setFormData(emptyForm);
        setImagePreview('');
      }
      setTimeout(() => { setSuccess(''); if (editingId) setPanel('list'); }, 1800);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove "${name}" from the catalog?`)) deleteMedicine(id);
  };

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  /* ══════════════════════════════════════════════════
     FORM (shared for Add & Edit)
  ══════════════════════════════════════════════════ */
  const renderMedicineForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {editingId ? 'Edit Medicine' : '✦ Add New Medicine'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {editingId ? 'Update the product details below.' : 'Fill in the form to add a new product to the catalog.'}
          </p>
        </div>
        <button
          onClick={() => setPanel('list')}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" /> <span>Back to List</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">

        {/* Feedback banners */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-semibold flex items-center space-x-2">
            <X className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4 flex-shrink-0" /><span>{success}</span>
          </div>
        )}

        {/* ── Image Upload Section ── */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1">
            <ImageIcon className="w-3.5 h-3.5" /><span>Product Image</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Preview box */}
            <div
              className="w-32 h-32 flex-shrink-0 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <ImageWithFallback src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-3">
                  <Upload className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 mx-auto transition-colors" />
                  <p className="text-[9px] text-slate-400 group-hover:text-indigo-400 font-bold mt-1 transition-colors">Click to upload</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-2">
              {/* File picker button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-100 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Image from Computer</span>
              </button>

              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                <div className="flex-1 h-px bg-slate-100" /><span>or paste a URL</span><div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* URL input */}
              <input
                type="text"
                name="image"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={(e) => {
                  handleChange(e);
                  setImagePreview(e.target.value);
                }}
                placeholder="https://example.com/medicine.jpg"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-xs"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setFormData(prev => ({ ...prev, image: '' })); setImagePreview(''); }}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors"
                >
                  ✕ Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Fields Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Name */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Product Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg Tablets"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-700 text-sm bg-white cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Price (₹) *</label>
            <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm font-mono"
            />
          </div>

          {/* Stock */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Stock (units) *</label>
            <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm font-mono"
            />
          </div>

          {/* Low Stock Threshold */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Low Stock Alert Threshold *</label>
            <input type="number" min="1" name="minThreshold" value={formData.minThreshold} onChange={handleChange}
              placeholder="10"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm font-mono"
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Active Ingredients / Composition *</label>
            <input type="text" name="ingredients" value={formData.ingredients} onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg, Caffeine 30mg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm"
            />
          </div>

          {/* Dosage */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Dosage Guidance *</label>
            <input type="text" name="dosage" value={formData.dosage} onChange={handleChange}
              placeholder="e.g. 1 tablet twice daily after meals"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">General Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              rows="3" placeholder="Detailed explanation of the medicine's usage and health advantages..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm resize-none"
            />
          </div>

          {/* Warnings */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Safety Warnings & Precautions *</label>
            <textarea name="warnings" value={formData.warnings} onChange={handleChange}
              rows="2" placeholder="Contraindications, side effects, overdose warnings..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={() => setPanel('list')}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 font-extrabold text-xs rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-1.5">
            {editingId ? <><Check className="w-4 h-4" /><span>Save Changes</span></> : <><Plus className="w-4 h-4" /><span>Add to Catalog</span></>}
          </button>
        </div>
      </form>
    </div>
  );

  /* ══════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════ */
  const renderListView = () => (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Manage Medicines</h1>
          <p className="text-sm text-slate-400">{medicines.length} products in catalog. Add new, edit, or remove entries.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center space-x-1.5 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /><span>Add New Medicine</span>
        </button>
      </div>

      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍  Search by name or category..."
        className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm text-slate-700"
      />

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider text-[10px] bg-slate-50">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6 text-right">Price</th>
                <th className="py-3 px-6 text-center">Stock</th>
                <th className="py-3 px-6 text-center">Alert</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">No medicines found.</td></tr>
              )}
              {filtered.map((med) => {
                const isLow = med.stock <= med.minThreshold;
                return (
                  <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 bg-slate-50">
                          <ImageWithFallback src={med.image} alt={med.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm line-clamp-1">{med.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {med.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                        {med.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">₹{med.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-[11px] ${isLow ? 'bg-rose-50 text-rose-600' : 'text-slate-700'}`}>
                        {med.stock} {isLow && '⚠'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-slate-400">{med.minThreshold}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => openEdit(med)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(med.id, med.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return panel === 'list' ? renderListView() : renderMedicineForm();
};

export default ManageMedicines;
