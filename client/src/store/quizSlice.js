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
