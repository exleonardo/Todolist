import { LoginParamsType, authApi } from '@/api/todolists-api'
import { clearTodosData } from '@/redux/todolists-reducer'
import { createAppAsyncThunk } from '@/utils/create-app-async-thunk'
import { handleServerAppError } from '@/utils/error-utils'
import { createSlice, isAnyOf } from '@reduxjs/toolkit'

export const slice = createSlice({
  extraReducers: builder => {
    builder.addMatcher(isAnyOf(login.fulfilled, logout.fulfilled, initialized.fulfilled), state => {
      state.isLoggedIn = true
    })
  },
  initialState: {
    isLoggedIn: false,
  },
  name: 'auth',
  reducers: {},
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
  initialized,
  login,
  logout,
}
