import { authApi, FieldErrorType, LoginParamsType } from "api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setAppStatusAC } from "app/app-reducer"
import { clearTodosData } from "features/TodolistsList/todolistsReducer"
import { AxiosError, isAxiosError } from "axios"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = true
    })
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false
    })
  },
})
export const logoutTC = createAppAsyncThunk(`${slice.name}/logout`, async (arg, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))

  try {
    const res = await authApi.logout()
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: "succesed" }))
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
export const loginTC = createAppAsyncThunk<
  undefined,
  LoginParamsType,
  {
    rejectValue: {
      errors: string[]
      fildsErrors?: FieldErrorType[]
    }
  }
>(`${slice.name}/login`, async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
  try {
    const res = await authApi.auth(param)
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: "succesed" }))
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fildsErrors: res.data.fieldsErrors,
      })
    }
  } catch (err) {
    if (isAxiosError(err)) {
      handleServerNetworkError(err, thunkAPI.dispatch)
    }
    const error = err as AxiosError
    return thunkAPI.rejectWithValue({
      errors: [error.message],
      fildsErrors: undefined,
    })
  }
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions
