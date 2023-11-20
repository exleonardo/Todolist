import * as tasksActions from "./tasksActions"
import { asyncActions as todolistsAsyncActions } from "./todolistsReducer"
import { slice } from "features/TodolistsList/todolistsReducer"

const todolistsActions = {
  ...todolistsAsyncActions,
  ...slice.actions,
}
export { tasksActions, todolistsActions }
