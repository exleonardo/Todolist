import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppDispatchType, AppRootStateType, ThunkError } from "app/state/store"
import { BaseResponseType } from "api/todolists-api"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatchType
  rejectValue: BaseResponseType | null
}>()
