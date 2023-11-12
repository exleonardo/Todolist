import {
  addTaskAC,
  updateTaskAC,
  removeTaskAC,
  tasksReducer,
  fetchTaskTC,
} from "../features/TodolistsList/Todolist/Task/tasks-reducer"
import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "../features/TodolistsList/Todolist/todolists-reducer"
import { TaskPrioties, TaskStatuses } from "../api/todolists-api"
import { v1 } from "uuid"
import { TasksStateType } from "../app/App"

let startState: TasksStateType = {}
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: "",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: "",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: "",
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: "",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: "",
      },
    ],
  }
})

test("correct task should be deleted from correct array", () => {
  const action = removeTaskAC({ taskId: "2", todolistId: "todolistId2" })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(2)
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy()
})
test("correct task should be added to correct array", () => {
  const action = addTaskAC({
    task: {
      id: "1",
      title: "juce",
      status: TaskStatuses.New,
      todoListId: "todolistId2",
      startDate: "",
      deadline: "",
      addedDate: "",
      order: 0,
      priority: TaskPrioties.Low,
      completed: false,
      description: "",
    },
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(4)
  expect(endState["todolistId2"][0].id).toBeDefined()
  expect(endState["todolistId2"][0].title).toBe("juce")
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New)
})
test("status of specified task should be changed", () => {
  const action = updateTaskAC({
    taskId: "2",
    model: {
      status: TaskStatuses.New,
    },
    todolistId: "todolistId2",
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed)
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New)
})
test("title of specified task should be changed", () => {
  const action = updateTaskAC({
    taskId: "2",
    model: { title: "yogurt" },
    todolistId: "todolistId2",
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].title).toBe("JS")
  expect(endState["todolistId2"][1].title).toBe("yogurt")
  expect(endState["todolistId2"][0].title).toBe("bread")
})
test("new array should be added when new todolist is added", () => {
  const action = addTodolistAC({
    todolist: {
      id: v1(),
      title: "newTitle",
      addedDate: "",
      order: 0,
    },
  })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})
test("propertry with todolistId should be deleted", () => {
  const action = removeTodolistAC({ id: "todolistId2" })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
})
test("empty array should be added when we set todolist", () => {
  const action = setTodolistsAC({
    todolists: [
      { id: "1", title: "What to learn", addedDate: "", order: 0 },
      { id: "2", title: "What to buy", addedDate: "", order: 0 },
    ],
  })

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState["1"]).toStrictEqual([])
  expect(endState["2"]).toStrictEqual([])
})

test("tasks shuold be added for todolist", () => {
  const action = fetchTaskTC.fulfilled(
    {
      tasks: startState["todolistId1"],
      todolistId: "todolistId1",
    },
    "",
    "todolistId1",
  )

  const endState = tasksReducer(
    {
      todolistId1: [],
      todolistId2: [],
    },
    action,
  )

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(0)
})
