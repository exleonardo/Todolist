import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { FieldErrorType } from '@/api/todolists-api'
import { appReducer } from '@/app'
import { tasksReducer, todolistsReducer } from '@/features/todolists-list'
import { authReducer } from '@/pages/auth'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    app: appReducer,
    login: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type ThunkError = {
  rejectValue: {
    errors: string[]
    fieldsErrors?: FieldErrorType[]
  }
}
