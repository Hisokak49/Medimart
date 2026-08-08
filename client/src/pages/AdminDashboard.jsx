import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Pill, AlertTriangle, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const { medicines, orders } = useContext(AppContext);

  // Statistics calculations
  const totalSales = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const totalOrders = orders.length;
  const totalMeds = medicines.length;
  
  // Stock alert levels
  const lowStockCount = medicines.filter(m => m.stock <= m.minThreshold).length;
  const outOfStockCount = medicines.filter(m => m.stock === 0).length;

  // Let's get the 3 most recent orders for review
  const recentOrders = orders.slice(0, 3);

  // Custom mock weekly sales figures for SVG graphing
  const weeklySales = [
    { day: 'Mon', sales: 420 },
    { day: 'Tue', sales: 650 },
    { day: 'Wed', sales: 510 },
    { day: 'Thu', sales: 820 },
    { day: 'Fri', sales: 950 },
    { day: 'Sat', sales: 1120 },
    { day: 'Sun', sales: 740 }
  ];

  const maxWeeklySale = Math.max(...weeklySales.map(d => d.sales));

  return (
    <div className="space-y-8">
      
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Real-time statistics of order transactions, inventory reserves, and low stock thresholds.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <Link
          to="/orders?view=all"
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900">₹{totalSales.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform">
            <IndianRupee className="w-6 h-6" />
          </div>
        </Link>

        {/* Total Orders */}
        <Link
          to="/orders?view=all"
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-cyan-300 transition-all group cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-900">{totalOrders}</h3>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </Link>

        {/* Total Medicines */}
        <Link
          to="/admin/medicines"
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all group cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Catalog Items</p>
            <h3 className="text-2xl font-black text-slate-900">{totalMeds}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
            <Pill className="w-6 h-6" />
          </div>
        </Link>

        {/* Low Stock Alerts */}
        <Link
          to="/admin/low-stock"
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-rose-300 transition-all group"
        >
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Low Stock Warnings</p>
            <h3 className="text-2xl font-black text-slate-950 flex items-center space-x-1.5">
              <span>{lowStockCount}</span>
              {outOfStockCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-600 font-black">
                  {outOfStockCount} critical
                </span>
              )}
            </h3>
          </div>
          <div className={`p-3 rounded-xl text-rose-600 transition-all ${lowStockCount > 0 ? 'bg-rose-50 animate-bounce' : 'bg-slate-50'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Link>

      </div>

      {/* Analytics Chart & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart (Custom SVG implementation for zero external-dependency styling) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Weekly Sales Revenue</h3>
          
          {/* Custom SVG Column Bar Graph */}
          <div className="relative pt-6">
            <div className="flex justify-between items-end h-56 px-2 border-b border-slate-100">
              {weeklySales.map((d, i) => {
                // Calculate height percentage
                const barHeightPct = (d.sales / maxWeeklySale) * 100;
                return (
                  <div key={i} className="flex flex-col items-center group w-1/8 space-y-3">
                    {/* Tooltip value */}
                    <span className="opacity-0 group-hover:opacity-100 bg-slate-950 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded absolute -translate-y-8 transition-opacity duration-200">
                      ₹{d.sales}
                    </span>
                    
                    {/* Column bar */}
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-500 group-hover:from-indigo-700 group-hover:to-cyan-400 transition-all duration-500 shadow shadow-indigo-500/20"
                    ></div>
                    
                    {/* Label */}
                    <span className="text-[10px] text-slate-400 font-extrabold">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Recent Transactions</h3>
            
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/60 transition-colors">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-800">{o.id}</p>
                    <p className="text-slate-400">{new Date(o.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">₹{Number(o.total || 0).toFixed(2)}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                      o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/admin/inventory"
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-700 font-extrabold text-xs mt-4"
          >
            <span>Manage Store Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
