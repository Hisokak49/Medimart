import { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, HeartPulse, AlertCircle, FileText } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ImageWithFallback from '../components/ImageWithFallback';

const MedicineDetails = () => {
  const { id } = useParams();
  const { medicines, addToCart } = useContext(AppContext);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const medicine = medicines.find(m => m.id === id);

  if (!medicine) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Medicine Not Found</h2>
        <p className="text-sm text-slate-400">The product you are looking for does not exist or has been removed.</p>
        <Link to="/catalog" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    try {
      addToCart(medicine.id, quantity);
      alert(`${quantity} units of ${medicine.name} added to cart!`);
    } catch (err) {
      alert(err.message);
    }
  };

  const isLowStock = medicine.stock <= medicine.minThreshold;
  const isOutOfStock = medicine.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back link */}
      <Link to="/catalog" className="inline-flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4.5 h-4.5" />
        <span>Back to Catalog</span>
      </Link>

      {/* Main product structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        
        {/* Left Side Image */}
        <div className="relative aspect-video md:aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            <ImageWithFallback
            src={medicine.image}
            alt={medicine.name}
            className="w-full h-full object-cover"
          />
          {isOutOfStock ? (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-rose-500 text-white font-black px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg">
                <AlertCircle className="w-4 h-4" />
                <span>Out of Stock</span>
              </span>
            </div>
          ) : isLowStock ? (
            <div className="absolute top-4 right-4 bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-lg flex items-center space-x-1 shadow-md">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Only {medicine.stock} Left</span>
            </div>
          ) : null}
        </div>

        {/* Right Side Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category Tag */}
            <span className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {medicine.category}
            </span>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{medicine.name}</h1>

            {/* Ratings */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(medicine.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-slate-800">{medicine.rating}</span>
              <span className="text-xs text-slate-400">({medicine.reviewsCount} verified patient reviews)</span>
            </div>

            {/* Price section */}
            <div className="py-3 border-y border-slate-100 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">₹{medicine.price.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-bold uppercase">per pack / unit</span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">{medicine.description}</p>
          </div>

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {!isOutOfStock ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity adjust */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-950 font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-black text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(medicine.stock, prev + 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-950 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-sm font-bold">
                Currently Out of Stock. Tap "Notify Me" when restocked.
              </div>
            )}
            
            {/* Safety banner */}
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              <span>Certified medication. Handled and stored in clinical temp controls.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs segment (Dosage, ingredients, warnings) */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          {[
            { id: 'description', label: 'Drug Overview', icon: FileText },
            { id: 'dosage', label: 'Dosage & Usage', icon: HeartPulse },
            { id: 'warnings', label: 'Safety & Warnings', icon: AlertCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 bg-white'
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8 min-h-[160px] text-sm text-slate-600 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1">Key Description</h4>
                <p>{medicine.description}</p>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1">Active Composition</h4>
                <p className="bg-slate-50 px-3 py-2.5 rounded-lg font-mono text-xs text-slate-700">{medicine.ingredients}</p>
              </div>
            </div>
          )}

          {activeTab === 'dosage' && (
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-800 text-sm mb-1">Recommended Usage Guidelines</h4>
              <p>{medicine.dosage}</p>
              <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs rounded-xl mt-3 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Always check with a physician or healthcare specialist before changing medication dose volumes.</span>
              </div>
            </div>
          )}

          {activeTab === 'warnings' && (
            <div className="space-y-2 text-rose-800">
              <h4 className="font-extrabold text-slate-800 text-sm mb-1">Precautions & Contraindications</h4>
              <p className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs leading-relaxed font-semibold">
                {medicine.warnings}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MedicineDetails;
