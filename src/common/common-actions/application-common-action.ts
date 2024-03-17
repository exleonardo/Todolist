import { RequestStatusType } from '@/redux/app-reducer'
import { createAction } from '@reduxjs/toolkit'

const setAppStatus = createAction<{ status: RequestStatusType }>('app/setAppStatus')
const setAppError = createAction<{ error: null | string }>('app/setAppError')
const setAppInitialized = createAction<{ isInitialized: boolean }>('app/setAppInitialized')

export const appActions = { setAppError, setAppInitialized, setAppStatus }
