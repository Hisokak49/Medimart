import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import MedicineCard from '../components/MedicineCard';
import { SlidersHorizontal, ArrowUpDown, Package } from 'lucide-react';

const MedicineCatalog = () => {
  const { medicines } = useContext(AppContext);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const catParam = params.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [prevSearch, setPrevSearch] = useState(location.search);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc');

  if (location.search !== prevSearch) {
    setPrevSearch(location.search);
    setSelectedCategory(catParam);
  }

  const categories = [...new Set(medicines.map((m) => m.category))];

  const filteredMeds = medicines
    .filter((med) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = med.name.toLowerCase().includes(q) || med.description.toLowerCase().includes(q) || med.ingredients.toLowerCase().includes(q);
      const matchCategory = selectedCategory === 'All' || med.category === selectedCategory;
      const matchPrice = med.price <= maxPrice;
      const matchStock = !onlyInStock || med.stock > 0;
      return matchSearch && matchCategory && matchPrice && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Medicine Catalog</h1>
        <p className="text-sm text-slate-400">Browse and search for medications, supplements, and medical supplies.</p>
      </div>

      <div className="animate-fade-in-up stagger-2">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" /><span>Filters</span>
            </h3>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setMaxPrice(3000); setOnlyInStock(false); setSortBy('name-asc'); }} className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors">Reset All</button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-600">
              <span>Max Price</span>
              <span className="text-emerald-600 font-black">₹{maxPrice}</span>
            </div>
            <input type="range" min="0" max="3000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold"><span>₹0</span><span>₹3000</span></div>
          </div>
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} className="w-4 h-4 rounded text-emerald-600 border-slate-300 accent-emerald-500" />
            <span className="text-xs font-bold text-slate-600">In Stock Only</span>
          </label>
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-600 flex items-center space-x-1"><ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /><span>Sort By</span></label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-700 text-xs font-semibold bg-white cursor-pointer">
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest First</option>
            </select>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-bold text-slate-400">Showing <span className="text-emerald-600 font-black">{filteredMeds.length}</span> of {medicines.length} medicines</p>
            </div>
          </div>
          {filteredMeds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMeds.map((med, i) => (
                <MedicineCard key={med.id} medicine={med} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-base">No Medicines Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">We couldn't find any matches. Try updating your filters, categories, or price range.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MedicineCatalog;
