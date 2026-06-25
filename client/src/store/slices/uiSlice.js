import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  isMobileNavOpen: false,
  isSearchOpen: false,
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({ id: Date.now(), ...action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setMobileNavOpen: (state, action) => {
      state.isMobileNavOpen = action.payload;
    },
    setSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  setMobileNavOpen,
  setSearchOpen,
  setGlobalLoading,
} = uiSlice.actions;

export const selectUi = (state) => state.ui;

export default uiSlice.reducer;
