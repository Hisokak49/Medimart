import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ImageWithFallback from './ImageWithFallback';

const MedicineCard = ({ medicine, index = 0 }) => {
  const { addToCart } = useContext(AppContext);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    try {
      addToCart(medicine.id, 1);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1200);
    } catch (err) {
      alert(err.message);
    }
  };

  const isLowStock = medicine.stock <= medicine.minThreshold && medicine.stock > 0;
  const isOutOfStock = medicine.stock === 0;
  const staggerClass = `stagger-${(index % 12) + 1}`;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      );
    }
    return stars;
  };

  return (
    <div className={`group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative flex flex-col justify-between card-hover-glow animate-card-entrance ${staggerClass}`}>
      <div className="h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <span className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-slate-700 backdrop-blur-md shadow-sm border border-white/50 animate-badge-pop">
        {medicine.category}
      </span>

      <div className="relative aspect-[4/3] w-full img-zoom-container bg-gradient-to-br from-slate-50 to-slate-100">
        <ImageWithFallback src={medicine.image} alt={medicine.name} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-lg">
              <AlertCircle className="w-3.5 h-3.5" /><span>Out of Stock</span>
            </span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-sm" style={{animation: 'pulse-soft 2s ease-in-out infinite'}}>
            <AlertCircle className="w-3 h-3" /><span>Low Stock</span>
          </div>
        )}
        {addedFeedback && (
          <div className="absolute inset-0 bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center animate-fade-in z-20">
            <span className="text-white font-extrabold text-sm animate-scale-in">✓ Added!</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex items-center space-x-0.5">{renderStars(medicine.rating)}</div>
            <span className="text-xs font-bold text-slate-600">{medicine.rating}</span>
            <span className="text-[10px] text-slate-400">({medicine.reviewsCount})</span>
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors duration-200 line-clamp-1 mb-1">{medicine.name}</h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">{medicine.description}</p>
        </div>
        <div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Price</p>
              <p className="text-lg font-black text-slate-900 tracking-tight">₹{medicine.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-1.5">
              <Link to={`/medicine/${medicine.id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 border border-slate-100 hover:border-emerald-200 hover:scale-105 active:scale-95" title="View details">
                <Eye className="w-4 h-4" />
              </Link>
              <button disabled={isOutOfStock} onClick={handleAddToCart}
                className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${isOutOfStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/25 hover:scale-105 active:scale-95'}`}
                title={addedFeedback ? 'Added!' : 'Add to Cart'}>
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
