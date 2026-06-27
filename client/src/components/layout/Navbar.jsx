import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import BrandLogo from '../common/BrandLogo';
import { useCart, useAuth, useWishlist } from '../../hooks';
import { clearCredentials } from '../../store/slices/authSlice';
import { authApi } from '../../services/authApi';

const NAV_LINKS = [
  { to: ROUTES.SHOP, label: 'Shop' },
  { to: ROUTES.COLLECTIONS, label: 'Collections' },
  { to: ROUTES.ABOUT, label: 'About' },
  { to: ROUTES.CONTACT, label: 'Contact' },
];

// Mobile drawer — grouped like Zara / H&M / Nike
// matchSort: only this shop sort param is active (null = plain /shop with no sort)
const MENU_BROWSE = [
  { to: ROUTES.SHOP, label: 'Shop', matchSort: null },
  { to: ROUTES.COLLECTIONS, label: 'Collections' },
  { to: `${ROUTES.SHOP}?sort=newest`, label: 'New Arrivals', matchSort: 'newest' },
  { to: `${ROUTES.SHOP}?sort=best-selling`, label: 'Best Sellers', matchSort: 'best-selling' },
];

const MENU_INFO = [
  { to: ROUTES.ABOUT, label: 'About Us' },
  { to: ROUTES.CONTACT, label: 'Contact Us' },
];

const navLinkClass = ({ isActive }) =>
  `relative text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
    isActive ? 'text-enugu-gold' : 'text-enugu-black hover:text-enugu-gold'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enugu-gold ${
    isActive
      ? 'bg-enugu-black text-white'
      : 'text-enugu-black hover:bg-enugu-black/5 active:bg-enugu-black/10'
  }`;

const isShopBrowseLinkActive = (link, location) => {
  if (link.matchSort === undefined) return undefined;
  if (location.pathname !== ROUTES.SHOP) return false;
  const sort = new URLSearchParams(location.search).get('sort');
  if (link.matchSort === null) return !sort;
  return sort === link.matchSort;
};

const sectionLabelClass =
  'px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400';

const AccountIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
    />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user, dispatch } = useAuth();

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    closeMenu();
    try {
      await authApi.logout();
    } catch {
      // ignore network errors — clear client session regardless
    }
    dispatch(clearCredentials());
    navigate(ROUTES.HOME);
  };

  const countBadge = (count) =>
    count > 0 ? (
      <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-enugu-gold px-1 text-[10px] font-bold text-enugu-black">
        {count}
      </span>
    ) : null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-enugu-white/90 backdrop-blur-md">
        <div className="enugu-container">
          <div className="flex h-[5rem] items-center justify-between gap-3 sm:h-[5.25rem] sm:gap-5">
            {/* LEFT — hamburger (mobile) */}
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={`block h-px w-5 bg-enugu-black transition-all duration-300 ${
                  isOpen ? 'translate-y-[3.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-5 bg-enugu-black transition-all duration-300 ${
                  isOpen ? '-translate-y-[3.5px] -rotate-45' : ''
                }`}
              />
            </button>

            {/* CENTER — logo */}
            <BrandLogo
              to={ROUTES.HOME}
              height={52}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:translate-x-0 md:translate-y-0"
              imgClassName="drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
            />

            {/* Desktop primary nav (unchanged) */}
            <nav className="hidden items-center gap-10 md:flex">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT — actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Desktop actions (md+) — unchanged */}
              <Link
                to={ROUTES.WISHLIST}
                className="relative hidden text-xs uppercase tracking-[0.15em] text-enugu-black transition hover:text-enugu-gold md:inline"
              >
                Wishlist
                {wishlistCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center bg-enugu-gold text-[10px] font-bold text-enugu-black">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to={ROUTES.CART}
                className="relative hidden text-xs uppercase tracking-[0.15em] text-enugu-black transition hover:text-enugu-gold md:inline"
              >
                Cart
                {itemCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center bg-enugu-gold text-[10px] font-bold text-enugu-black">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link
                to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN}
                className="hidden enugu-btn-primary px-4 py-2.5 text-[10px] md:inline-flex"
              >
                {isAuthenticated ? 'Account' : 'Login'}
              </Link>

              {/* Mobile action (<md) — Login text for guests, account icon when logged in */}
              {isAuthenticated ? (
                <Link
                  to={ROUTES.ACCOUNT}
                  aria-label="My account"
                  className="flex h-10 w-10 items-center justify-center text-enugu-black transition hover:text-enugu-gold md:hidden"
                >
                  <AccountIcon />
                </Link>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-enugu-black transition hover:text-enugu-gold md:hidden"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dim overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        style={{ backgroundColor: '#ffffff' }}
        className={`fixed inset-y-0 left-0 z-[70] flex w-[86vw] max-w-sm flex-col border-r border-black/5 bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <BrandLogo to={ROUTES.HOME} height={40} imgClassName="h-10 w-auto" onClick={closeMenu} />
          <button
            type="button"
            onClick={closeMenu}
            className="rounded-full border border-gray-200 p-2 text-enugu-black transition hover:bg-enugu-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-enugu-gold"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Logged-in greeting */}
        {isAuthenticated && (
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-enugu-black text-white">
              <AccountIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-enugu-black">
                Hi{user?.firstName ? `, ${user.firstName}` : ''}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {/* Browse */}
          <p className={sectionLabelClass}>Browse</p>
          <nav className="flex flex-col gap-1">
            {MENU_BROWSE.map((link) => {
              const shopActive = isShopBrowseLinkActive(link, location);
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === ROUTES.SHOP}
                  className={({ isActive, isPending }) =>
                    mobileLinkClass({
                      isActive: shopActive !== undefined ? shopActive : isActive,
                      isPending,
                    })
                  }
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="my-2 border-t border-gray-100" />

          {/* Quick links */}
          <nav className="flex flex-col gap-1">
            <NavLink to={ROUTES.WISHLIST} className={mobileLinkClass} onClick={closeMenu}>
              <span>Wishlist</span>
              {countBadge(wishlistCount)}
            </NavLink>
            <NavLink to={ROUTES.CART} className={mobileLinkClass} onClick={closeMenu}>
              <span>Cart</span>
              {countBadge(itemCount)}
            </NavLink>
            <NavLink to={ROUTES.ACCOUNT_ORDERS} className={mobileLinkClass} onClick={closeMenu}>
              <span>Track Order</span>
            </NavLink>
          </nav>

          <div className="my-2 border-t border-gray-100" />

          {/* Info */}
          <nav className="flex flex-col gap-1">
            {MENU_INFO.map((link) => (
              <NavLink key={link.label} to={link.to} className={mobileLinkClass} onClick={closeMenu}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="my-2 border-t border-gray-100" />

          {/* Account */}
          <p className={sectionLabelClass}>Account</p>
          {isAuthenticated ? (
            <nav className="flex flex-col gap-1">
              <NavLink to={ROUTES.ACCOUNT} className={mobileLinkClass} onClick={closeMenu}>
                My Account
              </NavLink>
              <NavLink to={ROUTES.ACCOUNT_ORDERS} className={mobileLinkClass} onClick={closeMenu}>
                My Orders
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-semibold tracking-wide text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                Logout
              </button>
            </nav>
          ) : (
            <div className="flex flex-col gap-2 px-1 pt-1">
              <Link
                to={ROUTES.LOGIN}
                onClick={closeMenu}
                className="enugu-btn-outline w-full py-3 text-xs"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                onClick={closeMenu}
                className="enugu-btn-primary w-full py-3 text-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
