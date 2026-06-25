import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const AccountPageHeader = ({ title, subtitle }) => (
  <div className="mb-8 sm:mb-10">
    <Link
      to={ROUTES.ACCOUNT}
      className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-enugu-gold"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
      </svg>
      Account
    </Link>
    <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
      {title}
    </h1>
    {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
  </div>
);

export default AccountPageHeader;
