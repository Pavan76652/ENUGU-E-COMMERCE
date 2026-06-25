import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const ErrorScreen = ({ code, title, message }) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
    <div className="text-center">
      <p className="font-display text-7xl font-black tracking-tight text-enugu-black sm:text-8xl">
        {code}
      </p>
      <h1 className="mt-4 text-xl font-bold uppercase tracking-wide text-enugu-black sm:text-2xl">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to={ROUTES.HOME}
          className="rounded-full bg-enugu-black px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-enugu-gold hover:text-enugu-black"
        >
          Back to Home
        </Link>
        <Link
          to={ROUTES.SHOP}
          className="rounded-full border border-gray-300 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700 transition hover:border-enugu-black hover:text-enugu-black"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  </div>
);

export const NotFoundPage = () => (
  <ErrorScreen
    code="404"
    title="Page Not Found"
    message="The page you're looking for doesn't exist or has been moved."
  />
);

export const ForbiddenPage = () => (
  <ErrorScreen
    code="403"
    title="Access Denied"
    message="You don't have permission to view this page."
  />
);
