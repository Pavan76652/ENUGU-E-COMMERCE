import { Suspense } from 'react';

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-enugu-black border-t-transparent" />
  </div>
);

/**
 * Wraps a lazily-loaded page component in a Suspense boundary so route-level
 * code splitting has a consistent loading fallback.
 */
export const withSuspense = (Component) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

export default withSuspense;
