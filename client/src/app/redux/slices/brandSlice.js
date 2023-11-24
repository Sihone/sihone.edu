import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  error: null,
  brands: [],
  loading: false,
};

export const getBrands = createAsyncThunk("brands/get", async () => {
  const res = await axios.get("/api/ecommerce/get-brand-list");
  return res.data;
});

const brandSlice = createSlice({
  initialState,
  name: "brands",
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
        state.brands = [];
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, actions) => {
        state.loading = false;
        state.brands = actions.payload;
        state.error = null;
      })
      .addCase(getBrands.rejected, (state, actions) => {
        state.loading = false;
        state.brands = [];
        state.error = actions.error.message;
      });
  },
});

export const brandReducer = brandSlice.reducer;
