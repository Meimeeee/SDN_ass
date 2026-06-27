import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { getApiError } from "../api/http";

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("quiz_user"));
  } catch {
    return null;
  }
};

const persistSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem("quiz_token", token);
  }

  if (user) {
    localStorage.setItem("quiz_user", JSON.stringify(user));
  }
};

const clearSession = () => {
  localStorage.removeItem("quiz_token");
  localStorage.removeItem("quiz_user");
};

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    await authApi.register(payload);
    const loginResult = await authApi.login({
      username: payload.username,
      password: payload.password,
    });
    persistSession(loginResult);
    return loginResult;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const result = await authApi.login(payload);
    persistSession(result);
    return result;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const getMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const user = await authApi.getMe();
    localStorage.setItem("quiz_user", JSON.stringify(user));
    return user;
  } catch (error) {
    clearSession();
    return rejectWithValue(getApiError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("quiz_token"),
    user: readUser(),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      clearSession();
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
