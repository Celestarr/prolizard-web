import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { thunk } from "redux-thunk";

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

// Export a hook that can be reused to resolve types
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
