import { BaseResponseType } from '@/api/todolists-api'
import { appActions } from '@/common/common-actions/application-common-action'
import { AppDispatchType, AppRootStateType } from '@/state/store'
import { handleServerNetworkError } from '@/utils/error-utils'
// eslint-disable-next-line import/no-unresolved
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatchType, BaseResponseType | null>,
  logic: () => Promise<T>
): Promise<ReturnType<typeof thunkAPI.rejectWithValue> | T> => {
  const { dispatch, rejectWithValue } = thunkAPI

  dispatch(appActions.setAppStatus({ status: 'loading' }))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(e, dispatch)

    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppStatus({ status: 'idle' }))
  }
}
