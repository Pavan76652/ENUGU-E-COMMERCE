import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

const ensureUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const listAddresses = async (userId) => {
  const user = await ensureUser(userId);
  return user.addresses ?? [];
};

export const addAddress = async (userId, data) => {
  const user = await ensureUser(userId);

  if (data.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  if (!user.addresses.length) {
    data.isDefault = true;
  }

  user.addresses.push(data);
  await user.save();

  return user.addresses[user.addresses.length - 1];
};

export const updateAddress = async (userId, addressId, data) => {
  const user = await ensureUser(userId);
  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  const fields = [
    'label', 'fullName', 'phone', 'addressLine1', 'addressLine2',
    'city', 'state', 'pincode', 'country', 'isDefault',
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) address[field] = data[field];
  });

  if (data.isDefault) {
    user.addresses.forEach((addr) => {
      if (addr._id.toString() !== addressId) {
        addr.isDefault = false;
      }
    });
  }

  await user.save();
  return address;
};

export const deleteAddress = async (userId, addressId) => {
  const user = await ensureUser(userId);
  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  const wasDefault = address.isDefault;
  address.deleteOne();
  await user.save();

  if (wasDefault && user.addresses.length) {
    user.addresses[0].isDefault = true;
    await user.save();
  }

  return { deleted: true };
};

export const setDefaultAddress = async (userId, addressId) => {
  const user = await ensureUser(userId);
  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === addressId;
  });

  await user.save();
  return address;
};

export default {
  listAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
};
