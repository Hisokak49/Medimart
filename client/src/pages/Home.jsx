import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Activity, ShieldCheck, HeartPulse, Sparkles, ArrowRight, Search, Percent } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import MedicineCard from '../components/MedicineCard';

const Home = () => {
  const { medicines } = useContext(AppContext);
  const navigate = useNavigate();

  // Get first 4 medicines for featured display
  const featuredMeds = medicines.slice(0, 4);

  const categoriesList = [
    { name: 'Prescription Drugs', count: 120, icon: Pill, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { name: 'Over-the-Counter (OTC)', count: 240, icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { name: 'Vitamins & Supplements', count: 85, icon: Sparkles, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: 'Medical Devices', count: 34, icon: Activity, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Grid Pattern & Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Certified Online Pharmacy</span>
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              Your Health, Our <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Priority.</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
              Order medicines, daily vitamins, health equipment, and personal care essentials online. Fast delivery, certified pharmacists, and reliable support.
            </p>
            
            {/* Quick Search Redirect Box */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">
              <button
                onClick={() => navigate('/catalog')}
                className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all text-sm font-semibold text-left"
              >
                <span className="flex items-center space-x-2">
                  <Search className="w-4.5 h-4.5 text-slate-400" />
                  <span>Search medicines...</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">Browse Catalog</span>
              </button>
              <button
                onClick={() => navigate('/catalog')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero right image display */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600&auto=format&fit=crop&q=80"
                alt="Medimart Medical Care"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Fast Delivery</p>
                  <p className="text-sm font-bold">Within 2 hours locally</p>
                </div>
                <span className="text-xs px-2.5 py-1.5 rounded-full bg-emerald-500 text-slate-900 font-black">Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMO OFFER CODES CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-600 p-6 md:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-emerald-500/10">
          <div className="space-y-2 mb-6 md:mb-0">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase">
              <Percent className="w-3.5 h-3.5" />
              <span>Special Offer</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold">Save Big on Your First Purchase</h2>
            <p className="text-teal-100 text-sm max-w-xl">
              Use code <strong className="text-white underline">WELCOME10</strong> for 10% discount on order, or <strong className="text-white underline">HEALTH20</strong> for 20% off vitamins!
            </p>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-sm rounded-xl transition-all shadow-md"
          >
            Apply Code & Buy
          </button>
        </div>
      </section>

      {/* 3. CATEGORIES CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
            <p className="text-sm text-slate-400">Select medicine groups to filter search results</p>
          </div>
          <Link to="/catalog" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
            <span>View all catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriesList.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 bg-white border border-slate-100 rounded-2xl hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 flex items-center space-x-4"
              >
                <div className={`p-3 rounded-xl border ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{cat.name}</h3>
                  <p className="text-xs text-slate-400">View Products</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (BEST SELLERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Best Selling Medicines</h2>
            <p className="text-sm text-slate-400">Top-rated pharmacy items for your healthcare routines</p>
          </div>
          <Link to="/catalog" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
            <span>Shop Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredMeds.map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      </section>

      {/* 5. HEALTH ARTICLES & TRUST METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trust Metric 1 */}
          <div className="flex flex-col items-center text-center p-4 space-y-3">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-black text-slate-800 text-sm">Certified Safe</h3>
            <p className="text-xs text-slate-400 max-w-[240px]">
              Every pharmaceutical item in our database is approved by regional drug regulators and verified by chemists.
            </p>
          </div>

          {/* Trust Metric 2 */}
          <div className="flex flex-col items-center text-center p-4 space-y-3 border-y lg:border-y-0 lg:border-x border-slate-100">
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
              <Pill className="w-7 h-7" />
            </div>
            <h3 className="font-black text-slate-800 text-sm">Genuine Prescription</h3>
            <p className="text-xs text-slate-400 max-w-[240px]">
              Upload prescriptions during checkout for prescription drugs. Our local partners examine detail logs before courier dispatch.
            </p>
          </div>

          {/* Trust Metric 3 */}
          <div className="flex flex-col items-center text-center p-4 space-y-3">
            <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-100 text-cyan-600">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="font-black text-slate-800 text-sm">Offline Store pickup</h3>
            <p className="text-xs text-slate-400 max-w-[240px]">
              Order offline. Choose nearest pharmacy pickup option on payment, reserving stock without waiting.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
