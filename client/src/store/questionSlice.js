import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { questionApi } from "../api/questionApi";
import { getApiError } from "../api/http";

export const fetchQuestions = createAsyncThunk("questions/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await questionApi.getQuestions();
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const createQuestion = createAsyncThunk(
  "questions/create",
  async ({ quizId, ...payload }, { rejectWithValue }) => {
    try {
      if (quizId) {
        await questionApi.addQuestionToQuiz(quizId, payload);
        return await questionApi.getQuestions();
      }

      const question = await questionApi.createQuestion(payload);
      return question;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await questionApi.updateQuestion(id, payload);
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const deleteQuestion = createAsyncThunk("questions/delete", async (id, { rejectWithValue }) => {
  try {
    await questionApi.deleteQuestion(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const questionSlice = createSlice({
  name: "questions",
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearQuestionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createQuestion.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.saving = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateQuestion.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.items.findIndex((question) => question._id === action.payload._id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((question) => question._id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearQuestionError } = questionSlice.actions;
export default questionSlice.reducer;
