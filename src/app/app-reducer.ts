import { AppThunk } from "state/store"
import { authApi } from "api/todolists-api"
import { setIsLoggedInAC } from "features/Login/authReducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  status: "idle",
  error: null as null | string,
  //true когда приложение проинициализировалось (проверили юзера, получили настройки ... )
  isInitialized: false,
}
const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value
    },
  },
})

export const appReducer = slice.reducer

export const { setAppErrorAC, setAppStatusAC, setAppInitializedAC } = slice.actions
export type AppInitialState = ReturnType<typeof slice.getInitialState>

//Thunks
export const initializedTC = (): AppThunk => (dispatch) => {
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }))
      } else {
      }
      dispatch(setAppInitializedAC({ value: true }))
    })
    .finally(() => dispatch(setAppInitializedAC({ value: true })))
}

//Types
export type RequestStatusType = "idle" | "loading" | "succesed" | "failed"
