import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../hooks';
const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', roles: ['admin', 'super_admin'] },
  { to: '/admin/products', label: 'Products', roles: ['admin', 'super_admin'] },
  { to: '/admin/size-guides', label: 'Size Guide Management', roles: ['admin', 'super_admin'] },
  { to: '/admin/orders', label: 'Orders', roles: ['admin', 'super_admin'] },
  { to: '/admin/customers', label: 'Customers', roles: ['admin', 'super_admin'] },
  { to: '/admin/coupons', label: 'Coupons', roles: ['admin', 'super_admin'] },
  { to: '/admin/campaigns', label: 'Campaigns', roles: ['admin', 'super_admin'] },
  { to: '/admin/design-requests', label: 'Design Requests', roles: ['admin', 'super_admin'] },
  { to: '/admin/analytics', label: 'Analytics', roles: ['admin', 'super_admin'] },
  { to: '/admin/activity-logs', label: 'Activity Logs', roles: ['admin', 'super_admin'] },
  { to: '/admin/admins', label: 'Admin Management', roles: ['super_admin'] },
];

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-enugu-gold ${
    isActive
      ? 'bg-enugu-gold font-semibold text-enugu-black'
      : 'text-gray-200 hover:bg-white/10 hover:text-white'
  }`;

const AdminSidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const { role } = useAuth();

  const visibleItems = adminNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[88vw] flex-col border-r border-gray-800 bg-enugu-black text-enugu-white transition-transform duration-300 md:static md:w-64 md:max-w-none ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="border-b border-gray-800 px-6 py-5">
        <BrandLogo
          to={ROUTES.ADMIN_DASHBOARD}
          height={40}
          imgClassName="h-10 w-auto brightness-0 invert"
        />
        <p className="mt-2 text-xs uppercase tracking-widest text-gray-500">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            end={item.to.endsWith('dashboard')}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
