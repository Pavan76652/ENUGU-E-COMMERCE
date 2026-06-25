import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  category: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  priceRange: { min: null, max: null },
  sizes: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSizes: (state, action) => {
      state.sizes = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearch,
  setCategory,
  setSort,
  setPriceRange,
  setSizes,
  resetFilters,
} = filtersSlice.actions;

export const selectFilters = (state) => state.filters;

export default filtersSlice.reducer;
