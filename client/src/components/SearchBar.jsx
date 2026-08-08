
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-center">
      {/* Search Input */}
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by medicine name, generic name, active ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 text-sm transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Category Dropdown */}
      <div className="relative w-full md:w-64">
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-700 text-sm font-semibold transition-all appearance-none bg-white cursor-pointer"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0"></span>
      </div>
    </div>
  );
};

export default SearchBar;
