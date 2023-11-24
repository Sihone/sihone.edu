import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  error: null,
  products: [],
  loading: false,
};

export const getProducts = createAsyncThunk("products/get", async () => {
  const res = await axios.get("/api/ecommerce/get-product-list");
  return res.data;
});

const productSlice = createSlice({
  initialState,
  name: "products",
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, actions) => {
        state.loading = false;
        state.products = actions.payload;
      })
      .addCase(getProducts.rejected, (state, actions) => {
        state.loading = false;
        state.products = [];
        state.error = actions.error.message;
      });
  },
});

export const productReducer = productSlice.reducer;
