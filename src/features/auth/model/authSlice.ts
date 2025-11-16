import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AxiosError, AxiosInstance } from 'axios';
import { ENDPOINTS } from '../../../shared/api/client';
import { dropToken, saveToken } from '../../../shared/api/api';
import type { AuthInfo } from '../../../shared/types/auth';
import { AuthorizationStatus } from '../../../shared/types/auth';


export type AuthState = {
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
  error: string | null;
};

const initialState: AuthState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  error: null,
};

const rejectMessage = 'Unable to authorize';

export const checkAuth = createAsyncThunk<
AuthInfo,
void,
{ extra: AxiosInstance; rejectValue: string }
>('auth/check', async (_arg, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<AuthInfo>(ENDPOINTS.LOGIN);
    return data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {

      return rejectWithValue('Not authorized');
    }
    return rejectWithValue(rejectMessage);
  }
});

export const login = createAsyncThunk<
AuthInfo,
{ email: string; password: string },
{ extra: AxiosInstance; rejectValue: string }
>('auth/login', async (credentials, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthInfo>(ENDPOINTS.LOGIN, credentials);
    saveToken(data.token);
    return data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message ?? rejectMessage);
  }
});

export const logout = createAsyncThunk<
void,
void,
{ extra: AxiosInstance; rejectValue: string }
>('auth/logout', async (_arg, { extra: api, rejectWithValue }) => {
  try {
    await api.delete(ENDPOINTS.LOGOUT);
    dropToken();
  } catch (error) {
    return rejectWithValue(rejectMessage);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthorizationStatus(state, action: PayloadAction<AuthorizationStatus>) {
      state.authorizationStatus = action.payload;
    },
    resetAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Authorized;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.Unauthorized;
      state.user = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Authorized;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Unauthorized;
      state.user = null;
      state.error = action.payload ?? rejectMessage;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.authorizationStatus = AuthorizationStatus.Unauthorized;
      state.user = null;
      state.error = null;
    });
  },
});

export const { reducer: authReducer, actions: authActions } = authSlice;
