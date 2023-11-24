import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const getNotification = createAsyncThunk("notifications/get", async () => {
  const res = await axios.get("/api/notification");
  return res.data;
});

export const createNotification = createAsyncThunk("notifications/add", async (notification) => {
  const res = await axios.post("/api/notification/add", { notification });
  return res.data;
});

export const deleteNotification = createAsyncThunk("notifications/delete", async (id) => {
  const res = await axios.post("/api/notification/delete", { id });
  return res.data;
});

export const deleteAllNotification = createAsyncThunk("notifications/delete-all", async () => {
  const res = await axios.post("/api/notification/delete-all");
  return res.data;
});

const notificationSlice = createSlice({
  initialState,
  name: "notifications",
  extraReducers: (builder) => {
    builder
      .addCase(getNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotification.fulfilled, (state, actions) => {
        state.loading = false;
        state.notifications = actions.payload;
      })
      .addCase(getNotification.rejected, (state, actions) => {
        state.loading = false;
        state.notifications = [];
        state.error = actions.error.message;
      })

      // create notification case
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state, actions) => {
        state.loading = false;
        state.notifications = actions.payload;
      })
      .addCase(createNotification.rejected, (state, actions) => {
        state.loading = false;
        state.notifications = [];
        state.error = actions.error.message;
      })

      // delete notification case
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, actions) => {
        state.loading = false;
        state.notifications = actions.payload;
      })
      .addCase(deleteNotification.rejected, (state, actions) => {
        state.loading = false;
        state.notifications = [];
        state.error = actions.error.message;
      })

      // delete all notification case
      .addCase(deleteAllNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllNotification.fulfilled, (state, actions) => {
        state.loading = false;
        state.notifications = actions.payload;
      })
      .addCase(deleteAllNotification.rejected, (state, actions) => {
        state.loading = false;
        state.notifications = [];
        state.error = actions.error.message;
      });
  },
});

export const notificationReducer = notificationSlice.reducer;
