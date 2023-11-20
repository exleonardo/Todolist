import { authApi } from "api/todolists-api"

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setIsLoggedInAC } from "features/Auth/authReducer"

export const initializedTC = createAsyncThunk("app/initializeApp", async (param, { dispatch }) => {
  try {
    const res = await authApi.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: true }))
    }
    return { value: true }
  } catch (error) {
    return { value: false }
  } finally {
    return { value: true }
  }
})

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
  },
  extraReducers: (builder) =>
    builder.addCase(initializedTC.fulfilled, (state, action) => {
      state.isInitialized = true
    }),
})

export const appReducer = slice.reducer

export const { setAppErrorAC, setAppStatusAC } = slice.actions
export type AppInitialState = ReturnType<typeof slice.getInitialState>

//Types
export type RequestStatusType = "idle" | "loading" | "succesed" | "failed"
