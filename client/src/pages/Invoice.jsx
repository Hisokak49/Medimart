import { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Printer, CheckCircle, ArrowRight } from 'lucide-react';

const Invoice = () => {
  const { orderId } = useParams();
  const { orders, currentUser } = useContext(AppContext);

  const order = orders.find(o => o.id === orderId);

  // Guard: not logged in
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-sm text-slate-400">Please sign in to inspect your tax invoice details.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  // Guard: If order not found, OR if the logged-in user is not an admin AND the order does not belong to them
  const isAuthorized = ['admin', 'super_admin', 'super-admin', 'super admin'].includes(String(currentUser?.role || '').trim().toLowerCase()) || (order && (order.user === currentUser.id || order.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()));

  if (!order || !isAuthorized) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Invoice Not Found</h2>
        <p className="text-sm text-slate-400">We could not retrieve the billing logs for this order ID.</p>
        <Link to="/" className="text-sm font-bold text-emerald-600 hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const handlePrint = (e) => {
    if (e) e.preventDefault();
    try {
      // Check if we are inside a sandboxed iframe
      if (window.self !== window.top) {
        console.warn("Print triggered inside a sandboxed preview iframe. If print dialog doesn't appear, please open the app in a new browser tab to print.");
      }
      window.print();
    } catch (err) {
      console.error("Print failed: ", err);
      alert("Printing is restricted by your browser's preview window sandbox. Please open this app in a separate browser tab to print or save the invoice as a PDF.");
    }
  };

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:py-0">
      
      {/* Back store links (hidden during print) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-black border border-emerald-100">
          <CheckCircle className="w-4.5 h-4.5" />
          <span>Thank you! Order Placed Successfully.</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          
          <Link
            to="/orders"
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition-all"
          >
            <span>My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Invoice Document Box */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white font-black text-lg">
                M
              </span>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">
                MEDIMART
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">
              Medimart Solutions Ltd.<br />
              100 Wellness Plaza, Health Avenue<br />
              support@medimart.com | +1 (800) 555-MEDS
            </p>
          </div>
          
          <div className="text-left sm:text-right space-y-1">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
              Tax Invoice / Receipt
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{order.id}</h2>
            <p className="text-xs text-slate-400 font-bold">Receipt ID: {order.receiptId}</p>
            <p className="text-xs text-slate-400 font-bold">{formattedDate}</p>
          </div>
        </div>

        {/* Billing & Shipment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="space-y-1">
            <p className="font-black text-slate-400 uppercase tracking-wider text-[10px]">Delivered To</p>
            <p className="font-extrabold text-slate-800 text-sm">{order.deliveryAddress.split(',')[0]}</p>
            <p>{order.deliveryAddress.split(',').slice(1).join(',')}</p>
          </div>
          
          <div className="space-y-1 sm:text-right">
            <p className="font-black text-slate-400 uppercase tracking-wider text-[10px]">Payment Details</p>
            <p className="font-bold text-slate-800">{order.paymentMethod}</p>
            <p className="font-mono text-slate-400">Status: <strong className={order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}>{order.paymentStatus}</strong></p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <th className="py-3 pr-4">Sl.</th>
                <th className="py-3 px-4">Medicine Item</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 pl-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {order.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-4 pr-4 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-4 px-4 font-extrabold text-slate-800">
                    {item.name}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-600">{item.quantity}</td>
                  <td className="py-4 px-4 text-right font-mono">₹{Number(item.price || 0).toFixed(2)}</td>
                  <td className="py-4 pl-4 text-right font-mono font-black text-slate-900">
                    ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <div className="w-full sm:w-64 space-y-2 text-xs font-bold text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal Amount</span>
              <span className="text-slate-800 font-bold">₹{Number(order.subtotal || 0).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Promo Discount</span>
                <span>-₹{Number(order.discount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST / Sales Tax (8%)</span>
              <span className="text-slate-800 font-bold">₹{Number(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Courier Delivery</span>
              <span className="text-emerald-600 font-extrabold">FREE</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline font-black">
              <span className="text-sm text-slate-800">Paid Grand Total</span>
              <span className="text-xl text-slate-900 font-black">₹{Number(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Terms footer info */}
        <div className="pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 font-semibold space-y-1">
          <p>This is a computer-generated tax bill. No physical signature is required.</p>
          <p>For refunds or dosage assistance, please reference your Receipt ID: {order.receiptId}.</p>
        </div>

      </div>

    </div>
  );
};

export default Invoice;
