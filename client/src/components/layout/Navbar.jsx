import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import BrandLogo from '../common/BrandLogo';
import { useCart, useAuth, useWishlist } from '../../hooks';

const NAV_LINKS = [
  { to: ROUTES.SHOP, label: 'Shop' },
  { to: ROUTES.COLLECTIONS, label: 'Collections' },
  { to: ROUTES.ABOUT, label: 'About' },
  { to: ROUTES.CONTACT, label: 'Contact' },
];

const navLinkClass = ({ isActive }) =>
  `relative text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
    isActive ? 'text-enugu-gold' : 'text-enugu-black hover:text-enugu-gold'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex items-center justify-between rounded-lg px-4 py-2.5 text-[15px] font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enugu-gold ${
    isActive
      ? 'bg-enugu-black text-white'
      : 'text-enugu-black hover:bg-enugu-black/5 active:bg-enugu-black/10'
  }`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

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
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
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

          <BrandLogo
            to={ROUTES.HOME}
            height={52}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:translate-x-0 md:translate-y-0"
            imgClassName="h-[52px] w-auto sm:h-[56px] md:h-[62px] lg:h-[66px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
          />
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to={ROUTES.WISHLIST}
              className="relative hidden text-xs uppercase tracking-[0.15em] text-enugu-black transition hover:text-enugu-gold sm:inline"
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
              className="relative text-xs uppercase tracking-[0.15em] text-enugu-black transition hover:text-enugu-gold"
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
              className="hidden enugu-btn-primary px-4 py-2.5 text-[10px] sm:inline-flex"
            >
              {isAuthenticated ? 'Account' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />
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

        <nav className="flex flex-col gap-1 px-3 py-3">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={mobileLinkClass} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}

          <div className="my-1 border-t border-gray-100" />

          <NavLink to={ROUTES.WISHLIST} className={mobileLinkClass} onClick={closeMenu}>
            <span>Wishlist</span>
            {countBadge(wishlistCount)}
          </NavLink>
          <NavLink to={ROUTES.CART} className={mobileLinkClass} onClick={closeMenu}>
            <span>Cart</span>
            {countBadge(itemCount)}
          </NavLink>
          <NavLink
            to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN}
            className={mobileLinkClass}
            onClick={closeMenu}
          >
            {isAuthenticated ? 'Account' : 'Login'}
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
