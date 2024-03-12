import { asyncActions as tasksAsyncActions } from '@/features/todolists-list/tasks-reducer'
import { asyncActions as todolistsAsyncActions } from '@/features/todolists-list/todolists-reducer'
import { slice as todolistsSlice } from '@/features/todolists-list/todolists-reducer'
import { TodolistsList } from '@/features/todolists-list/todolists-list'
import { slice as taskSlice } from '@/features/todolists-list/tasks-reducer'

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
