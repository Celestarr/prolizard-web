/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "app/store";

const initialState = {
  token: null,
} as { token: string | null; };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addMatcher(postsApi.endpoints.login.matchPending, (state, action) => {
  //       console.log("pending", action);
  //     })
  //     .addMatcher(postsApi.endpoints.login.matchFulfilled, (state, action) => {
  //       console.log("fulfilled", action);
  //       state.user = action.payload.user;
  //       state.token = action.payload.token;
  //       state.isAuthenticated = true;
  //     })
  //     .addMatcher(postsApi.endpoints.login.matchRejected, (state, action) => {
  //       console.log("rejected", action);
  //     });
  // },
});

export const { setToken } = slice.actions;
export default slice.reducer;

export const selectToken = (state: RootState) => state.auth.token;
