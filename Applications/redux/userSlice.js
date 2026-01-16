import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://randomuser.me/api/?results=20');
    const data = await response.json();
    return data.results;
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    userSelected: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserSelected: (state, action) => {
      state.userSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUserSelected } = userSlice.actions;

export default userSlice.reducer;
