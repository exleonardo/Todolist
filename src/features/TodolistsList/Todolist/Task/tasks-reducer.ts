import { TaskPrioties, todolistsApi, UpdateTaskType } from "api/todolists-api"
import { AppRootStateType } from "state/store"
import { TasksStateType } from "app/App"
import { setAppStatusAC } from "app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import {
  addTodolistAC,
  clearTodosData,
  removeTodolistAC,
  setTodolistsAC,
} from "../todolists-reducer"

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { isAxiosError } from "axios"

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
export const removeTaskTC = createAsyncThunk(
  "tasks/removeTask",
  async (param: { taskId: string; todolistId: string }, thunkAPI) => {
    await todolistsApi.deleteTask(param.todolistId, param.taskId)
    return { taskId: param.taskId, todolistId: param.todolistId }
  },
)

export const addTaskTC = createAsyncThunk(
  "tasks/addTask",
  async (
    {
      title,
      todolistId,
    }: {
      title: string
      todolistId: string
    },
    { dispatch, rejectWithValue },
  ) => {
    dispatch(setAppStatusAC({ status: "loading" }))

    try {
      const res = await todolistsApi.createTask(todolistId, title)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succesed" }))
        return { task: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      if (isAxiosError(error)) handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

export const updateTaskTC = createAsyncThunk(
  "tasks/updateTask",
  async (
    param: {
      taskId: string
      domainModel: UpdateDomainTaskModelType
      todolistId: string
    },
    { dispatch, getState, rejectWithValue },
  ) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find((el) => el.id === param.taskId)
    if (!task) {
      return rejectWithValue("Task not found")
    }
    const apiModel: UpdateTaskType = {
      deadline: task.deadline,
      priority: TaskPrioties.Low,
      startDate: task.startDate,
      description: task.description,
      title: task.title,
      status: task.status,
      completed: task.completed,
      ...param.domainModel,
    }

    try {
      const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel)
      if (res.data.resultCode === 0) {
        return param
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      if (isAxiosError(error)) handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
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
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.domainModel }
      }
    })
  },
})

export const tasksReducer = slice.reducer

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
