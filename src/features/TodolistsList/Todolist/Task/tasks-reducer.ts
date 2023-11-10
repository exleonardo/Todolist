import { TaskPrioties, TaskType, todolistsApi, UpdateTaskType } from "api/todolists-api"
import { AppRootStateType, AppThunk } from "state/store"
import { TasksStateType } from "app/App"
import { setAppStatusAC } from "app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import {
  addTodolistAC,
  clearTodosData,
  removeTodolistAC,
  setTodolistsAC,
} from "../todolists-reducer"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: TasksStateType = {}
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ taskId: string; todolistId: string }>) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string
        model: UpdateDomainTaskModelType
        todolistId: string
      }>,
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    },
    setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = []
      })
    })
    builder.addCase(clearTodosData, () => {
      return {}
    })
  },
})

export const tasksReducer = slice.reducer
export const { removeTaskAC, addTaskAC, updateTaskAC, setTasksAC } = slice.actions

// Thunks
export const fetchTaskTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    todolistsApi.getTasks(todolistId).then((res) => {
      dispatch(setTasksAC({ tasks: res.data.items, todolistId }))
      dispatch(setAppStatusAC({ status: "succesed" }))
    })
  }
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsApi.deleteTask(todolistId, taskId).then((res) => {
      const action = removeTaskAC({ taskId, todolistId })
      dispatch(action)
    })
  }
export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    todolistsApi
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = addTaskAC({ task: res.data.data.item })
          dispatch(action)
          dispatch(setAppStatusAC({ status: "succesed" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }

export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((el) => el.id === taskId)
    if (!task) {
      console.warn("Task not found")
      return
    }
    const apiModel: UpdateTaskType = {
      deadline: task.deadline,
      priority: TaskPrioties.Low,
      startDate: task.startDate,
      description: task.description,
      title: task.title,
      status: task.status,
      completed: task.completed,
      ...domainModel,
    }

    todolistsApi
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(updateTaskAC({ taskId, model: domainModel, todolistId }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }

//types

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  completed?: boolean
  status?: number
  priority?: number
  startDate?: string
  deadline?: string
}
