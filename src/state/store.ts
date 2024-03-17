import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { FieldErrorType } from '@/api/todolists-api'
import { appReducer } from '@/app'
import { tasksReducer, todolistsReducer } from '@/features/todolists-list'
import { authReducer } from '@/pages/auth'
import { configureStore } from '@reduxjs/toolkit'
import { AnyAction } from 'redux'
import { ThunkAction, thunk } from 'redux-thunk'

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
  reducer: {
    app: appReducer,
    login: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
  },
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
