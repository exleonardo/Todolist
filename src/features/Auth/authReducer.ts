import { authApi, LoginParamsType } from "api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTodosData } from "features/TodolistsList/todolistsReducer"
import { isAxiosError } from "axios"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { appActions } from "features/CommonActions"
import { authActions } from "features/Auth/index"

const { setAppStatus } = appActions
export const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
      .addCase(initialized.fulfilled, (state, action) => {
        state.isLoggedIn = true
      })
  },
})
const initialized = createAsyncThunk(`${slice.name}/initializeApp`, async (param, { dispatch }) => {
  try {
    const res = await authApi.me()
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
    }
    return { isLoggedIn: true }
  } catch (error) {
    return { isLoggedIn: false }
  } finally {
    dispatch(appActions.setAppInitialized({ isInitialized: true }))
  }
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
        const isShowAppError = !res.data.fieldsErrors?.length
        handleServerAppError(res.data, thunkAPI.dispatch, isShowAppError)
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
  initialized,
}
