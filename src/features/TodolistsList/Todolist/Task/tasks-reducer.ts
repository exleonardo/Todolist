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

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: TasksStateType = {}
export const fetchTaskTC = createAsyncThunk(
  "tasks/fetchTasks",
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
    const res = await todolistsApi.getTasks(todolistId)
    thunkAPI.dispatch(setAppStatusAC({ status: "succesed" }))
    return { tasks: res.data.items, todolistId }
  },
)

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
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
    builder.addCase(fetchTaskTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    })
  },
})

export const tasksReducer = slice.reducer
export const { addTaskAC, updateTaskAC } = slice.actions

//Thunks
export const removeTaskTC = createAsyncThunk(
  "tasks/removeTask",
  async (param: { taskId: string; todolistId: string }, thunkAPI) => {
    await todolistsApi.deleteTask(param.todolistId, param.taskId)
    return { taskId: param.taskId, todolistId: param.todolistId }
  },
)

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
