import {
  addTodolistAC,
  changeTodolistFilter,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodolistAC,
  setTodolistsAC,
  TodolistDomainType,
  todolistsReducer,
} from "features/TodolistsList/todolistsReducer"
import { v1 } from "uuid"

let startState: TodolistDomainType[]
let todolistId1 = v1()
let todolistId2 = v1()
beforeEach(() => {
  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
  ]
})
test("correct todolist should be removed", () => {
  const endState = todolistsReducer(startState, removeTodolistAC({ id: todolistId1 }))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
  let newTodolistTitle = "New Todolist"

  const endState = todolistsReducer(
    startState,
    addTodolistAC({
      todolist: {
        id: v1(),
        title: newTodolistTitle,
        addedDate: "",
        order: 0,
      },
    }),
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
  expect(endState[2].filter).toBe("all")
  expect(endState[2].id).toBeDefined()
})

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist"

  const action = changeTodolistTitleAC({ id: todolistId2, title: newTodolistTitle })

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

test("todolists should be set the state", () => {
  const action = setTodolistsAC({ todolists: startState })
  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})
