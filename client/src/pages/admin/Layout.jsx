import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { PlusCircle, List, ArrowLeft, HeartPulse, ShieldAlert } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800 gap-2">
            <HeartPulse className="h-6 w-6 text-emerald-400" />
            <span className="text-lg font-bold text-white tracking-tight">
              MediMart <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded-full">Admin</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-2">
            <NavLink 
              to="list-products" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-emerald-500 text-white shadow-xs' : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <List className="h-4 w-4" />
              Manage Inventory
            </NavLink>
            
            <NavLink 
              to="add-product" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-emerald-500 text-white shadow-xs' : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <PlusCircle className="h-4 w-4" />
              Add Medicine
            </NavLink>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between text-xs">
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            View Storefront
          </Link>
          
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <div className="flex-grow flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-gray-500">Secure Database Administration</span>
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        {/* View content */}
        <main className="flex-grow p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;
