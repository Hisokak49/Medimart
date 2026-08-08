import { useContext, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Clock, CheckCircle, Package, Eye, ClipboardList } from 'lucide-react';

const OrderHistory = () => {
  const { orders, currentUser } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const viewParam = searchParams.get('view');
  const isAdmin = ['admin', 'super_admin', 'super-admin', 'super admin'].includes(String(currentUser?.role || '').trim().toLowerCase());
  
  // Set view mode (default to personal orders unless ?view=all is specified for admin)
  const [showAll, setShowAll] = useState(isAdmin && viewParam === 'all');

  // If user not logged in
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-slate-100">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Login to View Order History</h2>
        <p className="text-sm text-slate-400">Please sign in to retrieve your past orders and prescription receipts.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  // Filter orders based on toggle selection
  const displayOrders = (isAdmin && showAll)
    ? orders
    : orders.filter(
        o => o.user === currentUser.id || o.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()
      );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-100">
            <Package className="w-3 h-3" />
            <span>Shipped</span>
          </span>
        );
      case 'Processing':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isAdmin && showAll ? "All Store Orders (Admin Mode)" : "Order History"}
          </h1>
          <p className="text-sm text-slate-400">Track current shipments or view past tax invoice records.</p>
        </div>

        {/* Toggle between admin view and personal view */}
        {isAdmin && (
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 shadow-inner">
            <button
              onClick={() => {
                setShowAll(false);
                setSearchParams({});
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !showAll
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              My Personal Orders
            </button>
            <button
              onClick={() => {
                setShowAll(true);
                setSearchParams({ view: 'all' });
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                showAll
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              All Store Orders (Admin)
            </button>
          </div>
        )}
      </div>

      {displayOrders.length > 0 ? (
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-200 transition-all"
              >
                {/* Order ID & Date */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-slate-800">{order.id}</span>
                    {getStatusBadge(order.status)}
                    {isAdmin && showAll && order.userEmail && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {order.userEmail}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-bold">{formattedDate}</p>
                  
                  {/* Item snippets */}
                  <p className="text-xs text-slate-500 line-clamp-1 pr-4 mt-2">
                    {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                  </p>
                </div>

                {/* Total & Action */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Paid Total</p>
                    <p className="text-base font-black text-slate-950">₹{Number(order.total || 0).toFixed(2)}</p>
                  </div>
                  
                  <Link
                    to={`/invoice/${order.id}`}
                    className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Bill</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">No Orders Yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isAdmin && showAll 
              ? "There are no orders placed by any customer in the store database."
              : "You haven't placed any medical orders yet. Tap below to browse medications."}
          </p>
          {!showAll && (
            <Link
              to="/catalog"
              className="inline-block px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              Go to Shop
            </Link>
          )}
        </div>
      )}

    </div>
  );
};

export default OrderHistory;
