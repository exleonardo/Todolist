import { todolistsReducer } from "features/TodolistsList/todolistsReducer"
import { ActionCreatorsMapObject, AnyAction, bindActionCreators } from "redux"
import thunkMiddleWare, { ThunkAction } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import { configureStore, PayloadActionCreator } from "@reduxjs/toolkit"
import { authReducer } from "features/Auth/authReducer"
import { appReducer } from "app/app-reducer"
import { tasksReducer } from "features/TodolistsList/Todolist/Task/tasks-reducer"
import { useMemo } from "react"

// export const store = legacy_createStore ( rootReducer , applyMiddleware ( thunkMiddleWare ) )
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
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
export const useAppDispatch = useDispatch<AppDispatchType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
// @ts-ignore
window.store = store

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
  const dispatch = useAppDispatch()
  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [])
  return boundActions
}
