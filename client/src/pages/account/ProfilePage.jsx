import { useEffect, useState } from 'react';
import { authApi } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';
import { updateUser } from '../../store/slices/authSlice';
import AccountPageHeader from '../../components/account/AccountPageHeader';

const ProfilePage = () => {
  const { user, dispatch } = useAuth();
  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    authApi
      .getMe()
      .then((res) => {
        const data = res.data?.user ?? res.user ?? res.data ?? res;
        setProfile({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
        });
        dispatch(updateUser(data));
      })
      .catch(() => {});
  }, [dispatch]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setLoadingProfile(true);

    try {
      const res = await authApi.updateProfile({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phone: profile.phone.trim(),
      });
      const updated = res.data?.user ?? res.user ?? res.data ?? res;
      dispatch(updateUser(updated));
      setProfileMessage('Profile updated successfully.');
    } catch (err) {
      setProfileError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          'Unable to update profile.'
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    setLoadingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordMessage('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Unable to change password.');
    } finally {
      setLoadingPassword(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-enugu-black';

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container max-w-2xl">
        <AccountPageHeader title="Profile" subtitle="Manage your personal information and password." />

        <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-enugu-black">Personal Details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">First name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Last name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
              <input type="email" value={profile.email} disabled className={`${inputClass} bg-gray-50`} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          {profileError && <p className="mt-4 text-sm text-red-600">{profileError}</p>}
          {profileMessage && <p className="mt-4 text-sm text-green-700">{profileMessage}</p>}
          <button
            type="submit"
            disabled={loadingProfile}
            className="mt-6 rounded-full bg-enugu-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
          >
            {loadingProfile ? 'Saving...' : 'Save Details'}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="mt-6 rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-enugu-black">Change Password</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Current password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">New password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Confirm new password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                className={inputClass}
                required
              />
            </div>
          </div>
          {passwordError && <p className="mt-4 text-sm text-red-600">{passwordError}</p>}
          {passwordMessage && <p className="mt-4 text-sm text-green-700">{passwordMessage}</p>}
          <button
            type="submit"
            disabled={loadingPassword}
            className="mt-6 rounded-full bg-enugu-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
          >
            {loadingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
