import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { authApi, LoginParamsType } from '@/api/todolists-api'
import { handleServerAppError } from '@/utils/error-utils'
import { clearTodosData } from '@/features/todolists-list/todolists-reducer'
import { createAppAsyncThunk } from '@/utils/create-app-async-thunk'

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(isAnyOf(login.fulfilled, logout.fulfilled, initialized.fulfilled), state => {
      state.isLoggedIn = true
    })
  },
})
const initialized = createAppAsyncThunk(`${slice.name}/initializeApp`, async (_param, thunkAPI) => {
  const { rejectWithValue } = thunkAPI

  const res = await authApi.me()
  if (res.data.resultCode === 0) {
    return { isLoggedIn: true }
  } else {
    return rejectWithValue(res.data)
  }
})

const logout = createAppAsyncThunk(`${slice.name}/logout`, async (_arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  const res = await authApi.logout()
  if (res.data.resultCode === 0) {
    dispatch(clearTodosData())
  } else {
    handleServerAppError(res.data, dispatch)
    return rejectWithValue(null)
  }
})
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (param, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await authApi.login(param)
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  }
)
export const asyncActions = {
  login,
  logout,
  initialized,
}
