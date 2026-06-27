import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { quizApi } from "../api/quizApi";
import { getApiError } from "../api/http";

export const fetchQuizzes = createAsyncThunk("quizzes/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await quizApi.getQuizzes();
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const createQuiz = createAsyncThunk("quizzes/create", async (payload, { rejectWithValue }) => {
  try {
    return await quizApi.createQuiz(payload);
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const updateQuiz = createAsyncThunk("quizzes/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await quizApi.updateQuiz(id, payload);
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const deleteQuiz = createAsyncThunk("quizzes/delete", async (id, { rejectWithValue }) => {
  try {
    await quizApi.deleteQuiz(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const fetchAttemptQuiz = createAsyncThunk(
  "quizzes/fetchAttempt",
  async (quizId, { rejectWithValue }) => {
    try {
      return await quizApi.getAttemptQuiz(quizId);
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  "quizzes/submit",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      return await quizApi.submitQuiz(quizId, answers);
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

const quizSlice = createSlice({
  name: "quizzes",
  initialState: {
    items: [],
    currentQuiz: null,
    result: null,
    loading: false,
    saving: false,
    submitLoading: false,
    error: null,
  },
  reducers: {
    clearQuizResult(state) {
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createQuiz.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateQuiz.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.items.findIndex((quiz) => quiz._id === action.payload._id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteQuiz.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.items = state.items.filter((quiz) => quiz._id !== action.payload);
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAttemptQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentQuiz = null;
      })
      .addCase(fetchAttemptQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
        state.result = null;
      })
      .addCase(fetchAttemptQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitQuizAnswers.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.result = action.payload;
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuizResult } = quizSlice.actions;
export default quizSlice.reducer;
