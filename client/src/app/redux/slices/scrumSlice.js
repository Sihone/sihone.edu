import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  board: {},
  labelList: [],
  boardList: [],
  memberList: [],
};

export const getAllMembers = createAsyncThunk("scrumboard/all-member", async () => {
  const res = await axios.get("/api/scrum-board/all-member");
  return res.data;
});

export const getAllLabels = createAsyncThunk("scrumboard/all-label", async () => {
  const res = await axios.get("/api/scrum-board/all-label");
  return res.data;
});

export const getAllBoard = createAsyncThunk("scrumboard/all-board", async () => {
  const res = await axios.get("/api/scrum-board/all-board");
  return res.data;
});

export const addNewBoard = createAsyncThunk("scrumboard/add-board", async (title) => {
  const res = await axios.post("/api/scrum-board/add-board", title);
  return res.data;
});

export const getBoardById = createAsyncThunk("scrumboard/get", async (id) => {
  const res = await axios.get("/api/scrum-board", { data: id });
  return res.data;
});

export const addMemberInBoard = createAsyncThunk(
  "scrumboard/add-member",
  async ({ boardId, memberId }) => {
    const res = await axios.post("/api/scrum-board/add-member", { boardId, memberId });
    return res.data;
  }
);

export const deleteMemberFromBoard = createAsyncThunk(
  "scrumboard/delete-member",
  async ({ boardId, memberId }) => {
    const res = await axios.post("/api/scrum-board/delete-member", { boardId, memberId });
    return res.data;
  }
);

export const addListInBoard = createAsyncThunk(
  "scrumboard/add-column",
  async ({ boardId, listTitle }) => {
    const res = await axios.post("/api/scrum-board/add-column", { boardId, listTitle });
    return res.data;
  }
);

export const renameListInBoard = createAsyncThunk(
  "scrumboard/rename-column",
  async ({ boardId, listTitle, listId }) => {
    const res = await axios.post("/api/scrum-board/rename-column", { boardId, listTitle, listId });
    return res.data;
  }
);

export const deleteListFromBoard = createAsyncThunk(
  "scrumboard/delete-column",
  async ({ boardId, listId }) => {
    const res = await axios.post("/api/scrum-board/delete-column", { boardId, listId });
    return res.data;
  }
);

export const reorderList = createAsyncThunk(
  "scrumboard/reorder-list",
  async ({ boardId, startIndex, endIndex }) => {
    const res = await axios.post("/api/scrum-board/reorder-list", {
      boardId,
      startIndex,
      endIndex,
    });

    return res.data;
  }
);

export const addNewCardInList = createAsyncThunk(
  "scrumboard/add-card",
  async ({ listId, boardId, cardTitle }) => {
    const res = await axios.post("/api/scrum-board/add-card", { listId, boardId, cardTitle });
    return res.data;
  }
);

export const reorderCardInList = createAsyncThunk(
  "scrumboard/reorder-card",
  async ({ boardId, listId, startIndex, endIndex }) => {
    const res = await axios.post("/api/scrum-board/reorder-card", {
      boardId,
      listId,
      startIndex,
      endIndex,
    });

    return res.data;
  }
);

export const moveCardInList = createAsyncThunk(
  "scrumboard/move-card",
  async ({ boardId, sourcelistId, destinationlistId, source, destination }) => {
    const res = await axios.post("/api/scrum-board/move-card", {
      source,
      boardId,
      destination,
      sourcelistId,
      destinationlistId,
    });

    return res.data;
  }
);

export const updateCardInList = createAsyncThunk(
  "scrumboard/update-card",
  async ({ boardId, listId, card }) => {
    const res = await axios.post("/api/scrum-board/update-card", { boardId, listId, card });
    return res.data;
  }
);

const scrumSlice = createSlice({
  initialState,
  name: "scrumboard",
  extraReducers: (builder) => {
    builder
      .addCase(getAllMembers.fulfilled, (state, actions) => {
        state.memberList = actions.payload;
      })
      .addCase(getAllLabels.fulfilled, (state, actions) => {
        state.labelList = actions.payload;
      })
      .addCase(getAllBoard.fulfilled, (state, actions) => {
        state.boardList = actions.payload;
      })
      .addCase(addNewBoard.fulfilled, (state, actions) => {
        state.boardList = actions.payload;
      })
      .addCase(getBoardById.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(addMemberInBoard.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(deleteMemberFromBoard.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(addListInBoard.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(renameListInBoard.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(deleteListFromBoard.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(reorderList.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(addNewCardInList.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(reorderCardInList.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(moveCardInList.fulfilled, (state, actions) => {
        state.board = actions.payload;
      })
      .addCase(updateCardInList.fulfilled, (state, actions) => {
        state.board = actions.payload;
      });
  },
});

export const scrumReducer = scrumSlice.reducer;
