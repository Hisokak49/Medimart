import { useContext } from 'react';
import { Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ImageWithFallback from './ImageWithFallback';

const CartItem = ({ item }) => {
  const { medicines, updateCartQuantity, removeFromCart } = useContext(AppContext);

  const medicine = medicines.find(m => m.id === item.id);

  if (!medicine) return null;

  const handleIncrease = () => {
    try {
      updateCartQuantity(item.id, item.quantity + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateCartQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const isLowStock = medicine.stock <= medicine.minThreshold;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm gap-4 transition-all hover:border-slate-200">
      
      {/* Product Image and Name */}
      <div className="flex items-center space-x-3.5 flex-1">
        <ImageWithFallback
          src={medicine.image}
          alt={medicine.name}
          className="w-16 h-16 object-cover rounded-xl border border-slate-100"
        />
        <div>
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 tracking-wider">
            {medicine.category}
          </span>
          <h4 className="font-extrabold text-slate-800 text-sm mt-1 line-clamp-1">{medicine.name}</h4>
          <p className="text-xs text-slate-400">Unit Price: ₹{medicine.price.toFixed(2)}</p>
          {isLowStock && (
            <p className="text-[10px] text-amber-500 font-semibold flex items-center mt-1">
              <AlertCircle className="w-3 h-3 mr-0.5" />
              <span>Only {medicine.stock} remaining in stock!</span>
            </p>
          )}
        </div>
      </div>

      {/* Product Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
        
        {/* Quantity control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-600 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-black text-slate-800">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            disabled={item.quantity >= medicine.stock}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
              item.quantity >= medicine.stock
                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 hover:border-slate-400 text-slate-600'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total and delete */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
            <p className="text-sm font-black text-slate-900">
              ₹{(medicine.price * item.quantity).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent"
            title="Remove item"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
