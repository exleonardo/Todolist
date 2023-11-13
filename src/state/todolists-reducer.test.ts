import {
  addTodolistTC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
  todolistsReducer,
} from "features/TodolistsList/Todolist/todolists-reducer"
import { v1 } from "uuid"
import { RequestStatusType } from "app/app-reducer"

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
  const endState = todolistsReducer(startState, removeTodolistTC.fulfilled(todo, "", todo.id))

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
    addTodolistTC.fulfilled(todolist, "", todolist.todolist.title),
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
  expect(endState[0].filter).toBe("all")
})

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist"
  const todolistTitle = { id: todolistId2, title: newTodolistTitle }
  const action = changeTodolistTitleTC.fulfilled(todolistTitle, "", todolistTitle)

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed"

  const action = changeTodolistFilterAC({ id: todolistId2, filter: newFilter })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(newFilter)
})

test("correct entity status of todolist should be changed", () => {
  let newStatus: RequestStatusType = "loading"

  const action = changeTodolistEntityStatusAC({ id: todolistId2, status: newStatus })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe("idle")
  expect(endState[1].entityStatus).toBe(newStatus)
})
