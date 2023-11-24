import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "features/CommonActions/ApplicationCommonAction"

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
      .addCase(appActions.setAppStatus, (state, action) => {
        state.status = action.payload.status
      })
      .addCase(appActions.setAppError, (state, action) => {
        state.error = action.payload.error
      })
      .addCase(appActions.setAppInitialized, (state, action) => {
        state.isInitialized = action.payload.isInitialized
      })
  },
})

export type AppInitialState = ReturnType<typeof slice.getInitialState>

//Types
export type RequestStatusType = "idle" | "loading" | "succesed" | "failed"
