import { BaseResponseType } from '@/api/todolists-api'
import { AppDispatchType, AppRootStateType } from '@/state/store'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  dispatch: AppDispatchType
  rejectValue: BaseResponseType | null
  state: AppRootStateType
}>()
