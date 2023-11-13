import { AppThunk } from "state/store"

import { authApi, FieldErrorType, LoginParamsType } from "api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setAppStatusAC } from "app/app-reducer"
import { clearTodosData } from "../TodolistsList/Todolist/todolists-reducer"
import { AxiosError, isAxiosError } from "axios"

export const loginTC = createAsyncThunk<
  { isLoggedIn: boolean },
  LoginParamsType,
  {
    rejectValue: {
      errors: string[]
      fildsErrors?: FieldErrorType[]
    }
  }
>("auth/login", async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
  try {
    const res = await authApi.auth(param)
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: "succesed" }))
      return { isLoggedIn: true }
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fildsErrors: res.data.fieldsErrors,
      })
    }
  } catch (err) {
    if (isAxiosError<any>(err)) {
      handleServerNetworkError(err, thunkAPI.dispatch)
    }
    const error = err as AxiosError
    return thunkAPI.rejectWithValue({
      errors: [error.message],
      fildsErrors: undefined,
    })
  }
})

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
      state.isLoggedIn = action.payload.isLoggedIn
    })
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions

//Thunk
export const _loginTC =
  (data: LoginParamsType): AppThunk =>
  async (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    authApi
      .auth(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC({ value: true }))
          dispatch(setAppStatusAC({ status: "succesed" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: false }))
        dispatch(setAppStatusAC({ status: "succesed" }))
        dispatch(clearTodosData())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
