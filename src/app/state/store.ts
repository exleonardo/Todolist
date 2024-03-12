import { AnyAction } from "redux"
import thunkMiddleWare, { ThunkAction } from "redux-thunk"
import { TypedUseSelectorHook, useSelector } from "react-redux"

import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "features/auth"
import { FieldErrorType } from "api/todolists-api"
import { tasksReducer, todolistsReducer } from "features/todolists-list"
import { appReducer } from "features/Application"

// export const store = legacy_createStore ( rootReducer , applyMiddleware ( thunkMiddleWare ) )
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    login: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleWare),
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
// @ts-ignore
window.store = store

export type ThunkError = {
  rejectValue: {
    errors: string[]
    fieldsErrors?: FieldErrorType[]
  }
}
