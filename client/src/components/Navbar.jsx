import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard, Sun, Moon, Search, CornerDownLeft } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ImageWithFallback from './ImageWithFallback';

const Navbar = () => {
  const { cart, currentUser, logout, medicines } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Keyboard shortcut listener (Ctrl+K or Cmd+K to open, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter medicines in real-time
  const searchResults = searchQuery.trim()
    ? medicines.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.ingredients.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Cap at top 5 premium matches
    : [];



  // Dark/Light Theme Handler
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('mm_theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      return true;
    }
    return false;
  });

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mm_theme', 'light');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setShowDropdown(false);
  };


  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 text-white font-black text-xl shadow-md shadow-emerald-500/20">
                M
              </span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                MEDIMART
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`relative py-1 text-sm font-semibold transition-all duration-300 hover:text-emerald-500 after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-emerald-500 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${
                isActive('/') ? 'text-emerald-600 after:scale-x-100' : 'text-slate-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className={`relative py-1 text-sm font-semibold transition-all duration-300 hover:text-emerald-500 after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-emerald-500 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${
                isActive('/catalog') ? 'text-emerald-600 after:scale-x-100' : 'text-slate-600'
              }`}
            >
              Medicines
            </Link>
            {currentUser && (
              <Link
                to="/orders"
                className={`relative py-1 text-sm font-semibold transition-all duration-300 hover:text-emerald-500 after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-emerald-500 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${
                  isActive('/orders') ? 'text-emerald-600 after:scale-x-100' : 'text-slate-600'
                }`}
              >
                Order History
              </Link>
            )}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Dark/Light mode button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-700 cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* User Dropdown Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700 cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[120px] truncate pr-1">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    {['admin', 'super_admin', 'super-admin', 'super admin'].includes(String(currentUser?.role || '').trim().toLowerCase()) && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold border-t border-slate-50 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-transparent"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2.5">
            
            {/* Dark/Light theme toggler in mobile header */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-slate-50 text-slate-700 cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/cart" className="relative p-1.5 text-slate-700">
              <ShoppingCart className="w-5.5 h-5.5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {totalCartItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Spotlight Command-K Search Overlay Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 md:p-20 flex items-center justify-center transition-all duration-300">
          {/* Backdrop click close */}
          <div className="fixed inset-0" onClick={() => setShowSearchModal(false)}></div>

          {/* Modal box */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in max-h-[80vh] flex flex-col stagger-1 z-10"
          >
            
            {/* Search Header */}
            <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-emerald-500 animate-pulse" />
              <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search premium medicines, devices, or categories..."
                  className="w-full bg-transparent border-none text-slate-800 dark:text-white focus:outline-none text-sm font-semibold placeholder-slate-400"
                  autoFocus
                />
              </form>
              <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 px-2 py-1 rounded-lg">
                ESC
              </span>
            </div>

            {/* Content Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {searchQuery.trim().length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Results ({searchResults.length})</p>
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                      {searchResults.map((med) => (
                        <Link
                          key={med.id}
                          to={`/medicine/${med.id}`}
                          onClick={() => {
                            setShowSearchModal(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between py-2.5 px-3 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:scale-[1.01] rounded-xl transition-all group border border-transparent hover:border-emerald-100/30"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 flex-shrink-0">
                              <ImageWithFallback
                                src={med.image}
                                alt={med.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                                {med.name}
                              </p>
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                                {med.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 font-mono">
                            <span className="text-xs font-black text-slate-900 dark:text-white">₹{med.price.toFixed(2)}</span>
                            <span className="hidden group-hover:flex items-center space-x-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg animate-fade-in">
                              <span>View</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">No matching medicines found</p>
                      <p className="text-xs text-slate-400">Try searching for keywords like "paracetamol", "BP", or "device".</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-pulse">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Search Medimart Catalog</h3>
                    <p className="text-xs text-slate-400">Start typing to query medicines, medical devices, or wellness products.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer help guidelines */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-semibold flex justify-between">
              <span>Press <kbd className="font-mono bg-white dark:bg-slate-900 border px-1 rounded">Enter</kbd> to search everything</span>
              <span>Press <kbd className="font-mono bg-white dark:bg-slate-900 border px-1 rounded">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-2.5 animate-in slide-in-from-top-5 duration-200">
          
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-semibold bg-white text-slate-700"
            />
            <button type="submit" className="absolute right-3 text-slate-400 cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-bold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/catalog"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-bold text-slate-700 hover:bg-slate-50"
          >
            Medicines
          </Link>
          {currentUser && (
            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-slate-700 hover:bg-slate-50"
            >
              Order History
            </Link>
          )}

          <div className="border-t border-slate-100 pt-3">
            {currentUser ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <img src={currentUser.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  My Profile
                </Link>
                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2 bg-emerald-600 rounded-lg text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
