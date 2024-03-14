import { v1 } from 'uuid'
import { TodolistDomainType } from '@/redux/todolists-reducer'
import { TasksStateType } from '@/app/ui/App'

import { expect, test } from 'vitest'
import { tasksReducer, todolistsActions, todolistsReducer } from '@/features/todolists-list'

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []
  const todolist = {
    todolist: { id: v1(), title: 'newTitle', addedDate: '', order: 0 },
  }
  const action = todolistsActions.addTodolist.fulfilled(todolist, '', todolist.todolist.title)

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
