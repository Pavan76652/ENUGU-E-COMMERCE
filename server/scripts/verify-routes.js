/**
 * Verifies all API route modules load without errors.
 * Run: npm run verify
 */
const routes = [
  '../src/routes/v1/health.routes.js',
  '../src/routes/v1/auth.routes.js',
  '../src/routes/v1/products.routes.js',
  '../src/routes/v1/orders.routes.js',
  '../src/routes/v1/addresses.routes.js',
  '../src/routes/v1/campaigns.routes.js',
  '../src/routes/v1/designRequests.routes.js',
  '../src/routes/v1/wishlist.routes.js',
  '../src/routes/v1/stockNotifications.routes.js',
  '../src/routes/v1/contact.routes.js',
  '../src/routes/v1/seo.routes.js',
  '../src/routes/v1/admin/index.js',
];

let failed = 0;

for (const route of routes) {
  try {
    await import(route);
    console.log(`✓ ${route.split('/').pop()}`);
  } catch (err) {
    failed += 1;
    console.error(`✗ ${route}: ${err.message}`);
  }
}

if (failed) {
  console.error(`\n${failed} route module(s) failed to load.`);
  process.exit(1);
}

console.log('\nAll route modules loaded successfully.');
