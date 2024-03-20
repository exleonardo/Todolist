import { tasksAction, todolistsActions } from '@/features/todolists-list'
import { authActions } from '@/pages/auth'
import {
  PayloadAction,
  createSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import { AnyAction } from '@reduxjs/toolkit'

export const slice = createSlice({
  extraReducers: builder => {
    builder
      .addMatcher(isPending, state => {
        state.status = 'loading'
      })
      .addMatcher(isFulfilled, state => {
        state.status = 'succesed'
      })
      .addMatcher(
        isAnyOf(authActions.initialized.fulfilled, authActions.initialized.rejected),
        state => {
          state.isInitialized = true
        }
      )
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.status = 'failed'
        if (action.payload) {
          if (
            action.type === todolistsActions.addTodolist.rejected.type ||
            action.type === tasksAction.addTask.rejected.type ||
            action.type === authActions.initialized.rejected.type
          ) {
            return
          }

          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
      })
  },
  initialState: {
    error: null as null | string,
    isInitialized: false,
    status: 'idle' as RequestStatusType,
  },
  name: 'app',
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
  },
})

export type AppInitialState = ReturnType<typeof slice.getInitialState>

//Types
export type RequestStatusType = 'failed' | 'idle' | 'loading' | 'succesed'
