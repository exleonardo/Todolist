import { asyncActions as tasksAsyncActions } from "features/TodolistsList/Todolist/Task/tasksReducer"
import { asyncActions as todolistsAsyncActions } from "./todolistsReducer"
import { slice } from "features/TodolistsList/todolistsReducer"
import { TodolistsList } from "./TodolistsList"

const todolistsActions = {
  ...todolistsAsyncActions,
  ...slice.actions,
}
const tasksAction = {
  ...tasksAsyncActions,
}
export { todolistsActions, tasksAction, TodolistsList }
