import { asyncActions as tasksAsyncActions } from '@/redux/tasks-reducer'
import { asyncActions as todolistsAsyncActions } from '@/redux/todolists-reducer'
import { slice as todolistsSlice } from '@/redux/todolists-reducer'
import { TodolistsList } from '@/features/todolists-list/ui/todolists-list'
import { slice as taskSlice } from '@/redux/tasks-reducer'

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
