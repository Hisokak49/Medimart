import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertTriangle, PlusCircle, CheckCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const LowStock = () => {
  const { medicines, restockMedicine } = useContext(AppContext);

  // Filter medicines below minimum threshold
  const lowStockMeds = medicines.filter(m => m.stock <= m.minThreshold);

  const handleRestock = (id, name, amount) => {
    restockMedicine(id, amount);
    alert(`Restocked ${amount} units of ${name}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Low Stock Alerts</h1>
        <p className="text-sm text-slate-400">Restock medicines that are below safe reserves to avoid storefront supply issues.</p>
      </div>

      {/* Grid listing */}
      {lowStockMeds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {lowStockMeds.map((med) => {
            const isCritical = med.stock === 0;

            return (
              <div
                key={med.id}
                className={`p-5 rounded-3xl border shadow-sm bg-white flex flex-col justify-between h-48 transition-all ${
                  isCritical ? 'border-rose-200 ring-2 ring-rose-500/5' : 'border-amber-200'
                }`}
              >
                {/* Product details */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src={med.image}
                      alt={med.name}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1">{med.name}</h4>
                      <p className="text-[10px] text-slate-400">{med.category}</p>
                    </div>
                  </div>

                  <span className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    isCritical ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isCritical ? 'Out of Stock' : 'Low Stock'}</span>
                  </span>
                </div>

                {/* Info status levels */}
                <div className="flex items-baseline space-x-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold">Current Stock: </span>
                    <strong className={`font-mono text-sm ${isCritical ? 'text-rose-600' : 'text-slate-800'}`}>
                      {med.stock} units
                    </strong>
                  </div>
                  <div className="text-slate-400 font-semibold border-l pl-3.5 border-slate-100">
                    <span>Threshold Limit: </span>
                    <span className="font-mono text-slate-700 font-bold">{med.minThreshold} units</span>
                  </div>
                </div>

                {/* Action restock buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => handleRestock(med.id, med.name, 50)}
                    className="py-2.5 px-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Restock +50</span>
                  </button>
                  <button
                    onClick={() => handleRestock(med.id, med.name, 100)}
                    className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Restock +100</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto mt-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">All Items Restocked</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Great! Every medicine in the pharmacy inventory is currently sitting safely above its warning limits.
          </p>
        </div>
      )}

    </div>
  );
};

export default LowStock;
