import { AppThunk } from "../../state/store"

import { authApi, LoginParamsType } from "../../api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setAppStatusAC } from "../../app/app-reducer"
import { clearTodosData } from "../TodolistsList/Todolist/todolists-reducer"

const initialState = {
  isLoggedIn: false,
}

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions

//Thunk
export const loginTC =
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
