import { RequestStatusTypeProp } from '@/app'
import { todolistsActions, todolistsReducer } from '@/features/todolists-list'
import {
  FilterValuesType,
  TodolistDomainType,
  changeTodolistEntityStatus,
  changeTodolistFilter,
} from '@/redux/todolists-reducer'
import { v1 } from 'uuid'
import { beforeEach, expect, test } from 'vitest'

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  startState = [
    {
      addedDate: '',
      entityStatus: 'idle',
      filter: 'all',
      id: todolistId1,
      order: 0,
      title: 'What to learn',
    },
    {
      addedDate: '',
      entityStatus: 'idle',
      filter: 'all',
      id: todolistId2,
      order: 0,
      title: 'What to buy',
    },
  ]
})

test('correct todolist should be removed', () => {
  const todo = { id: todolistId1 }
  const endState = todolistsReducer(
    startState,
    todolistsActions.removeTodolist.fulfilled(todo, '', todo.id)
  )

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
  const newTodolistTitle = 'New Todolist'
  const todolist = {
    todolist: {
      addedDate: '',
      id: v1(),
      order: 0,
      title: newTodolistTitle,
    },
  }
  const endState = todolistsReducer(
    startState,
    todolistsActions.addTodolist.fulfilled(todolist, '', todolist.todolist.title)
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
  expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
  const newTodolistTitle = 'New Todolist'
  const todolistTitle = { id: todolistId2, title: newTodolistTitle }
  const action = todolistsActions.changeTodolistTitle.fulfilled(todolistTitle, '', todolistTitle)

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
  const newFilter: FilterValuesType = 'completed'

  const action = changeTodolistFilter({ filter: newFilter, id: todolistId2 })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})

test('correct entity status of todolist should be changed', () => {
  const newStatus: RequestStatusTypeProp = 'loading'

  const action = changeTodolistEntityStatus({ id: todolistId2, status: newStatus })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})
