import { useContext } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import { AppContext } from './context/AppContext'

// Pages
import Home from './pages/Home'
import MedicineCatalog from './pages/MedicineCatalog'
import MedicineDetails from './pages/MedicineDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Invoice from './pages/Invoice'
import OrderHistory from './pages/OrderHistory'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ManageMedicines from './pages/ManageMedicines'
import Inventory from './pages/Inventory'
import LowStock from './pages/LowStock'
import NotFound from './pages/NotFound'

// Standard User Layout Wrapper
const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// Admin Layout Wrapper
const AdminLayout = ({ children }) => {
  const { currentUser } = useContext(AppContext);

  const isAdmin = ['admin', 'super_admin', 'super-admin', 'super admin'].includes(String(currentUser?.role || '').trim().toLowerCase());

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-50 text-indigo-700">Admin Mode</span>
            <span className="text-sm text-slate-500">Logged in as: <strong>{currentUser.name}</strong></span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Go to Storefront</Link>
            {currentUser.avatar && (
              <img src={currentUser.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
            )}
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Front Storefront Routes */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/catalog" element={<UserLayout><MedicineCatalog /></UserLayout>} />
      <Route path="/medicine/:id" element={<UserLayout><MedicineDetails /></UserLayout>} />
      <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
      <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
      <Route path="/payment" element={<UserLayout><Payment /></UserLayout>} />
      <Route path="/invoice/:orderId" element={<UserLayout><Invoice /></UserLayout>} />
      <Route path="/orders" element={<UserLayout><OrderHistory /></UserLayout>} />
      <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
      <Route path="/register" element={<UserLayout><Register /></UserLayout>} />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/medicines" element={<AdminLayout><ManageMedicines /></AdminLayout>} />
      <Route path="/admin/inventory" element={<AdminLayout><Inventory /></AdminLayout>} />
      <Route path="/admin/low-stock" element={<AdminLayout><LowStock /></AdminLayout>} />

      {/* 404 Route */}
      <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
    </Routes>
  )
}

export default App
