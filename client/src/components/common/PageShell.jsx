const PageShell = ({ name, zone = 'storefront' }) => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest text-enugu-gold">{zone}</p>
      <h1 className="mt-2 text-2xl font-medium text-enugu-black">{name}</h1>
      <p className="mt-2 text-sm text-gray-500">Page implementation pending</p>
    </div>
  </div>
);

export default PageShell;
