import { createAction } from "@reduxjs/toolkit"
import { RequestStatusType } from "features/Application/applicationReducer"

const setAppStatus = createAction<{ status: RequestStatusType }>("app/setAppStatus")
const setAppError = createAction<{ error: string | null }>("app/setAppError")
const setAppInitialized = createAction<{ isInitialized: boolean }>("app/setAppInitialized")
export const appActions = { setAppStatus, setAppError, setAppInitialized }
