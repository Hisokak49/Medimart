import { Link } from 'react-router-dom';
import { Heart, CheckCircle2, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white font-black text-lg">
                M
              </span>
              <span className="font-extrabold text-lg text-white tracking-tight">
                MEDIMART
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner in healthcare. Delivering quality prescriptions, supplements, and digital medical equipment directly to your doorstep.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>FDA Approved & Secure Checkout</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">Medicines Catalog</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog?category=Prescription+Drugs" className="hover:text-white transition-colors">Prescription Drugs</Link>
              </li>
              <li>
                <Link to="/catalog?category=Over-the-Counter+(OTC)" className="hover:text-white transition-colors">Over-the-Counter (OTC)</Link>
              </li>
              <li>
                <Link to="/catalog?category=Vitamins+%26+Supplements" className="hover:text-white transition-colors">Vitamins & Supplements</Link>
              </li>
              <li>
                <Link to="/catalog?category=Medical+Devices" className="hover:text-white transition-colors">Medical Devices</Link>
              </li>
            </ul>
          </div>

          {/* Emergency / Contact */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4">Support & Help</h3>
            <p className="text-sm mb-2 text-slate-300 font-semibold">Need pharmaceutical advice?</p>
            <p className="text-lg font-black text-emerald-400 mb-4">+1 (800) 555-MEDS</p>
            <div className="flex items-center space-x-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available 24/7 for support</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} MEDIMART Inc. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-3 h-3 mx-1 text-rose-500 fill-rose-500" /> for healthy living.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
