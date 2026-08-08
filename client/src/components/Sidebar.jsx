import { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Pill, ClipboardList, AlertTriangle, Home, LogOut } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Sidebar = () => {
  const { medicines, logout } = useContext(AppContext);
  const navigate = useNavigate();

  // Calculate low stock alert count
  const lowStockCount = medicines.filter(m => m.stock <= m.minThreshold).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`;

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800">
      <div className="flex-1 py-6 px-4">
        {/* Brand Header */}
        <div className="flex items-center space-x-2 px-2 mb-8">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500 text-white font-black text-lg">
            M
          </span>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            MEDIMART ADMIN
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard Overview</span>
          </NavLink>

          <NavLink to="/admin/medicines" className={linkClass}>
            <Pill className="w-5 h-5" />
            <span>Manage Medicines</span>
          </NavLink>

          <NavLink to="/admin/inventory" className={linkClass}>
            <ClipboardList className="w-5 h-5" />
            <span>Inventory Stock</span>
          </NavLink>

          <NavLink to="/admin/low-stock" className={linkClass}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5" />
                <span>Low Stock Alerts</span>
              </div>
              {lowStockCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse">
                  {lowStockCount}
                </span>
              )}
            </div>
          </NavLink>
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          <span>Store Home</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all duration-200 text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Admin Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
