import {
  changeTodolistEntityStatus,
  changeTodolistFilter,
  FilterValuesType,
  TodolistDomainType,
} from "features/todolists-list/todolists-reducer"
import { v1 } from "uuid"

import { todolistsActions, todolistsReducer } from "features/todolists-list/index"
import { RequestStatusType } from "features/Application"

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
  ]
})

test("correct todolist should be removed", () => {
  const todo = { id: todolistId1 }
  const endState = todolistsReducer(
    startState,
    todolistsActions.removeTodolist.fulfilled(todo, "", todo.id),
  )

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
  let newTodolistTitle = "New Todolist"
  const todolist = {
    todolist: {
      id: v1(),
      title: newTodolistTitle,
      addedDate: "",
      order: 0,
    },
  }
  const endState = todolistsReducer(
    startState,
    todolistsActions.addTodolist.fulfilled(todolist, "", todolist.todolist.title),
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
  expect(endState[0].filter).toBe("all")
})

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist"
  const todolistTitle = { id: todolistId2, title: newTodolistTitle }
  const action = todolistsActions.changeTodolistTitle.fulfilled(todolistTitle, "", todolistTitle)

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed"

  const action = changeTodolistFilter({ id: todolistId2, filter: newFilter })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(newFilter)
})

test("correct entity status of todolist should be changed", () => {
  let newStatus: RequestStatusType = "loading"

  const action = changeTodolistEntityStatus({ id: todolistId2, status: newStatus })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe("idle")
  expect(endState[1].entityStatus).toBe(newStatus)
})
