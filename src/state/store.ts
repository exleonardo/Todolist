import { AnyAction } from 'redux'

import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { ThunkAction, thunk } from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'

import { authReducer } from '@/features/auth'
import { appReducer } from '@/features/Application'
import { FieldErrorType } from '@/api/todolists-api'
import { tasksReducer, todolistsReducer } from '@/features/todolists-list'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    login: authReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  AnyAction
>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type ThunkError = {
  rejectValue: {
    errors: string[]
    fieldsErrors?: FieldErrorType[]
  }
}
