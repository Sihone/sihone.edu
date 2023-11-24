import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  error: null,
  users: [],
  loading: false,
};

export const getUsers = createAsyncThunk("users/get", async () => {
  const res = await axios.get("/api/user/all");
  return res.data;
});

const userSlice = createSlice({
  initialState,
  name: "users",
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, actions) => {
        state.loading = false;
        state.users = actions.payload;
      })
      .addCase(getUsers.rejected, (state, actions) => {
        state.loading = false;
        state.users = [];
        state.error = actions.error.message;
      });
  },
});

export const userReducer = userSlice.reducer;
