import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaSave } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../api/authApi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  if (!isAuthenticated) return null;

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar + Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {user?.role || 'Customer'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['profile', 'password'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 font-semibold capitalize text-sm transition border-b-2 -mb-px ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'profile' ? 'Edit Profile' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={`${inputClass} pl-10`} placeholder="Full Name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={`${inputClass} pl-10`} placeholder="Email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className={`${inputClass} pl-10`} placeholder="Phone number" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition">
            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="space-y-4 max-w-sm">
            {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type="password" required value={passwordForm[field]} onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })} className={inputClass} placeholder="••••••••" />
              </div>
            ))}
          </div>
          <button type="submit" disabled={saving} className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition">
            <FaSave /> {saving ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
