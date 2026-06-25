import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';
import { clearCredentials } from '../../store/slices/authSlice';
import { ROUTES } from '../../config/routes';

const ACCOUNT_LINKS = [
  {
    to: ROUTES.ACCOUNT_ORDERS,
    title: 'My Orders',
    description: 'Track, view and manage your orders.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  },
  {
    to: ROUTES.ACCOUNT_PROFILE,
    title: 'Profile',
    description: 'Update your personal details and password.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    to: ROUTES.ACCOUNT_ADDRESSES,
    title: 'Addresses',
    description: 'Manage your saved delivery addresses.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    to: ROUTES.ACCOUNT_WISHLIST,
    title: 'Wishlist',
    description: 'View the items you have saved for later.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
  },
];

const AccountPage = () => {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const firstName = user?.firstName || 'there';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      dispatch(clearCredentials());
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container">
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Account</p>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
              Hello, {firstName}
            </h1>
            {user?.email && <p className="mt-2 text-sm text-gray-500">{user.email}</p>}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="self-start rounded-full border border-enugu-black px-5 py-2 text-xs font-semibold uppercase tracking-wider text-enugu-black transition hover:bg-enugu-black hover:text-white disabled:opacity-50 sm:self-auto"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ACCOUNT_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-enugu-black hover:shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-enugu-black transition group-hover:bg-enugu-black group-hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold uppercase tracking-wide text-enugu-black">
                  {link.title}
                </span>
                <span className="mt-1 block text-sm text-gray-500">{link.description}</span>
              </span>
              <svg
                className="ml-auto h-5 w-5 shrink-0 text-gray-300 transition group-hover:text-enugu-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
