import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk"
import { AppDispatchType, AppRootStateType } from "state/store"
import { BaseResponseType } from "api/todolists-api"
import { handleServerNetworkError } from "common/utils/error-utils"
import { appActions } from "features/CommonActions/ApplicationCommonAction"

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatchType, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }))
  }
}
