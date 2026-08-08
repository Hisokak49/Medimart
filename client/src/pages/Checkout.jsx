import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cart, medicines, currentUser, promoApplied } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    zipCode: currentUser?.zipCode || '',
    phone: currentUser?.phone || ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, address, city, zipCode, phone } = formData;
    if (!name || !address || !city || !zipCode || !phone) {
      setError('Please fill in all the shipping details.');
      return;
    }

    // Save shipping details to session storage temporarily, to use on the payment screen
    sessionStorage.setItem('mm_checkout_shipping', JSON.stringify(formData));
    navigate('/payment');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const med = medicines.find(m => m.id === item.id);
    return acc + (med ? med.price * item.quantity : 0);
  }, 0);

  const discount = promoApplied ? (subtotal * promoApplied.value) / 100 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal - discount + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Link */}
      <Link to="/cart" className="inline-flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </Link>

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Delivery Details</h1>
        <p className="text-sm text-slate-400">Complete your delivery address configurations before proceeding to secure payment options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Shipping Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 text-base pb-3 border-b border-slate-50">Delivery Address</h3>
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Recipient Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 text-sm transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 text-sm transition-all"
                  placeholder="e.g. Apartment, Suite, Street name"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 text-sm transition-all"
                  placeholder="e.g. Wellness City"
                />
              </div>

              {/* Zip Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 text-sm transition-all"
                  placeholder="e.g. 10001"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Mobile Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 text-sm transition-all"
                  placeholder="e.g. +1 (555) 000-0000"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CreditCard className="w-4.5 h-4.5" />
              <span>Proceed to Payment</span>
            </button>
          </form>
        </div>

        {/* Right Side summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-50">Order Items</h3>
            
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => {
                const med = medicines.find(m => m.id === item.id);
                if (!med) return null;
                return (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="flex-grow max-w-[70%]">
                      <p className="font-extrabold text-slate-800 truncate">{med.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-slate-900">₹{(med.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="text-slate-800 font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-600">Total Price</span>
              <span className="text-xl font-black text-slate-900">₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2.5 text-xs text-slate-400 p-2 border border-slate-100 rounded-2xl bg-white">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>Secure 256-bit encryption safeguards medical transactions.</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
