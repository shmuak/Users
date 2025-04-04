import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersState, User, ApiError } from '../types/types';
import { api } from './api';
import { AxiosError } from 'axios';

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  currentUser: null
};

const handleApiError = (error: unknown) => {
  const err = error as AxiosError<ApiError>;
  return {
    message: err.response?.data?.message || err.message,
    status: err.response?.status,
    data: err.response?.data
  };
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.data;
        state.pagination = {
          ...state.pagination,
          totalItems: action.payload.total,
          totalPages: Math.ceil(action.payload.total / state.pagination.itemsPerPage),
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as ReturnType<typeof handleApiError>).message;
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as ReturnType<typeof handleApiError>).message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.payload);
        state.pagination.totalItems -= 1;
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.itemsPerPage
        );
      });
  },
});

export const { setCurrentPage } = usersSlice.actions;
export default usersSlice.reducer;