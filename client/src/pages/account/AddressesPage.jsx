import { useState, useEffect } from 'react';
import { checkoutService } from '../../services/checkoutService';
import { AddressForm, AddressSelector } from '../../components/checkout';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadAddresses = async () => {
    setLoading(true);
    const list = await checkoutService.getAddresses();
    setAddresses(list);
    setLoading(false);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSave = async (formData) => {
    if (editingId) {
      await checkoutService.updateAddress(editingId, formData);
    } else {
      await checkoutService.saveAddress(formData);
    }
    setShowForm(false);
    setEditingId(null);
    loadAddresses();
  };

  const handleDelete = async (addressId) => {
    await checkoutService.deleteAddress(addressId);
    loadAddresses();
  };

  const handleEdit = (address) => {
    setEditingId(address._id ?? address.id);
    setShowForm(true);
  };

  const editingAddress = editingId
    ? addresses.find((a) => (a._id ?? a.id) === editingId)
    : null;

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container max-w-2xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Account</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black">
            Saved Addresses
          </h1>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading addresses...</p>
        ) : showForm ? (
          <AddressForm
            initialValues={editingAddress ?? {}}
            onSubmit={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            submitLabel={editingId ? 'Update Address' : 'Save Address'}
          />
        ) : (
          <>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address) => {
                  const id = address._id ?? address.id;
                  return (
                    <div key={id} className="border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-enugu-gold">
                            {address.label}
                            {address.isDefault && (
                              <span className="ml-2 text-gray-400">· Default</span>
                            )}
                          </p>
                          <p className="mt-1 font-medium">{address.fullName}</p>
                          <p className="text-sm text-gray-600">
                            {address.addressLine1}
                            {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} — {address.pincode}
                          </p>
                          <p className="text-sm text-gray-500">{address.phone}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-xs uppercase tracking-wider">
                          <button
                            type="button"
                            onClick={() => handleEdit(address)}
                            className="text-gray-500 hover:text-enugu-gold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No saved addresses yet.</p>
            )}

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 bg-enugu-black px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
            >
              Add New Address
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;
