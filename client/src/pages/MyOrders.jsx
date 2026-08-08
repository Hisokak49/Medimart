import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Loader2, ClipboardList, CheckCircle2, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const { orders, fetchUserOrders, getToken } = useAppContext();
  const [fetching, setFetching] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setFetching(true);
      await fetchUserOrders();
      setFetching(false);
    };
    loadOrders();
  }, []);

  // Simulate payment processing
  const handlePayment = async (orderId) => {
    try {
      setPayingId(orderId);
      const token = await getToken();
      const { data } = await axios.post("/api/order/pay", { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success("Payment successful!");
        await fetchUserOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process checkout transaction");
    } finally {
      setPayingId(null);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-emerald-500 h-10 w-10" />
        <span className="text-gray-500 text-sm">Retrieving order history...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xs">
          <div className="bg-emerald-50 text-emerald-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Orders Placed Yet</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
            You haven't ordered any health supplies or prescription medications yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div 
            key={order._id} 
            className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden flex flex-col"
          >
            {/* Header info */}
            <div className="bg-gray-50 border-b border-gray-100 p-5 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-6 text-xs text-gray-500">
                <div>
                  <span className="block font-bold uppercase tracking-wider text-gray-400">Order Placed</span>
                  <span className="font-semibold text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-wider text-gray-400">Order ID</span>
                  <span className="font-semibold text-gray-700">{order._id}</span>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-wider text-gray-400">Ship To</span>
                  <span className="font-semibold text-gray-700 line-clamp-1 max-w-[200px]" title={order.shippingAddress}>
                    {order.shippingAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Paid Badge */}
                {order.isPaid ? (
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Paid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Unpaid
                  </span>
                )}

                {/* Delivery status */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === "Delivered" 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : order.status === "Cancelled" 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* List of items */}
            <div className="p-5 flex-grow divide-y divide-gray-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                      <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Summary info & Payment button */}
            <div className="bg-gray-50/50 p-5 border-t border-gray-100 flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                <span className="text-lg font-black text-gray-800">${order.totalAmount.toFixed(2)}</span>
              </div>

              {!order.isPaid && order.status !== "Cancelled" && (
                <button
                  onClick={() => handlePayment(order._id)}
                  disabled={payingId === order._id}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {payingId === order._id ? (
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                  ) : (
                    <>
                      <CreditCard className="h-3.5 w-3.5" />
                      Pay Now
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
