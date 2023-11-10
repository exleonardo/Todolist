import {
  addTodolistAC,
  TodolistDomainType,
  todolistsReducer,
} from "../features/TodolistsList/Todolist/todolists-reducer"
import { tasksReducer } from "../features/TodolistsList/Todolist/Task/tasks-reducer"
import { v1 } from "uuid"
import { TasksStateType } from "../app/App"

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  const action = addTodolistAC({
    todolist: { id: v1(), title: "newTitle", addedDate: "", order: 0 },
  })

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
