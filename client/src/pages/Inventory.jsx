import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Save, AlertTriangle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const Inventory = () => {
  const { medicines, updateMedicine } = useContext(AppContext);

  // We will track the local modifications in an object state
  const [stockChanges, setStockChanges] = useState({});
  const [priceChanges, setPriceChanges] = useState({});

  const handleStockLocalChange = (id, val) => {
    setStockChanges({ ...stockChanges, [id]: val });
  };

  const handlePriceLocalChange = (id, val) => {
    setPriceChanges({ ...priceChanges, [id]: val });
  };

  const handleSaveChanges = (id, currentMed) => {
    const updatedStock = stockChanges[id] !== undefined ? parseInt(stockChanges[id]) : currentMed.stock;
    const updatedPrice = priceChanges[id] !== undefined ? parseFloat(priceChanges[id]) : currentMed.price;

    if (isNaN(updatedStock) || updatedStock < 0) {
      alert('Please enter a valid stock number (0 or higher).');
      return;
    }

    if (isNaN(updatedPrice) || updatedPrice < 0) {
      alert('Please enter a valid price (₹0 or higher).');
      return;
    }

    try {
      updateMedicine(id, { stock: updatedStock, price: updatedPrice });
      // Clear out local overrides
      const nextStockChanges = { ...stockChanges };
      delete nextStockChanges[id];
      setStockChanges(nextStockChanges);

      const nextPriceChanges = { ...priceChanges };
      delete nextPriceChanges[id];
      setPriceChanges(nextPriceChanges);

      alert(`${currentMed.name} inventory metrics saved!`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
        <p className="text-sm text-slate-400">Perform quick stock adjustments and price updates directly on the inventory grid list.</p>
      </div>

      {/* Grid inventory list */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider text-[10px] bg-slate-50">
                <th className="py-3.5 px-6">Medicine Product</th>
                <th className="py-3.5 px-6">Current Stock</th>
                <th className="py-3.5 px-6">Adjust Stock (Units)</th>
                <th className="py-3.5 px-6 text-right">Price per unit</th>
                <th className="py-3.5 px-6 text-right">Adjust Price (₹)</th>
                <th className="py-3.5 px-6 text-center">Save Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {medicines.map((med) => {
                const localStockVal = stockChanges[med.id] !== undefined ? stockChanges[med.id] : med.stock;
                const localPriceVal = priceChanges[med.id] !== undefined ? priceChanges[med.id] : med.price;

                const hasChanges = stockChanges[med.id] !== undefined || priceChanges[med.id] !== undefined;

                const isLowStock = med.stock <= med.minThreshold;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Item title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={med.image}
                          alt={med.name}
                          className="w-9 h-9 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm line-clamp-1">{med.name}</p>
                          <p className="text-[10px] text-slate-400">{med.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Stock level indicators */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1.5">
                        <span className={`font-mono font-bold text-sm ${
                          isLowStock ? 'text-rose-600' : 'text-slate-800'
                        }`}>
                          {med.stock}
                        </span>
                        {isLowStock && (
                          <span className="p-0.5 bg-rose-50 text-rose-600 rounded" title="Low stock warning alert!">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock adjustments field */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={localStockVal}
                          onChange={(e) => handleStockLocalChange(med.id, e.target.value)}
                          className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-center"
                        />
                        <div className="flex flex-col text-[10px] text-slate-400 font-bold">
                          <button
                            onClick={() => handleStockLocalChange(med.id, (parseInt(localStockVal) || 0) + 10)}
                            className="hover:text-slate-700 font-black px-1"
                            title="Add 10"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleStockLocalChange(med.id, Math.max(0, (parseInt(localStockVal) || 0) - 10))}
                            className="hover:text-slate-700 font-black px-1"
                            title="Sub 10"
                          >
                            -10
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Price display */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-800">
                      ₹{med.price.toFixed(2)}
                    </td>

                    {/* Price adjustments field */}
                    <td className="py-4 px-6 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={localPriceVal}
                        onChange={(e) => handlePriceLocalChange(med.id, e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-right"
                      />
                    </td>

                    {/* Action button */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleSaveChanges(med.id, med)}
                        disabled={!hasChanges}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all flex items-center space-x-1 mx-auto cursor-pointer ${
                          hasChanges
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
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
};

export default Inventory;
