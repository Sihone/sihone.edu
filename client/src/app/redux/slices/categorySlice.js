import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  error: null,
  categories: [],
  loading: false,
};

export const getCategories = createAsyncThunk("categories/get", async () => {
  const res = await axios.get("/api/ecommerce/get-category-list");
  return res.data;
});

const categorySlice = createSlice({
  initialState,
  name: "categories",
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, actions) => {
        state.loading = false;
        state.categories = actions.payload;
      })
      .addCase(getCategories.rejected, (state, actions) => {
        state.loading = false;
        state.categories = [];
        state.error = actions.error.message;
      });
  },
});

export const categoryReducer = categorySlice.reducer;
