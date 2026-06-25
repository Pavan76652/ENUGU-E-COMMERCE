import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/helpers';
import { ROUTES } from '../../../config/routes';
import CustomerStatusBadge from './CustomerStatusBadge';
const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const fullName = (customer) =>
  `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim() || '—';

const CustomerTable = ({ customers, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Customer', 'Email', 'Phone', 'Orders', 'Spend', 'Status', 'Verified', 'Joined', ''].map((head) => (
              <th
                key={head || 'actions'}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((customer) => {
            const id = customer._id ?? customer.id;

            return (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-enugu-black">{fullName(customer)}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3 text-gray-600">{customer.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{customer.totalOrders ?? 0}</td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(customer.totalSpent ?? 0)}
                </td>
                <td className="px-4 py-3">                  <CustomerStatusBadge isActive={customer.isActive !== false} />
                </td>
                <td className="px-4 py-3">
                  {customer.isEmailVerified ? (
                    <span className="text-xs font-medium text-green-700">Yes</span>
                  ) : (
                    <span className="text-xs text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={ROUTES.ADMIN_CUSTOMER.replace(':id', id)}
                    className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
