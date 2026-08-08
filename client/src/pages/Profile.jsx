import { useContext, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Key, Check, Camera, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateProfile } = useContext(AppContext);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    zipCode: currentUser?.zipCode || '',
    password: currentUser?.password || '',
    avatar: currentUser?.avatar || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ── Guard: not logged in ──
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please Log In</h2>
        <p className="text-sm text-slate-400">You must be logged in to inspect your user profile details.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Profile picture file upload → base64 data-URL ──
  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatarPreview(dataUrl);
      setFormData(prev => ({ ...prev, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.name.trim()) { setError('Name field cannot be left blank.'); return; }
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-400">Manage your address details, contact numbers, profile picture, and login credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ── Left: Avatar Card ── */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 h-fit">

          {/* Avatar with camera overlay */}
          <div className="relative group">
            <img
              src={avatarPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/20 shadow"
            />
            {/* Hover overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 w-24 h-24 rounded-full bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              title="Change profile photo"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
            className="hidden"
          />

          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-100"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change Photo</span>
          </button>
          <p className="text-[10px] text-slate-400">Click photo or button to upload from your computer</p>

          <div>
            <h3 className="font-extrabold text-slate-800 text-base">{currentUser.name}</h3>
            <p className="text-xs text-slate-400 font-semibold">{currentUser.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-50 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded bg-slate-100 text-slate-600">
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        {/* ── Right: Profile Form ── */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 text-base pb-3 border-b border-slate-50">Profile Details</h3>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-semibold">{error}</div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-1">
                <Check className="w-4 h-4" /><span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /><span>Full Name</span>
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 text-sm transition-all"
                />
              </div>

              {/* Email (disabled) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5" /><span>Email Address (Not editable)</span>
                </label>
                <input type="email" disabled value={currentUser.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-sm cursor-not-allowed font-mono"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /><span>Phone Number</span>
                </label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 text-sm transition-all"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /><span>Street Address</span>
                </label>
                <input type="text" name="address" value={formData.address} onChange={handleChange}
                  placeholder="Flat/House no., Street name, Locality"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 text-sm transition-all"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange}
                  placeholder="Mumbai, Delhi, Bengaluru..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 text-sm transition-all"
                />
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">PIN Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange}
                  placeholder="e.g. 400050"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 text-sm transition-all"
                />
              </div>

              {/* Password with eye toggle */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <Key className="w-3.5 h-3.5 text-slate-400" /><span>Change Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

            <button type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
