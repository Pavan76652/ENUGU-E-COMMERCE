const CustomerStatusBadge = ({ isActive }) => (
  <span
    className={`rounded px-2 py-1 text-xs font-medium uppercase tracking-wide ${
      isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}
  >
    {isActive ? 'Active' : 'Disabled'}
  </span>
);

export default CustomerStatusBadge;
