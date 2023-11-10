import { tasksReducer } from "../features/TodolistsList/Todolist/Task/tasks-reducer"
import { todolistsReducer } from "../features/TodolistsList/Todolist/todolists-reducer"
import { AnyAction, combineReducers } from "redux"
import thunkMiddleWare, { ThunkAction } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "../features/Login/authReducer"
import { appReducer } from "../app/app-reducer"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

// непосредственно создаём store
// export const store = legacy_createStore ( rootReducer , applyMiddleware ( thunkMiddleWare ) )
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleWare),
})
// определить автоматически тип всего объекта состояния
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
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
