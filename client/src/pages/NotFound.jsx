
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center text-rose-500 shadow-sm animate-bounce">
        <ShieldAlert className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          The link you requested may be broken, or the medicine page you are looking for has been removed from catalog directories.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center space-x-1.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
      >
        <Home className="w-4.5 h-4.5" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
