import {
  createSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit'
import { authActions } from '@/features/auth'
import { AnyAction } from 'redux'
import { tasksAction, todolistsActions } from '@/features/todolists-list'

export const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
  },
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
          )
            return

          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
      })
  },
})

export type AppInitialState = ReturnType<typeof slice.getInitialState>

//Types
export type RequestStatusType = 'idle' | 'loading' | 'succesed' | 'failed'
