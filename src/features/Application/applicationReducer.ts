import { authApi } from "api/todolists-api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { authActions } from "features/Auth"
import { appActions } from "features/CommonActions/ApplicationCommonAction"

const initialized = createAsyncThunk(`application/initializeApp`, async (param, { dispatch }) => {
  try {
    const res = await authApi.me()
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ value: true }))
    }
    return { value: true }
  } catch (error) {
    return { value: false }
  } finally {
    return { value: true }
  }
})

export const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initialized.fulfilled, (state, action) => {
        state.isInitialized = true
      })
      .addCase(appActions.setAppStatus, (state, action) => {
        state.status = action.payload.status
      })
      .addCase(appActions.setAppError, (state, action) => {
        state.error = action.payload.error
      })
  },
})

export type AppInitialState = ReturnType<typeof slice.getInitialState>
export const asyncActions = {
  initialized,
}
//Types
export type RequestStatusType = "idle" | "loading" | "succesed" | "failed"
