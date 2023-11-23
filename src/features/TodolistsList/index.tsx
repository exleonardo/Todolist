import { asyncActions as tasksAsyncActions } from "features/TodolistsList/tasksReducer"
import { asyncActions as todolistsAsyncActions } from "./todolistsReducer"
import { slice as todolistsSlice } from "features/TodolistsList/todolistsReducer"
import { TodolistsList } from "./TodolistsList"
import { slice as taskSlice } from "./tasksReducer"

const todolistsActions = {
  ...todolistsAsyncActions,
  ...todolistsSlice.actions,
}
const tasksAction = {
  ...tasksAsyncActions,
  ...taskSlice.actions,
}
const tasksReducer = taskSlice.reducer
const todolistsReducer = todolistsSlice.reducer
export { todolistsActions, tasksAction, TodolistsList, todolistsReducer, tasksReducer }
