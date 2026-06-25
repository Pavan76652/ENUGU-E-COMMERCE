import { Outlet, Link } from 'react-router-dom';
import BRAND from '../constants/brand';
import { ROUTES } from '../config/routes';

const AuthLayout = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-enugu-black px-4">
    <Link to={ROUTES.HOME} className="mb-8 text-2xl font-bold tracking-widest text-enugu-white">
      {BRAND.name}
    </Link>
    <div className="w-full max-w-md rounded-none border border-gray-800 bg-enugu-white p-8 shadow-xl">
      <Outlet />
    </div>
    <p className="mt-6 text-sm text-gray-500">{BRAND.tagline}</p>
  </div>
);

export default AuthLayout;
