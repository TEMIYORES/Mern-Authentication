import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/authSlice";
import { apiSlice } from "./slices/apiSlice";
const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
