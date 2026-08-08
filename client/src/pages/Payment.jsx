import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, CreditCard, ShieldCheck, Landmark, Truck, CheckCircle, WifiOff } from 'lucide-react';

const Payment = () => {
  const { cart, medicines, promoApplied, placeOrder, isOnline } = useContext(AppContext);
  const navigate = useNavigate();

  const [shippingDetails] = useState(() => {
    const savedShipping = sessionStorage.getItem('mm_checkout_shipping');
    return savedShipping ? JSON.parse(savedShipping) : null;
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [prevIsOnline, setPrevIsOnline] = useState(isOnline);
  
  // Card input states
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiData, setUpiData] = useState({ vpa: '' });
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(false);

  if (isOnline !== prevIsOnline) {
    setPrevIsOnline(isOnline);
    if (!isOnline) {
      setPaymentMethod('Cash on Delivery (Offline)');
    }
  }

  useEffect(() => {
    if (!shippingDetails) {
      navigate('/checkout');
    }
  }, [shippingDetails, navigate]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'name') {
      // If user inputs any number or symbol, trigger error and strip it
      if (/[^a-zA-Z\s]/.test(value)) {
        setNameError(true);
        formattedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
      } else {
        setNameError(false);
        formattedValue = value.toUpperCase();
      }
    } else if (name === 'number') {
      // Strip all non-digits
      const digits = value.replace(/\D/g, '');
      const trimmed = digits.substring(0, 16);
      // Chunk into groups of 4 separated by space
      const chunks = trimmed.match(/.{1,4}/g);
      formattedValue = chunks ? chunks.join(' ') : '';
    } else if (name === 'expiry') {
      // Strip all non-digits
      let digits = value.replace(/\D/g, '');
      
      // Enforce valid month typing constraints
      if (digits.length >= 1) {
        const firstDigit = digits.charAt(0);
        // If the first digit is 2-9, auto-prepend '0' (e.g., '9' -> '09')
        if (firstDigit !== '0' && firstDigit !== '1') {
          digits = '0' + firstDigit + digits.substring(1);
        }
      }
      if (digits.length >= 2) {
        const month = parseInt(digits.substring(0, 2), 10);
        if (month > 12) {
          // Cap invalid month to 12
          digits = '12' + digits.substring(2);
        } else if (month === 0) {
          // Prevent '00' by correcting to '01'
          digits = '01' + digits.substring(2);
        }
      }

      const trimmed = digits.substring(0, 4);
      if (trimmed.length > 2) {
        formattedValue = `${trimmed.substring(0, 2)} / ${trimmed.substring(2)}`;
      } else {
        formattedValue = trimmed;
      }
    } else if (name === 'cvv') {
      // Strip all non-digits, max 3
      const digits = value.replace(/\D/g, '');
      formattedValue = digits.substring(0, 3);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!shippingDetails) return;

    setError('');
    setProcessing(true);

    // Simulate network delay then process async
    setTimeout(async () => {
      try {
        if (paymentMethod === 'Credit Card') {
          if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
            throw new Error('Please fill in all credit card fields.');
          }
          
          // Validate Card Number Length (Exactly 16 digits)
          const cardDigits = cardData.number.replace(/\D/g, '');
          if (cardDigits.length !== 16) {
            throw new Error('Card number must be exactly 16 digits.');
          }

          // Validate Expiry Date Format (MM / YY)
          const expiryMatch = cardData.expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
          if (!expiryMatch) {
            throw new Error('Expiry date must be in MM / YY format.');
          }

          const month = parseInt(expiryMatch[1], 10);
          const year = parseInt('20' + expiryMatch[2], 10);

          // Validate Month
          if (month < 1 || month > 12) {
            throw new Error('Expiry month must be between 01 and 12.');
          }

          // Validate Expiry Limit (Not Expired)
          const now = new Date();
          const currentMonth = now.getMonth() + 1; // 1-indexed month
          const currentYear = now.getFullYear();

          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            throw new Error('The card has expired.');
          }

          // Validate CVV Code (Exactly 3 digits)
          if (cardData.cvv.length !== 3) {
            throw new Error('CVV code must be exactly 3 digits.');
          }

          if (!isOnline) {
            throw new Error('Online transactions are currently disabled in offline mode.');
          }
        }

        if (paymentMethod === 'UPI') {
          if (!upiData.vpa) {
            throw new Error('Please enter your UPI Virtual Private Address.');
          }
          if (isUpiInvalid) {
            throw new Error(`Invalid UPI Address: ${upiErrorMsg}`);
          }
          if (!isOnline) {
            throw new Error('UPI payments require active internet connection.');
          }
        }

        // ✅ Await the async placeOrder so we get the real order object (not a Promise)
        const createdOrder = await placeOrder(shippingDetails, paymentMethod, { cardData, upiData });
        
        // Remove checkout details from session
        sessionStorage.removeItem('mm_checkout_shipping');
        setProcessing(false);
        
        // Navigate to Invoice — createdOrder.id is now the real order ID
        navigate(`/invoice/${createdOrder.id}`);
      } catch (err) {
        setError(err.message);
        setProcessing(false);
      }
    }, 1500);
  };

  const cardDigits = cardData.number.replace(/\D/g, '');
  const isCardNumberInvalid = cardDigits.length > 0 && cardDigits.length < 16;

  // Real-time Expiry Validation Checks (MM / YY)
  let isExpiryInvalid = false;
  let expiryErrorMsg = "";
  if (cardData.expiry.length === 7) {
    const expiryMatch = cardData.expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (expiryMatch) {
      const month = parseInt(expiryMatch[1], 10);
      const year = parseInt('20' + expiryMatch[2], 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const maxYear = currentYear + 20; // limit future years to 20 years

      if (month < 1 || month > 12) {
        isExpiryInvalid = true;
        expiryErrorMsg = "Invalid month";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        isExpiryInvalid = true;
        expiryErrorMsg = "Card has expired";
      } else if (year > maxYear) {
        isExpiryInvalid = true;
        expiryErrorMsg = `Limit year to ${maxYear}`;
      }
    } else {
      isExpiryInvalid = true;
      expiryErrorMsg = "Invalid format";
    }
  }

  // Real-time UPI VPA Validation Checks
  let isUpiInvalid = false;
  let upiErrorMsg = "";
  if (upiData.vpa.length > 0) {
    if (!upiData.vpa.includes('@')) {
      isUpiInvalid = true;
      upiErrorMsg = "Must contain '@' symbol (e.g., @bank)";
    } else {
      const parts = upiData.vpa.split('@');
      if (parts.length !== 2) {
        isUpiInvalid = true;
        upiErrorMsg = "Must contain exactly one '@' symbol";
      } else {
        const [username, handle] = parts;
        const usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
        const handleRegex = /^[a-zA-Z0-9.\-_]+$/;
        
        if (upiData.vpa.length > 100) {
          isUpiInvalid = true;
          upiErrorMsg = "Address is too long (max 100 characters)";
        } else if (username.length < 2) {
          isUpiInvalid = true;
          upiErrorMsg = "Username must be at least 2 characters";
        } else if (username.length > 64) {
          isUpiInvalid = true;
          upiErrorMsg = "Username is too long (max 64 characters)";
        } else if (!usernameRegex.test(username)) {
          isUpiInvalid = true;
          upiErrorMsg = "Only letters, numbers, dot, hyphen, and underscore allowed before @";
        } else if (handle.length < 2) {
          isUpiInvalid = true;
          upiErrorMsg = "Bank handle must be at least 2 characters (e.g., okaxis)";
        } else if (handle.length > 32) {
          isUpiInvalid = true;
          upiErrorMsg = "Bank handle is too long (max 32 characters)";
        } else if (!handleRegex.test(handle)) {
          isUpiInvalid = true;
          upiErrorMsg = "Only letters, numbers, dot, hyphen, and underscore allowed after @";
        }
      }
    }
  }

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const med = medicines.find(m => m.id === item.id);
    return acc + (med ? med.price * item.quantity : 0);
  }, 0);

  const discount = promoApplied ? (subtotal * promoApplied.value) / 100 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal - discount + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Link */}
      <Link to="/checkout" className="inline-flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shipping</span>
      </Link>

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Secure Payment</h1>
        <p className="text-sm text-slate-400">Choose your payment mode. Online channels (UPI/Cards) will adjust during connectivity outages.</p>
      </div>

      {/* Network Alert Banner */}
      {!isOnline && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-800 text-sm">
          <WifiOff className="w-5 h-5 mt-0.5 text-amber-600 animate-pulse flex-shrink-0" />
          <div>
            <strong className="font-extrabold">Offline Mode Triggered:</strong> You are currently simulating an offline environment. Card and UPI channels are locked. Please complete checkout with <strong className="underline">Cash on Delivery (Offline)</strong>.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Choose Payment Mode */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 text-base pb-3 border-b border-slate-50">Select Payment Method</h3>
            
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Methods Select Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Credit Card Button */}
              <button
                type="button"
                disabled={!isOnline}
                onClick={() => setPaymentMethod('Credit Card')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                  !isOnline ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60' : ''
                } ${
                  paymentMethod === 'Credit Card' && isOnline
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'Credit Card' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-black">Credit/Debit Card</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Online Gateway</p>
                </div>
              </button>

              {/* UPI Button */}
              <button
                type="button"
                disabled={!isOnline}
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                  !isOnline ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60' : ''
                } ${
                  paymentMethod === 'UPI' && isOnline
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Landmark className={`w-6 h-6 ${paymentMethod === 'UPI' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-black">UPI (GPay / PhonePe)</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Instant Scan</p>
                </div>
              </button>

              {/* COD Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery (Offline)')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                  paymentMethod === 'Cash on Delivery (Offline)'
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Truck className={`w-6 h-6 ${paymentMethod === 'Cash on Delivery (Offline)' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-black">Cash on Delivery</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Offline Payment</p>
                </div>
              </button>

            </div>

            {/* Selected Method Form Panel */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              
              {/* Credit Card inputs */}
              {paymentMethod === 'Credit Card' && isOnline && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Cardholder Name</label>
                      {nameError && (
                        <span className="text-[10px] font-extrabold text-rose-500 animate-pulse">
                          Only alphabetical characters allowed
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={cardData.name}
                      onChange={handleCardChange}
                      placeholder="e.g. JOHNATHAN DOE"
                      className={`w-full px-3.5 py-2 rounded-xl border bg-white text-sm focus:outline-none uppercase font-bold transition-all ${
                        nameError
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/5 text-rose-700'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Card Number</label>
                      {isCardNumberInvalid && (
                        <span className="text-[10px] font-extrabold text-rose-500 animate-pulse">
                          Card number must be exactly 16 digits ({cardDigits.length}/16)
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="number"
                      value={cardData.number}
                      onChange={handleCardChange}
                      placeholder="4111 2222 3333 4444"
                      maxLength="19"
                      disabled={nameError || cardData.name.trim().length === 0}
                      title={nameError || cardData.name.trim().length === 0 ? "Enter a valid Cardholder Name first" : ""}
                      className={`w-full px-3.5 py-2 rounded-xl border bg-white text-sm focus:outline-none font-mono disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all ${
                        isCardNumberInvalid
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/5 text-rose-700'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Expiry Date</label>
                        {isExpiryInvalid && (
                          <span className="text-[9px] font-extrabold text-rose-500 animate-pulse">
                            {expiryErrorMsg}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM / YY"
                        maxLength="7"
                        disabled={cardDigits.length < 16}
                        title={cardDigits.length < 16 ? "Enter a 16-digit card number first" : ""}
                        className={`w-full px-3.5 py-2 rounded-xl border bg-white text-sm focus:outline-none font-mono disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all ${
                          isExpiryInvalid
                            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/5 text-rose-700'
                            : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">CVV Code</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        maxLength="3"
                        disabled={cardDigits.length < 16}
                        title={cardDigits.length < 16 ? "Enter a 16-digit card number first" : ""}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-emerald-500 font-mono disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>
                  {cardData.name.trim().length === 0 || nameError ? (
                    <p className="text-[10px] text-slate-400 font-medium animate-pulse">
                      ℹ Please enter a valid alphabetical Cardholder Name to unlock the Card Number field.
                    </p>
                  ) : cardDigits.length < 16 ? (
                    <p className="text-[10px] text-slate-400 font-medium animate-pulse">
                      ℹ Please enter a valid 16-digit Card Number to unlock Expiry Date and CVV.
                    </p>
                  ) : null}
                </div>
              )}

              {/* UPI input */}
              {paymentMethod === 'UPI' && isOnline && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">UPI VPA Address</label>
                      {isUpiInvalid && (
                        <span className="text-[10px] font-extrabold text-rose-500 animate-pulse">
                          {upiErrorMsg}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. username@okhdfcbank"
                      value={upiData.vpa}
                      onChange={(e) => setUpiData({ vpa: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl border bg-white text-sm focus:outline-none font-mono transition-all ${
                        isUpiInvalid
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-rose-50/5 text-rose-700'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    A payment request notification will be pushed to your active mobile UPI app.
                  </p>
                </div>
              )}

              {/* COD message */}
              {paymentMethod === 'Cash on Delivery (Offline)' && (
                <div className="space-y-2 text-slate-600 text-xs font-semibold">
                  <p className="flex items-center space-x-1.5 text-slate-700">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                    <span>No advance payment needed.</span>
                  </p>
                  <p>
                    Pay cash, swipe card on delivery, or complete payments at your selected local pharmacy branch counter.
                  </p>
                </div>
              )}

            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className={`w-full py-3.5 rounded-xl text-white font-extrabold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
                processing
                  ? 'bg-slate-400 cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 hover:shadow-emerald-500/30'
              }`}
            >
              <span>{processing ? 'Simulating Secure Transaction...' : `Pay ₹${total.toFixed(2)} & Complete Order`}</span>
            </button>
          </div>
        </div>

        {/* Right Side summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-50">Delivery Summary</h3>
            
            {shippingDetails && (
              <div className="text-xs space-y-1.5 text-slate-600">
                <p className="font-bold text-slate-800">{shippingDetails.name}</p>
                <p>{shippingDetails.address}</p>
                <p>{shippingDetails.city} - {shippingDetails.zipCode}</p>
                <p className="pt-1.5 border-t border-slate-50 font-mono text-[10px] text-slate-400">Phone: {shippingDetails.phone}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 font-semibold">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Fees</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span className="text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline font-black">
              <span className="text-xs text-slate-600">Order Grand Total</span>
              <span className="text-xl text-slate-900">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3 text-xs text-slate-400">
            <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <span>PCI-DSS compliant system tokenization guarantees safety of card storage indices.</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Payment;
