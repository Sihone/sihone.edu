import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  error: null,
  ratings: [],
  loading: false,
};

export const getRatings = createAsyncThunk("ratings/get", async () => {
  const res = await axios.get("/api/ecommerce/get-rating-list");
  return res.data;
});

const ratingSlice = createSlice({
  initialState,
  name: "ratings",
  extraReducers: (builder) => {
    builder
      .addCase(getRatings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRatings.fulfilled, (state, actions) => {
        state.loading = false;
        state.ratings = actions.payload;
      })
      .addCase(getRatings.rejected, (state, actions) => {
        state.loading = false;
        state.ratings = [];
        state.error = actions.error.message;
      });
  },
});

export const ratingReducer = ratingSlice.reducer;
