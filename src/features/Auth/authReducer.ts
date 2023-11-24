import { authApi, LoginParamsType } from "api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTodosData } from "features/TodolistsList/todolistsReducer"
import { AxiosError, isAxiosError } from "axios"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { appActions } from "features/CommonActions"
import { ThunkError } from "state/store"

const { setAppStatus } = appActions
export const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  },
})
export const logout = createAppAsyncThunk(`${slice.name}/logout`, async (arg, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }))

  try {
    const res = await authApi.logout()
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succesed" }))
      thunkAPI.dispatch(clearTodosData())
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({})
    }
  } catch (error) {
    if (isAxiosError(error)) {
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({})
    }
  }
})
export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: "loading" }))
    try {
      const res = await authApi.auth(param)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: "succesed" }))
        return { isLoggedIn: true }
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(res.data)
      }
    } catch (err) {
      handleServerNetworkError(err, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  },
)
export const asyncActions = {
  login,
  logout,
}
