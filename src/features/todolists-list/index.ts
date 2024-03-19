import { TodolistsList } from '@/features/todolists-list/ui/todolists-list'
import { slice as taskSlice, asyncActions as tasksAsyncActions } from '@/redux/tasks-reducer'
import {
  asyncActions as todolistsAsyncActions,
  slice as todolistsSlice,
} from '@/redux/todolists-reducer'

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

export { TodolistsList, tasksAction, tasksReducer, todolistsActions, todolistsReducer }
