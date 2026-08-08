import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Tag, X, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, medicines, promoApplied, applyPromo, removePromo } = useContext(AppContext);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const res = applyPromo(promoCode);
    if (res.success) {
      setPromoSuccess(res.message);
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError(res.message);
      setPromoSuccess('');
    }
  };

  const handleRemovePromo = () => {
    removePromo();
    setPromoSuccess('');
    setPromoError('');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const med = medicines.find(m => m.id === item.id);
    return acc + (med ? med.price * item.quantity : 0);
  }, 0);

  const discount = promoApplied ? (subtotal * promoApplied.value) / 100 : 0;
  const tax = subtotal * 0.08; // 8% Tax
  const total = subtotal - discount + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Add medications or healthcare essentials to your shopping list to continue.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <span>Browse Medicines</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-slate-400">Review your chosen products before proceeding to secure checkout.</p>
      </div>

      {/* Cart layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Right Side: Price Summary & Coupons */}
        <div className="space-y-6">
          
          {/* Coupon Code Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-2">
              <Tag className="w-4 h-4 text-emerald-500" />
              <span>Promo Code / Coupons</span>
            </h3>

            {promoApplied ? (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-semibold">
                <span>Code Applied: {promoApplied.code} (-{promoApplied.value}%)</span>
                <button
                  onClick={handleRemovePromo}
                  className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter WELCOME10 or HEALTH20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl transition-all"
                >
                  Apply
                </button>
              </form>
            )}

            {promoError && <p className="text-[10px] text-rose-500 font-bold">{promoError}</p>}
            {promoSuccess && <p className="text-[10px] text-emerald-600 font-bold">{promoSuccess}</p>}
          </div>

          {/* Pricing Details Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm pb-3 border-b border-slate-50">Order Summary</h3>
            
            <div className="space-y-2.5 text-xs text-slate-500 font-bold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-black">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {promoApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({promoApplied.value}%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-slate-800 font-black">₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-black">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-800">Total Price</span>
              <span className="text-2xl font-black text-slate-900">₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
