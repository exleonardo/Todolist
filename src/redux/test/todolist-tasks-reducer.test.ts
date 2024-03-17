import { TasksStateType } from '@/app/ui/App'
import { tasksReducer, todolistsActions, todolistsReducer } from '@/features/todolists-list'
import { TodolistDomainType } from '@/redux/todolists-reducer'
import { v1 } from 'uuid'
import { expect, test } from 'vitest'

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []
  const todolist = {
    todolist: {
      addedDate: '',
      id: v1(),
      order: 0,
      title: 'New ToDo',
    },
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
